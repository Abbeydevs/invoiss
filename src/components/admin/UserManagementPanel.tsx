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
import { CalendarIcon, Crown, ShieldAlert, Zap, Loader2 } from "lucide-react";
import {
  updateUserPlan,
  extendTrial,
  toggleBanUser,
} from "@/lib/api/admin-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserManagementPanelProps {
  userId: string;
  currentPlan: string;
  subscriptionEndsAt: Date | null;
  trialEndsAt: Date | null;
}

export function UserManagementPanel({
  userId,
  currentPlan,
  subscriptionEndsAt,
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

  const executeBan = async () => {
    setIsLoading(true);
    try {
      await toggleBanUser(userId, true);
      toast.success("User has been banned/demoted");
    } catch {
      toast.error("Failed to ban user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* MANUAL SUBSCRIPTION CARD */}
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

            {/* LIFETIME ACCESS DIALOG */}
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
                    year 2099. They will have full Pro access until then.
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
            // DOWNGRADE DIALOG
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoading}
                  className="w-full"
                >
                  Downgrade to Basic
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Downgrade User?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will immediately remove Pro access. If they have an
                    active paid subscription, you should cancel that first in
                    the Payment settings.
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
        </CardContent>
      </Card>

      {/* QUICK ACTIONS CARD */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            {/* BAN USER DIALOG */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Ban / Suspend User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                    Ban User Account?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This is a destructive action. It will strip the user of all
                    Pro privileges and reset their plan to Basic immediately.
                    (In a real production app, you might want to prevent login
                    entirely).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={executeBan}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ban User
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
