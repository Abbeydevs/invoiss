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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, TrendingUp, Users, Clock } from "lucide-react";

const PRO_PLAN_PRICE = 5000;

export default async function AdminSubscriptionsPage() {
  const subscribers = await prisma.user.findMany({
    where: {
      OR: [{ planType: "PRO" }, { trialEndsAt: { not: null } }],
    },
    include: {
      profile: true,
      subscription: {
        include: {
          payments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  const activePro = subscribers.filter(
    (s) => s.planType === "PRO" && (!s.trialEndsAt || s.trialEndsAt < now)
  );

  const activeTrials = subscribers.filter(
    (s) => s.trialEndsAt && s.trialEndsAt > now
  );

  const estimatedMRR = activePro.length * PRO_PLAN_PRICE;

  const totalRevenueCollected = subscribers.reduce((acc, user) => {
    const userPayments =
      user.subscription?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    return acc + userPayments;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Subscription Overview
        </h1>
        <p className="text-slate-500">
          Monitor your revenue, active subscribers, and trial users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(estimatedMRR)}
            </div>
            <p className="text-xs text-slate-500">Based on active Pro users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscribers
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePro.length}</div>
            <p className="text-xs text-slate-500">+0% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trials</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTrials.length}</div>
            <p className="text-xs text-slate-500">Potential customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lifetime Revenue
            </CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalRevenueCollected)}
            </div>
            <p className="text-xs text-slate-500">
              Total collected via payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg">Subscriber List</h3>
          <p className="text-sm text-slate-500">
            Detailed view of all premium users
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User / Business</TableHead>
              <TableHead>Plan Status</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Subscribed On</TableHead>
              <TableHead>Expires / Renews</TableHead>
              <TableHead className="text-right">Total Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((user) => {
              const isTrial =
                user.trialEndsAt && new Date(user.trialEndsAt) > now;
              const isExpired =
                !isTrial &&
                user.subscriptionEndsAt &&
                new Date(user.subscriptionEndsAt) < now;

              const paidAmount =
                user.subscription?.payments?.reduce(
                  (sum, p) => sum + p.amount,
                  0
                ) || 0;

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile?.logoUrl || ""} />
                        <AvatarFallback className="bg-blue-50 text-blue-700">
                          {user.email.slice(0, 2).toUpperCase()}
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
                    {isTrial ? (
                      <Badge
                        variant="outline"
                        className="bg-orange-50 text-orange-700 border-orange-200"
                      >
                        Trial Active
                      </Badge>
                    ) : isExpired ? (
                      <Badge variant="secondary">Expired</Badge>
                    ) : user.planType === "PRO" ? (
                      <Badge className="bg-green-600 hover:bg-green-700">
                        Active Pro
                      </Badge>
                    ) : (
                      <Badge variant="outline">Basic</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {user.billingCycle || "Monthly"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {/* Show when they joined or started trial */}
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.trialEndsAt && new Date(user.trialEndsAt) > now ? (
                      <span className="text-orange-600">
                        Trial ends {format(new Date(user.trialEndsAt), "MMM d")}
                      </span>
                    ) : user.subscriptionEndsAt ? (
                      <span>
                        {format(
                          new Date(user.subscriptionEndsAt),
                          "MMM d, yyyy"
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-400">Lifetime / Manual</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {paidAmount > 0 ? formatCurrency(paidAmount) : "—"}
                  </TableCell>
                </TableRow>
              );
            })}

            {subscribers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-slate-500"
                >
                  No active subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
