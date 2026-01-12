import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { InvoiceEmailTemplate } from "@/components/email/InvoiceEmailTemplate";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.planType !== "PRO") {
      return NextResponse.json(
        { error: "Upgrade to Pro to send invoices directly." },
        { status: 403 }
      );
    }

    const { id: invoiceId } = await params;
    const userId = session.user.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        userId: userId,
      },
      include: {
        customer: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
      select: {
        businessName: true,
        logoUrl: true,
      },
    });

    const customerName = invoice.customer?.name || invoice.billToName;
    const customerEmail = invoice.customer?.email || invoice.billToEmail;
    const businessName = profile?.businessName || "Your Business";

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceViewUrl = `${appUrl}/public/invoice/${invoice.id}`;

    const { success, error } = await sendEmail({
      to: customerEmail,
      subject: `New Invoice ${invoice.invoiceNumber} from ${businessName}`,
      senderName: businessName,
      react: InvoiceEmailTemplate({
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: invoice.totalAmount,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        customerName: customerName,
        businessName: businessName,
        businessLogo: profile?.logoUrl,
        invoiceViewUrl: invoiceViewUrl,
      }) as React.ReactElement,
    });

    if (!success) {
      console.error("Email Helper Failed:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: "UNPAID",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully!",
    });
  } catch (error) {
    console.error("Send invoice error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
