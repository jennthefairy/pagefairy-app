"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Square } from "lucide-react";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

const checklistItems = [
  {
    id: "content",
    title: "Prepare content",
    description: "Plan posts, stories, or videos announcing your product",
    tips: [
      "Show the lashes on your eyes",
      "Explain why you love them",
      "Share the link in your bio",
    ],
  },
  {
    id: "bio",
    title: "Update your bio",
    description: "Add your PageFairy link to your Instagram/TikTok bio",
    tips: [
      "Use pagefairy.com/@yourname",
      "Keep it short and clear",
      "Mention limited pre-orders",
    ],
  },
  {
    id: "timing",
    title: "Plan your launch",
    description: "Choose when to start sharing (can be right now!)",
    tips: [
      "Launch when your audience is most active",
      "Consider building hype for 24-48 hours first",
      "Set a personal goal for orders",
    ],
  },
  {
    id: "engagement",
    title: "Engage with your audience",
    description: "Reply to comments and questions about your product",
    tips: [
      "Answer DMs quickly",
      "Share customer excitement",
      "Create urgency (limited spots)",
    ],
  },
];

export default function ChecklistStep({ data, onNext, onBack }: Props) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allCompleted = checklistItems.every((item) => completed[item.id]);
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Launch checklist</CardTitle>
        <CardDescription>
          Complete {completedCount} of {checklistItems.length} items
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {Math.round((completedCount / checklistItems.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full fairy-gradient transition-all duration-300"
              style={{ width: `${(completedCount / checklistItems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition-all ${
                completed[item.id] ? "bg-muted/50 border-primary/50" : "bg-background"
              }`}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-start gap-3 text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {completed[item.id] ? (
                    <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <h4
                    className={`font-semibold ${
                      completed[item.id] ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {!completed[item.id] && (
                    <ul className="mt-2 space-y-1">
                      {item.tips.map((tip, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="border-l-4 border-primary/50 bg-primary/5 rounded-r-lg p-3">
          <p className="text-sm">
            <span className="font-semibold">Don't worry!</span> You don't need to complete
            everything now. This checklist will be available in your dashboard.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button variant="gradient" onClick={() => onNext()} className="flex-1">
            {allCompleted ? "Let's Launch! 🚀" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
