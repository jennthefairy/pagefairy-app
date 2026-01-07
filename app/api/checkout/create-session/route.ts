import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { products, orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, email, name, shippingAddress } = body;

    // Validate required fields
    if (!productId || !email || !name || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch product
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Convert price to cents for Stripe
    const priceInCents = Math.round(parseFloat(product.price) * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `${product.lashType} lashes`,
              images: product.imageUrl ? [product.imageUrl] : [],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/@${product.userId}/checkout/${productId}`,
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        productId: product.id,
        creatorId: product.userId,
        customerEmail: email,
        customerName: name,
      },
    });

    // Create order record (status: pending until payment complete)
    await db.insert(orders).values({
      productId: product.id,
      creatorId: product.userId,
      customerEmail: email,
      customerName: name,
      shippingAddress: JSON.stringify(shippingAddress),
      amount: product.price,
      status: "pending",
      stripeSessionId: session.id,
    });

    return NextResponse.json(
      { sessionId: session.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create checkout session error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
