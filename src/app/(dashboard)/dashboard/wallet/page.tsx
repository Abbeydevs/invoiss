"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Wallet, ArrowUpRight, ArrowDownLeft, Lock } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/common/SkeletonLoader";
import { getWallet } from "@/lib/api/action";
import { format } from "date-fns";
import { useState } from "react";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { WalletTransaction } from "@/lib/types";

export default function WalletPage() {
  const { data: session, status } = useSession();
  const isProUser = session?.user?.planType === "PRO";
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: wallet, isLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: getWallet,
    enabled: isProUser && status === "authenticated",
  });

  if (status === "loading" || (isProUser && isLoading)) {
    return (
      <DashboardLayout title="Wallet" subtitle="Manage your finances">
        <PageSkeleton />
      </DashboardLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const displayWallet = isProUser
    ? wallet
    : {
        id: "dummy",
        balance: 1540000,
        totalReceived: 2500000,
        totalPending: 450000,
        transactions: [
          {
            id: "1",
            description: "Payment for Invoice #001",
            amount: 50000,
            type: "CREDIT" as const,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            description: "Payment for Invoice #002",
            amount: 120000,
            type: "CREDIT" as const,
            createdAt: new Date().toISOString(),
          },
          {
            id: "3",
            description: "Payment for Invoice #003",
            amount: 75000,
            type: "CREDIT" as const,
            createdAt: new Date().toISOString(),
          },
        ],
      };

  return (
    <DashboardLayout
      title="Wallet"
      subtitle="Track your cash flow and transaction history"
    >
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!isProUser && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="h-8 w-8 text-[#1451cb]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Unlock Your Wallet
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Upgrade to Pro to track payments, view transaction history, and
                manage your cash flow automatically.
              </p>
              <Button
                size="lg"
                className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 shadow-lg shadow-blue-500/20"
                onClick={() => setShowUpgradeModal(true)}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}

        <div
          className={
            !isProUser ? "blur-sm select-none pointer-events-none" : ""
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Available Balance"
              value={formatCurrency(displayWallet?.balance || 0)}
              variant="primary"
              icon={<Wallet className="h-5 w-5" />}
            />
            <StatCard
              title="Total Received"
              value={formatCurrency(displayWallet?.totalReceived || 0)}
              variant="success"
              icon={<ArrowDownLeft className="h-5 w-5" />}
            />
            <StatCard
              title="Pending Invoices"
              value={formatCurrency(displayWallet?.totalPending || 0)}
              variant="warning"
              icon={<ArrowUpRight className="h-5 w-5" />}
            />
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayWallet?.transactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No transactions found. Record a payment to see it here.
                  </div>
                ) : (
                  displayWallet?.transactions.map((tx: WalletTransaction) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <ArrowDownLeft className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {tx.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(tx.createdAt), "PPP 'at' p")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +{formatCurrency(tx.amount)}
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Credit
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </DashboardLayout>
  );
}
