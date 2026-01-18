"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowLeft, Package, Shield, Lock } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: string;
  lashType: string;
  imageUrl: string | null;
};

type User = {
  username: string;
  name: string | null;
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "US",
  });

  const username = (params.username as string).replace("@", "");
  const productId = params.productId as string;

  useEffect(() => {
    fetchProductDetails();
  }, [productId, username]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`/api/checkout/${username}/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
        setUser(data.user);
      } else {
        router.push(`/@${username}`);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
      router.push(`/@${username}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email,
          name,
          shippingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create checkout session");
        return;
      }

      // Redirect to Stripe Checkout
<<<<<<< HEAD
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create checkout session");
=======
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await (stripe as any).redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          alert(error.message);
        }
>>>>>>> d4380c0 (commit)
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!product || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/@${username}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to @{username}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <div>
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Product Image */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize mb-3">
                    {product.lashType.replace("-", " ")} lashes
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    Sold by @{username}
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product</span>
                    <span className="font-medium">${product.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-success">FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold fairy-text-gradient">
                      ${product.price}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>256-bit SSL encryption</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Pre-Order</CardTitle>
                <CardDescription>Reserve your lashes now, pay later</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send order updates here
                    </p>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Shipping Address <span className="text-destructive">*</span>
                    </label>

                    <Input
                      placeholder="Street address"
                      value={shippingAddress.line1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                      required
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="City"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="State"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        required
                      />
                    </div>

                    <Input
                      placeholder="ZIP code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                      required
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-primary/5 border-l-4 border-primary/50 rounded-r-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold">Pre-order:</span> Reserve now, we'll charge
                      you when your lashes ship!
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full text-lg h-12"
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Reserve & Pay Later"}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By completing this purchase, you agree to PageFairy's Terms of Service
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
