/**
 * OpenRouter AI Client
 *
 * Provides access to multiple AI models through OpenRouter API
 * Including OpenAI GPT, Anthropic Claude, Google Gemini, Meta Llama, etc.
 */

type OpenRouterMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenRouterRequest = {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
};

type OpenRouterResponse = {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("OpenRouter API key not found");
    }
  }

  /**
   * Generate a chat completion
   */
  async chat(
    messages: OpenRouterMessage[],
    options?: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    }
  ): Promise<string> {
    const request: OpenRouterRequest = {
      model: options?.model || "anthropic/claude-3.5-sonnet",
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1000,
      top_p: options?.topP ?? 1,
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": "https://pagefairy.com",
        "X-Title": "PageFairy",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${error}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || "";
  }

  /**
   * Generate product description for lashes
   */
  async generateProductDescription(params: {
    productName: string;
    lashType: string;
    price: string;
    targetAudience?: string;
    tone?: "casual" | "professional" | "luxury";
  }): Promise<string> {
    const { productName, lashType, price, targetAudience = "beauty enthusiasts", tone = "casual" } = params;

    const systemPrompt = `You are a creative copywriter specializing in beauty and cosmetics. Generate compelling, authentic product descriptions for lash products that convert browsers into buyers.

Guidelines:
- Keep it concise (2-3 sentences)
- Focus on benefits, not just features
- Use ${tone} tone
- Include emotional appeal
- Avoid clichés and overused phrases
- Make it scannable and easy to read`;

    const userPrompt = `Generate a product description for:
- Product Name: ${productName}
- Lash Type: ${lashType}
- Price: $${price}
- Target Audience: ${targetAudience}

Create a compelling description that highlights the unique qualities of these ${lashType} lashes and why customers will love them.`;

    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    return await this.chat(messages, {
      temperature: 0.8,
      maxTokens: 150,
    });
  }

  /**
   * Generate social media caption for product launch
   */
  async generateCaption(params: {
    productName: string;
    lashType: string;
    price: string;
    platform: "instagram" | "tiktok" | "twitter";
    includeEmojis?: boolean;
    includeHashtags?: boolean;
  }): Promise<string> {
    const { productName, lashType, price, platform, includeEmojis = true, includeHashtags = true } = params;

    const platformGuidelines = {
      instagram: "casual, visual, emoji-rich, hashtag-friendly",
      tiktok: "energetic, trend-focused, short and punchy",
      twitter: "concise (under 280 chars), conversational",
    };

    const systemPrompt = `You are a social media expert specializing in beauty and creator content. Generate engaging captions that drive traffic and sales.

Platform: ${platform}
Style: ${platformGuidelines[platform]}
${includeEmojis ? "Use emojis naturally throughout" : "No emojis"}
${includeHashtags ? "Include 3-5 relevant hashtags" : "No hashtags"}`;

    const userPrompt = `Create a ${platform} caption for:
- Product: ${productName}
- Style: ${lashType} lashes
- Price: $${price}

Focus on creating FOMO and driving people to the link in bio.`;

    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    return await this.chat(messages, {
      temperature: 0.9,
      maxTokens: 200,
    });
  }

  /**
   * Generate customer support response
   */
  async generateSupportResponse(params: {
    question: string;
    context?: string;
  }): Promise<string> {
    const { question, context } = params;

    const systemPrompt = `You are a helpful customer support assistant for PageFairy, a platform where creators sell lash products.

Key information:
- We handle all fulfillment and shipping
- Products are pre-order based
- Shipping takes 2-3 weeks
- Free shipping on all orders
- Creators set their own prices
- We provide production, packaging, and delivery

Be helpful, empathetic, and concise. If you don't know something, direct them to support@pagefairy.com`;

    const userPrompt = context
      ? `Context: ${context}\n\nQuestion: ${question}`
      : `Question: ${question}`;

    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    return await this.chat(messages, {
      temperature: 0.7,
      maxTokens: 300,
    });
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient();
