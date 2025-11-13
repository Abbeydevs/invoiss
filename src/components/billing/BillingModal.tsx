"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Zap,
  Crown,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";

interface BillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillingModal({ open, onOpenChange }: BillingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const price = isYearly ? "55,000" : "5,000";
  const interval = isYearly ? "/year" : "/month";
  const savings = isYearly ? "Save ₦5,000" : null;

  const handleUpgrade = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>

        {/* Header with Gradient */}
        <div className="relative overflow-hidden rounded-t-3xl bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 pb-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-2">
              <Crown className="h-8 w-8 text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              Upgrade to Pro
              <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            </h2>
            <p className="text-blue-100 text-sm font-medium">
              Unlock unlimited potential. Cancel anytime.
            </p>
          </div>
        </div>

        <div className="p-8 -mt-6">
          {/* Pricing Toggle */}
          <div className="relative bg-gray-100 rounded-2xl p-1.5 flex items-center justify-between mb-6 shadow-inner">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-md transition-all duration-300 ${
                isYearly ? "translate-x-[calc(100%+12px)]" : "translate-x-0"
              }`}
            />

            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                !isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                isYearly ? "text-gray-900" : "text-gray-500"
              }`}
            >
              <span>Yearly</span>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white">
                -10%
              </span>
            </button>
          </div>

          {/* Pricing Card */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 mb-6">
            {/* Savings Badge */}
            {savings && (
              <div className="absolute top-0 right-0">
                <div className="relative">
                  <div className="bg-linear-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {savings}
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="text-center mb-6 pt-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-semibold text-gray-700">₦</span>
                <span className="text-5xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {price}
                </span>
                <span className="text-lg text-gray-600 font-medium">
                  {interval}
                </span>
              </div>
              {isYearly && (
                <p className="text-xs text-gray-600 mt-2">
                  That&apos;s only ₦4,583/month billed annually
                </p>
              )}
            </div>

            {/* Features List */}
            <ul className="space-y-3">
              {[
                { text: "Everything in Basic", highlight: true },
                { text: "Unlimited Invoices & Banks", highlight: false },
                { text: "Remove Watermark", highlight: false },
                { text: "Send via Email", highlight: false },
                { text: "Wallet & Payment Tracking", highlight: false },
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <span
                    className={`text-sm ${feature.highlight ? "font-bold text-gray-900" : "text-gray-700"}`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full relative overflow-hidden group bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 fill-current" />
                  <span>Proceed to Payment</span>
                </>
              )}
            </span>
          </button>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
