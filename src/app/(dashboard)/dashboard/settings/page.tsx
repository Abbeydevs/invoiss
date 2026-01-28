/* eslint-disable @next/next/no-img-element */
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
  Crown,
  CheckCircle2,
  Building2,
  X,
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { FormSkeleton } from "@/components/common/SkeletonLoader";
import { ImageUpload } from "@/components/common/ImageUpload";
import { BillingModal } from "@/components/billing/BillingModal";
import { Profile } from "@/lib/types";
import { format, differenceInDays } from "date-fns";
import { CurrencyForm } from "@/components/settings/CurrencyForm";

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

  const subscriptionEnd =
    profileData && profileData.subscriptionEndsAt
      ? new Date(profileData.subscriptionEndsAt)
      : null;

  const trialEnd =
    profileData && profileData.trialEndsAt
      ? new Date(profileData.trialEndsAt)
      : null;

  // User is in grace period if they're PRO with expired paid subscription
  const isGracePeriod = isPro && subscriptionEnd && subscriptionEnd < today;

  // User is on trial if they're PRO, have a trial end date in the future, and no paid subscription
  const isTrial = isPro && trialEnd && trialEnd > today && !subscriptionEnd;

  // User's trial has expired but they haven't been downgraded yet (edge case before cron runs)
  const isExpiredTrial =
    isPro && trialEnd && trialEnd < today && !subscriptionEnd;

  const daysRemaining = subscriptionEnd
    ? differenceInDays(subscriptionEnd, today)
    : trialEnd && isTrial
      ? differenceInDays(trialEnd, today)
      : 0;

  // Determine the display date based on subscription status
  const displayDate = subscriptionEnd || trialEnd;

  // Determine the status text
  const getStatusText = () => {
    if (isExpiredTrial) return "Trial expired";
    if (isGracePeriod) return "Subscription expired";
    if (isTrial) return "Trial ends";
    if (subscriptionEnd && subscriptionEnd > today) return "Renews on";
    return null;
  };

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account settings">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Expired Trial Warning */}
        {isExpiredTrial && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your free trial has ended. Subscribe now to continue using Pro
              features. Your account will be downgraded to Basic soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Grace Period Warning */}
        {isGracePeriod && (
          <Alert
            variant="destructive"
            className="border-orange-200 bg-orange-50"
          >
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              Your subscription has expired. You have{" "}
              {3 - Math.abs(daysRemaining)} day
              {3 - Math.abs(daysRemaining) !== 1 ? "s" : ""} remaining in your
              grace period before your account is downgraded to Basic.
            </AlertDescription>
          </Alert>
        )}

        {/* Subscription Card */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    isPro
                      ? "bg-linear-to-br from-blue-500 to-purple-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Crown
                    className={`h-6 w-6 ${isPro ? "text-white" : "text-gray-400"}`}
                  />
                </div>
                <div>
                  <CardTitle className="text-xl mb-1">
                    {isPro ? "Pro Plan" : "Basic Plan"}
                  </CardTitle>
                  <CardDescription>
                    {isPro
                      ? isTrial
                        ? "Free trial - enjoying all premium features"
                        : "Access to all premium features"
                      : "Upgrade to unlock premium features"}
                  </CardDescription>
                </div>
              </div>
              <Badge
                className={`${
                  isPro
                    ? isTrial
                      ? "bg-linear-to-r from-green-500 to-emerald-600"
                      : "bg-linear-to-r from-blue-500 to-purple-600"
                    : "bg-gray-500"
                } text-white`}
              >
                {isTrial ? "TRIAL" : isPro ? "PRO" : "BASIC"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <CheckCircle2
                    className={`h-5 w-5 mt-0.5 ${isPro ? "text-green-500" : "text-gray-400"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {isPro ? "Unlimited" : "1"} Bank Account
                      {isPro ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isPro
                        ? "Connect multiple accounts"
                        : "Limited to one account"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <CheckCircle2
                    className={`h-5 w-5 mt-0.5 ${isPro ? "text-green-500" : "text-gray-400"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {isPro ? "Premium" : "Basic"} Templates
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isPro
                        ? "Access all invoice designs"
                        : "Limited templates only"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-between pt-4 border-t">
                {isPro && displayDate ? (
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-500">{getStatusText()}</p>
                      <p className="text-base font-semibold text-gray-900">
                        {format(displayDate, "MMM d, yyyy")}
                      </p>
                      {!isGracePeriod &&
                        !isExpiredTrial &&
                        daysRemaining > 0 && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {daysRemaining} day
                            {daysRemaining !== 1 ? "s" : ""} remaining
                          </p>
                        )}
                    </div>
                    {profileData?.billingCycle &&
                      !isTrial &&
                      !isExpiredTrial && (
                        <Badge variant="outline" className="capitalize">
                          {profileData.billingCycle.toLowerCase()}
                        </Badge>
                      )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">
                      Get unlimited access to all features
                    </p>
                  </div>
                )}

                {(!isPro || isGracePeriod || isTrial || isExpiredTrial) && (
                  <Button
                    onClick={() => setShowBillingModal(true)}
                    className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {isGracePeriod
                      ? "Renew Now"
                      : isTrial || isExpiredTrial
                        ? "Subscribe Now"
                        : "Upgrade to Pro"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding Card */}
        <Card className="border border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Business Branding</CardTitle>
                <CardDescription>
                  Customize how your brand appears on invoices
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <FormSkeleton />
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your company name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This will appear on all your invoices
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Logo</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            {field.value ? (
                              <div className="relative inline-block">
                                <img
                                  src={field.value}
                                  alt="Logo preview"
                                  className="h-24 w-auto rounded-lg border border-gray-200 object-contain bg-white p-2"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                  onClick={() => field.onChange(null)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                <ImageUpload
                                  value={field.value || null}
                                  onChange={field.onChange}
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload your company logo (PNG, JPG or SVG)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <CurrencyForm />
      </div>

      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
      />
    </DashboardLayout>
  );
}
