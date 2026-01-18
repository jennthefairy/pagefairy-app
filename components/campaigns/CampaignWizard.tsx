"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export type CampaignWizardData = {
  campaignName: string;
  templateId: string;
  productId: string;
  goalQty: number;
  productDetails: {
    photos: string[];
    price: string;
    wholesale: string;
    description: string;
  };
  copyData: {
    headline: string;
    description: string;
    ctaText: string;
  };
};

type CampaignWizardProps = {
  children: (props: {
    data: CampaignWizardData;
    currentStep: number;
    handleNext: (stepData?: Partial<CampaignWizardData>) => void;
    handleBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
  }) => React.ReactNode;
  steps: { title: string; description?: string }[];
  onComplete: (data: CampaignWizardData) => Promise<void>;
};

export default function CampaignWizard({ children, steps, onComplete }: CampaignWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<CampaignWizardData>({
    campaignName: "",
    templateId: "",
    productId: "",
    goalQty: 10,
    productDetails: {
      photos: [],
      price: "",
      wholesale: "",
      description: "",
    },
    copyData: {
      headline: "",
      description: "",
      ctaText: "",
    },
  });

  const handleNext = async (stepData?: Partial<CampaignWizardData>) => {
    if (stepData) {
      setData((prev) => ({ ...prev, ...stepData }));
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - submit
      setIsSubmitting(true);
      try {
        await onComplete({ ...data, ...stepData });
      } catch (error) {
        console.error("Failed to create campaign:", error);
      } finally {
        setIsSubmitting(false);
      }
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

      {/* Step Indicator */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 rounded transition-colors ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        {children({
          data,
          currentStep,
          handleNext,
          handleBack,
          isFirstStep: currentStep === 0,
          isLastStep: currentStep === steps.length - 1,
        })}
      </div>
    </div>
  );
}
