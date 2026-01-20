"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateSystemSettings } from "@/lib/api/settings-actions";
import { toast } from "sonner";
import { Loader2, ShieldAlert, DoorClosed, Ban } from "lucide-react";

interface SettingsProps {
  initialSettings: {
    maintenanceMode: boolean;
    registrationOpen: boolean;
    blockedDomains: string[];
  };
}

export function SystemSettingsForm({ initialSettings }: SettingsProps) {
  const [maintenance, setMaintenance] = useState(
    initialSettings.maintenanceMode
  );
  const [regOpen, setRegOpen] = useState(initialSettings.registrationOpen);
  const [domains, setDomains] = useState(
    initialSettings.blockedDomains.join(", ")
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSystemSettings({
        maintenanceMode: maintenance,
        registrationOpen: regOpen,
        blockedDomains: domains,
      });
      toast.success("System settings updated successfully");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card
        className={`border-l-4 ${maintenance ? "border-l-red-500" : "border-l-green-500"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-slate-500" />
              Maintenance Mode
            </CardTitle>
            <CardDescription>
              When active, only Admins can log in. All other users will be
              blocked.
            </CardDescription>
          </div>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-0.5">
            <CardTitle className="text-base flex items-center gap-2">
              <DoorClosed className="h-5 w-5 text-slate-500" />
              Allow New Registrations
            </CardTitle>
            <CardDescription>
              Turn this off to pause new signups (e.g., if servers are
              overloaded).
            </CardDescription>
          </div>
          <Switch checked={regOpen} onCheckedChange={setRegOpen} />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ban className="h-5 w-5 text-slate-500" />
            Blocked Email Domains
          </CardTitle>
          <CardDescription>
            Prevent signups from these domains (e.g., spam or competitors).
            Separate with commas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            placeholder="tempmail.com, mailinator.com, spam-site.net"
            className="font-mono text-sm"
            rows={4}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
