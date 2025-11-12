import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

const createInvoiceSchema = z.object({
  customerId: z.string().optional(),
  billToName: z.string(),
  billToEmail: z.string().email(),
  billToPhone: z.string().optional(),
  billToAddress: z.string().optional(),
  invoiceDate: z.string().transform((str) => new Date(str)),
  dueDate: z.string().transform((str) => new Date(str)),
  items: z.array(invoiceItemSchema),
  subtotal: z.number(),
  taxRate: z.number().optional(),
  taxAmount: z.number().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().optional(),
  discountAmount: z.number().optional(),
  totalAmount: z.number(),
  balanceDue: z.number(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  bankAccountId: z.string(),
  status: z.enum(["DRAFT", "SENT"]).default("DRAFT"),
  templateId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const prefix = `INV-${year}${month}-`;

    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        // userId: session.user.id,
        invoiceNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextNumber = 1;
    if (lastInvoice) {
      const lastSequentialPart = lastInvoice.invoiceNumber.split("-")[2];
      const lastNumber = parseInt(lastSequentialPart, 10);
      nextNumber = lastNumber + 1;
    }

    const invoiceNumber = `${prefix}${String(nextNumber).padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        invoiceNumber,
        customerId: validatedData.customerId,
        bankAccountId: validatedData.bankAccountId,
        templateId: validatedData.templateId,
        invoiceDate: validatedData.invoiceDate,
        dueDate: validatedData.dueDate,
        billToName: validatedData.billToName,
        billToEmail: validatedData.billToEmail,
        billToPhone: validatedData.billToPhone,
        billToAddress: validatedData.billToAddress,
        subtotal: validatedData.subtotal,
        taxRate: validatedData.taxRate || 0,
        taxAmount: validatedData.taxAmount || 0,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue || 0,
        discountAmount: validatedData.discountAmount || 0,
        totalAmount: validatedData.totalAmount,
        balanceDue: validatedData.balanceDue,
        paymentTerms: validatedData.paymentTerms,
        notes: validatedData.notes,
        status: validatedData.status,
        items: {
          create: validatedData.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            order: index,
          })),
        },
      },
      include: {
        items: true,
        customer: true,
        bankAccount: true,
      },
    });

    await prisma.activity.create({
      data: {
        userId: session.user.id,
        invoiceId: invoice.id,
        action: "invoice_created",
        description: `Created invoice ${invoiceNumber}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Invoice created successfully",
        invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create invoice error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        customer: true,
        items: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Get invoices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
