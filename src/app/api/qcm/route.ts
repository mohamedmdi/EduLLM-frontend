import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

// Mock response function for QCM generation
function createMockQCMResponse(query: string) {
  const mockQCM = {
    title: "Sample Quiz",
    description: `Generated quiz for: "${query}"`,
    questions: [
      {
        id: 1,
        question: "What is the main topic discussed?",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        explanation: "This is a sample explanation for demonstration purposes."
      },
      {
        id: 2,
        question: "Which of the following is correct?",
        options: ["First choice", "Second choice", "Third choice", "Fourth choice"],
        correct: 1,
        explanation: "This is another sample explanation."
      }
    ]
  };
  
  return NextResponse.json(mockQCM);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const queryField = formData.get("query")
  const userIdField = formData.get("userId")
  
  const query = typeof queryField === 'string' ? queryField : null
  const userId = typeof userIdField === 'string' ? userIdField : null

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Create a new FormData to send to backend
    const backendFormData = new FormData()
    backendFormData.append("query", query)
    backendFormData.append("user_id", userId)
    
    // Copy any files from the original request
    const file = formData.get("file")
    if (file) {
      backendFormData.append("file", file)
    }

    const backendRes = await fetch(`${process.env.BACKEND_URL ?? 'http://localhost:8000'}/generate-qcm`, {
      method: "POST",
      body: backendFormData,
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      // If backend is not available, return a mock response
      if (backendRes.status === 0 || text.includes("ECONNREFUSED")) {
        return createMockQCMResponse(query)
      }
      return NextResponse.json({ error: text }, { status: backendRes.status })
    }

    const data = await backendRes.json()
    return NextResponse.json(data)

  } catch (err) {
    console.error("Error calling backend for QCM:", err)
    // Return mock response when backend is not available
    return createMockQCMResponse(query ?? "General Knowledge")
  }
}
