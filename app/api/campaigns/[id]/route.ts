import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products, drops } from "@/lib/db/schema";
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

    // Fetch the associated product
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

    // Build campaign object
    const campaign = {
      id: drop.id,
      name: product.name,
      status: product.status,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      drop: {
        id: drop.id,
        currentOrders: drop.currentOrders,
        minOrders: drop.minOrders,
        status: drop.status,
      },
      createdAt: product.createdAt,
      copyData: product.aiGeneratedDescription
        ? {
            headline: "Pre-Order Now",
            description: product.aiGeneratedDescription,
            ctaText: "Secure My Pre-Order",
          }
        : undefined,
    };

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { status } = body;

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

    // Update product status
    if (status) {
      await db
        .update(products)
        .set({ status, updatedAt: new Date() })
        .where(eq(products.id, product.id));

      // Update drop status accordingly
      const dropStatus =
        status === "active" ? "active" :
        status === "ended" ? "cancelled" :
        status;

      await db
        .update(drops)
        .set({ status: dropStatus })
        .where(eq(drops.id, drop.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Failed to update campaign" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete the drop (cascade will handle related data)
    await db.delete(drops).where(eq(drops.id, drop.id));

    // Delete the product
    await db.delete(products).where(eq(products.id, product.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Failed to delete campaign" },
      { status: 500 }
    );
  }
}
