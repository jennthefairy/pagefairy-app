"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check, ArrowLeft, Loader2, Instagram } from "lucide-react";

type Product = {
  id: string;
  name: string;
  lashType: string;
  price: string;
};

export default function CaptionGeneratorPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok" | "twitter">("instagram");
  const [caption, setCaption] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProducts();
    }
  }, [status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products || []);
      if (data.products?.length > 0) {
        setSelectedProduct(data.products[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    setGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product.name,
          lashType: product.lashType,
          price: product.price,
          platform,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCaption(data.caption);
      } else {
        alert(data.error || "Failed to generate caption");
      }
    } catch (error) {
      alert("Failed to generate caption. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <header className="border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <Card>
            <CardContent className="p-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products yet</h2>
              <p className="text-muted-foreground mb-6">
                Create a product first to generate captions
              </p>
              <Button variant="gradient" asChild>
                <Link href="/onboarding">Create Product</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Caption Generator
          </h1>
          <p className="text-muted-foreground">
            Generate engaging social media captions for your products
          </p>
        </div>

        <div className="grid gap-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Caption</CardTitle>
              <CardDescription>Choose your product and platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "instagram", label: "Instagram", icon: Instagram },
                    { id: "tiktok", label: "TikTok", icon: Sparkles },
                    { id: "twitter", label: "Twitter", icon: Sparkles },
                  ].map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setPlatform(plat.id as any)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        platform === plat.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <plat.icon className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">{plat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                variant="gradient"
                className="w-full"
                disabled={generating || !selectedProduct}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Caption...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          {caption && (
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Caption</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={8}
                  className="font-sans whitespace-pre-wrap"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Feel free to edit the caption to match your style
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tips Card */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Generate multiple captions and pick your favorite</p>
              <p>• Add your own personal touch to make it authentic</p>
              <p>• Include a clear call-to-action (check link in bio)</p>
              <p>• Post when your audience is most active</p>
              <p>• Engage with comments to boost visibility</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
