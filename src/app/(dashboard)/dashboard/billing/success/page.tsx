/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function BillingSuccessPage() {
  const { update } = useSession();

  useEffect(() => {
    update();

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [update]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#1451cb] to-[#0ea5e9]" />

        <CardContent className="pt-12 pb-10 px-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upgrade Successful!
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Welcome to{" "}
            <span className="font-bold text-[#1451cb]">Invoiss Pro</span>.
          </p>

          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left space-y-3 border border-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-2 uppercase tracking-wider">
              You&apos;ve unlocked:
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Unlimited Invoices & Templates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Email Sending & Tracking</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Wallet & Payment History</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 text-white h-12 text-base shadow-lg shadow-blue-500/20"
            >
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-900"
            >
              <Link href="/dashboard/settings">View Billing Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
