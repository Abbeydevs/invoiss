/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifyWebhookSignature(
  payload: any,
  signature: string,
  timestamp: string
): boolean {
  const secret =
    process.env.NOMBA_WEBHOOK_SECRET || process.env.NOMBA_PRIVATE_KEY;
  if (!secret) return false;

  const eventType = payload.event_type;
  const requestId = payload.requestId;

  const userId = payload.data?.merchant?.userId || "";
  const walletId = payload.data?.merchant?.walletId || "";
  const transactionId = payload.data?.transaction?.transactionId || "";
  const type = payload.data?.transaction?.type || "";
  const time = payload.data?.transaction?.time || "";
  const responseCode = payload.data?.transaction?.responseCode || "";

  const stringToSign = `${eventType}:${requestId}:${userId}:${walletId}:${transactionId}:${type}:${time}:${responseCode}:${timestamp}`;

  console.log("Constructed String to Sign:", stringToSign);

  const hash = crypto
    .createHmac("sha256", secret)
    .update(stringToSign)
    .digest("base64");

  console.log("Calculated Hash:", hash);
  console.log("Nomba Signature:", signature);

  return hash === signature;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("nomba-signature");
    const timestamp = request.headers.get("nomba-timestamp");
    const rawBody = await request.text();

    console.log("--- WEBHOOK POST RECEIVED ---");
    console.log("Signature:", signature);

    if (!signature || !timestamp || !rawBody || rawBody === "{}") {
      console.warn(
        "⚠️ Empty or missing payload. Assuming Dashboard Test Ping. Returning 200 OK."
      );
      return NextResponse.json({ received: true, note: "handshake_accepted" });
    }

    const payload = JSON.parse(rawBody);

    const isValid = verifyWebhookSignature(payload, signature, timestamp);

    if (!isValid) {
      console.error("❌ Webhook Error: Invalid signature.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    console.log("✅ Signature Verified. Processing Event:", payload.event_type);

    if (payload.event_type === "payment_success") {
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
    return NextResponse.json({ received: true, note: "error_caught" });
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
