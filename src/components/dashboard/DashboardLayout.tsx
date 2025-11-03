"use client";

import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="lg:pl-72 transition-all duration-300">
        <DashboardHeader />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
