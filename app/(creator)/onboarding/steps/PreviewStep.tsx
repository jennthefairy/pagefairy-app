"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink, Package } from "lucide-react";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function PreviewStep({ data, onNext, onBack }: Props) {
  const { data: session } = useSession();
  const username = session?.user?.username || "yourname";
  const bioLinkUrl = `pagefairy.com/@${username}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preview your page</CardTitle>
          <CardDescription>Here's what your customers will see</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bio Link URL */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Your PageFairy link:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background px-3 py-2 rounded text-sm font-mono">
                {bioLinkUrl}
              </code>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="border-2 border-dashed border-muted rounded-lg p-6">
            <div className="max-w-sm mx-auto space-y-4">
              {/* Mock Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 mx-auto" />

              {/* Mock Username */}
              <div className="text-center">
                <h3 className="font-bold text-lg">@{username}</h3>
              </div>

              {/* Product Card Preview */}
              <div className="bg-card border rounded-lg overflow-hidden">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.productName}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{data.productName}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Pre-order
                    </span>
                  </div>
                  <p className="text-2xl font-bold fairy-text-gradient">${data.price}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {data.lashType.replace("-", " ")} lashes
                  </p>
                  <Button variant="gradient" className="w-full" size="sm">
                    Reserve Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-primary/50 bg-primary/5 rounded-r-lg p-3">
            <p className="text-sm">
              <span className="font-semibold">Tip:</span> Your page will be live after you complete
              onboarding. You can customize it anytime from your dashboard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="gradient" onClick={() => onNext()} className="flex-1">
          Looks Good!
        </Button>
      </div>
    </div>
  );
}
