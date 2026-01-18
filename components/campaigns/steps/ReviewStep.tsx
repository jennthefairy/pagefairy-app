"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampaignWizardData } from "../CampaignWizard";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

type ReviewStepProps = {
  data: CampaignWizardData;
  onNext: () => void;
  onBack: () => void;
};

export default function ReviewStep({ data, onNext, onBack }: ReviewStepProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    onNext();
  };

  const priceCents = parseFloat(data.productDetails.price.replace(/[^0-9.]/g, "")) * 100;
  const wholesaleCents = parseFloat(data.productDetails.wholesale.replace(/[^0-9.]/g, "")) * 100;
  const profit = ((priceCents - wholesaleCents) / 100).toFixed(2);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Campaign</CardTitle>
          <CardDescription>
            Double-check everything before publishing your pre-order campaign
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Overview */}
          <div>
            <h3 className="font-semibold mb-3">Campaign Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Campaign Name:</dt>
                <dd className="text-sm font-medium">{data.campaignName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Template:</dt>
                <dd className="text-sm font-medium capitalize">{data.templateId}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-muted-foreground">Pre-Order Goal:</dt>
                <dd className="text-sm font-medium">{data.goalQty} units</dd>
              </div>
            </dl>
          </div>

          <hr />

          {/* Product Details */}
          <div>
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="space-y-3">
              {/* Photos */}
              <div className="grid grid-cols-4 gap-2">
                {data.productDetails.photos.slice(0, 4).map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Product ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Pricing */}
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Retail Price:</dt>
                  <dd className="text-sm font-medium">{data.productDetails.price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Wholesale Cost:</dt>
                  <dd className="text-sm font-medium">{data.productDetails.wholesale}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Profit per Unit:</dt>
                  <dd className="text-sm font-medium text-green-600">${profit}</dd>
                </div>
              </dl>

              {/* Description Preview */}
              <div>
                <dt className="text-sm text-muted-foreground mb-1">Description:</dt>
                <dd className="text-sm line-clamp-3">{data.productDetails.description}</dd>
              </div>
            </div>
          </div>

          <hr />

          {/* Campaign Copy */}
          <div>
            <h3 className="font-semibold mb-3">Campaign Copy</h3>
            <div className="space-y-3">
              <div>
                <dt className="text-sm text-muted-foreground mb-1">Headline:</dt>
                <dd className="text-sm font-medium">{data.copyData.headline}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground mb-1">Description:</dt>
                <dd className="text-sm line-clamp-3">{data.copyData.description}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground mb-1">CTA Button:</dt>
                <dd className="text-sm font-medium">{data.copyData.ctaText}</dd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Ready to publish?</p>
            <p className="text-muted-foreground">
              Your campaign will be created as a draft. You can preview and make changes before
              going live.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isPublishing}>
          Back
        </Button>
        <Button onClick={handlePublish} disabled={isPublishing}>
          {isPublishing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publishing...
            </>
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </div>
  );
}
