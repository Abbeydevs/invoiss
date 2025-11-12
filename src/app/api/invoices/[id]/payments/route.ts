import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().transform((str) => new Date(str)),
  paymentMethod: z.string().min(1, "Payment method is required"),
  notes: z.string().optional(),
});

export async function POST(
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
    const validatedData = paymentSchema.parse(body);

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (validatedData.amount > invoice.balanceDue + 0.01) {
      return NextResponse.json(
        {
          error: `Payment amount (₦${validatedData.amount}) exceeds balance due (₦${invoice.balanceDue})`,
        },
        { status: 400 }
      );
    }

    const newAmountPaid = invoice.amountPaid + validatedData.amount;
    const newBalanceDue = invoice.totalAmount - newAmountPaid;

    let newStatus = invoice.status;
    if (newBalanceDue <= 0.01) {
      newStatus = "PAID";
    } else {
      newStatus = "PARTIALLY_PAID";
    }

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.invoicePayment.create({
        data: {
          invoiceId,
          amount: validatedData.amount,
          paymentDate: validatedData.paymentDate,
          paymentMethod: validatedData.paymentMethod,
          notes: validatedData.notes,
        },
      });

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          status: newStatus,
          paidAt: newStatus === "PAID" ? new Date() : undefined,
        },
      });

      return { payment, updatedInvoice };
    });

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Record payment error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
