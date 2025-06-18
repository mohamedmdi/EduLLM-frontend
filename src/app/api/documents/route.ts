import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // Required for file processing

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const userId = formData.get("userId")?.toString()
  const action = formData.get("action")?.toString() || "upload" // upload, process, delete

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Create FormData for backend request with user_id for embedding folder creation
    const backendFormData = new FormData()
    backendFormData.append("user_id", userId) // Backend uses this to create/access user embedding folder
    backendFormData.append("action", action)
    
    // Handle file uploads
    const files = formData.getAll("file")
    if (files.length === 0 && action === "upload") {
      return NextResponse.json({ error: "At least one file is required for upload" }, { status: 400 })
    }

    files.forEach((file) => {
      if (file instanceof File) {
        backendFormData.append("file", file)
      }
    })

    // Add any additional metadata
    const metadata = formData.get("metadata")
    if (metadata) {
      backendFormData.append("metadata", metadata)
    }

    // Send to backend document processing endpoint
    let backendUrl = "http://localhost:8000/documents"
    
    // Different endpoints based on action
    switch (action) {
      case "upload":
        backendUrl = "http://localhost:8000/documents/upload"
        break
      case "process":
        backendUrl = "http://localhost:8000/documents/process"
        break
      case "delete":
        backendUrl = "http://localhost:8000/documents/delete"
        break
      case "list":
        backendUrl = "http://localhost:8000/documents/list"
        break
      default:
        backendUrl = "http://localhost:8000/documents"
    }

    const backendRes = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      return new NextResponse(text, { status: backendRes.status })
    }

    // Return JSON response for document operations
    const result = await backendRes.json()
    return NextResponse.json(result)

  } catch (err) {
    console.error("Error processing documents:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    // Get user's documents list from backend
    const backendRes = await fetch(`http://localhost:8000/documents/list?user_id=${userId}`, {
      method: "GET",
    })

    if (!backendRes.ok) {
      const text = await backendRes.text()
      return new NextResponse(text, { status: backendRes.status })
    }

    const documents = await backendRes.json()
    return NextResponse.json(documents)

  } catch (err) {
    console.error("Error fetching documents:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
