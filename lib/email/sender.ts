/**
 * Email Sender for PageFairy
 *
 * Uses Cloudflare Email Workers or fallback to fetch API
 * Configure your email worker at: https://dash.cloudflare.com/
 */

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
};

export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const { to, subject, html, text, from = "PageFairy <noreply@pagefairy.com>" } = params;

  try {
    // Option 1: Using Cloudflare Email Workers (recommended)
    if (process.env.CLOUDFLARE_EMAIL_WORKER_URL) {
      const response = await fetch(process.env.CLOUDFLARE_EMAIL_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_EMAIL_WORKER_TOKEN}`,
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email worker failed: ${response.statusText}`);
      }

      return true;
    }

    // Option 2: Direct SMTP via fetch (if Email Worker not available)
    // This is a fallback - you'll need to deploy an email worker
    console.warn("Cloudflare Email Worker URL not configured. Email not sent.");
    console.log("Email would be sent to:", to, "Subject:", subject);

    return false;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

/**
 * Send multiple emails in batch
 */
export async function sendBatchEmails(emails: SendEmailParams[]): Promise<boolean[]> {
  const results = await Promise.allSettled(
    emails.map((email) => sendEmail(email))
  );

  return results.map((result) => result.status === "fulfilled" && result.value);
}

/**
 * Queue email for background sending
 * Useful for non-critical emails that can be delayed
 */
export async function queueEmail(params: SendEmailParams): Promise<void> {
  // In production, this would use Cloudflare Queues
  // For now, we'll send immediately
  await sendEmail(params);
}
