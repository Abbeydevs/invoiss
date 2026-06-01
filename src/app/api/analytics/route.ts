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

    const userId = session.user.id;

    const groupedInvoices = await prisma.invoice.groupBy({
      by: ["currency"],
      where: { userId: userId },
      _sum: {
        totalAmount: true,
        amountPaid: true,
        balanceDue: true,
      },
    });

    let exchangeRates: Record<string, number> = {};
    try {
      const rateRes = await fetch(
        `https://api.currencybeacon.com/v1/latest?base=USD`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CURRENCY_BEACON_API_KEY}`,
          },
          next: { revalidate: 3600 },
        },
      );

      if (rateRes.ok) {
        const rateData = await rateRes.json();
        exchangeRates = rateData.rates;
      } else {
        console.warn(
          "Failed to fetch CurrencyBeacon rates, falling back to 1:1",
        );
      }
    } catch (error) {
      console.error("Exchange rate fetch error:", error);
    }

    let universalTotalUsd = 0;
    let universalBalanceDueUsd = 0;
    let universalAmountPaidUsd = 0;

    const totalsByCurrency = groupedInvoices.map((group) => {
      const curr = group.currency;
      const totalAmount = group._sum.totalAmount || 0;
      const amountPaid = group._sum.amountPaid || 0;
      const balanceDue = group._sum.balanceDue || 0;

      const rate = exchangeRates[curr] || 1;

      const totalInUsd = curr === "USD" ? totalAmount : totalAmount / rate;
      const paidInUsd = curr === "USD" ? amountPaid : amountPaid / rate;
      const balanceInUsd = curr === "USD" ? balanceDue : balanceDue / rate;

      universalTotalUsd += totalInUsd;
      universalAmountPaidUsd += paidInUsd;
      universalBalanceDueUsd += balanceInUsd;

      return {
        currency: curr,
        totalAmount,
        amountPaid,
        balanceDue,
      };
    });

    const totalInvoicesCount = await prisma.invoice.count({
      where: { userId },
    });
    const totalCustomersCount = await prisma.customer.count({
      where: { userId },
    });

    const recentInvoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { invoiceDate: "desc" },
      take: 5,
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      totalsByCurrency,
      universalTotals: {
        currency: "USD",
        totalAmount: universalTotalUsd,
        amountPaid: universalAmountPaidUsd,
        balanceDue: universalBalanceDueUsd,
      },
      counts: {
        invoices: totalInvoicesCount,
        customers: totalCustomersCount,
      },
      recentInvoices,
    });
  } catch (error) {
    console.error("Analytics engine error:", error);
    return NextResponse.json(
      { error: "Failed to generate analytics" },
      { status: 500 },
    );
  }
}
