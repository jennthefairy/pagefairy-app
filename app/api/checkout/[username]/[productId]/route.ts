import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

type RouteParams = {
  params: Promise<{
    username: string;
    productId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username, productId } = await params;

    // Fetch user
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    // Fetch product
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.id, productId),
          eq(products.userId, user.id),
          eq(products.status, "active")
        )
      )
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or not available" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          lashType: product.lashType,
          imageUrl: product.imageUrl,
        },
        user: {
          username: user.username,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
