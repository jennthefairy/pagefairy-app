import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, drops, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the drop
    const [drop] = await db
      .select()
      .from(drops)
      .where(eq(drops.id, params.id))
      .limit(1);

    if (!drop) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Verify ownership
    const [product] = await db
      .select()
      .from(products)
      .where(and(
        eq(products.id, drop.productId),
        eq(products.userId, session.user.id)
      ))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Fetch orders for this drop
    const campaignOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.dropId, drop.id))
      .orderBy(orders.createdAt);

    return NextResponse.json({ orders: campaignOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
