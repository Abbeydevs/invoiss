import { NextResponse } from "next/server";
import { getNombaAccessToken, verifyAccountSchema } from "@/lib/nomba";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = verifyAccountSchema.parse(body);

    const accessToken = await getNombaAccessToken();

    const accountId = process.env.NOMBA_ACCOUNT_ID;
    const baseUrl = process.env.NOMBA_BASE_URL;

    if (!accountId || !baseUrl) {
      throw new Error("Missing Nomba accountId or baseUrl");
    }

    const verifyUrl = `${baseUrl}/v1/transfers/bank/lookup`;

    const nombaResponse = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccountId: accountId,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        bankCode: validatedData.bankCode,
        accountNumber: validatedData.accountNumber,
      }),
    });

    if (!nombaResponse.ok) {
      const errorText = await nombaResponse.text();
      console.error("Nomba verify error:", errorText);

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.description || "Invalid account details");
      } catch (parseError) {
        console.error("Error parsing Nomba error response:", parseError);
        throw new Error(errorText || "Invalid account details");
      }
    }

    const data = await nombaResponse.json();

    if (data && data.data && data.data.accountName) {
      return NextResponse.json({
        accountName: data.data.accountName,
      });
    }

    throw new Error("Account verified, but response format was unexpected.");
  } catch (error) {
    console.error("API /banks/verify error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
