"use client";

import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Sparkles, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";

export default function BillingPage() {
  const { data: session, update } = useSession();
  const isPro = session?.user?.planType === "PRO";
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");

    if (paymentStatus === "success") {
      toast.success("Upgrade Successful! Welcome to Pro.");
      update();
      router.replace("/dashboard/billing");
    } else if (paymentStatus === "failed") {
      toast.error("Payment failed. Please try again.");
      router.replace("/dashboard/billing");
    }
  }, [searchParams, update, router]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/subscribe", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to start subscription");
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Billing & Subscription"
      subtitle="Manage your plan and payment details"
    >
      <div className="max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className={`border-2 ${!isPro ? "border-blue-100 bg-blue-50/50" : "border-gray-100"}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Basic Plan</CardTitle>
                  <CardDescription>
                    For individuals just starting out
                  </CardDescription>
                </div>
                {!isPro && <Badge className="bg-gray-600">Current Plan</Badge>}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-gray-500">/forever</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Unlimited
                  Invoices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> 1 Bank
                  Account
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> Basic
                  Templates
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="h-4 w-4" /> No Payment Tracking
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="h-4 w-4" /> Watermarked PDFs
                </li>
              </ul>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>

          <Card
            className={`border-2 relative overflow-hidden ${isPro ? "border-[#1451cb] bg-blue-50/30" : "border-[#1451cb]"}`}
          >
            {!isPro && (
              <div className="absolute top-0 right-0 bg-[#1451cb] text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                RECOMMENDED
              </div>
            )}

            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Pro Plan
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>For growing businesses</CardDescription>
                </div>
                {isPro && <Badge className="bg-[#1451cb]">Current Plan</Badge>}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold">₦5,000</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" />{" "}
                  <strong>Everything in Basic</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" /> Send
                  Invoices via Email
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" /> Remove
                  Watermark
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" /> Unlimited
                  Bank Accounts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" /> Wallet &
                  Payment Tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1451cb]" /> Premium
                  Templates
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {isPro ? (
                <Button variant="outline" className="w-full" disabled>
                  Plan Active
                </Button>
              ) : (
                <Button
                  className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 text-white shadow-lg shadow-blue-500/20"
                  onClick={handleUpgrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2 fill-current" />
                  )}
                  Upgrade Now
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
