import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const basicFeatures = [
  { text: "Unlimited Invoices", included: true },
  { text: "Unlimited Customers", included: true },
  { text: "Watermarked PDF Downloads", included: true },
  { text: "1 Bank Account", included: true },
  { text: "Basic Templates", included: true },
  { text: "Send Invoices via Email", included: false },
  { text: "Premium Templates", included: false },
  { text: "Wallet & Payment Tracking", included: false },
];

const proFeatures = [
  { text: "Everything in Basic, plus:", included: true, highlight: true },
  { text: "Send Invoices via Email", included: true },
  { text: "Remove PDF Watermark", included: true },
  { text: "Wallet & Payment Tracking", included: true },
  { text: "Unlimited Bank Accounts", included: true },
  { text: "Premium Templates", included: true },
  { text: "Priority Support", included: true },
  { text: "Advanced Analytics", included: true },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-linear-to-b from-white via-gray-50 to-white py-20 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-100 to-purple-100 rounded-full mb-6 shadow-sm">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SIMPLE PRICING
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            A plan for{" "}
            <span className="bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
              every stage
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Start for free and upgrade when you&apos;re ready to unlock powerful
            Pro features. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 max-w-5xl mx-auto">
          <Card className="group border-2 border-gray-200 shadow-xl hover:shadow-2xl flex flex-col relative bg-white transition-all hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <CardHeader className="pb-6 pt-8 px-8">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Basic
                </CardTitle>
                <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <CardDescription className="text-base">
                Perfect for getting started
              </CardDescription>
              <div className="pt-6 flex items-end gap-2">
                <span className="text-5xl font-bold text-gray-900">₦0</span>
                <span className="text-gray-500 pb-2 font-medium">/forever</span>
              </div>
              <p className="text-sm text-green-600 font-semibold pt-2 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Free forever, no card needed
              </p>
            </CardHeader>
            <CardContent className="flex-1 px-8 pb-6">
              <ul className="space-y-4">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <X className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.included
                          ? "text-gray-700 font-medium"
                          : "text-gray-400"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8">
              <Button
                asChild
                variant="outline"
                className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50 hover:border-gray-300 transition-all group"
              >
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2"
                >
                  Start for Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="group border-2 border-[#1451cb] shadow-2xl hover:shadow-3xl flex flex-col relative bg-linear-to-br from-white to-blue-50/30 transition-all hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 lg:scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="px-6 py-2 bg-linear-to-r from-[#1451cb] to-purple-600 text-white rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                <Crown className="h-4 w-4" />
                RECOMMENDED
              </div>
            </div>

            <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardHeader className="pb-6 pt-12 px-8 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Pro
                  <Sparkles className="h-5 w-5 text-yellow-500 fill-current animate-pulse" />
                </CardTitle>
                <div className="w-12 h-12 bg-linear-to-br from-[#1451cb] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>
              <CardDescription className="text-base">
                For growing businesses & professionals
              </CardDescription>
              <div className="pt-6 flex items-end gap-2">
                <span className="text-5xl font-bold bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
                  ₦5,000
                </span>
                <span className="text-gray-600 pb-2 font-medium">/month</span>
              </div>
              <div className="pt-3 px-4 py-2 bg-blue-100 border border-blue-200 rounded-lg inline-block">
                <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  7-day free trial, cancel anytime
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-8 pb-6 relative z-10">
              <ul className="space-y-4">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-linear-to-br from-[#1451cb] to-purple-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        feature.highlight
                          ? "font-bold text-gray-900"
                          : "text-gray-700 font-medium"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8 relative z-10">
              <Button
                asChild
                className="w-full bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#1451cb]/90 hover:to-purple-600/90 text-white h-14 text-base font-bold shadow-xl shadow-blue-500/30 group transition-all duration-300 hover:scale-105"
              >
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2"
                >
                  Start 7-Day Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>

            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 -translate-y-16 translate-x-16" />
          </Card>
        </div>

        <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">
                  No Hidden Fees
                </p>
                <p className="text-xs text-gray-600">
                  What you see is what you pay
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">
                  Cancel Anytime
                </p>
                <p className="text-xs text-gray-600">No long-term contracts</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">
                  7-Day Free Trial
                </p>
                <p className="text-xs text-gray-600">Try Pro risk-free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
