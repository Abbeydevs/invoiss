import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/mail";
import { InvoiceEmailTemplate } from "@/components/email/InvoiceEmailTemplate";

const externalInvoiceSchema = z.object({
  userId: z.string().min(1),
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
      }),
    )
    .min(1),
  taxRate: z.number().min(0).default(0),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().min(0).default(0),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  templateId: z.string().min(1),
  bankAccountId: z.string().optional(), // Made optional for CRM flexibility
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.EXTERNAL_API_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized CRM Access" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validatedData = externalInvoiceSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Target User not found" },
        { status: 404 },
      );
    }

    // 1. Resolve Bank Account Automatically if not provided
    let finalBankAccountId = validatedData.bankAccountId;
    if (!finalBankAccountId) {
      const defaultBank = await prisma.bankAccount.findFirst({
        where: { userId: user.id },
      });
      if (!defaultBank) {
        return NextResponse.json(
          { error: "User must configure a bank account in Invoiss first." },
          { status: 400 },
        );
      }
      finalBankAccountId = defaultBank.id;
    }

    // 2. Server-Side Financial Calculations
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    let discountAmount = 0;
    if (validatedData.discountType === "PERCENTAGE") {
      discountAmount = subtotal * (validatedData.discountValue / 100);
    } else if (validatedData.discountType === "FIXED") {
      discountAmount = validatedData.discountValue;
    }

    const taxableAmount = subtotal - discountAmount;
    const taxAmount = taxableAmount * (validatedData.taxRate / 100);
    const totalAmount = taxableAmount + taxAmount;

    // 3. Generate Sequential Invoice Number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: user.id },
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

    // 4. Database Persistence
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        userId: user.id,
        customerId: validatedData.customerId,
        bankAccountId: finalBankAccountId,
        templateId: validatedData.templateId,
        invoiceDate: validatedData.invoiceDate,
        dueDate: validatedData.dueDate,
        billToName: validatedData.billToName,
        billToEmail: validatedData.billToEmail,
        billToPhone: validatedData.billToPhone,
        billToAddress: validatedData.billToAddress,
        subtotal,
        taxRate: validatedData.taxRate,
        taxAmount,
        discountType: validatedData.discountType,
        discountValue: validatedData.discountValue,
        discountAmount,
        totalAmount,
        balanceDue: totalAmount,
        paymentTerms: validatedData.paymentTerms,
        notes: validatedData.notes,
        status: "UNPAID",
        sentAt: new Date(),
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
    });

    // 5. Direct Email Dispatch
    const businessName = user.profile?.businessName || "Your Business";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceViewUrl = `${appUrl}/public/invoice/${invoice.id}`;

    const { success } = await sendEmail({
      to: validatedData.billToEmail,
      subject: `New Invoice ${invoice.invoiceNumber} from ${businessName}`,
      senderName: businessName,
      react: InvoiceEmailTemplate({
        invoiceNumber: invoice.invoiceNumber,
        totalAmount,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        customerName: validatedData.billToName,
        businessName: businessName,
        businessLogo: user.profile?.logoUrl,
        invoiceViewUrl,
      }) as React.ReactElement,
    });

    return NextResponse.json(
      {
        success: true,
        message: success
          ? "Invoice processed and emailed"
          : "Invoice saved, dispatch retry queued",
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("External Engine Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Schema validation failure", details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal processing failure" },
      { status: 500 },
    );
  }
}
