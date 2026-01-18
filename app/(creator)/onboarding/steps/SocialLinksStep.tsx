"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Instagram, Twitter, Music, Youtube, Linkedin } from "lucide-react";

type SocialLinksStepProps = {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
};

export default function SocialLinksStep({
  data,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
}: SocialLinksStepProps) {
  const [instagram, setInstagram] = useState(data.instagram || "");
  const [twitter, setTwitter] = useState(data.twitter || "");
  const [tiktok, setTiktok] = useState(data.tiktok || "");
  const [youtube, setYoutube] = useState(data.youtube || "");
  const [linkedin, setLinkedin] = useState(data.linkedin || "");

  const handleNext = () => {
    onNext({
      instagram,
      twitter,
      tiktok,
      youtube,
      linkedin,
    });
  };

  // Helper function to clean social handles
  const cleanHandle = (value: string, prefix: string = "@") => {
    // Remove common prefixes and URLs
    let cleaned = value.trim();
    cleaned = cleaned.replace(/^https?:\/\/(www\.)?/i, "");
    cleaned = cleaned.replace(/^(instagram\.com|twitter\.com|x\.com|tiktok\.com|youtube\.com|linkedin\.com)\//i, "");
    cleaned = cleaned.replace(/^@/, "");
    return cleaned;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Connect your social media accounts to build credibility and grow your audience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instagram */}
        <div className="space-y-2">
          <label htmlFor="instagram" className="text-sm font-medium flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">@</span>
            <Input
              id="instagram"
              placeholder="username"
              value={instagram}
              onChange={(e) => setInstagram(cleanHandle(e.target.value))}
            />
          </div>
        </div>

        {/* Twitter/X */}
        <div className="space-y-2">
          <label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Twitter / X
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">@</span>
            <Input
              id="twitter"
              placeholder="username"
              value={twitter}
              onChange={(e) => setTwitter(cleanHandle(e.target.value))}
            />
          </div>
        </div>

        {/* TikTok */}
        <div className="space-y-2">
          <label htmlFor="tiktok" className="text-sm font-medium flex items-center gap-2">
            <Music className="h-4 w-4" />
            TikTok
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">@</span>
            <Input
              id="tiktok"
              placeholder="username"
              value={tiktok}
              onChange={(e) => setTiktok(cleanHandle(e.target.value))}
            />
          </div>
        </div>

        {/* YouTube */}
        <div className="space-y-2">
          <label htmlFor="youtube" className="text-sm font-medium flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </label>
          <Input
            id="youtube"
            placeholder="channel name or URL"
            value={youtube}
            onChange={(e) => setYoutube(cleanHandle(e.target.value))}
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </label>
          <Input
            id="linkedin"
            placeholder="profile URL or username"
            value={linkedin}
            onChange={(e) => setLinkedin(cleanHandle(e.target.value))}
          />
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p>
              All fields are optional. Adding social links helps build trust with potential customers
              and makes it easy for them to follow you on their favorite platforms.
            </p>
          </CardContent>
        </Card>

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
