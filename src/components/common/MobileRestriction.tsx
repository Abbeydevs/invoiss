"use client";

import { Laptop, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MobileRestriction() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md p-6 lg:hidden text-center">
      <div className="max-w-md w-full bg-white border border-gray-200 shadow-2xl rounded-2xl p-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Laptop className="h-8 w-8 text-[#1451cb]" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Desktop Experience Required
        </h2>

        <p className="text-gray-600 mb-8 leading-relaxed">
          To ensure you have the best experience designing and managing your
          invoices, please access the Invoiss Dashboard from a{" "}
          <strong>computer or laptop</strong>.
        </p>

        <p className="text-sm text-gray-500 mb-8 bg-gray-50 p-3 rounded-lg">
          We are working on a dedicated mobile app for on-the-go management
          coming in v2! 🚀
        </p>

        <Button asChild variant="outline" className="w-full">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home Page
          </Link>
        </Button>
      </div>
    </div>
  );
}
