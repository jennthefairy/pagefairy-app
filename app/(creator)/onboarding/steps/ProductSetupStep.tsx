"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Check } from "lucide-react";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const lashTypes = [
  {
    id: "natural",
    name: "Natural",
    description: "Subtle, everyday lashes",
    emoji: "🌿",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    description: "Bold, glamorous lashes",
    emoji: "✨",
  },
  {
    id: "wispy",
    name: "Wispy",
    description: "Feathery, textured lashes",
    emoji: "🪶",
  },
  {
    id: "cat-eye",
    name: "Cat Eye",
    description: "Winged, elongated lashes",
    emoji: "😸",
  },
];

export default function ProductSetupStep({ data, onNext, onBack }: Props) {
  const [productName, setProductName] = useState(data.productName);
  const [lashType, setLashType] = useState(data.lashType);
  const [imageUrl, setImageUrl] = useState(data.imageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create temporary preview URL
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handleNext = () => {
    if (!productName || !lashType) {
      alert("Please fill in all required fields");
      return;
    }
    onNext({ productName, lashType, imageUrl });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set up your product</CardTitle>
        <CardDescription>Tell us about your lashes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <label htmlFor="productName" className="text-sm font-medium">
            Product Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="productName"
            placeholder="e.g., Luxury Mink Lashes"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Give your lashes a catchy, memorable name
          </p>
        </div>

        {/* Lash Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Lash Style <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {lashTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setLashType(type.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  lashType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{type.emoji}</span>
                  {lashType === type.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="font-semibold mb-1">{type.name}</p>
                <p className="text-xs text-muted-foreground">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Product Photo <span className="text-muted-foreground">(Optional)</span>
          </label>
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Product preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setImageUrl("");
                  setImageFile(null);
                }}
              >
                Change Photo
              </Button>
            </div>
          ) : (
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Click to upload image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              <input
                id="imageUpload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
          <p className="text-xs text-muted-foreground">
            High-quality photos help sell more. You can add one later if you don't have one ready.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button
            variant="gradient"
            onClick={handleNext}
            className="flex-1"
            disabled={!productName || !lashType}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
