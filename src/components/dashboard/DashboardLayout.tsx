"use client";

import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  action,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="lg:pl-72 transition-all duration-300">
        <DashboardHeader />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-gray-600 text-sm md:text-base">
                    {subtitle}
                  </p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
