import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, lashType, price, imageUrl, description, status } = body;

    // Validate required fields
    if (!name || !lashType || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 15) {
      return NextResponse.json(
        { error: "Price must be at least $15" },
        { status: 400 }
      );
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        userId: session.user.id,
        name,
        lashType,
        price: price.toString(),
        imageUrl: imageUrl || null,
        description: description || null,
        status: status || "draft",
      })
      .returning();

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all products for the current user
    const userProducts = await db
      .select()
      .from(products)
      .where(eq(products.userId, session.user.id))
      .orderBy(products.createdAt);

    return NextResponse.json(
      { products: userProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
