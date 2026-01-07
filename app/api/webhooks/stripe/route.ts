import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { orders, payouts, products, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("Checkout completed:", session.id);

  const { productId, creatorId, customerEmail, customerName } = session.metadata || {};

  if (!productId || !creatorId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  try {
    // Update order status
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripeSessionId, session.id))
      .limit(1);

    if (order) {
      // Update order to paid
      await db
        .update(orders)
        .set({
          status: "paid",
          stripePaymentIntentId: session.payment_intent as string,
        })
        .where(eq(orders.id, order.id));

      // Calculate creator payout (price minus base cost)
      const baseCost = 15;
      const orderAmount = parseFloat(order.amount);
      const creatorEarnings = Math.max(0, orderAmount - baseCost);

      // Create payout record
      await db.insert(payouts).values({
        userId: creatorId,
        orderId: order.id,
        amount: creatorEarnings.toString(),
        status: "pending",
      });

      console.log(`Order ${order.id} marked as paid, payout created for $${creatorEarnings}`);

      // Send email notifications
      const { sendEmail } = await import("@/lib/email/sender");
      const { emailTemplates } = await import("@/lib/email/templates");

      // Get product and creator details
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      const [creator] = await db
        .select()
        .from(users)
        .where(eq(users.id, creatorId))
        .limit(1);

      if (product && creator) {
        // Send order confirmation to customer
        const customerEmailData = emailTemplates.orderConfirmation({
          customerName: customerName || "Customer",
          productName: product.name,
          price: order.amount,
          creatorUsername: creator.username,
          orderId: order.id,
        });
        await sendEmail({ ...customerEmailData, to: customerEmail || order.customerEmail });

        // Send new order alert to creator
        const creatorEmailData = emailTemplates.newOrderAlert({
          creatorName: creator.name || creator.username,
          customerName: customerName || "A customer",
          productName: product.name,
          price: order.amount,
          earnings: creatorEarnings.toString(),
          orderId: order.id,
        });
        await sendEmail({ ...creatorEmailData, to: creator.email });
      }
    }
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);

  // Update any orders with this payment intent
  try {
    await db
      .update(orders)
      .set({ status: "paid" })
      .where(eq(orders.stripePaymentIntentId, paymentIntent.id));
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment failed:", paymentIntent.id);

  try {
    // Update order status to failed
    await db
      .update(orders)
      .set({ status: "failed" })
      .where(eq(orders.stripePaymentIntentId, paymentIntent.id));

    // TODO: Send notification to customer about payment failure
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  console.log("Charge refunded:", charge.id);

  try {
    // Find orders with this charge
    const paymentIntentId = charge.payment_intent as string;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.stripePaymentIntentId, paymentIntentId))
      .limit(1);

    if (order) {
      // Update order status
      await db
        .update(orders)
        .set({ status: "refunded" })
        .where(eq(orders.id, order.id));

      // Update payout status if exists
      await db
        .update(payouts)
        .set({ status: "cancelled" })
        .where(eq(payouts.orderId, order.id));

      console.log(`Order ${order.id} refunded, payout cancelled`);

      // TODO: Send refund notification emails
    }
  } catch (error) {
    console.error("Error handling refund:", error);
  }
}
