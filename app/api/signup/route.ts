import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, validateEmail, validatePassword, validateUsername, generateUsername } from "@/lib/auth/utils";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, username } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Generate or validate username
    let finalUsername = username;
    if (!finalUsername) {
      // Auto-generate from email
      finalUsername = generateUsername(email);
    } else {
      // Validate provided username
      const usernameValidation = validateUsername(finalUsername);
      if (!usernameValidation.valid) {
        return NextResponse.json(
          { error: usernameValidation.error },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const [existingEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Check if username already exists
    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, finalUsername))
      .limit(1);

    if (existingUsername) {
      // If auto-generated username exists, try again
      if (!username) {
        finalUsername = generateUsername(email);
      } else {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username: finalUsername,
        passwordHash,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
      });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
