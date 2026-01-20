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

export async function updateUserPlan({
  userId,
  planType,
  expiryDate,
}: {
  userId: string;
  planType: "BASIC" | "PRO";
  expiryDate?: Date | null;
}) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: {
      planType,
      subscriptionEndsAt: planType === "PRO" ? expiryDate : null,
      trialEndsAt: planType === "BASIC" ? null : undefined,
    },
  });

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function extendTrial(userId: string, days: number) {
  await requireAdmin();

  const newDate = new Date();
  newDate.setDate(newDate.getDate() + days);

  await prisma.user.update({
    where: { id: userId },
    data: {
      planType: "PRO",
      trialEndsAt: newDate,
      subscriptionEndsAt: null,
    },
  });

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

// Suspend account helper function
export async function toggleBanUser(userId: string, shouldBan: boolean) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: {
      isBanned: shouldBan,
    },
  });

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}

export async function resetAccount(userId: string) {
  await requireAdmin();

  await prisma.$transaction([
    prisma.invoice.deleteMany({ where: { userId } }),
    prisma.customer.deleteMany({ where: { userId } }),
    prisma.bankAccount.deleteMany({ where: { userId } }),
    prisma.activity.deleteMany({ where: { userId } }),
    prisma.wallet.deleteMany({ where: { userId } }),

    prisma.user.update({
      where: { id: userId },
      data: {
        planType: "BASIC",
        trialEndsAt: null,
        subscriptionEndsAt: null,
      },
    }),
  ]);

  revalidatePath(`/admin/users/${userId}`);
  return { success: true };
}
