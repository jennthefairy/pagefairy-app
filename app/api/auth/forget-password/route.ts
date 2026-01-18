import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { success: true, message: "If an account exists, a reset link has been sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // In a real implementation, you would:
    // 1. Store the reset token and expiry in the database
    // 2. Send an email with the reset link
    // 3. The reset link would be: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`

    // For now, just log it (in production, this should send an email)
    console.log(`Password reset requested for ${email}`);
    console.log(`Reset token: ${resetToken}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`);

    // TODO: Implement email sending
    // await sendResetEmail(email, resetToken);

    return NextResponse.json(
      { success: true, message: "If an account exists, a reset link has been sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
