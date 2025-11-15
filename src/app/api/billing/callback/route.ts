import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransactionViaApi } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderReference = searchParams.get("orderReference");

    console.log("--- PAYMENT CALLBACK TRIGGERED ---");
    console.log("Ref:", orderReference);

    if (!orderReference) {
      return NextResponse.redirect(new URL("/dashboard/billing", request.url));
    }

    let transactionData = await verifyTransactionViaApi(
      orderReference,
      "orderReference"
    );

    if (!transactionData) {
      console.log("Verification with Ref failed. Trying Order ID...");
      transactionData = await verifyTransactionViaApi("orderReference");
    }

    if (!transactionData) {
      console.error("Verification failed completely.");
      return NextResponse.redirect(
        new URL("/dashboard/billing?payment=failed", request.url)
      );
    }

    if (transactionData.status === "SUCCESS") {
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
      new URL("/dashboard/billing?payment=failed", request.url)
    );
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard/billing?error=true", request.url)
    );
  }
}
