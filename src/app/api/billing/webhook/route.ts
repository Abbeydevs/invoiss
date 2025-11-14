import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTransactionViaApi } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);

    console.log("--- WEBHOOK TRIGGERED ---");

    const orderReference =
      payload.data?.transaction?.merchantReference ||
      payload.data?.transaction?.orderReference ||
      payload.data?.orderReference;

    if (!orderReference) {
      return NextResponse.json({ received: true, note: "no_reference" });
    }

    const transactionData = await verifyTransactionViaApi(orderReference);

    if (!transactionData) {
      console.error(
        "❌ Fake or Failed Transaction detected for ref:",
        orderReference
      );
      return NextResponse.json({ received: true, note: "verification_failed" });
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
        console.log(`SUCCESS: User ${userId} upgraded via API Verification`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderReference = searchParams.get("orderReference");

  if (orderReference) {
    return NextResponse.redirect(
      new URL("/dashboard/billing?payment=success", request.url)
    );
  }

  return NextResponse.redirect(new URL("/dashboard/billing", request.url));
}
