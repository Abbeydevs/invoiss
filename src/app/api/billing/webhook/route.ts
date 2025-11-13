import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("nomba-signature");
    const timestamp = request.headers.get("nomba-timestamp");

    const rawBody = await request.text();

    console.log("--- WEBHOOK POST RECEIVED ---");
    console.log("Header Signature:", signature);
    console.log("Header Timestamp:", timestamp);
    console.log("Raw Body Payload:", rawBody);

    if (!signature || !timestamp) {
      console.error("Webhook Error: Missing Nomba headers");
      return NextResponse.json({ error: "Missing headers" }, { status: 401 });
    }

    const payload = await request.json();

    const isValid = verifyWebhookSignature(payload, signature, timestamp);

    console.log("Signature Valid?", isValid);

    if (!isValid) {
      console.error("Webhook Error: Invalid signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (
      payload.event_type === "payment_success" ||
      payload.event_type === "checkout.successful"
    ) {
      const orderReference =
        payload.data?.transaction?.merchantReference ||
        payload.data?.transaction?.orderReference ||
        payload.data?.orderReference;

      console.log("Processing Order Ref:", orderReference);

      if (orderReference) {
        const parts = orderReference.split("-");
        if (parts[0] === "SUB" && parts[1]) {
          const userId = parts[1];

          await prisma.user.update({
            where: { id: userId },
            data: {
              planType: "PRO",
              subscriptionEndsAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ),
            },
          });
          console.log(`SUCCESS: User ${userId} upgraded via Webhook`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook POST error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
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
