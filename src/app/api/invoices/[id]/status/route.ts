import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "SENT",
    "UNPAID",
    "PAID",
    "PARTIALLY_PAID",
    "OVERDUE",
    "CANCELLED",
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: invoiceId } = await params;
    const body = await request.json();
    const validatedData = statusSchema.parse(body);

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: validatedData.status,
        ...(validatedData.status === "SENT" || validatedData.status === "UNPAID"
          ? { sentAt: invoice.sentAt || new Date() }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
