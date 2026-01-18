"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

type BrandAssetsStepProps = {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const typography = [
  "Jakarta Sans",
  "Noto Sans",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Raleway",
];

const colorThemes = [
  { id: "purple", name: "Purple", color: "#8b5cf6" },
  { id: "blue", name: "Blue", color: "#3b82f6" },
  { id: "green", name: "Green", color: "#10b981" },
  { id: "orange", name: "Orange", color: "#f97316" },
  { id: "red", name: "Red", color: "#ef4444" },
  { id: "brown", name: "Brown", color: "#92400e" },
];

export default function BrandAssetsStep({
  data,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: BrandAssetsStepProps) {
  const [logo, setLogo] = useState<string | null>(data.logo || null);
  const [brandColor, setBrandColor] = useState(data.brandColor || "#6366f1");
  const [selectedTypography, setSelectedTypography] = useState(
    data.typography || "Jakarta Sans"
  );
  const [selectedTheme, setSelectedTheme] = useState(data.theme || "purple");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate hex color
    if (/^#[0-9A-F]{6}$/i.test(value) || value === "" || value.length <= 7) {
      setBrandColor(value);
    }
  };

  const handleNext = () => {
    onNext({
      logo,
      brandColor,
      typography: selectedTypography,
      theme: selectedTheme,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Assets</CardTitle>
        <CardDescription>
          Customize your brand identity with a logo, colors, and typography
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Logo (Optional)</label>

          {logo ? (
            <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
              <button
                onClick={removeLogo}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Upload className="h-8 w-8" />
              <span className="text-xs">Upload Logo</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <p className="text-xs text-muted-foreground">
            Recommended: Square image, 512x512px, transparent background
          </p>
        </div>

        {/* Brand Color */}
        <div className="space-y-3">
          <label htmlFor="brandColor" className="text-sm font-medium">
            Brand Color
          </label>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <input
                type="color"
                id="brandColorPicker"
                value={brandColor}
                onChange={handleColorChange}
                className="w-12 h-12 rounded-lg cursor-pointer border"
              />
            </div>
            <Input
              id="brandColor"
              type="text"
              placeholder="#6366f1"
              value={brandColor}
              onChange={handleColorChange}
              maxLength={7}
              className="font-mono"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This color will be used throughout your page as the primary accent
          </p>
        </div>

        {/* Typography */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Typography</label>
          <select
            value={selectedTypography}
            onChange={(e) => setSelectedTypography(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {typography.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Color Theme */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Color Theme</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {colorThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-all ${
                  selectedTheme === theme.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-xs font-medium">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Preview</label>
          <Card
            className="p-6 text-center"
            style={{
              backgroundColor: `${brandColor}10`,
              borderColor: brandColor,
            }}
          >
            {logo && (
              <img src={logo} alt="Logo preview" className="w-16 h-16 mx-auto mb-4" />
            )}
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: selectedTypography, color: brandColor }}
            >
              Your Brand Name
            </h3>
            <p style={{ fontFamily: selectedTypography }}>
              This is how your brand will appear with your selected styling
            </p>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
            Back
          </Button>
          <Button onClick={handleNext}>Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
}
