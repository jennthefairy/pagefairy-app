"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Users, Calendar, ShoppingBag, ArrowRight, X, Check } from "lucide-react";

export default function HomePage() {
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);

    try {
      const response = await fetch("https://pf-catalogue.pcnbiz.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setOverlayOpen(false);
        setSuccess(false);
        setEmail("");
      }, 1500);
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen overflow-x-hidden">
      {/* Hero */}
      <div className="px-6 pt-10 max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <h1 className="logo-font text-gray-800 text-5xl tracking-wide text-center mb-6">Pagefairy</h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FEF5E7] border border-gold/30 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-gold stroke-[2]" />
            <span className="text-sm font-medium text-gray-800">Limited seats available</span>
          </div>
        </div>

        <h2 className="title-font text-[44px] leading-tight font-bold text-center mb-5 text-gray-900">
          Your <span className="text-redAccent">Beauty Skills</span>
          <br />
          Can Build <span className="text-redAccent">More</span> Than Just Appointments
        </h2>

        <p className="text-center text-gray-800 text-[17px] leading-relaxed mb-10 px-2">
          Most beauty creators trade time for money and that model has limits. We help creators turn skills into brands
          using AI to test demand before launch.
        </p>
      </div>

      {/* Features */}
      <div className="w-full max-w-3xl mx-auto mb-10 px-6">
        <div className="flex items-center justify-center gap-10 flex-wrap">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] text-gray-900 font-medium">Build an audience</span>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] text-gray-900 font-medium">Improve online presence</span>
          </div>

          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gray-800 stroke-[2]" />
            <span className="text-[16px] text-gray-900 font-medium">Sell beyond services</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-10 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setOverlayOpen(true)}
          className="w-full bg-orange-900 text-white rounded-xl py-5 mb-4 hover:bg-amber-900 transition-colors shadow-lg"
          disabled={overlayOpen}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[19px] font-semibold">Join the Private Waitlist</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-[13px] text-white/70 font-normal">No credit card required</div>
        </button>

        <p className="text-center text-gray-700 text-[12px] px-4">PageFairy© 2026 | All Rights Reserved</p>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-yellow-700 z-[100] px-6 flex flex-col transform transition-transform duration-500 ease-in-out ${
          overlayOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-end pt-8">
          <button
            type="button"
            onClick={() => {
              setOverlayOpen(false);
              setSubmitting(false);
              setSuccess(false);
            }}
            className="p-2 bg-cream/10 rounded-full"
          >
            <X className="text-cream w-8 h-8" />
          </button>
        </div>

        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-8">
            <h3 className="logo-font text-cream text-4xl mb-4 text-center">Pagefairy</h3>
            <h2 className="text-cream text-3xl font-bold text-center leading-tight">
              Secure your spot in the beauty revolution
            </h2>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cream/70 text-sm font-medium mb-2 ml-1" htmlFor="waitlist-email">
                  Your Email Address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-2 border-cream/20 rounded-2xl px-6 py-5 text-cream text-xl placeholder:text-cream/30 focus:outline-none focus:border-gold transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-darkGreen font-bold text-xl py-5 rounded-2xl shadow-2xl hover:bg-white transition-all active:scale-95 disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm My Access"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="bg-gold p-4 rounded-full mb-4">
                <Check className="text-darkGreen w-12 h-12 stroke-[3]" />
              </div>
              <p className="text-cream font-bold text-2xl">Access Granted</p>
            </div>
          )}

          <p className="text-cream/30 text-center text-sm mt-8">
            By joining you agree to receive early access updates and brand building tips.
          </p>
        </div>
      </div>
    </div>
  );
}
