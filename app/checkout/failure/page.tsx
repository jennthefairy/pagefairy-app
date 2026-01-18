"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, RefreshCw, HelpCircle, Sparkles } from "lucide-react";

export default function CheckoutFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const errorMessage = searchParams.get("error") || "Payment failed";

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Error Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground">
            We couldn't process your payment. Please try again.
          </p>
        </div>

        {/* Error Details */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Error Message */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error Details</p>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
              </CardContent>
            </Card>

            {/* Common Issues */}
            <div>
              <h3 className="font-semibold mb-4">Common Issues & Solutions</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <p>
                    <strong>Insufficient funds:</strong> Check your account balance
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <p>
                    <strong>Incorrect card details:</strong> Verify your card number, expiry date,
                    and CVV
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <p>
                    <strong>Card declined:</strong> Contact your bank to authorize the transaction
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <p>
                    <strong>Billing address mismatch:</strong> Ensure your billing address matches
                    your card records
                  </p>
                </div>
              </div>
            </div>

            {/* What to Do */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  <strong>Don't worry!</strong> Your order is saved. You can try paying again, use
                  a different payment method, or contact us for assistance.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.back()}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/support")}
                variant="outline"
                className="flex-1"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>

            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="w-full"
            >
              Return to Store
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>
              Powered by{" "}
              <a href="https://pagefairy.com" className="text-primary hover:underline">
                PageFairy
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
