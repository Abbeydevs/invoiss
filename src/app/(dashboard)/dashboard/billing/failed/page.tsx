"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function BillingFailedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-500 to-orange-500" />

        <CardContent className="pt-12 pb-10 px-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            We couldn&apos;t process your subscription payment.
          </p>

          <div className="bg-red-50 rounded-xl p-6 mb-8 text-left border border-red-100">
            <p className="text-sm font-medium text-red-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Possible reasons:
            </p>
            <ul className="list-disc list-inside text-sm text-red-800 space-y-1 ml-1">
              <li>Insufficient funds in your wallet/card</li>
              <li>The transaction was declined by your bank</li>
              <li>Network connection timed out</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 text-base shadow-lg"
            >
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Try Again
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-900"
            >
              <Link href="mailto:support@invoiss.com">Contact Support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
