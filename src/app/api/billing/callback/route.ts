// src/app/api/billing/callback/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransactionViaApi } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderReference = searchParams.get("orderReference");

    if (!orderReference) {
      return NextResponse.redirect(new URL("/dashboard/billing", request.url));
    }

    console.log("--- PAYMENT CALLBACK TRIGGERED ---");
    console.log("Ref:", orderReference);

    const transactionData = await verifyTransactionViaApi(orderReference);

    if (!transactionData) {
      console.error("❌ Verification failed for ref:", orderReference);
      return NextResponse.redirect(
        new URL("/dashboard/billing?payment=failed", request.url)
      );
    }

    if (transactionData.status === "SUCCESS") {
      const parts = orderReference.split("-");

      if (parts[0] === "SUB" && parts[1]) {
        const userId = parts[1];

        await prisma.user.update({
          where: { id: userId },
          data: {
            planType: "PRO",
            subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        console.log(`SUCCESS: User ${userId} upgraded via Callback`);

        return NextResponse.redirect(
          new URL("/dashboard/billing?payment=success", request.url)
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
