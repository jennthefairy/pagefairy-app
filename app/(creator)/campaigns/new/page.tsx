"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CampaignWizard, { CampaignWizardData } from "@/components/campaigns/CampaignWizard";
import TemplateSelectionStep from "@/components/campaigns/steps/TemplateSelectionStep";
import ProductDetailsStep from "@/components/campaigns/steps/ProductDetailsStep";
import AICopyStep from "@/components/campaigns/steps/AICopyStep";
import ReviewStep from "@/components/campaigns/steps/ReviewStep";

const steps = [
  { title: "Template & Goals", description: "Choose a template and set your campaign goals" },
  { title: "Product Details", description: "Add photos, pricing, and product information" },
  { title: "Campaign Copy", description: "Create compelling copy with AI assistance" },
  { title: "Review & Publish", description: "Review everything and launch your campaign" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleComplete = async (data: CampaignWizardData) => {
    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: data.campaignName,
          templateId: data.templateId,
          goalQty: data.goalQty,
          productDetails: data.productDetails,
          copyData: data.copyData,
          status: "draft",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/campaigns/${result.campaignId}`);
      } else {
        console.error("Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <CampaignWizard steps={steps} onComplete={handleComplete}>
      {({ data, currentStep, handleNext, handleBack, isFirstStep, isLastStep }) => {
        switch (currentStep) {
          case 0:
            return (
              <TemplateSelectionStep
                data={data}
                onNext={handleNext}
                onBack={handleBack}
                isFirstStep={isFirstStep}
              />
            );
          case 1:
            return (
              <ProductDetailsStep data={data} onNext={handleNext} onBack={handleBack} />
            );
          case 2:
            return <AICopyStep data={data} onNext={handleNext} onBack={handleBack} />;
          case 3:
            return <ReviewStep data={data} onNext={handleNext} onBack={handleBack} />;
          default:
            return null;
        }
      }}
    </CampaignWizard>
  );
}
