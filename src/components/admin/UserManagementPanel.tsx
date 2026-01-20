"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  CalendarIcon,
  Crown,
  ShieldAlert,
  Zap,
  Loader2,
  RotateCcw,
  ArrowDownCircle,
  LogIn,
} from "lucide-react";
import {
  updateUserPlan,
  extendTrial,
  toggleBanUser,
  resetAccount,
  impersonateUser,
} from "@/lib/api/admin-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

interface UserManagementPanelProps {
  userId: string;
  currentPlan: string;
  subscriptionEndsAt: Date | null;
  trialEndsAt: Date | null;
  isBanned: boolean;
}

export function UserManagementPanel({
  userId,
  currentPlan,
  subscriptionEndsAt,
  isBanned,
}: UserManagementPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    subscriptionEndsAt ? new Date(subscriptionEndsAt) : undefined
  );

  const handleManualUpgrade = async () => {
    if (!date) {
      toast.error("Please pick an expiration date first");
      return;
    }
    setIsLoading(true);
    try {
      await updateUserPlan({
        userId,
        planType: "PRO",
        expiryDate: date,
      });
      toast.success("User manually upgraded to PRO");
    } catch {
      toast.error("Failed to upgrade user");
    } finally {
      setIsLoading(false);
    }
  };

  const executeGrantLifetime = async () => {
    setIsLoading(true);
    const lifetime = new Date("2099-12-31");
    try {
      await updateUserPlan({ userId, planType: "PRO", expiryDate: lifetime });
      toast.success("Lifetime access granted!");
      setDate(lifetime);
    } catch {
      toast.error("Failed to grant lifetime access");
    } finally {
      setIsLoading(false);
    }
  };

  const executeDowngrade = async () => {
    setIsLoading(true);
    try {
      await updateUserPlan({ userId, planType: "BASIC", expiryDate: null });
      toast.success("User downgraded to Basic");
      setDate(undefined);
    } catch {
      toast.error("Failed to downgrade");
    } finally {
      setIsLoading(false);
    }
  };

  const executeSuspend = async () => {
    setIsLoading(true);
    try {
      await toggleBanUser(userId, !isBanned);
      toast.success(
        isBanned ? "User Access Restored" : "User Access Suspended"
      );
    } catch {
      toast.error("Failed to update suspension status");
    } finally {
      setIsLoading(false);
    }
  };

  const executeReset = async () => {
    setIsLoading(true);
    try {
      await resetAccount(userId);
      toast.success("Account has been reset to factory settings");
    } catch {
      toast.error("Failed to reset account");
    } finally {
      setIsLoading(false);
    }
  };

  const executeImpersonation = async () => {
    setIsLoading(true);
    try {
      const { token, email } = await impersonateUser(userId);

      const result = await signIn("credentials", {
        redirect: true,
        callbackUrl: "/dashboard",
        email: email,
        password: "impersonation-mode",
        impersonationToken: token,
      });

      if (result?.error) {
        toast.error("Impersonation failed");
      }
    } catch {
      toast.error("Failed to start impersonation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Crown className="h-4 w-4 text-yellow-500" />
            Manage Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Set Expiry Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleManualUpgrade}
              disabled={isLoading || !date}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Set Active"
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="secondary" disabled={isLoading}>
                  Lifetime
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Grant Lifetime Access?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will set the user&apos;s subscription to expire in the
                    year 2099.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={executeGrantLifetime}>
                    Grant Access
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {currentPlan === "PRO" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Downgrade to Basic
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Downgrade User to Basic?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove Pro features but{" "}
                    <strong>keep their data</strong>. If they have an active
                    paid subscription, you should cancel that manually first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={executeDowngrade}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirm Downgrade
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={isLoading}
                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Account (Wipe Data)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-orange-600">
                  Factory Reset User?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="font-bold block mb-2">
                    Warning: This cannot be undone.
                  </span>
                  This will delete ALL invoices, customers, and data for this
                  user. They will be downgraded to the Basic plan and start
                  fresh.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={executeReset}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Confirm Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white mb-2"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Log in as User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enter Impersonation Mode?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to log out of the Admin panel and log in as this
                  user. You will see exactly what they see. To return, you must
                  log out and log back in as Admin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={executeImpersonation}>
                  Proceed to Login
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="space-y-2">
            <label className="text-sm font-medium">Extend Trial</label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => extendTrial(userId, 3)}>
                +3 Days
              </Button>
              <Button variant="outline" onClick={() => extendTrial(userId, 7)}>
                +7 Days
              </Button>
              <Button variant="outline" onClick={() => extendTrial(userId, 14)}>
                +14 Days
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={isBanned ? "default" : "ghost"}
                  className={cn(
                    "w-full",
                    isBanned
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "text-red-500 hover:text-red-600 hover:bg-red-50"
                  )}
                >
                  {isBanned ? (
                    <>
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Unban / Restore Access
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      Suspend User (Ban Access)
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className={isBanned ? "text-green-600" : "text-red-600"}
                  >
                    {isBanned ? "Restore User Access?" : "Suspend User Access?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isBanned
                      ? "This will allow the user to log in to their account again."
                      : "This will immediately prevent the user from logging in. They will see a suspension message."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={executeSuspend}
                    className={
                      isBanned
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                  >
                    {isBanned ? "Restore Access" : "Suspend User"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
