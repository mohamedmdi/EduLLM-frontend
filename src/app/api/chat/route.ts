import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge" // or "nodejs" depending on your setup

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const query = formData.get("query")?.toString()

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    const backendRes = await fetch("http://localhost:8000/ask", {
      method: "POST",
      body: formData,
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      return new NextResponse(text, { status: backendRes.status })
    }

    const stream = backendRes.body

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (err) {
    console.error("Error calling backend:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}