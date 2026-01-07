/**
 * Cloudflare Email Worker for PageFairy
 *
 * Deploy this worker separately to handle email sending
 * Docs: https://developers.cloudflare.com/email-routing/email-workers/
 *
 * Deploy command: wrangler deploy workers/email-worker.ts
 */

interface Env {
  EMAIL_WORKER_TOKEN: string;
}

interface EmailRequest {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Verify authorization token
      const authHeader = request.headers.get("Authorization");
      const expectedToken = `Bearer ${env.EMAIL_WORKER_TOKEN}`;

      if (!authHeader || authHeader !== expectedToken) {
        return new Response("Unauthorized", {
          status: 401,
          headers: corsHeaders
        });
      }

      // Parse email request
      const emailData: EmailRequest = await request.json();
      const { from, to, subject, html, text } = emailData;

      // Validate required fields
      if (!to || !subject || (!html && !text)) {
        return new Response("Missing required fields", {
          status: 400,
          headers: corsHeaders
        });
      }

      // Send email using Cloudflare Email Routing
      // Note: You need to configure email routing in Cloudflare Dashboard
      const emailMessage = new Headers();
      emailMessage.set("From", from);
      emailMessage.set("To", to);
      emailMessage.set("Subject", subject);

      const emailBody = `
${text}

---
Sent via PageFairy
`;

      // In production, this would use the Email Routing API
      // For now, log the email that would be sent
      console.log("Email would be sent:", {
        from,
        to,
        subject,
        textLength: text.length,
        htmlLength: html.length,
      });

      // Return success
      return new Response(
        JSON.stringify({
          success: true,
          message: "Email queued for delivery",
          to,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error("Email worker error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to process email",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
