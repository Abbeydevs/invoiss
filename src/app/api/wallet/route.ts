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

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!wallet) {
      return NextResponse.json({
        balance: 0,
        totalReceived: 0,
        totalPending: 0,
        transactions: [],
      });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Get wallet error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
