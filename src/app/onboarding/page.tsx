"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Building2, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { update } = useSession();

  const [accountType, setAccountType] = useState<
    "INDIVIDUAL" | "COMPANY" | null
  >(null);
  const [businessName, setBusinessName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountType) return;

    if (accountType === "COMPANY" && !businessName.trim()) {
      return toast.error("Please enter your business name");
    }
    if (
      accountType === "INDIVIDUAL" &&
      (!firstName.trim() || !lastName.trim())
    ) {
      return toast.error("Please enter your full name");
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          businessName,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set up profile");
      }

      await update();

      toast.success("Profile setup complete!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding setup failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-linear-to-r from-[#1451cb] to-purple-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to Invoiss!</h1>
            <p className="text-blue-100">
              Let&apos;s personalize your experience. How will you be using the
              platform?
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* The Selection Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div
                onClick={() => setAccountType("INDIVIDUAL")}
                className={cn(
                  "cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 text-center relative group",
                  accountType === "INDIVIDUAL"
                    ? "border-[#1451cb] bg-blue-50/50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-colors",
                    accountType === "INDIVIDUAL"
                      ? "bg-[#1451cb] text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200",
                  )}
                >
                  <User className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Individual</h3>
                <p className="text-xs text-gray-500">
                  I am a freelancer or sole proprietor
                </p>
              </div>

              <div
                onClick={() => setAccountType("COMPANY")}
                className={cn(
                  "cursor-pointer p-6 rounded-2xl border-2 transition-all duration-200 text-center relative group",
                  accountType === "COMPANY"
                    ? "border-[#1451cb] bg-blue-50/50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 transition-colors",
                    accountType === "COMPANY"
                      ? "bg-[#1451cb] text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200",
                  )}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">
                  Registered Business
                </h3>
                <p className="text-xs text-gray-500">
                  I am operating as a registered company
                </p>
              </div>
            </div>

            {/* Dynamic Input Fields */}
            <div
              className={cn(
                "space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-300",
                !accountType && "hidden",
              )}
            >
              {accountType === "COMPANY" ? (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    What is your company called?
                  </label>
                  <Input
                    placeholder="e.g. Acme Corporation"
                    className="h-12 bg-gray-50 focus:bg-white text-lg"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      First Name
                    </label>
                    <Input
                      placeholder="John"
                      className="h-12 bg-gray-50 focus:bg-white"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Last Name
                    </label>
                    <Input
                      placeholder="Doe"
                      className="h-12 bg-gray-50 focus:bg-white"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#1451cb]/90 hover:to-purple-600/90 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Go to Dashboard <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
