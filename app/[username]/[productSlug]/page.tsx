"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CheckCircle, Package, Shield, TrendingUp } from "lucide-react";

type Campaign = {
  id: string;
  name: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string | null;
    photos?: string[];
  };
  drop: {
    id: string;
    currentOrders: number;
    minOrders: number;
    status: string;
  } | null;
  copyData?: {
    headline: string;
    description: string;
    ctaText: string;
  };
  creator: {
    username: string;
    name: string | null;
    brandColor?: string;
  };
};

export default function PublicPreOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    if (params.username && params.productSlug) {
      fetchCampaign();
    }
  }, [params.username, params.productSlug]);

  useEffect(() => {
    if (campaign?.creator?.brandColor) {
      document.documentElement.style.setProperty("--brand-color", campaign.creator.brandColor);
    }
  }, [campaign]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(
        `/api/public/campaigns?username=${params.username}&slug=${params.productSlug}`
      );

      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else {
        // Campaign not found
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreOrder = () => {
    if (campaign) {
      router.push(`/checkout/${campaign.drop?.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const progress = campaign.drop
    ? (campaign.drop.currentOrders / campaign.drop.minOrders) * 100
    : 0;
  const progressClamped = Math.min(progress, 100);
  const photos = campaign.product.photos || (campaign.product.imageUrl ? [campaign.product.imageUrl] : []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: campaign.creator.brandColor || "#6366f1" }} />
            <span className="font-bold text-lg">{campaign.creator.name || campaign.creator.username}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-muted">
              {photos.length > 0 && (
                <img
                  src={photos[selectedPhotoIndex]}
                  alt={campaign.product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {photos.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedPhotoIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${campaign.product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Headline */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                {campaign.copyData?.headline || campaign.product.name}
              </h1>
              <div className="flex items-center gap-2 text-3xl font-bold" style={{ color: campaign.creator.brandColor || "#6366f1" }}>
                <span>${campaign.product.price}</span>
              </div>
            </div>

            {/* Progress Bar */}
            {campaign.drop && (
              <Card style={{ backgroundColor: `${campaign.creator.brandColor}10`, borderColor: campaign.creator.brandColor }}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {progressClamped >= 100 ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-green-600">Goal Unlocked!</span>
                            </>
                          ) : (
                            <>
                              <TrendingUp className="h-5 w-5" />
                              Pre-Order Progress
                            </>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.drop.currentOrders} of {campaign.drop.minOrders} orders
                        </p>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${progressClamped}%`,
                          backgroundColor: progressClamped >= 100 ? "#10b981" : campaign.creator.brandColor || "#6366f1",
                        }}
                      />
                    </div>
                    {progressClamped >= 100 && (
                      <p className="text-sm text-green-600 font-medium">
                        This product has reached its goal and will be produced!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground whitespace-pre-line">
                {campaign.copyData?.description || campaign.product.description}
              </p>
            </div>

            {/* Features/Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Pre-Order</p>
                  <p className="text-xs text-muted-foreground">
                    Your payment is held until production is confirmed
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Limited Availability</p>
                  <p className="text-xs text-muted-foreground">
                    Pre-order now to secure your spot
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full text-lg h-14"
              style={{ backgroundColor: campaign.creator.brandColor || "#6366f1" }}
              onClick={handlePreOrder}
            >
              {campaign.copyData?.ctaText || "Secure My Pre-Order"}
            </Button>

            {/* Pre-Order Disclaimer */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Pre-Order Notice:</strong> This is a pre-order campaign. Your card will be charged now,
                  but production will only begin once the minimum order goal is reached. Expected fulfillment: 2-4
                  weeks after goal is met. You can request a refund before production begins.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="https://pagefairy.com" className="text-primary hover:underline font-medium">
              PageFairy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
