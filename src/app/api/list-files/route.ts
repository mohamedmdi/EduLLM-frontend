// app/api/list-files/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  console.log("Received user_id:", userId);
  try {
    const res = await fetch(
      `http://localhost:8000/list_files?user_id=${userId}`
    );
    const data = await res.json();
    console.log("Response from backend:", data);
    return NextResponse.json(data);  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
