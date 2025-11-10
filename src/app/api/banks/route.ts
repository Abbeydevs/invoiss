import { NextResponse } from "next/server";
import { getNombaAccessToken } from "@/lib/nomba";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accessToken = await getNombaAccessToken();

    const accountId = process.env.NOMBA_ACCOUNT_ID;
    const baseUrl = process.env.NOMBA_BASE_URL;

    if (!accountId || !baseUrl) {
      throw new Error("Missing Nomba accountId or baseUrl");
    }

    const banksUrl = `${baseUrl}/v1/transfers/banks`;

    const banksResponse = await fetch(banksUrl, {
      method: "GET",
      headers: {
        accountId: accountId,
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!banksResponse.ok) {
      console.error("Failed to get Nomba banks:", await banksResponse.text());
      throw new Error("Could not fetch bank list from Nomba");
    }

    const data = await banksResponse.json();

    if (data && data.data && Array.isArray(data.data)) {
      return NextResponse.json(data.data);
    }

    console.error("Bank list response structure not recognized:", data);
    throw new Error("Bank list response structure not recognized.");
  } catch (error) {
    console.error("API /banks error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
