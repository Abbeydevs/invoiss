"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

const getAnalytics = async () => {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function AnalyticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics" subtitle="Business overview">
        <div className="p-8 text-center text-red-500">
          Failed to load analytics data.
        </div>
      </DashboardLayout>
    );
  }

  const {
    totalRevenue,
    totalPending,
    totalInvoices,
    totalCustomers,
    revenueTrend,
    recentInvoices,
  } = data;

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Overview of your business performance"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue || 0)}
            description="Total amount collected"
            icon={TrendingUp}
            className="border-l-4 border-l-emerald-500"
          />
          <StatsCard
            title="Outstanding"
            value={formatCurrency(totalPending || 0)}
            description="Pending payments"
            icon={AlertCircle}
            className="border-l-4 border-l-amber-500"
          />
          <StatsCard
            title="Total Invoices"
            value={totalInvoices?.toString() || "0"}
            description="Invoices generated"
            icon={FileText}
            className="border-l-4 border-l-blue-500"
          />
          <StatsCard
            title="Total Customers"
            value={totalCustomers?.toString() || "0"}
            description="Active clients"
            icon={Users}
            className="border-l-4 border-l-purple-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Trend (6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₦${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number | undefined) => [
                        formatCurrency(value || 0),
                        "Revenue",
                      ]}
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#1451cb"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {recentInvoices?.map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {invoice.customer?.name || invoice.billToName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {invoice.invoiceNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(invoice.createdAt), "MMM d")}
                      </p>
                    </div>
                  </div>
                ))}
                {(!recentInvoices || recentInvoices.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent invoices found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatsCard({ title, value, description, icon: Icon, className }: any) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <DashboardLayout title="Analytics" subtitle="Loading data...">
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    </DashboardLayout>
  );
}
