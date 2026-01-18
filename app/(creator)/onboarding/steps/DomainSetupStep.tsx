"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2, Globe, Sparkles } from "lucide-react";

type DomainSetupStepProps = {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function DomainSetupStep({
  data,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: DomainSetupStepProps) {
  const [domainType, setDomainType] = useState<"subdomain" | "custom">(
    data.domainType || "subdomain"
  );
  const [slug, setSlug] = useState(data.slug || "");
  const [customDomain, setCustomDomain] = useState(data.customDomain || "");
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<"available" | "taken" | "invalid" | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Validate and format slug
  const formatSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Debounced availability check
  useEffect(() => {
    if (domainType === "subdomain" && slug.length >= 3) {
      setIsChecking(true);
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`/api/domains/check?slug=${slug}`);
          const data = await response.json();

          if (data.available) {
            setAvailability("available");
            setSuggestions([]);
          } else {
            setAvailability("taken");
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error("Error checking availability:", error);
          setAvailability("invalid");
        } finally {
          setIsChecking(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAvailability(null);
      setSuggestions([]);
    }
  }, [slug, domainType]);

  const handleSlugChange = (value: string) => {
    const formatted = formatSlug(value);
    setSlug(formatted);
    setAvailability(null);
  };

  const handleNext = () => {
    if (domainType === "subdomain" && (!slug || availability !== "available")) {
      return;
    }

    onNext({
      domainType,
      slug: domainType === "subdomain" ? slug : null,
      customDomain: domainType === "custom" ? customDomain : null,
    });
  };

  const isValid =
    (domainType === "subdomain" && slug && availability === "available") ||
    (domainType === "custom" && customDomain);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Your Domain</CardTitle>
        <CardDescription>
          Choose how customers will access your pre-order page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Domain Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Subdomain */}
            <button
              onClick={() => setDomainType("subdomain")}
              className={`p-4 border rounded-lg text-left transition-all ${
                domainType === "subdomain"
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Free Subdomain</h3>
                  <p className="text-sm text-muted-foreground">
                    Get started instantly with pagefairy.com/yourbrand
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Recommended
                  </span>
                </div>
              </div>
            </button>

            {/* Custom Domain */}
            <button
              onClick={() => setDomainType("custom")}
              className={`p-4 border rounded-lg text-left transition-all ${
                domainType === "custom"
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Custom Domain</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your own domain like yourbrand.com
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                    Pro Feature
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Subdomain Configuration */}
        {domainType === "subdomain" && (
          <div className="space-y-3">
            <label htmlFor="slug" className="text-sm font-medium">
              Your Brand Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                pagefairy.com/
              </span>
              <div className="relative flex-1">
                <Input
                  id="slug"
                  placeholder="yourbrand"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className={
                    availability === "available"
                      ? "border-green-500"
                      : availability === "taken" || availability === "invalid"
                      ? "border-red-500"
                      : ""
                  }
                />
                {isChecking && (
                  <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {!isChecking && availability === "available" && (
                  <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                )}
                {!isChecking &&
                  (availability === "taken" || availability === "invalid") && (
                    <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
              </div>
            </div>

            {/* Availability Message */}
            {availability === "available" && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Perfect! This slug is available
              </p>
            )}
            {availability === "taken" && (
              <div className="space-y-2">
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="h-4 w-4" />
                  This slug is already taken
                </p>
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Try these instead:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSlugChange(suggestion)}
                          className="px-3 py-1 text-sm bg-muted hover:bg-primary/10 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Use lowercase letters, numbers, and hyphens only (minimum 3 characters)
            </p>
          </div>
        )}

        {/* Custom Domain Configuration */}
        {domainType === "custom" && (
          <div className="space-y-3">
            <label htmlFor="customDomain" className="text-sm font-medium">
              Your Domain
            </label>
            <Input
              id="customDomain"
              placeholder="yourbrand.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="text-sm text-blue-900">
                  You'll need to configure DNS settings after setup. We'll provide detailed
                  instructions in your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isValid}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
