import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { openRouterClient } from "@/lib/ai/openrouter";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { task, query, productType, productName } = body;

    // Validate required fields
    if (!task || !query) {
      return NextResponse.json(
        { error: "Missing required fields: task and query" },
        { status: 400 }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (task) {
      case "product_launch":
        systemPrompt = `You are a creative copywriter specializing in product launches and pre-order campaigns. Generate compelling, conversion-focused copy that creates urgency and excitement.

Guidelines:
- Create a punchy, benefit-driven headline (under 10 words)
- Write a compelling description (2-3 short paragraphs)
- Generate a strong CTA button text (2-4 words)
- Focus on benefits over features
- Create FOMO and urgency
- Use emotional appeal
- Keep language clear and scannable
- Match tone to product type (${productType || "general"})

Return JSON format:
{
  "headline": "...",
  "description": "...",
  "ctaText": "..."
}`;

        userPrompt = `Generate pre-order campaign copy for:
- Product/Campaign Name: ${productName || "Unnamed Product"}
- Product Type: ${productType || "general"}
- Business/Product Description: ${query}

Create copy that will maximize pre-order conversions and create excitement around the launch.`;
        break;

      default:
        return NextResponse.json({ error: "Invalid task type" }, { status: 400 });
    }

    const messages = [
      { role: "system" as const, content: systemPrompt },
      { role: "user" as const, content: userPrompt },
    ];

    const response = await openRouterClient.chat(messages, {
      temperature: 0.8,
      maxTokens: 500,
    });

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(response);
      return NextResponse.json(parsed, { status: 200 });
    } catch {
      // If not JSON, return the raw response with a default structure
      return NextResponse.json(
        {
          headline: "Pre-Order Your Exclusive Product",
          description: response,
          ctaText: "Secure My Pre-Order",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Generate AI copy error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
