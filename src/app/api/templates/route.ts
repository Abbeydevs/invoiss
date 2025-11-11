import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const defaultTemplates = await prisma.template.findMany({
      where: {
        userId: null,
      },
    });

    const customTemplates = await prisma.template.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      defaultTemplates,
      customTemplates,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
