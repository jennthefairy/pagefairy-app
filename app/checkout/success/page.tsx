"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Check, Package, Mail } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      router.push("/");
      return;
    }

    // Here you could fetch order details from your API
    // For now, we'll just show a success message
    setLoading(false);
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Processing...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="border-success/50">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center">
              <Check className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-lg text-muted-foreground">
              Thank you for your pre-order! Your lashes are reserved.
            </p>

            {/* What Happens Next */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg">What happens next:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Check your email</p>
                    <p className="text-sm text-muted-foreground">
                      We sent a confirmation to your email with order details
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Production begins</p>
                    <p className="text-sm text-muted-foreground">
                      Your lashes will be carefully crafted and quality checked
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ships to you</p>
                    <p className="text-sm text-muted-foreground">
                      Expect your order in 2-3 weeks with free shipping
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-success/50 bg-success/5 rounded-r-lg p-4">
              <p className="text-sm">
                <span className="font-semibold">💚 Thank you for supporting creators!</span> Your
                purchase directly helps creators turn their passion into income.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">Browse More Creators</Link>
              </Button>
              <Button variant="gradient" className="flex-1" asChild>
                <Link href="/">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Selling Too
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a href="mailto:support@pagefairy.com" className="text-primary hover:underline">
              support@pagefairy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
