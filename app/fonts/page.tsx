import { NextResponse } from "next/server"

// This is a simple API route to handle the font file request
export async function GET() {
  // Redirect to a default font or return a 404
  return NextResponse.redirect("/fonts/Inter-Bold.ttf")
}

