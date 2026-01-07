import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function WelcomeStep({ onNext }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-full fairy-gradient mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Welcome to PageFairy!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg text-muted-foreground">
            Let's get your first product ready to share. This will only take a few minutes.
          </p>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg">What you'll create:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Your unique product link</p>
                  <p className="text-sm text-muted-foreground">
                    Add to your bio, stories, or anywhere you share content
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Beautiful product page</p>
                  <p className="text-sm text-muted-foreground">
                    Show off your lashes with photos and descriptions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Pre-order system</p>
                  <p className="text-sm text-muted-foreground">
                    Collect orders with zero upfront inventory
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-primary/50 bg-primary/5 rounded-r-lg p-4">
            <p className="text-sm">
              <span className="font-semibold">Remember:</span> You don't need inventory, we handle
              everything after you get orders. Your job is to create content and share your link!
            </p>
          </div>

          <Button
            onClick={() => onNext()}
            variant="gradient"
            size="lg"
            className="w-full text-lg h-12"
          >
            Let's Get Started
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
