"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CampaignWizardData } from "../CampaignWizard";
import { Upload, X, Image as ImageIcon } from "lucide-react";

type ProductDetailsStepProps = {
  data: CampaignWizardData;
  onNext: (data: Partial<CampaignWizardData>) => void;
  onBack: () => void;
};

// Utility function to convert price string to cents
const centsFromPriceString = (priceStr: string): number => {
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
};

// Utility function to format cents as price string
const formatPrice = (cents: number): string => {
  return (cents / 100).toFixed(2);
};

export default function ProductDetailsStep({ data, onNext, onBack }: ProductDetailsStepProps) {
  const [photos, setPhotos] = useState<string[]>(data.productDetails.photos);
  const [price, setPrice] = useState(data.productDetails.price);
  const [wholesale, setWholesale] = useState(data.productDetails.wholesale);
  const [description, setDescription] = useState(data.productDetails.description);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const priceCents = centsFromPriceString(price);
  const wholesaleCents = centsFromPriceString(wholesale);
  const profit = priceCents - wholesaleCents;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to data URLs for preview
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!photos.length || !price || !wholesale || !description) {
      return;
    }

    onNext({
      productDetails: {
        photos,
        price,
        wholesale,
        description,
      },
    });
  };

  const isValid = photos.length > 0 && price && wholesale && description && profit >= 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Add photos, pricing, and description for your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Product Photos</label>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={photo}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Add Photo</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-muted-foreground">
              Upload at least one product photo. Recommended: 1200x1200px
            </p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Retail Price
              </label>
              <Input
                id="price"
                type="text"
                placeholder="$29.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="wholesale" className="text-sm font-medium">
                Wholesale/Cost Price
              </label>
              <Input
                id="wholesale"
                type="text"
                placeholder="$15.00"
                value={wholesale}
                onChange={(e) => setWholesale(e.target.value)}
              />
            </div>
          </div>

          {/* Profit Display */}
          {price && wholesale && (
            <Card className={profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estimated Profit per Unit:</span>
                  <span className={`text-lg font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${formatPrice(profit)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Product Description
            </label>
            <Textarea
              id="description"
              placeholder="Describe your product features, benefits, and what makes it special..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be shown to potential customers on your pre-order page
            </p>
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
