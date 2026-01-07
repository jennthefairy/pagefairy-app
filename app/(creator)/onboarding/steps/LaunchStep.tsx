"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Copy, Check, ExternalLink, Instagram } from "lucide-react";
import { OnboardingData } from "../page";

type Props = {
  data: OnboardingData;
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function LaunchStep({ data, onBack }: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const username = session?.user?.username || "yourname";
  const bioLinkUrl = `pagefairy.com/@${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bioLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      // Save product to database
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.productName,
          lashType: data.lashType,
          price: data.price,
          imageUrl: data.imageUrl,
          description: data.description,
          status: "active",
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save product. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 rounded-full fairy-gradient mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl">You're ready to launch!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-lg text-muted-foreground">
            Your product is set up and ready to share. Here's your link:
          </p>

          {/* Link Display */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-lg p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your PageFairy Link</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-background px-4 py-3 rounded-lg text-sm font-mono font-semibold">
                  {bioLinkUrl}
                </code>
                <Button size="lg" variant="outline" onClick={handleCopy}>
                  {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {copied && (
              <div className="text-center text-sm text-success font-medium animate-in fade-in duration-200">
                ✓ Copied to clipboard!
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-muted/50 rounded-lg p-5 space-y-4">
            <h3 className="font-semibold">Next steps:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Add link to your bio</p>
                  <p className="text-sm text-muted-foreground">
                    Paste it in your Instagram, TikTok, or YouTube bio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Create your announcement</p>
                  <p className="text-sm text-muted-foreground">
                    Post about your lashes and tell followers to check your bio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Watch the orders come in</p>
                  <p className="text-sm text-muted-foreground">
                    Track everything from your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <Instagram className="h-5 w-5" />
              <span className="text-xs">Share on IG Story</span>
            </Button>
            <Button variant="outline" className="h-auto py-3 flex flex-col gap-2">
              <ExternalLink className="h-5 w-5" />
              <span className="text-xs">View Your Page</span>
            </Button>
          </div>

          <div className="border-l-4 border-success/50 bg-success/5 rounded-r-lg p-4">
            <p className="text-sm">
              <span className="font-semibold">🎉 Congratulations!</span> You're now part of the
              PageFairy creator community. We handle fulfillment, you handle the content!
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button
              variant="gradient"
              onClick={handleFinish}
              className="flex-1"
              disabled={saving}
            >
              {saving ? "Saving..." : "Go to Dashboard"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
