"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

async function getSettingsRow() {
  const settings = await prisma.systemSettings.findFirst();
  if (!settings) {
    return await prisma.systemSettings.create({
      data: {
        maintenanceMode: false,
        registrationOpen: true,
        blockedDomains: [],
      },
    });
  }
  return settings;
}

export async function getSystemSettings() {
  await requireAdmin();
  return await getSettingsRow();
}

export async function updateSystemSettings(data: {
  maintenanceMode: boolean;
  registrationOpen: boolean;
  blockedDomains: string;
}) {
  await requireAdmin();

  const settings = await getSettingsRow();

  const domainArray = data.blockedDomains
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.length > 0);

  await prisma.systemSettings.update({
    where: { id: settings.id },
    data: {
      maintenanceMode: data.maintenanceMode,
      registrationOpen: data.registrationOpen,
      blockedDomains: domainArray,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
