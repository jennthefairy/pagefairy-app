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
    const { productName, lashType, price, platform } = body;

    // Validate required fields
    if (!productName || !lashType || !price || !platform) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate platform
    if (!["instagram", "tiktok", "twitter"].includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform" },
        { status: 400 }
      );
    }

    // Generate caption using OpenRouter
    const caption = await openRouterClient.generateCaption({
      productName,
      lashType,
      price,
      platform,
      includeEmojis: true,
      includeHashtags: true,
    });

    return NextResponse.json(
      { caption },
      { status: 200 }
    );
  } catch (error) {
    console.error("Generate caption error:", error);
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}
