import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserManagementPanel } from "@/components/admin/UserManagementPanel";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      invoices: {
        take: 10,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { invoices: true },
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-start justify-between bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profile?.logoUrl || ""} />
            <AvatarFallback className="text-lg">
              {user.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {user.profile?.businessName || "No Business Name"}
            </h1>
            <div className="flex items-center gap-2 text-slate-500 mt-1">
              <span>{user.email}</span>
              <span>•</span>
              <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge
                variant={user.planType === "PRO" ? "default" : "secondary"}
              >
                {user.planType} Plan
              </Badge>
              {user.role === "ADMIN" && (
                <Badge
                  variant="outline"
                  className="border-purple-200 text-purple-700"
                >
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <p className="text-sm text-slate-500">Joined</p>
          <p className="font-medium">
            {format(new Date(user.createdAt), "PPP")}
          </p>
        </div>
      </div>

      <UserManagementPanel
        userId={user.id}
        currentPlan={user.planType}
        subscriptionEndsAt={user.subscriptionEndsAt}
        trialEndsAt={user.trialEndsAt}
        isBanned={user.isBanned}
      />

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="font-bold text-lg mb-4">
          Recent Invoices ({user._count.invoices})
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">
                  {inv.invoiceNumber}
                </TableCell>
                <TableCell>
                  {format(new Date(inv.invoiceDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{inv.billToName}</TableCell>
                <TableCell>₦{inv.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{inv.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
            {user.invoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-slate-500"
                >
                  No invoices created yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
