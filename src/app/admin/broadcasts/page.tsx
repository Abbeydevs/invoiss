import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { BroadcastManager } from "@/components/admin/BroadcastManager";

export default async function BroadcastsPage() {
  const broadcasts = await prisma.systemBroadcast.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Broadcasts</h1>
        <p className="text-slate-500">
          Create global announcements visible to all users on their dashboard.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-5 w-5 text-blue-500" />
              Create New Announcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BroadcastManager initialBroadcasts={broadcasts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
