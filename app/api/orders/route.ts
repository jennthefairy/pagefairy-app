import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, drops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dropId,
      email,
      shippingAddress,
      customerName,
      phone,
      shippingMethod,
    } = body;

    // Validate required fields
    if (!dropId || !email || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the drop to get product and creator info
    const [drop] = await db
      .select()
      .from(drops)
      .where(eq(drops.id, dropId))
      .limit(1);

    if (!drop) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // In a real implementation, you would:
    // 1. Create a Stripe PaymentIntent
    // 2. Return the client secret to the frontend
    // 3. Complete payment on the client side
    // 4. Handle the webhook to confirm the order

    // For now, create the order with pending status
    const [order] = await db
      .insert(orders)
      .values({
        dropId: drop.id,
        productId: drop.productId,
        creatorId: drop.productId, // This should be fetched from the product
        customerEmail: email,
        customerName: customerName || email,
        amount: "29.99", // This should come from the product price
        status: "pending",
        stripePaymentStatus: "pending",
        shippingAddress: {
          line1: shippingAddress.line1,
          line2: shippingAddress.line2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        },
      })
      .returning();

    // Update drop current orders count
    await db
      .update(drops)
      .set({ currentOrders: drop.currentOrders + 1 })
      .where(eq(drops.id, drop.id));

    return NextResponse.json({
      success: true,
      orderId: order.id,
      // In production, return Stripe client secret here
      // clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would fetch orders for the current user
    // For now, return empty array
    return NextResponse.json({ orders: [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
