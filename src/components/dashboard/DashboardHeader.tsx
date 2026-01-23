"use client";

import { LogOut, User, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DashboardHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const getName = () => {
    if (session?.user?.name) return session.user.name;
    if (session?.user?.email) {
      return session.user.email.split("@")[0];
    }
    return "User";
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/dashboard/invoices/new")}
            className="bg-linear-to-r from-[#1451cb] to-[#0ea5e9] hover:from-[#1451cb]/90 hover:to-[#0ea5e9]/90 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100/80 rounded-xl px-2 py-1 h-auto transition-all duration-200"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-offset-2 ring-blue-100 transition-all duration-200 hover:ring-blue-200">
                    <AvatarImage src="" alt={getName()} />
                    <AvatarFallback className="bg-linear-to-br from-[#1451cb] to-[#0ea5e9] text-white font-bold text-sm">
                      {session?.user?.email
                        ? getInitials(session.user.email)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                      {getName()}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">
                      {session?.user?.planType === "PRO" ? (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-linear-to-r from-amber-400 to-yellow-500 text-white font-bold text-[10px]">
                          PRO
                        </span>
                      ) : (
                        <span className="text-gray-400">Basic Plan</span>
                      )}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {getName()}
                    </p>
                    <p className="text-xs text-gray-500 font-normal">
                      {session?.user?.email}
                    </p>
                    {session?.user?.planType === "PRO" && (
                      <span className="inline-flex items-center w-fit px-2 py-1 rounded-md bg-linear-to-r from-amber-400 to-yellow-500 text-white font-bold text-xs mt-1">
                        PRO Member
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                  className="rounded-lg cursor-pointer py-2.5"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer py-2.5"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
