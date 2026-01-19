import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const localInvoiceApiSchema = z.object({
  customerId: z.string().optional(),
  billToName: z.string().min(2),
  billToEmail: z.string().email(),
  billToPhone: z.string().optional(),
  billToAddress: z.string().optional(),

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

  hasPaymentSchedule: z.boolean().optional(),
  milestones: z
    .array(
      z.object({
        name: z.string().min(1),
        amount: z.number().min(0),
        percentage: z.number().optional(),
        dueDate: z.coerce.date(),
      })
    )
    .optional(),

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

    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { invoiceNumber: true },
    });

    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoiceNumber.startsWith("INV-")) {
      const split = lastInvoice.invoiceNumber.split("-");
      const numberPart = parseInt(split[1]);

      if (!isNaN(numberPart)) {
        nextNumber = numberPart + 1;
      }
    }

    const newInvoiceNumber = `INV-${nextNumber.toString().padStart(4, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        userId: session.user.id,
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
