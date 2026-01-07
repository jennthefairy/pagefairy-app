import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import { users, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { Sparkles, Package, Shield, Truck, CreditCard } from "lucide-react";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function BioLinkPage({ params }: Props) {
  const { username } = await params;

  // Remove @ symbol if present
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  // Fetch user and their active products
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      name: users.name,
      bio: users.bio,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.username, cleanUsername))
    .limit(1);

  if (!user) {
    notFound();
  }

  const userProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.userId, user.id),
        eq(products.status, "active")
      )
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold fairy-text-gradient">PageFairy</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Creator Profile */}
        <div className="text-center mb-8">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name || user.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {(user.name || user.username).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold mb-1">{user.name || `@${user.username}`}</h1>
          {user.name && (
            <p className="text-muted-foreground mb-2">@{user.username}</p>
          )}
          {user.bio && (
            <p className="text-muted-foreground max-w-md mx-auto">{user.bio}</p>
          )}
        </div>

        {/* Products */}
        {userProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground text-sm">Check back soon for new drops!</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {userProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {/* Product Image */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Package className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}

                {/* Product Details */}
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                          Pre-order
                        </span>
                      </div>
                      <p className="text-muted-foreground capitalize">
                        {product.lashType?.replace("-", " ")} lashes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold fairy-text-gradient">
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-muted-foreground">{product.description}</p>
                  )}

                  {/* Features */}
                  {product.features && Array.isArray(product.features) && (
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full text-lg h-12"
                    asChild
                  >
                    <Link href={`/@${user.username}/checkout/${product.id}`}>
                      Reserve Now
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Shield className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <Truck className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Free Shipping</p>
                    </div>
                    <div className="text-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Pay Later</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Powered by Footer */}
        <div className="text-center mt-12 pt-8 border-t">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <span>Powered by</span>
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold fairy-text-gradient">PageFairy</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Create your own product link in minutes
          </p>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  const [user] = await db
    .select({
      name: users.name,
      username: users.username,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.username, cleanUsername))
    .limit(1);

  if (!user) {
    return {
      title: "Creator Not Found - PageFairy",
    };
  }

  return {
    title: `${user.name || `@${user.username}`} - PageFairy`,
    description: user.bio || `Shop ${user.name || user.username}'s products on PageFairy`,
  };
}
