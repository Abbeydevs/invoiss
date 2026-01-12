"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  Crown,
  CheckCircle2,
  Building2,
  Image as ImageIcon,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { FormSkeleton } from "@/components/common/SkeletonLoader";
import { ImageUpload } from "@/components/common/ImageUpload";
import { BillingModal } from "@/components/billing/BillingModal";
import { Profile } from "@/lib/types";
import { format, differenceInDays } from "date-fns";

async function getProfile(): Promise<Profile> {
  const response = await fetch("/api/profile");
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
}

const profileFormSchema = z.object({
  brandName: z.string().min(2, "Brand name must be at least 2 characters"),
  logoUrl: z.string().url().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

async function updateProfile(values: ProfileFormValues) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update profile");
  }
  return response.json();
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isPro = session?.user?.planType === "PRO";

  const [showBillingModal, setShowBillingModal] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      brandName: "",
      logoUrl: null,
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        brandName: profileData.businessName || "",
        logoUrl: profileData.logoUrl || null,
      });
    }
  }, [profileData, form]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      queryClient.setQueryData(["profile"], data.profile);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  const today = new Date();
  const subscriptionEnd = profileData?.subscriptionEndsAt
    ? new Date(profileData.subscriptionEndsAt)
    : null;

  const isGracePeriod = isPro && subscriptionEnd && subscriptionEnd < today;

  const daysDifference = subscriptionEnd
    ? Math.abs(differenceInDays(subscriptionEnd, today))
    : 0;

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your profile and subscription"
    >
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card
          className={`border-0 shadow-xl overflow-hidden transition-all duration-300 ${
            isGracePeriod
              ? "bg-linear-to-br from-red-50 via-white to-orange-50 border-red-200 ring-2 ring-red-100"
              : isPro
                ? "bg-linear-to-br from-blue-50 via-white to-purple-50"
                : "bg-linear-to-br from-gray-50 to-white"
          }`}
        >
          <CardHeader className="pb-4 relative overflow-hidden">
            {isPro && !isGracePeriod && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-yellow-400/20 to-purple-400/20 rounded-full blur-3xl" />
            )}

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
              <div className="flex items-start gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    isGracePeriod
                      ? "bg-red-100 text-red-600"
                      : isPro
                        ? "bg-linear-to-br from-[#1451cb] to-purple-600 shadow-lg text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isGracePeriod ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : isPro ? (
                    <Crown className="h-6 w-6" />
                  ) : (
                    <Sparkles className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <CardTitle
                    className={`text-2xl font-bold mb-1 ${
                      isGracePeriod ? "text-red-700" : ""
                    }`}
                  >
                    {isGracePeriod
                      ? "Subscription Expired"
                      : isPro
                        ? "Pro Plan"
                        : "Basic Plan"}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isGracePeriod
                      ? "Your plan has expired. Please renew to avoid downgrade."
                      : isPro
                        ? "Unlimited access to all premium features"
                        : "Limited access with basic features"}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={`${
                    isGracePeriod
                      ? "bg-red-600 hover:bg-red-700 shadow-md animate-pulse"
                      : isPro
                        ? "bg-linear-to-r from-[#1451cb] to-purple-600 shadow-md"
                        : "bg-gray-500 hover:bg-gray-600"
                  } text-white px-4 py-1.5 text-sm font-semibold`}
                >
                  {isGracePeriod ? "ACTION REQUIRED" : isPro ? "PRO" : "BASIC"}
                </Badge>
                {isPro && !isGracePeriod && profileData?.billingCycle && (
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-700 bg-blue-50"
                  >
                    {profileData.billingCycle}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 pb-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100">
                  <CheckCircle2
                    className={`h-5 w-5 mt-0.5 shrink-0 ${
                      isPro ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {isPro ? "Unlimited Bank Accounts" : "1 Bank Account"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isPro
                        ? "Connect as many as you need"
                        : "Limited to single account"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100">
                  <CheckCircle2
                    className={`h-5 w-5 mt-0.5 shrink-0 ${
                      isPro ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {isPro ? "Premium Templates" : "Basic Templates"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isPro
                        ? "Access to all invoice designs"
                        : "Limited template selection"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center sm:items-end gap-4">
                {(!isPro || isGracePeriod) && (
                  <div className="text-center sm:text-right w-full sm:w-auto">
                    {!isPro && (
                      <p className="text-sm text-gray-500 mb-2">
                        Unlock all features
                      </p>
                    )}
                    <Button
                      onClick={() => setShowBillingModal(true)}
                      size="lg"
                      className={`${
                        isGracePeriod
                          ? "bg-red-600 hover:bg-red-700 text-white w-full" // Red Button for Grace
                          : "bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#1451cb]/90 text-white w-full px-8"
                      } shadow-lg transition-all duration-300`}
                    >
                      {isGracePeriod ? (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Pay Now & Restore
                        </>
                      ) : (
                        <>
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Pro
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {isPro && subscriptionEnd && (
                  <div
                    className={`text-center sm:text-right p-4 rounded-xl border shadow-sm w-full sm:w-auto ${
                      isGracePeriod
                        ? "bg-red-50 border-red-200"
                        : "bg-white/60 border-blue-100/50"
                    }`}
                  >
                    <p
                      className={`text-sm mb-1 ${
                        isGracePeriod
                          ? "text-red-600 font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {isGracePeriod
                        ? "Expired on"
                        : profileData?.billingCycle === "YEARLY"
                          ? "Renews Yearly on"
                          : "Renews Monthly on"}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {format(subscriptionEnd, "MMMM d, yyyy")}
                    </p>
                    <p
                      className={`text-xs font-medium mt-1 ${
                        isGracePeriod ? "text-red-600" : "text-blue-600"
                      }`}
                    >
                      {isGracePeriod
                        ? `${daysDifference} day(s) ago`
                        : `${daysDifference} days remaining`}
                    </p>
                  </div>
                )}

                {isPro && !isGracePeriod && (
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-green-600 font-medium mb-2 flex items-center gap-2 justify-center sm:justify-end">
                      <CheckCircle2 className="h-4 w-4" />
                      Active Subscription
                    </p>
                    <Button
                      variant="outline"
                      disabled
                      className="border-gray-300"
                    >
                      Manage Subscription
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          <CardHeader className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-[#1451cb]" />
              </div>
              <div>
                <CardTitle className="text-xl">Business Branding</CardTitle>
                <CardDescription className="mt-1">
                  Customize how your brand appears on invoices
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isLoadingProfile ? (
              <FormSkeleton />
            ) : (
              <Form {...form}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Business Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your company name"
                            {...field}
                            className="h-11 border-gray-300 focus:border-[#1451cb] focus:ring-[#1451cb] transition-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" />
                          Business Logo
                        </FormLabel>
                        <FormControl>
                          <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#1451cb] transition-colors bg-gray-50/50">
                            <ImageUpload
                              value={field.value || null}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t border-gray-100">
                    <Button
                      onClick={form.handleSubmit(onSubmit)}
                      type="button"
                      size="lg"
                      className="w-full bg-linear-to-r from-[#1451cb] to-blue-600 hover:from-[#1451cb]/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-semibold"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5 mr-2" />
                          Save Branding
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
      />
    </DashboardLayout>
  );
}
