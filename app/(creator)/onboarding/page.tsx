"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import WelcomeStep from "./steps/WelcomeStep";
import ProductSetupStep from "./steps/ProductSetupStep";
import PricingStep from "./steps/PricingStep";
import PreviewStep from "./steps/PreviewStep";
import ChecklistStep from "./steps/ChecklistStep";
import LaunchStep from "./steps/LaunchStep";

export type OnboardingData = {
  productName: string;
  lashType: string;
  imageUrl: string;
  price: string;
  description: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    productName: "",
    lashType: "",
    imageUrl: "",
    price: "",
    description: "",
  });

  const steps = [
    { title: "Welcome", component: WelcomeStep },
    { title: "Product Setup", component: ProductSetupStep },
    { title: "Pricing", component: PricingStep },
    { title: "Preview", component: PreviewStep },
    { title: "Checklist", component: ChecklistStep },
    { title: "Launch", component: LaunchStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = (stepData?: Partial<OnboardingData>) => {
    if (stepData) {
      setData((prev) => ({ ...prev, ...stepData }));
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold fairy-text-gradient">PageFairy</span>
          </div>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Exit
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">{steps[currentStep].title}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full fairy-gradient transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <CurrentStepComponent
          data={data}
          onNext={handleNext}
          onBack={handleBack}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>
    </div>
  );
}
