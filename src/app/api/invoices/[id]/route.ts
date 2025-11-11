import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateInvoiceSchema } from "@/lib/validators/invoice.schema";
import z from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const invoiceId = id;
    const userId = session.user.id;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: userId,
      },
      include: {
        items: true,
        customer: true,
        bankAccount: true,
        template: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
      select: {
        businessName: true,
        logoUrl: true,
        address: true,
        phone: true,
      },
    });

    return NextResponse.json({ ...invoice, profile });
  } catch (error) {
    console.error("Get invoice detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const invoiceId = id;
    const body = await request.json();
    const validatedData = updateInvoiceSchema.parse(body);

    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (existingInvoice.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only DRAFT invoices can be edited." },
        { status: 400 }
      );
    }

    const { items, ...invoiceData } = validatedData;

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          ...invoiceData,
        },
      });

      if (items && items.length > 0) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: invoiceId },
        });

        // Create new items
        await tx.invoiceItem.createMany({
          data: items.map((item, index) => ({
            invoiceId: invoiceId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            order: index,
          })),
        });
      }

      return invoice;
    });

    return NextResponse.json({
      success: true,
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Update invoice error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

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
    const invoiceId = id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: session.user.id,
      },
      select: {
        status: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only DRAFT invoices can be deleted." },
        { status: 400 }
      );
    }

    await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
