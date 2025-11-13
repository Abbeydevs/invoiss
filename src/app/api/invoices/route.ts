import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
// import { invoiceApiSchema } from "@/lib/validators/invoice.schema";

const localInvoiceApiSchema = z.object({
  customerId: z.string().optional(),
  billToName: z.string().min(2),
  billToEmail: z.string().email(),
  billToPhone: z.string().optional(),
  billToAddress: z.string().optional(),

  // API receives strings, so we coerce them to dates
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),

  items: z
    .array(
      z.object({
        description: z.string().min(1),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0),
      })
    )
    .min(1),

  taxRate: z.number().min(0).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().min(0).optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  bankAccountId: z.string().min(1),
  templateId: z.string().min(1),

  // Payment Schedule Fields
  hasPaymentSchedule: z.boolean().optional(),
  milestones: z
    .array(
      z.object({
        name: z.string().min(1),
        amount: z.number().min(0),
        percentage: z.number().optional(),
        dueDate: z.coerce.date(), // Coerce string to Date
      })
    )
    .optional(),

  // Calculated Fields
  subtotal: z.number().optional(),
  taxAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  balanceDue: z.number().optional(),
  status: z.enum(["DRAFT", "SENT"]).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = localInvoiceApiSchema.parse(body);

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
        subtotal: validatedData.subtotal || 0,
        taxRate: validatedData.taxRate || 0,
        taxAmount: validatedData.taxAmount || 0,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue || 0,
        discountAmount: validatedData.discountAmount || 0,
        totalAmount: validatedData.totalAmount || 0,
        balanceDue: validatedData.balanceDue || 0,
        paymentTerms: validatedData.paymentTerms,
        notes: validatedData.notes,
        status: validatedData.status,
        hasPaymentSchedule: validatedData.hasPaymentSchedule,
        items: {
          create: validatedData.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            order: index,
          })),
        },
        ...(validatedData.hasPaymentSchedule &&
          validatedData.milestones && {
            paymentMilestones: {
              create: validatedData.milestones.map((milestone, index) => ({
                name: milestone.name,
                amount: milestone.amount,
                percentage: milestone.percentage,
                dueDate: milestone.dueDate,
                order: index,
                status: "PENDING",
              })),
            },
          }),
      },
      include: {
        items: true,
        customer: true,
        bankAccount: true,
        paymentMilestones: true,
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
