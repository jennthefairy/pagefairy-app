"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Globe, Palette, Link2 } from "lucide-react";

type FinalReviewStepProps = {
  data: any;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function FinalReviewStep({
  data,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: FinalReviewStepProps) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    setIsLaunching(true);
    onNext();
  };

  const getSocialLinksCount = () => {
    let count = 0;
    if (data.instagram) count++;
    if (data.twitter) count++;
    if (data.tiktok) count++;
    if (data.youtube) count++;
    if (data.linkedin) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Final Review</CardTitle>
          <CardDescription>
            Review your setup before launching your PageFairy website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Product Information
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Product Name:</dt>
                <dd className="font-medium">{data.productName || "Not set"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Type:</dt>
                <dd className="font-medium capitalize">{data.lashType || "Not set"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Price:</dt>
                <dd className="font-medium">${data.price || "0.00"}</dd>
              </div>
              {data.imageUrl && (
                <div className="pt-2">
                  <img
                    src={data.imageUrl}
                    alt="Product"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
              )}
            </dl>
          </div>

          <hr />

          {/* Brand Assets */}
          {(data.logo || data.brandColor || data.typography || data.theme) && (
            <>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  Brand Assets
                </h3>
                <dl className="space-y-2 text-sm">
                  {data.logo && (
                    <div>
                      <dt className="text-muted-foreground mb-1">Logo:</dt>
                      <dd>
                        <img src={data.logo} alt="Logo" className="w-16 h-16 object-contain" />
                      </dd>
                    </div>
                  )}
                  {data.brandColor && (
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Brand Color:</dt>
                      <dd className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: data.brandColor }}
                        />
                        <span className="font-mono text-xs">{data.brandColor}</span>
                      </dd>
                    </div>
                  )}
                  {data.typography && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Typography:</dt>
                      <dd className="font-medium">{data.typography}</dd>
                    </div>
                  )}
                  {data.theme && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Color Theme:</dt>
                      <dd className="font-medium capitalize">{data.theme}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <hr />
            </>
          )}

          {/* Social Links */}
          {getSocialLinksCount() > 0 && (
            <>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  Social Links
                </h3>
                <dl className="space-y-2 text-sm">
                  {data.instagram && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Instagram:</dt>
                      <dd className="font-medium">@{data.instagram}</dd>
                    </div>
                  )}
                  {data.twitter && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Twitter:</dt>
                      <dd className="font-medium">@{data.twitter}</dd>
                    </div>
                  )}
                  {data.tiktok && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">TikTok:</dt>
                      <dd className="font-medium">@{data.tiktok}</dd>
                    </div>
                  )}
                  {data.youtube && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">YouTube:</dt>
                      <dd className="font-medium">{data.youtube}</dd>
                    </div>
                  )}
                  {data.linkedin && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">LinkedIn:</dt>
                      <dd className="font-medium">{data.linkedin}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <hr />
            </>
          )}

          {/* Domain */}
          {(data.slug || data.customDomain) && (
            <>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Domain
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type:</dt>
                    <dd className="font-medium capitalize">
                      {data.domainType === "subdomain" ? "Free Subdomain" : "Custom Domain"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">URL:</dt>
                    <dd className="font-medium">
                      {data.domainType === "subdomain"
                        ? `pagefairy.com/${data.slug}`
                        : data.customDomain}
                    </dd>
                  </div>
                </dl>
              </div>
              <hr />
            </>
          )}

          {/* Target Countries */}
          {data.targetCountries && data.targetCountries.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Target Markets</h3>
              <div className="flex flex-wrap gap-2">
                {data.targetCountries.slice(0, 10).map((country: string) => (
                  <span
                    key={country}
                    className="px-2 py-1 bg-muted text-sm rounded"
                  >
                    {country}
                  </span>
                ))}
                {data.targetCountries.length > 10 && (
                  <span className="px-2 py-1 bg-muted text-sm rounded">
                    +{data.targetCountries.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Ready to Launch!</h3>
          <p className="text-muted-foreground mb-6">
            Your PageFairy website is configured and ready to go live. You can always update these
            settings later from your dashboard.
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isLaunching}>
          Back
        </Button>
        <Button onClick={handleLaunch} disabled={isLaunching} size="lg">
          {isLaunching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Launch My Website
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
