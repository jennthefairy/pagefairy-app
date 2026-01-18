"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Loader2, XCircle, Sparkles } from "lucide-react";

type DeploymentStep = {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "failed";
};

type DeploymentProgressProps = {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
};

export default function DeploymentProgress({
  isOpen,
  onClose,
  campaignId,
}: DeploymentProgressProps) {
  const [steps, setSteps] = useState<DeploymentStep[]>([
    { id: "prepare", label: "Preparing your website", status: "pending" },
    { id: "build", label: "Building optimized assets", status: "pending" },
    { id: "deploy", label: "Deploying to servers", status: "pending" },
    { id: "ssl", label: "Configuring SSL & CDN", status: "pending" },
    { id: "finalize", label: "Finalizing deployment", status: "pending" },
  ]);
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(120); // seconds
  const [isComplete, setIsComplete] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate deployment progress
    let currentStepIndex = 0;
    const stepDuration = 2000; // 2 seconds per step

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        setSteps((prev) =>
          prev.map((step, index) => {
            if (index < currentStepIndex) {
              return { ...step, status: "completed" };
            } else if (index === currentStepIndex) {
              return { ...step, status: "in_progress" };
            }
            return step;
          })
        );

        const newProgress = ((currentStepIndex + 1) / steps.length) * 100;
        setProgress(newProgress);
        setEstimatedTime(Math.max(0, (steps.length - currentStepIndex - 1) * 2));

        currentStepIndex++;
      } else {
        // All steps completed
        setSteps((prev) =>
          prev.map((step) => ({ ...step, status: "completed" }))
        );
        setProgress(100);
        setIsComplete(true);
        clearInterval(interval);

        // Auto-close after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deploying Your Campaign</span>
            {isComplete && (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
            {hasFailed && <XCircle className="h-6 w-6 text-red-600" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{Math.round(progress)}% Complete</span>
              {!isComplete && !hasFailed && (
                <span className="text-muted-foreground">
                  ~{estimatedTime}s remaining
                </span>
              )}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isComplete
                    ? "bg-green-500"
                    : hasFailed
                    ? "bg-red-500"
                    : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {step.status === "completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : step.status === "in_progress" ? (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  ) : step.status === "failed" ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      step.status === "pending"
                        ? "text-muted-foreground"
                        : step.status === "failed"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.status === "in_progress" && (
                    <p className="text-xs text-muted-foreground">
                      In progress...
                    </p>
                  )}
                  {step.status === "completed" && (
                    <p className="text-xs text-green-600">Completed</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Success Message */}
          {isComplete && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">
                    Deployment Complete!
                  </p>
                  <p className="text-sm text-green-700">
                    Your campaign is now live and ready to accept orders
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failure Message */}
          {hasFailed && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="font-medium text-red-900 mb-1">
                  Deployment Failed
                </p>
                <p className="text-sm text-red-700">
                  An error occurred during deployment. Please try again or
                  contact support.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
