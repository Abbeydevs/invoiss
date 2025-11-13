"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  CreditCard,
  Wallet,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Menu,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BillingModal } from "../billing/BillingModal";

const navigation = [
  {
    title: "MENU",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        title: "Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
        badge: "New",
      },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      {
        title: "Bank Accounts",
        href: "/dashboard/bank-accounts",
        icon: CreditCard,
      },
      { title: "Wallet", href: "/dashboard/wallet", icon: Wallet },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "GENERAL",
    items: [
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
      { title: "Help", href: "/dashboard/help", icon: HelpCircle },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isPro = session?.user?.planType === "PRO";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-to-br from-[#1451cb] to-[#0ea5e9] flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Invoiss</span>
            </Link>
          )}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 text-gray-600 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                        isActive
                          ? "bg-[#1451cb] text-white shadow-lg shadow-blue-500/20"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive
                            ? "text-white"
                            : "text-gray-500 group-hover:text-[#1451cb]"
                        )}
                      />
                      {!isCollapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!isCollapsed && item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Upgrade Banner (Only for Basic Users) */}
        {!isPro && !isCollapsed && (
          <div className="p-4 m-4 bg-linear-to-br from-[#1451cb] to-[#0ea5e9] rounded-xl text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
                <span className="font-semibold text-sm">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-blue-100 mb-3 leading-relaxed">
                Unlock unlimited invoices, payments, and premium templates.
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full bg-white text-[#1451cb] hover:bg-blue-50 text-xs font-semibold h-8"
                onClick={() => setShowBillingModal(true)}
              >
                Upgrade Now
              </Button>
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
          </div>
        )}

        {!isPro && isCollapsed && (
          <div className="p-2 mb-4">
            <Button
              size="icon"
              className="bg-linear-to-br from-[#1451cb] to-[#0ea5e9] hover:opacity-90"
              onClick={() => setShowBillingModal(true)}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </Button>
          </div>
        )}
      </aside>

      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
      />
    </>
  );
}
