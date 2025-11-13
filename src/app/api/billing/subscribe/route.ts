import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNombaAccessToken } from "@/lib/nomba";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const interval = body.interval || "MONTHLY";

    const amount = interval === "YEARLY" ? "55000.00" : "5000.00";
    const description = `Invoiss Pro Subscription (${interval === "YEARLY" ? "Yearly" : "Monthly"})`;

    const accessToken = await getNombaAccessToken();
    const accountId = process.env.NOMBA_ACCOUNT_ID;
    const baseUrl = process.env.NOMBA_BASE_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!accountId || !baseUrl || !appUrl) {
      throw new Error("Missing environment variables");
    }

    const orderReference = `SUB-${session.user.id}-${Date.now()}`;

    const response = await fetch(`${baseUrl}/v1/checkout/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccountId: accountId,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        order: {
          orderReference: orderReference,
          customerEmail: session.user.email,
          currency: "NGN",
          amount: amount,
          callbackUrl: `${appUrl}/api/billing/webhook`,
          redirectUrl: `${appUrl}/dashboard/billing?success=true`,
          description: description,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nomba checkout error:", errorText);
      throw new Error("Failed to initialize payment with Nomba");
    }

    const data = await response.json();

    return NextResponse.json({
      checkoutUrl: data.data.checkoutLink,
    });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to start subscription" },
      { status: 500 }
    );
  }
}
