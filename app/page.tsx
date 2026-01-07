import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Package, CreditCard, Truck, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold fairy-text-gradient">PageFairy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn Your Content Into{" "}
            <span className="fairy-text-gradient">Products</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sell lash products without inventory. No upfront costs, no shipping hassles. Get paid per order shipped.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="gradient" className="text-lg px-8 py-6 h-auto">
              Add a Product to My Bio
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full fairy-gradient mx-auto mb-4 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Choose Product</h3>
            <p className="text-muted-foreground">
              Pick your lash style, set your price, and get your unique link
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full fairy-gradient mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Share & Sell</h3>
            <p className="text-muted-foreground">
              Add link to bio, create content, and collect pre-orders
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full fairy-gradient mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Get Paid</h3>
            <p className="text-muted-foreground">
              Orders ship automatically, you receive your earnings
            </p>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 fairy-gradient text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Creators Love PageFairy
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Truck className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Zero Fulfillment</h3>
                  <p className="text-white/90">We handle all production, packaging, and shipping</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">No Inventory Risk</h3>
                  <p className="text-white/90">Products are made only after orders come in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Simple Payouts</h3>
                  <p className="text-white/90">Get paid directly for every order shipped</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">Free to Launch</h3>
                  <p className="text-white/90">No subscription, no upfront costs</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Launch Your First Product?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join creators who are turning their influence into income
        </p>
        <Link href="/signup">
          <Button size="lg" variant="gradient" className="text-lg px-8 py-6 h-auto">
            Get Started Free
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold fairy-text-gradient">PageFairy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PageFairy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
