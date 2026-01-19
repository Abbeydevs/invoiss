import { getAdminStats } from "@/lib/api/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Crown, FileText, TrendingUp, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Overview
        </h2>
        <p className="text-slate-500 mt-2">
          Welcome back, Admin. Here is what is happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Pro Users
            </CardTitle>
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.proUsers}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {((stats.proUsers / stats.totalUsers) * 100).toFixed(1)}%
              conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {stats.totalInvoices}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Est. MRR (Manual)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              ₦{(stats.proUsers * 5000).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">Based on ₦5k/user</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups Table */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.profile?.logoUrl || ""} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.profile?.businessName || user.email}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                    </div>
                    {user.planType === "PRO" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        PRO
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-0 shadow-lg bg-linear-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white/10 border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
              <UserPlus className="h-5 w-5 text-blue-300" />
              <div>
                <p className="font-semibold text-sm">Review New Users</p>
                <p className="text-xs text-slate-300">
                  Check the latest 5 signups
                </p>
              </div>
            </div>
            {/* We will wire these up later */}
            <div className="p-4 rounded-lg bg-white/10 border border-white/10 flex items-center gap-3 hover:bg-white/20 transition cursor-pointer">
              <Crown className="h-5 w-5 text-yellow-300" />
              <div>
                <p className="font-semibold text-sm">Manage Subscriptions</p>
                <p className="text-xs text-slate-300">
                  Manually upgrade a user
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
