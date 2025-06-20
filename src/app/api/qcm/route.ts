import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// Simple PDF generation function
function createPDFContent(content: string, title: string): Uint8Array {
  // For now, we'll create a simple text-based PDF-like content
  // In a real implementation, you'd use a library like jsPDF or puppeteer
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length ${content.length + 200}
>>
stream
BT
/F1 12 Tf
50 750 Td
(${title}) Tj
0 -20 Td
(${content.replace(/\n/g, ') Tj 0 -15 Td (')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000${String(400 + content.length).padStart(6, '0')} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${500 + content.length}
%%EOF`;

  return new TextEncoder().encode(pdfContent);
}

// Mock response function for QCM generation - Returns content in the requested language
function createMockQCMResponse(query: string, locale: string = 'en') {
  const content = {
    en: {
      title: "Sample Quiz",
      description: `Generated quiz for: "${query}"`,
      question1: "What is the main topic discussed?",
      question2: "Which of the following is correct?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      explanation: "This is a sample explanation for demonstration purposes."
    },
    fr: {
      title: "Quiz d'Exemple",
      description: `Quiz généré pour : "${query}"`,
      question1: "Quel est le sujet principal discuté ?",
      question2: "Lequel des éléments suivants est correct ?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      explanation: "Ceci est un exemple d'explication à des fins de démonstration."
    },
    ar: {
      title: "اختبار تجريبي",
      description: `اختبار تم إنشاؤه لـ: "${query}"`,
      question1: "ما هو الموضوع الرئيسي الذي تمت مناقشته؟",
      question2: "أي مما يلي صحيح؟",
      options: ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      explanation: "هذا مثال على التفسير لأغراض العرض التوضيحي."
    }
  };

  const localizedContent = content[locale as keyof typeof content] || content.en;  const mockQCM = {
    title: localizedContent.title,
    description: localizedContent.description,
    questions: [
      {
        id: 1,
        question: localizedContent.question1,
        options: localizedContent.options,
        correct: 0,
        explanation: localizedContent.explanation
      },
      {
        id: 2,
        question: localizedContent.question2,
        options: localizedContent.options,
        correct: 1,
        explanation: localizedContent.explanation
      }
    ]
  };
  
  return NextResponse.json(mockQCM);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const queryField = formData.get("query")
  const userIdField = formData.get("userId")
  const generatePDFField = formData.get("generatePDF")
  const localeField = formData.get("locale")
  
  const query = typeof queryField === 'string' ? queryField : null
  const userId = typeof userIdField === 'string' ? userIdField : null
  const shouldGeneratePDF = generatePDFField === 'true'
  const locale = typeof localeField === 'string' ? localeField : 'en' // Default to English

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }  try {    // Add language-specific instruction to the query for QCM
    const languageInstructions = {
      en: "Please respond in English.",
      fr: "Veuillez répondre en français.",
      ar: "يرجى الرد باللغة العربية."
    };
    
    const languageInstruction = languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.en;
    const enhancedQuery = `${query}\n\n${languageInstruction}`;
    
    // Create a new FormData to send to backend
    const backendFormData = new FormData()
    backendFormData.append("query", enhancedQuery)
    backendFormData.append("user_id", userId)
    backendFormData.append("locale", locale) // Send language preference to backend
    
    // Copy any files from the original request
    const files = formData.getAll("file")
    files.forEach((file) => {
      if (file) {
        backendFormData.append("file", file)
      }
    })

    const backendRes = await fetch(`${process.env.BACKEND_URL ?? 'http://localhost:8000'}/ask`, {
      method: "POST",
      body: backendFormData,
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()      // If backend is not available, return a mock response
      if (backendRes.status === 0 || text.includes("ECONNREFUSED")) {
        return createMockQCMResponse(query, locale)
      }
      return NextResponse.json({ error: text }, { status: backendRes.status })
    }    // The backend returns a streaming response, so we need to read the full text
    const aiResponse = await backendRes.text()
      // Check if PDF generation is requested
    if (shouldGeneratePDF) {
      // Generate PDF
      const pdfBuffer = createPDFContent(aiResponse, `Generated quiz for: "${query}"`)
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="qcm-${Date.now()}.pdf"`,
        },
      })
    }
    
    // For regular requests, return the AI response wrapped in a simple format
    const qcmData = {
      title: "AI Generated Quiz",
      description: `Generated quiz for: "${query}"`,
      content: aiResponse,
      questions: [] // You could parse the AI response to extract questions
    }
    
    return NextResponse.json(qcmData)
  } catch (err) {
    console.error("Error calling backend for QCM:", err)
    // Return mock response when backend is not available
    return createMockQCMResponse(query ?? "General Knowledge", locale)
  }
}