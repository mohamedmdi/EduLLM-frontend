import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // or "nodejs" depending on your setup

// Mock response function for when backend is not available
function createMockResponse(query: string, locale: string = 'en') {
  const responses = {
    en: [
      `I understand you're asking about: "${query}". As this is a demo version, I'm providing a simulated response. For full functionality, please ensure the backend server is running on localhost:8000.`,
      `That's an interesting question about "${query}". In a real environment, I would analyze your query and provide detailed educational assistance. Currently running in demo mode.`,
      `Thanks for your question: "${query}". I'm EduLLM, your AI learning companion. This is a preview response since the backend service isn't currently available.`,
    ],
    fr: [
      `Je comprends que vous posez une question sur : "${query}". Comme il s'agit d'une version de démonstration, je fournis une réponse simulée. Pour une fonctionnalité complète, veuillez vous assurer que le serveur backend fonctionne sur localhost:8000.`,
      `C'est une question intéressante sur "${query}". Dans un environnement réel, j'analyserais votre requête et fournirais une assistance éducative détaillée. Actuellement en mode démo.`,
      `Merci pour votre question : "${query}". Je suis EduLLM, votre compagnon d'apprentissage IA. Ceci est une réponse de prévisualisation car le service backend n'est pas actuellement disponible.`,
    ],
    ar: [
      `أفهم أنك تسأل عن: "${query}". نظرًا لأن هذه نسخة تجريبية، فإنني أقدم استجابة محاكاة. للحصول على الوظائف الكاملة، يرجى التأكد من تشغيل خادم الواجهة الخلفية على localhost:8000.`,
      `هذا سؤال مثير للاهتمام حول "${query}". في بيئة حقيقية، سأحلل استفسارك وأقدم مساعدة تعليمية مفصلة. يعمل حاليًا في وضع العرض التوضيحي.`,
      `شكرًا لك على سؤالك: "${query}". أنا EduLLM، رفيق التعلم بالذكاء الاصطناعي. هذه استجابة معاينة نظرًا لأن خدمة الواجهة الخلفية غير متاحة حاليًا.`,
    ]
  };

  const availableResponses = responses[locale as keyof typeof responses] || responses.en;
  const response = availableResponses[Math.floor(Math.random() * availableResponses.length)];

  // Create a streaming response
  const stream = new ReadableStream({
    start(controller) {
      const words = response.split(" ");
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          controller.enqueue(new TextEncoder().encode(words[index] + " "));
          index++;
        } else {
          clearInterval(interval);
          controller.close();
        }
      }, 50); // Simulate typing effect
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const queryField = formData.get("query");
  const userIdField = formData.get("userId");
  const localeField = formData.get("locale");

  const query = typeof queryField === "string" ? queryField : null;
  const userId = typeof userIdField === "string" ? userIdField : null;
  const locale = typeof localeField === "string" ? localeField : "en"; // Default to English

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {    // Create a new FormData to send to backend with userId
    const backendFormData = new FormData();
    backendFormData.append("query", query);
    backendFormData.append("user_id", userId); // Backend expects user_id
    backendFormData.append("locale", locale); // Send language preference to backend

    // Copy any files from the original request
    const files = formData.getAll("file"); // this is an array of files, if multiple files uploaded
    files.forEach((file) => {
      backendFormData.append("file", file);
    });const backendRes = await fetch(
      `${process.env.BACKEND_URL ?? "http://localhost:8000"}/ask`,
      {
        method: "POST",
        body: backendFormData,
      }
    );

    if (!backendRes.ok) {      const text = await backendRes.text();
      // If backend is not available, return a mock response
      if (backendRes.status === 0 || text.includes("ECONNREFUSED")) {
        return createMockResponse(query, locale);
      }
      return new NextResponse(text, { status: backendRes.status });
    }

    const stream = backendRes.body;

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });  } catch (err) {
    console.error("Error calling backend:", err);
    // Return mock response when backend is not available
    return createMockResponse(query || "Hello", locale);
  }
}
