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
  Sparkles,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BillingModal } from "../billing/BillingModal";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";
import { useState } from "react";

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

  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();
  const [showBillingModal, setShowBillingModal] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transition-transform duration-300 lg:hidden flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-gray-900">Menu</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                        isActive(item.href)
                          ? "bg-blue-50 text-[#1451cb]"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 hidden lg:flex flex-col",
          isCollapsed ? "w-20" : "w-72",
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-9 h-9 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/invoiss-logo.svg"
                  alt="Invoiss Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl text-gray-900">Invoiss</span>
            </Link>
          )}
          <Button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 text-gray-600 transition-transform",
                isCollapsed && "rotate-180",
              )}
            />
          </Button>
        </div>

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
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                        isActive(item.href)
                          ? "bg-[#1451cb] text-white shadow-lg shadow-blue-500/20"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive(item.href)
                            ? "text-white"
                            : "text-gray-500 group-hover:text-[#1451cb]",
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
                Unlock unlimited invoices and premium features.
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
          </div>
        )}
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            href="/dashboard"
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform",
              isActive("/dashboard")
                ? "text-[#1451cb]"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            href="/dashboard/invoices"
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform",
              isActive("/dashboard/invoices")
                ? "text-[#1451cb]"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <FileText className="h-5 w-5" />
            <span className="text-[10px] font-medium">Invoices</span>
          </Link>

          <div className="-mt-8 relative z-10">
            <Link href="/dashboard/invoices/new">
              <div className="h-14 w-14 rounded-full bg-linear-to-r from-[#1451cb] to-[#0ea5e9] shadow-lg shadow-blue-500/30 flex items-center justify-center text-white transition-transform active:scale-90 hover:scale-105 border-4 border-gray-50/50">
                <Plus className="h-7 w-7" />
              </div>
            </Link>
          </div>

          <Link
            href="/dashboard/wallet"
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform",
              isActive("/dashboard/wallet")
                ? "text-[#1451cb]"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>

          <button
            onClick={() => setIsMobileOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform",
              isMobileOpen
                ? "text-[#1451cb]"
                : "text-gray-500 hover:text-gray-900",
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>

      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
      />
    </>
  );
}
