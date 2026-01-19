import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Shield, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { profile: { businessName: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: {
      profile: true,
      _count: {
        select: { invoices: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-slate-500">View and manage {users.length} users</p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <form>
            <Input
              name="q"
              placeholder="Search by email or business..."
              className="pl-9 bg-white"
              defaultValue={query}
            />
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Invoices</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profile?.logoUrl || ""} />
                      <AvatarFallback>
                        {user.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {user.profile?.businessName || "No Business Name"}
                      </span>
                      <span className="text-xs text-slate-500">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? (
                    <Badge
                      variant="outline"
                      className="border-purple-200 bg-purple-50 text-purple-700 gap-1"
                    >
                      <Shield className="h-3 w-3" /> Admin
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-slate-200 text-slate-600"
                    >
                      User
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.planType === "PRO" ? (
                    <Badge className="bg-linear-to-r from-amber-200 to-yellow-400 text-yellow-900 border-0 gap-1 hover:from-amber-300 hover:to-yellow-500">
                      <Crown className="h-3 w-3" /> PRO
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-slate-500 bg-slate-100"
                    >
                      Basic
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-slate-700">
                    {user._count.invoices}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`}>
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
