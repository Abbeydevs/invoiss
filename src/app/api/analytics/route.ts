import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths, format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const sixMonthsAgo = startOfMonth(subMonths(now, 5));

    const [
      totalInvoices,
      totalCustomers,
      revenueStats,
      pendingStats,
      recentInvoices,
      monthlyInvoices,
    ] = await Promise.all([
      prisma.invoice.count({
        where: { userId },
      }),

      prisma.customer.count({
        where: { userId },
      }),

      prisma.invoice.aggregate({
        _sum: {
          amountPaid: true,
        },
        where: { userId },
      }),

      prisma.invoice.aggregate({
        _sum: {
          balanceDue: true,
        },
        where: {
          userId,
          status: {
            notIn: ["DRAFT", "CANCELLED"],
          },
        },
      }),

      prisma.invoice.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: { name: true },
          },
        },
      }),

      prisma.invoice.findMany({
        where: {
          userId,
          invoiceDate: {
            gte: sixMonthsAgo,
          },
          status: { not: "CANCELLED" },
        },
        select: {
          invoiceDate: true,
          totalAmount: true,
        },
        orderBy: {
          invoiceDate: "asc",
        },
      }),
    ]);

    const revenueMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthKey = format(date, "MMM");
      revenueMap.set(monthKey, 0);
    }

    monthlyInvoices.forEach((inv) => {
      const monthKey = format(new Date(inv.invoiceDate), "MMM");
      if (revenueMap.has(monthKey)) {
        revenueMap.set(
          monthKey,
          (revenueMap.get(monthKey) || 0) + inv.totalAmount,
        );
      }
    });

    const revenueTrend = Array.from(revenueMap.entries()).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    return NextResponse.json({
      totalInvoices,
      totalCustomers,
      totalRevenue: revenueStats._sum.amountPaid || 0,
      totalPending: pendingStats._sum.balanceDue || 0,
      recentInvoices,
      revenueTrend,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
