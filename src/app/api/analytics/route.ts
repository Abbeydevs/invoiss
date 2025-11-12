import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const [
      totalInvoices,
      totalCustomers,
      revenueStats,
      pendingStats,
      recentInvoices,
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
    ]);

    return NextResponse.json({
      totalInvoices,
      totalCustomers,
      totalRevenue: revenueStats._sum.amountPaid || 0,
      totalPending: pendingStats._sum.balanceDue || 0,
      recentInvoices,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
