// app/api/set-admin/route.ts
import { NextResponse } from "next/server"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    // Get the user by email
    const user = await adminAuth.getUserByEmail(email)
    
    // Set admin claim
    await adminAuth.setCustomUserClaims(user.uid, { admin: true })
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully made ${email} an admin!` 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
