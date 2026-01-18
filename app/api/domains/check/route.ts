import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Reserved slugs that cannot be used
const RESERVED_SLUGS = [
  "admin",
  "api",
  "app",
  "auth",
  "blog",
  "checkout",
  "dashboard",
  "docs",
  "help",
  "login",
  "logout",
  "settings",
  "signup",
  "support",
  "terms",
  "privacy",
  "about",
  "contact",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter is required" },
      { status: 400 }
    );
  }

  // Validate slug format
  const slugRegex = /^[a-z0-9-]{3,}$/;
  if (!slugRegex.test(slug)) {
    return NextResponse.json({
      available: false,
      reason: "Invalid format. Use lowercase letters, numbers, and hyphens only (min 3 characters)",
    });
  }

  // Check if reserved
  if (RESERVED_SLUGS.includes(slug)) {
    return NextResponse.json({
      available: false,
      reason: "This slug is reserved",
      suggestions: [
        `${slug}-store`,
        `${slug}-shop`,
        `${slug}-official`,
        `my-${slug}`,
      ],
    });
  }

  try {
    // Check if username exists
    // In production, you'd have a separate slug field
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, slug))
      .limit(1);

    if (existingUser) {
      // Generate suggestions
      const suggestions = [
        `${slug}-store`,
        `${slug}-shop`,
        `${slug}-official`,
        `${slug}${Math.floor(Math.random() * 100)}`,
      ];

      return NextResponse.json({
        available: false,
        reason: "This slug is already taken",
        suggestions,
      });
    }

    return NextResponse.json({
      available: true,
      slug,
    });
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
