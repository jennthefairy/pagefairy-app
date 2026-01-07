import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { openRouterClient } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productName, lashType, price, tone } = body;

    // Validate required fields
    if (!productName || !lashType || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate description using OpenRouter
    const description = await openRouterClient.generateProductDescription({
      productName,
      lashType,
      price,
      tone: tone || "casual",
    });

    return NextResponse.json(
      { description },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generate description error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
