"use client";

import { LogOut, User } from "lucide-react";
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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {/* Create Invoice Button */}
          <Button
            onClick={() => router.push("/dashboard/invoices/new")}
            className="bg-[#1451cb] hover:bg-[#1451cb]/90 text-white shadow-lg shadow-blue-500/20"
          >
            Create Invoice
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 hover:bg-transparent"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                    <AvatarImage src="" alt={getName()} />
                    <AvatarFallback className="bg-linear-to-br from-[#1451cb] to-[#0ea5e9] text-white font-semibold">
                      {session?.user?.email
                        ? getInitials(session.user.email)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {getName()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <User className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
