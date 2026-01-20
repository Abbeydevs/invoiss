import { prisma } from "@/lib/prisma";
import { SystemSettingsForm } from "@/components/admin/SystemSettingsForm";

export default async function AdminSettingsPage() {
  let settings = await prisma.systemSettings.findFirst();

  if (!settings) {
    settings = await prisma.systemSettings.create({
      data: {
        maintenanceMode: false,
        registrationOpen: true,
        blockedDomains: [],
      },
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
        <p className="text-slate-500">
          Control global application availability and security restrictions.
        </p>
      </div>

      <div className="max-w-4xl">
        <SystemSettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
