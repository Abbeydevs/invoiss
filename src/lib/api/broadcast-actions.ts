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

export async function createBroadcast(
  message: string,
  type: "INFO" | "WARNING" | "CRITICAL"
) {
  await requireAdmin();

  await prisma.systemBroadcast.create({
    data: {
      message,
      type,
      isActive: true,
    },
  });

  revalidatePath("/admin/broadcasts");
  return { success: true };
}

export async function getActiveBroadcast() {
  const broadcast = await prisma.systemBroadcast.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return broadcast;
}

export async function toggleBroadcast(id: string, currentState: boolean) {
  await requireAdmin();

  await prisma.systemBroadcast.update({
    where: { id },
    data: { isActive: !currentState },
  });

  revalidatePath("/admin/broadcasts");
  return { success: true };
}

export async function deleteBroadcast(id: string) {
  await requireAdmin();

  await prisma.systemBroadcast.delete({
    where: { id },
  });

  revalidatePath("/admin/broadcasts");
  return { success: true };
}
