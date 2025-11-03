"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FileText, Users, Wallet, TrendingUp, Check } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageSkeleton } from "@/components/common/SkeletonLoader";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <PageSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Plan, prioritize, and accomplish your tasks with ease."
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Invoices"
            value="24"
            variant="primary"
            change={{ value: 12, label: "from last month" }}
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            title="Total Customers"
            value="10"
            change={{ value: 8, label: "from last month" }}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Total Revenue"
            value="₦12M"
            change={{ value: 15, label: "from last month" }}
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title="Growth Rate"
            value="23%"
            variant="success"
            change={{ value: 5, label: "from last month" }}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Getting Started */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Getting Started
            </CardTitle>
            <CardDescription>
              Welcome to Invoiss! Here&apos;s what you can do next:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: "Your account has been created successfully",
                  completed: true,
                },
                { title: "Create your first invoice", completed: false },
                { title: "Add your first customer", completed: false },
                { title: "Set up bank accounts", completed: false },
                { title: "Customize your invoice template", completed: false },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 ${
                      item.completed
                        ? "bg-linear-to-r from-[#1451cb] to-[#0ea5e9] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {item.completed ? <Check className="h-3 w-3" /> : index + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      item.completed
                        ? "text-gray-900 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
