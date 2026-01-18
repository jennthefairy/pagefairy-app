import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products, drops } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      campaignName,
      templateId,
      goalQty,
      productDetails,
      copyData,
      status = "draft",
    } = body;

    // Create the product
    const [product] = await db
      .insert(products)
      .values({
        userId: session.user.id,
        name: campaignName,
        description: productDetails.description,
        aiGeneratedDescription: copyData.description,
        price: productDetails.price.replace(/[^0-9.]/g, ""),
        imageUrl: productDetails.photos[0] || null,
        status: status,
      })
      .returning();

    // Create the drop (campaign)
    const [drop] = await db
      .insert(drops)
      .values({
        productId: product.id,
        minOrders: goalQty,
        currentOrders: 0,
        status: status === "draft" ? "active" : status,
      })
      .returning();

    return NextResponse.json({
      success: true,
      campaignId: drop.id,
      productId: product.id,
      campaign: {
        id: drop.id,
        name: campaignName,
        templateId,
        product,
        drop,
      },
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all products with their associated drops
    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.userId, session.user.id))
      .orderBy(products.createdAt);

    // Fetch drops for these products
    const campaigns = await Promise.all(
      userProducts.map(async (product) => {
        const [drop] = await db
          .select()
          .from(drops)
          .where(eq(drops.productId, product.id))
          .limit(1);

        return {
          id: drop?.id || product.id,
          name: product.name,
          status: product.status,
          product,
          drop,
          progress: drop
            ? {
                current: drop.currentOrders,
                goal: drop.minOrders,
              }
            : null,
          createdAt: product.createdAt,
        };
      })
    );

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
