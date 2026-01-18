"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CampaignWizardData } from "../CampaignWizard";
import { Sparkles, Loader2, Package, Laptop, ShoppingBag, Briefcase, Calendar } from "lucide-react";

type AICopyStepProps = {
  data: CampaignWizardData;
  onNext: (data: Partial<CampaignWizardData>) => void;
  onBack: () => void;
};

const productTypes = [
  { id: "physical", label: "Physical Product", icon: Package },
  { id: "digital", label: "Digital Product", icon: Laptop },
  { id: "saas", label: "SaaS", icon: Briefcase },
  { id: "service", label: "Service", icon: Briefcase },
  { id: "event", label: "Event", icon: Calendar },
];

export default function AICopyStep({ data, onNext, onBack }: AICopyStepProps) {
  const [businessDescription, setBusinessDescription] = useState("");
  const [productType, setProductType] = useState("physical");
  const [headline, setHeadline] = useState(data.copyData.headline);
  const [description, setDescription] = useState(data.copyData.description);
  const [ctaText, setCtaText] = useState(data.copyData.ctaText || "Secure My Pre-Order");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!businessDescription) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "product_launch",
          query: businessDescription,
          productType,
          productName: data.campaignName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setHeadline(result.headline || "");
        setDescription(result.description || "");
        setCtaText(result.ctaText || "Secure My Pre-Order");
      } else {
        console.error("Failed to generate copy");
      }
    } catch (error) {
      console.error("Error generating copy:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (!headline || !description || !ctaText) {
      return;
    }

    onNext({
      copyData: {
        headline,
        description,
        ctaText,
      },
    });
  };

  const isValid = headline && description && ctaText;

  return (
    <div className="space-y-6">
      {/* AI Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Copy Generator
          </CardTitle>
          <CardDescription>
            Let AI create compelling copy for your campaign, or write your own
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Product Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {productTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setProductType(type.id)}
                    className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                      productType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <label htmlFor="businessDescription" className="text-sm font-medium">
              Describe Your Product
            </label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your product, its unique features, target audience, and what problem it solves..."
              rows={4}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!businessDescription || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Copy with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated/Manual Copy */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Copy</CardTitle>
          <CardDescription>
            Review and edit the generated copy or write your own
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Headline */}
          <div className="space-y-2">
            <label htmlFor="headline" className="text-sm font-medium">
              Headline
            </label>
            <Input
              id="headline"
              placeholder="e.g., Pre-Order the Future of Beauty"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="aiDescription" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="aiDescription"
              placeholder="Your campaign description..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <label htmlFor="ctaText" className="text-sm font-medium">
              Call-to-Action Button Text
            </label>
            <Input
              id="ctaText"
              placeholder="e.g., Secure My Pre-Order"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
}
