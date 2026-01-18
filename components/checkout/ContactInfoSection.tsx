"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

type ContactInfoSectionProps = {
  email: string;
  setEmail: (email: string) => void;
  newsletter: boolean;
  setNewsletter: (newsletter: boolean) => void;
};

export default function ContactInfoSection({
  email,
  setEmail,
  newsletter,
  setNewsletter,
}: ContactInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Order confirmation will be sent to this email
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
          />
          <span className="text-sm">
            Email me with news and offers from this creator
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
