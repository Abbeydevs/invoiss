import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const bankAccountId = id;

    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        id: bankAccountId,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: { invoices: true },
        },
      },
    });

    if (!bankAccount) {
      return NextResponse.json(
        { error: "Bank account not found" },
        { status: 404 }
      );
    }

    if (bankAccount._count.invoices > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete this bank account because it is associated with existing invoices. Consider archiving it instead.",
        },
        { status: 400 }
      );
    }

    await prisma.bankAccount.delete({
      where: {
        id: bankAccountId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Bank account deleted successfully",
    });
  } catch (error) {
    console.error("Delete bank account error:", error);
    return NextResponse.json(
      { error: "Failed to delete bank account" },
      { status: 500 }
    );
  }
}
