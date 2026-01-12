import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransactionViaApi } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderReference = searchParams.get("orderReference");
    const orderId = searchParams.get("orderId");

    console.log("--- CALLBACK START ---");
    console.log(`Ref: ${orderReference}, ID: ${orderId}`);

    if (!orderReference) {
      return NextResponse.redirect(new URL("/dashboard/billing", request.url));
    }

    let transactionData = await verifyTransactionViaApi(
      orderReference,
      "orderReference"
    );

    if (!transactionData && orderId) {
      console.log("Ref verification failed. Retrying with Order ID...");
      transactionData = await verifyTransactionViaApi(orderId, "orderId");
    }

    if (!transactionData) {
      console.error("Verification failed completely.");
      return NextResponse.redirect(
        new URL("/dashboard/billing?payment=failed", request.url)
      );
    }

    const status = transactionData.status?.toString().toUpperCase();

    if (["SUCCESS", "SUCCESSFUL"].includes(status)) {
      const parts = orderReference.split("-");

      if (parts[0] === "SUB" && parts[1]) {
        const userId = parts[1];
        const amountPaid = parseFloat(transactionData.amount);
        const isYearly = amountPaid > 50000;
        const daysToAdd = isYearly ? 365 : 30;
        const billingCycle = isYearly ? "YEARLY" : "MONTHLY";

        await prisma.user.update({
          where: { id: userId },
          data: {
            planType: "PRO",
            billingCycle: billingCycle,
            subscriptionEndsAt: new Date(
              Date.now() + daysToAdd * 24 * 60 * 60 * 1000
            ),
          },
        });

        console.log(`SUCCESS: User ${userId} upgraded to ${billingCycle}`);
        return NextResponse.redirect(
          new URL("/dashboard/billing/success", request.url)
        );
      }
    }

    return NextResponse.redirect(
      new URL("/dashboard/billing/failed", request.url)
    );
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/billing/failed", request.url)
    );
  }
}
