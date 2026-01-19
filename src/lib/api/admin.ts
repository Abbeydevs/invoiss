"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  console.log("DEBUGGING ADMIN ACCESS:");
  console.log("User Email:", session?.user?.email);
  console.log("User Role:", session?.user?.role);

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers, proUsers, totalInvoices, recentUsers] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({ where: { planType: "PRO" } }),

    prisma.invoice.count(),

    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { profile: true },
    }),
  ]);

  return {
    totalUsers,
    proUsers,
    totalInvoices,
    recentUsers,
  };
}
