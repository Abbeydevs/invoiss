"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
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

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Empty space for future elements */}
        <div className="flex-1" />

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Create Invoice Button */}
          <Button
            onClick={() => router.push("/dashboard/invoices/new")}
            className="bg-[#1451cb] hover:bg-[#1451cb]/90 text-white shadow-lg shadow-blue-500/20"
          >
            Create Invoice
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-sm text-gray-500 text-center">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
                      <Badge
                        variant={
                          session?.user?.planType === "PRO"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          session?.user?.planType === "PRO"
                            ? "bg-[#1451cb]"
                            : ""
                        }
                      >
                        {session?.user?.planType}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{getName()}</p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                    <Badge variant="outline" className="w-fit mt-1 capitalize">
                      {session?.user?.accountType.toLowerCase()}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/help")}
                >
                  Help & Support
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
