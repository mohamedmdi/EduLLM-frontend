import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // or "nodejs" depending on your setup

// Mock response function for when backend is not available
function createMockResponse(query: string) {
  const mockResponses = [
    `I understand you're asking about: "${query}". As this is a demo version, I'm providing a simulated response. For full functionality, please ensure the backend server is running on localhost:8000.`,
    `That's an interesting question about "${query}". In a real environment, I would analyze your query and provide detailed educational assistance. Currently running in demo mode.`,
    `Thanks for your question: "${query}". I'm EduLLM, your AI learning companion. This is a preview response since the backend service isn't currently available.`,
  ];

  const response =
    mockResponses[Math.floor(Math.random() * mockResponses.length)];

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

  const query = typeof queryField === "string" ? queryField : null;
  const userId = typeof userIdField === "string" ? userIdField : null;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Create a new FormData to send to backend with userId
    const backendFormData = new FormData();
    backendFormData.append("query", query);
    backendFormData.append("user_id", userId); // Backend expects user_id

    // Copy any files from the original request
    const files = formData.getAll("file"); // this is an array of files, if multiple files uploaded
    files.forEach((file) => {
      backendFormData.append("file", file);
    });

    const backendRes = await fetch(
      `${process.env.BACKEND_URL ?? "http://localhost:8000"}/ask`,
      {
        method: "POST",
        body: backendFormData,
      }
    );

    /*     // Simulate API call delay for 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate a successful backend response
    const backendRes = {
      ok: true,
      status: 200,
      body: new ReadableStream({
        start(controller) {
          const responseText = `Simulated backend response for query: "${query}" and userId: "${userId}"`;
          controller.enqueue(new TextEncoder().encode(responseText));
          controller.close();
        },
      }),
      text: async () => "Simulated backend response",
    } as Response; */

    if (!backendRes.ok) {
      const text = await backendRes.text();
      // If backend is not available, return a mock response
      if (backendRes.status === 0 || text.includes("ECONNREFUSED")) {
        return createMockResponse(query);
      }
      return new NextResponse(text, { status: backendRes.status });
    }

    const stream = backendRes.body;

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (err) {
    console.error("Error calling backend:", err);
    // Return mock response when backend is not available
    return createMockResponse(query || "Hello");
  }
}
