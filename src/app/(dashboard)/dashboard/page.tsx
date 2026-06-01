"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
  Plus,
  Globe,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/common/SkeletonLoader";
import { getDashboardStats } from "@/lib/api/action";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import Link from "next/link";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  const [activeView, setActiveView] = useState<
    "UNIVERSAL" | "NGN" | "USD" | "GBP" | "EUR"
  >("UNIVERSAL");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Overview">
        <PageSkeleton />
      </DashboardLayout>
    );
  }

  let displayRevenue = 0;
  let displayPending = 0;
  let displayCurrency = "USD";

  if (activeView === "UNIVERSAL") {
    displayRevenue = stats?.universalTotals?.amountPaid || 0;
    displayPending = stats?.universalTotals?.balanceDue || 0;
    displayCurrency = "USD";
  } else {
    const bucket = stats?.totalsByCurrency?.find(
      (b) => b.currency === activeView,
    );
    displayRevenue = bucket?.amountPaid || 0;
    displayPending = bucket?.balanceDue || 0;
    displayCurrency = activeView;
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your business performance"
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Sleek Currency View Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={activeView === "UNIVERSAL" ? "default" : "outline"}
            onClick={() => setActiveView("UNIVERSAL")}
            className={
              activeView === "UNIVERSAL"
                ? "bg-[#1451cb] text-white"
                : "bg-white"
            }
            size="sm"
          >
            <Globe className="h-4 w-4 mr-2" />
            Universal (USD)
          </Button>
          <Button
            variant={activeView === "NGN" ? "default" : "outline"}
            onClick={() => setActiveView("NGN")}
            className={
              activeView === "NGN" ? "bg-[#1451cb] text-white" : "bg-white"
            }
            size="sm"
          >
            ₦ NGN
          </Button>
          <Button
            variant={activeView === "USD" ? "default" : "outline"}
            onClick={() => setActiveView("USD")}
            className={
              activeView === "USD" ? "bg-[#1451cb] text-white" : "bg-white"
            }
            size="sm"
          >
            $ USD
          </Button>
          <Button
            variant={activeView === "GBP" ? "default" : "outline"}
            onClick={() => setActiveView("GBP")}
            className={
              activeView === "GBP" ? "bg-[#1451cb] text-white" : "bg-white"
            }
            size="sm"
          >
            £ GBP
          </Button>
          <Button
            variant={activeView === "EUR" ? "default" : "outline"}
            onClick={() => setActiveView("EUR")}
            className={
              activeView === "EUR" ? "bg-[#1451cb] text-white" : "bg-white"
            }
            size="sm"
          >
            € EUR
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title={
              activeView === "UNIVERSAL"
                ? "Universal Revenue"
                : `${activeView} Revenue`
            }
            value={formatCurrency(displayRevenue, displayCurrency)}
            variant="primary"
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title={
              activeView === "UNIVERSAL"
                ? "Universal Pending"
                : `${activeView} Pending`
            }
            value={formatCurrency(displayPending, displayCurrency)}
            variant="warning"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Total Invoices"
            value={stats?.counts?.invoices?.toString() || "0"}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Total Customers"
            value={stats?.counts?.customers?.toString() || "0"}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 border-0 shadow-lg overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 bg-white border-b border-gray-100">
              <div>
                <CardTitle className="text-lg">Recent Invoices</CardTitle>
                <CardDescription className="hidden sm:block">
                  Latest transactions from your business
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm" className="h-8">
                <Link href="/dashboard/invoices">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {!stats?.recentInvoices || stats.recentInvoices.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      No invoices yet.
                    </p>
                    <Button asChild size="sm">
                      <Link href="/dashboard/invoices/new">Create Invoice</Link>
                    </Button>
                  </div>
                ) : (
                  stats.recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() =>
                        router.push(`/dashboard/invoices/${invoice.id}`)
                      }
                    >
                      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                        <div className="shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {invoice.customer?.name || invoice.billToName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {invoice.invoiceNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 pl-2 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(
                              invoice.totalAmount,
                              invoice.currency || "NGN",
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(invoice.invoiceDate), "MMM d")}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <InvoiceStatusBadge status={invoice.status} />
                        </div>
                        <div
                          className={`sm:hidden h-2.5 w-2.5 rounded-full ${
                            invoice.status === "PAID"
                              ? "bg-green-500"
                              : invoice.status === "OVERDUE"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-linear-to-br from-[#1451cb] to-[#0ea5e9] text-white">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-blue-100">
                Common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-white text-[#1451cb] hover:bg-blue-50 justify-between group shadow-lg"
              >
                <Link href="/dashboard/invoices/new">
                  <span className="flex items-center gap-2 font-semibold">
                    <Plus className="h-5 w-5" />
                    Create New Invoice
                  </span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-white hover:bg-white/10 justify-between hover:text-white h-12"
              >
                <Link href="/dashboard/customers">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Add Customer
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-white hover:bg-white/10 justify-between hover:text-white h-12"
              >
                <Link href="/dashboard/settings">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Brand Settings
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-50" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
