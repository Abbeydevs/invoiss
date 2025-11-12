import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-nomba-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawBody = await request.text();

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("Webhook: Invalid signature attempt");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    console.log(`Webhook Received: ${eventType}`);

    if (eventType === "checkout.successful" || eventType === "charge.success") {
      const orderReference = payload.data.orderReference;

      if (orderReference) {
        const parts = orderReference.split("-");
        const userId = parts[1];

        if (userId) {
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
