import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const currencySchema = z.object({
  currency: z.string().min(3).max(3),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currency } = currencySchema.parse(body);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { currency },
    });

    return NextResponse.json({ success: true, currency });
  } catch (error) {
    console.error("Error updating currency:", error);
    return NextResponse.json(
      { error: "Failed to update currency" },
      { status: 500 },
    );
  }
}
