"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Info, Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function PricingStep({ data, onNext, onBack }: Props) {
  const [price, setPrice] = useState(data.price);
  const [description, setDescription] = useState(data.description);
  const [generatingDescription, setGeneratingDescription] = useState(false);

  const baseCost = 15; // Example base cost
  const parsePrice = parseFloat(price) || 0;
  const yourEarnings = Math.max(0, parsePrice - baseCost);
  const profitMargin = parsePrice > 0 ? ((yourEarnings / parsePrice) * 100).toFixed(0) : 0;

  const handleGenerateDescription = async () => {
    if (!data.productName || !data.lashType || !price) {
      alert("Please complete product setup and pricing first");
      return;
    }

    setGeneratingDescription(true);
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: data.productName,
          lashType: data.lashType,
          price,
          tone: "casual",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDescription(result.description);
      } else {
        alert(result.error || "Failed to generate description");
      }
    } catch (error) {
      alert("Failed to generate description. Please try again.");
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleNext = () => {
    if (!price || parseFloat(price) < baseCost) {
      alert(`Price must be at least $${baseCost} to cover costs`);
      return;
    }
    onNext({ price, description });
  };

  const suggestedPrices = [
    { price: 25, label: "Starter", earnings: 10, popular: false },
    { price: 35, label: "Sweet Spot", earnings: 20, popular: true },
    { price: 45, label: "Premium", earnings: 30, popular: false },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set your price</CardTitle>
        <CardDescription>Choose what works for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Suggested Prices */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Popular pricing options</label>
          <div className="grid grid-cols-3 gap-3">
            {suggestedPrices.map((option) => (
              <button
                key={option.price}
                type="button"
                onClick={() => setPrice(option.price.toString())}
                className={`relative p-4 rounded-lg border-2 text-center transition-all ${
                  parseFloat(price) === option.price
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-white rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <p className="text-2xl font-bold mb-1">${option.price}</p>
                <p className="text-xs text-muted-foreground mb-2">{option.label}</p>
                <p className="text-xs font-semibold text-success">
                  ${option.earnings} earnings
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Price */}
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium">
            Or set your own price <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              min={baseCost}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Minimum ${baseCost} (covers production & shipping)
          </p>
        </div>

        {/* Earnings Breakdown */}
        {parsePrice >= baseCost && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Your earnings per sale</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Your price:</span>
                <span className="font-medium">${parsePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Production & shipping:</span>
                <span className="font-medium">-${baseCost.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">You earn:</span>
                <span className="text-lg font-bold text-success">
                  ${yourEarnings.toFixed(2)}
                </span>
              </div>
              <div className="text-center pt-2">
                <span className="text-xs text-muted-foreground">
                  {profitMargin}% profit margin
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="border-l-4 border-primary/50 bg-primary/5 rounded-r-lg p-3">
          <p className="text-sm">
            <span className="font-semibold">Pro tip:</span> Most creators price between $30-$40.
            Higher prices work great if you have a strong following!
          </p>
        </div>

        {/* AI Description Generator */}
        {parsePrice >= baseCost && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Product Description <span className="text-muted-foreground">(Optional)</span>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={generatingDescription}
              >
                {generatingDescription ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            <Textarea
              placeholder="Add a description of your lashes, or let AI write it for you..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              A compelling description helps customers understand why they'll love your lashes
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="gradient"
            onClick={handleNext}
            className="flex-1"
            disabled={!price || parseFloat(price) < baseCost}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
