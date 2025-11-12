"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Users, Wallet, TrendingUp, ArrowRight } from "lucide-react";
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

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Overview of your business performance"
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            variant="primary"
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title="Pending Payments"
            value={formatCurrency(stats?.totalPending || 0)}
            variant="warning"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Total Invoices"
            value={stats?.totalInvoices.toString() || "0"}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers.toString() || "0"}
            icon={<Users className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Invoices</CardTitle>
                <CardDescription>
                  Latest transactions from your business
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/invoices">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentInvoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No invoices yet. Create your first one!
                  </div>
                ) : (
                  stats?.recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                      onClick={() =>
                        router.push(`/dashboard/invoices/${invoice.id}`)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200 text-gray-500 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {invoice.customer?.name || invoice.billToName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {invoice.invoiceNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(invoice.totalAmount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(invoice.invoiceDate), "MMM d")}
                          </p>
                        </div>
                        <InvoiceStatusBadge status={invoice.status} />
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
                Common tasks you can do right now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="w-full bg-white text-[#1451cb] hover:bg-blue-50 justify-between group"
              >
                <Link href="/dashboard/invoices/new">
                  <span>Create New Invoice</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-white hover:bg-white/10 justify-between hover:text-white"
              >
                <Link href="/dashboard/customers">
                  <span>Add Customer</span>
                  <Users className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-white hover:bg-white/10 justify-between hover:text-white"
              >
                <Link href="/dashboard/settings">
                  <span>Update Brand Settings</span>
                  <TrendingUp className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
