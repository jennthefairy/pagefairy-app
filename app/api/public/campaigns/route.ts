import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, products, drops } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const slug = searchParams.get("slug");

  if (!username || !slug) {
    return NextResponse.json(
      { error: "Missing username or slug parameter" },
      { status: 400 }
    );
  }

  try {
    // Find user by username
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Find product by slug (convert slug back to name)
    // In a real implementation, you'd have a slug field in the products table
    // For now, we'll search by matching the product name
    const productName = slug.replace(/-/g, " ");

    const userProducts = await db
      .select()
      .from(products)
      .where(and(
        eq(products.userId, user.id),
        eq(products.status, "active")
      ));

    // Find matching product (case-insensitive)
    const product = userProducts.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch the associated drop
    const [drop] = await db
      .select()
      .from(drops)
      .where(eq(drops.productId, product.id))
      .limit(1);

    // Build campaign object
    const campaign = {
      id: drop?.id || product.id,
      name: product.name,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        photos: product.imageUrl ? [product.imageUrl] : [],
      },
      drop: drop
        ? {
            id: drop.id,
            currentOrders: drop.currentOrders,
            minOrders: drop.minOrders,
            status: drop.status,
          }
        : null,
      copyData: product.aiGeneratedDescription
        ? {
            headline: `Pre-Order ${product.name}`,
            description: product.aiGeneratedDescription,
            ctaText: "Secure My Pre-Order",
          }
        : undefined,
      creator: {
        username: user.username,
        name: user.name,
        brandColor: "#6366f1", // Default color, would come from user profile
      },
    };

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Error fetching public campaign:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}
