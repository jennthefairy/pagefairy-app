"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignWizardData } from "../CampaignWizard";
import {
  Sparkles,
  ShoppingBag,
  Rocket,
  Monitor,
  Package,
  GraduationCap,
  Users,
} from "lucide-react";

type TemplateSelectionStepProps = {
  data: CampaignWizardData;
  onNext: (data: Partial<CampaignWizardData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
};

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design for any product",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "waitlist",
    name: "Waitlist",
    description: "Build anticipation before launch",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "launch",
    name: "Launch",
    description: "Perfect for product launches",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Ideal for software products",
    icon: Monitor,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Optimized for online stores",
    icon: ShoppingBag,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "course",
    name: "Course",
    description: "Best for educational content",
    icon: GraduationCap,
    color: "from-indigo-500 to-purple-500",
  },
];

export default function TemplateSelectionStep({
  data,
  onNext,
  onBack,
  isFirstStep,
}: TemplateSelectionStepProps) {
  const [campaignName, setCampaignName] = useState(data.campaignName);
  const [selectedTemplate, setSelectedTemplate] = useState(data.templateId);
  const [goalQty, setGoalQty] = useState(data.goalQty.toString());

  const handleNext = () => {
    if (!campaignName || !selectedTemplate || !goalQty) {
      return;
    }

    onNext({
      campaignName,
      templateId: selectedTemplate,
      goalQty: parseInt(goalQty, 10),
    });
  };

  const isValid = campaignName && selectedTemplate && goalQty && parseInt(goalQty, 10) > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Campaign</CardTitle>
          <CardDescription>
            Choose a template and set up your pre-order campaign details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <label htmlFor="campaignName" className="text-sm font-medium">
              Campaign Name
            </label>
            <Input
              id="campaignName"
              placeholder="e.g., Summer Collection Launch"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          {/* Pre-Order Goal */}
          <div className="space-y-2">
            <label htmlFor="goalQty" className="text-sm font-medium">
              Pre-Order Goal (units)
            </label>
            <Input
              id="goalQty"
              type="number"
              min="1"
              placeholder="e.g., 75"
              value={goalQty}
              onChange={(e) => setGoalQty(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Minimum number of pre-orders needed to proceed with production
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Template</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;

                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isSelected ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <Sparkles className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isFirstStep}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  );
}
