import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const basicFeatures = [
  { text: "Unlimited Invoices", included: true },
  { text: "Unlimited Customers", included: true },
  { text: "Watermarked PDF Downloads", included: true },
  { text: "1 Bank Account", included: true },
  { text: "Basic Templates", included: true },
];

const proFeatures = [
  { text: "Everything in Basic, plus:", included: true, highlight: true },
  { text: "Send Invoices via Email", included: true },
  { text: "Remove PDF Watermark", included: true },
  { text: "Wallet & Payment Tracking", included: true },
  { text: "Unlimited Bank Accounts", included: true },
  { text: "Premium Templates", included: true },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-[#1451cb] rounded-full mb-3">
            PRICING
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            A plan for every stage.
          </h2>
          <p className="text-lg text-gray-600">
            Start for free and upgrade when you&apos;re ready to unlock powerful
            Pro features.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <Card className="border-2 shadow-lg border-gray-200 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Basic</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">₦0</span>
                <span className="text-gray-500">/forever</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {basicFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700 text-sm">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 text-base"
              >
                <Link href="/register">Start for Free</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-2 border-[#1451cb] shadow-2xl shadow-blue-500/20 flex flex-col relative scale-105 z-10 bg-white">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1 bg-linear-to-r from-[#1451cb] to-[#0ea5e9] text-white rounded-full text-sm font-semibold shadow-lg">
                RECOMMENDED
              </div>
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Pro{" "}
                <Sparkles className="h-5 w-5 text-yellow-400 fill-current" />
              </CardTitle>
              <CardDescription>For growing businesses & pros</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">₦5,000</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {proFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-[#1451cb] shrink-0" />
                    <span
                      className={cn(
                        "text-gray-700 text-sm",
                        feature.highlight && "font-bold text-gray-900"
                      )}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 text-white h-12 text-base shadow-lg"
              >
                <Link href="/register">Start 7-Day Free Trial</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
