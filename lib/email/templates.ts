/**
 * Email Templates for PageFairy
 *
 * These templates are designed to work with Cloudflare Email Workers
 */

type EmailData = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export const emailTemplates = {
  /**
   * Order Confirmation - Sent to customer after successful payment
   */
  orderConfirmation: (data: {
    customerName: string;
    productName: string;
    price: string;
    creatorUsername: string;
    orderId: string;
  }): EmailData => ({
    to: "",
    subject: `Order Confirmed: ${data.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Order Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Thank you for your order! Your lashes are reserved and will be carefully crafted just for you.</p>

              <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Product:</strong> ${data.productName}</p>
                <p><strong>Price:</strong> $${data.price}</p>
                <p><strong>Creator:</strong> @${data.creatorUsername}</p>
                <p><strong>Order ID:</strong> #${data.orderId}</p>
              </div>

              <h3>What happens next:</h3>
              <ul>
                <li>📦 Your lashes will be carefully produced and quality checked</li>
                <li>📬 Expect delivery in 2-3 weeks with free shipping</li>
                <li>📧 You'll receive a shipping notification with tracking</li>
              </ul>

              <p style="margin-top: 30px;">Questions? Reply to this email or contact us at support@pagefairy.com</p>
            </div>
            <div class="footer">
              <p>© 2025 PageFairy. All rights reserved.</p>
              <p>Empowering creators, one product at a time.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

Thank you for your order! Your lashes are reserved and will be carefully crafted just for you.

Order Details:
- Product: ${data.productName}
- Price: $${data.price}
- Creator: @${data.creatorUsername}
- Order ID: #${data.orderId}

What happens next:
- Your lashes will be carefully produced and quality checked
- Expect delivery in 2-3 weeks with free shipping
- You'll receive a shipping notification with tracking

Questions? Contact us at support@pagefairy.com

© 2025 PageFairy. All rights reserved.
    `,
  }),

  /**
   * New Order Alert - Sent to creator when they receive an order
   */
  newOrderAlert: (data: {
    creatorName: string;
    customerName: string;
    productName: string;
    price: string;
    earnings: string;
    orderId: string;
  }): EmailData => ({
    to: "",
    subject: `🎉 New Order: ${data.productName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .earnings { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You Got an Order!</h1>
            </div>
            <div class="content">
              <p>Hey ${data.creatorName},</p>
              <p>Congratulations! Someone just ordered your lashes.</p>

              <div class="earnings">
                <h2 style="margin: 0;">You'll earn</h2>
                <p style="font-size: 36px; font-weight: bold; margin: 10px 0;">$${data.earnings}</p>
              </div>

              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Customer:</strong> ${data.customerName}</p>
                <p><strong>Product:</strong> ${data.productName}</p>
                <p><strong>Order Total:</strong> $${data.price}</p>
                <p><strong>Order ID:</strong> #${data.orderId}</p>
              </div>

              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>We'll handle all production and shipping</li>
                <li>Track your earnings in your dashboard</li>
                <li>Payouts are processed weekly</li>
              </ul>

              <center>
                <a href="https://pagefairy.com/dashboard" class="button">View Dashboard</a>
              </center>

              <p style="margin-top: 30px;">Keep sharing your link - you're doing great! 🚀</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hey ${data.creatorName},

Congratulations! Someone just ordered your lashes.

You'll earn: $${data.earnings}

Order Details:
- Customer: ${data.customerName}
- Product: ${data.productName}
- Order Total: $${data.price}
- Order ID: #${data.orderId}

Next Steps:
- We'll handle all production and shipping
- Track your earnings in your dashboard
- Payouts are processed weekly

View Dashboard: https://pagefairy.com/dashboard

Keep sharing your link - you're doing great! 🚀
    `,
  }),

  /**
   * Shipping Notification - Sent to customer when order ships
   */
  shippingNotification: (data: {
    customerName: string;
    productName: string;
    trackingNumber: string;
    carrier: string;
  }): EmailData => ({
    to: "",
    subject: `Your lashes are on the way! 📦`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .tracking { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📦 Your Order Has Shipped!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.customerName},</p>
              <p>Great news! Your ${data.productName} are on their way to you.</p>

              <div class="tracking">
                <h3>Tracking Information</h3>
                <p><strong>Carrier:</strong> ${data.carrier}</p>
                <p><strong>Tracking Number:</strong><br>${data.trackingNumber}</p>
                <center>
                  <a href="https://track.${data.carrier.toLowerCase()}.com/${data.trackingNumber}" class="button">Track Package</a>
                </center>
              </div>

              <p><strong>Delivery Tips:</strong></p>
              <ul>
                <li>Estimated delivery: 3-5 business days</li>
                <li>No signature required</li>
                <li>Package tracking updates daily</li>
              </ul>

              <p style="margin-top: 30px;">Questions about your shipment? Reply to this email!</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.customerName},

Great news! Your ${data.productName} are on their way to you.

Tracking Information:
- Carrier: ${data.carrier}
- Tracking Number: ${data.trackingNumber}

Track your package: https://track.${data.carrier.toLowerCase()}.com/${data.trackingNumber}

Delivery Tips:
- Estimated delivery: 3-5 business days
- No signature required
- Package tracking updates daily

Questions about your shipment? Reply to this email!
    `,
  }),

  /**
   * Payout Notification - Sent to creator when payout is processed
   */
  payoutNotification: (data: {
    creatorName: string;
    amount: string;
    orderCount: number;
    payoutId: string;
  }): EmailData => ({
    to: "",
    subject: `💰 Payout Processed: $${data.amount}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .amount { background: #10b981; color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #FF69B4 0%, #9333EA 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Payout Sent!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.creatorName},</p>
              <p>Your payout has been processed and is on its way to your account!</p>

              <div class="amount">
                <h2 style="margin: 0;">Payout Amount</h2>
                <p style="font-size: 48px; font-weight: bold; margin: 10px 0;">$${data.amount}</p>
                <p style="opacity: 0.9;">From ${data.orderCount} order${data.orderCount !== 1 ? 's' : ''}</p>
              </div>

              <p><strong>Payout Details:</strong></p>
              <ul>
                <li>Payout ID: #${data.payoutId}</li>
                <li>Funds typically arrive in 2-5 business days</li>
                <li>Check your Stripe Dashboard for details</li>
              </ul>

              <center>
                <a href="https://pagefairy.com/dashboard" class="button">View Dashboard</a>
              </center>

              <p style="margin-top: 30px;">Keep up the amazing work! 🎉</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hi ${data.creatorName},

Your payout has been processed and is on its way to your account!

Payout Amount: $${data.amount}
From ${data.orderCount} order${data.orderCount !== 1 ? 's' : ''}

Payout Details:
- Payout ID: #${data.payoutId}
- Funds typically arrive in 2-5 business days
- Check your Stripe Dashboard for details

View Dashboard: https://pagefairy.com/dashboard

Keep up the amazing work! 🎉
    `,
  }),
};
