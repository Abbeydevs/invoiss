/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import crypto from "crypto";

interface NombaWebhookPayload {
  event_type: string;
  requestId: string;
  data: {
    merchant: {
      userId: string;
      walletId: string;
      walletBalance?: number;
    };
    transaction: {
      transactionId: string;
      type: string;
      time: string;
      responseCode: string;
      sessionID?: string;
      amount?: number;
      merchantReference?: string;
      orderReference?: string;
    };
  };
}

export async function getNombaAccessToken() {
  const url = `${process.env.NOMBA_BASE_URL}/v1/auth/token/issue`;

  const clientId = process.env.NOMBA_CLIENT_ID;
  const clientSecret = process.env.NOMBA_PRIVATE_KEY;
  const accountId = process.env.NOMBA_ACCOUNT_ID;

  if (
    !url ||
    !clientId ||
    !clientSecret ||
    !accountId ||
    !process.env.NOMBA_BASE_URL
  ) {
    throw new Error("Missing Nomba environment variables for auth");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccountId: accountId,
      },
      cache: "no-store",
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error("Could not authenticate with Nomba");
    }

    const data = await response.json();
    return data.data.access_token as string;
  } catch (error) {
    console.error("Error fetching Nomba token:", error);
    throw new Error("Could not authenticate with Nomba");
  }
}

export const bankSchema = z.object({
  code: z.string(),
  name: z.string(),
});
export type Bank = z.infer<typeof bankSchema>;

export const verifyAccountSchema = z.object({
  bankCode: z.string(),
  accountNumber: z.string().length(10),
});
export type VerifyAccountPayload = z.infer<typeof verifyAccountSchema>;

export function verifyWebhookSignature(
  payload: NombaWebhookPayload,
  signature: string,
  timestamp: string
): boolean {
  const secret =
    process.env.NOMBA_WEBHOOK_SECRET || process.env.NOMBA_PRIVATE_KEY;
  if (!secret) return false;

  const eventType = payload.event_type;
  const requestId = payload.requestId;
  const userId = payload.data?.merchant?.userId;
  const walletId = payload.data?.merchant?.walletId;
  const transactionId = payload.data?.transaction?.transactionId;
  const type = payload.data?.transaction?.type;
  const time = payload.data?.transaction?.time;
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

export async function verifyTransactionViaApi(
  reference: string,
  type: "orderReference" | "transactionId" | "orderId" = "orderReference"
) {
  const accessToken = await getNombaAccessToken();
  const accountId = process.env.NOMBA_ACCOUNT_ID;
  const baseUrl = process.env.NOMBA_BASE_URL;

  if (!accountId || !baseUrl) throw new Error("Missing env vars");

  const url = `${baseUrl}/v1/transactions/accounts/single?${type}=${reference}`;

  console.log(`Verifying via API: ${url}`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      accountId: accountId,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Nomba Verify API Error:", errorText);
    return null;
  }

  const data = await response.json();

  const description = data.description?.toUpperCase() || "";
  const isSuccessCode = data.code === "00";
  const isSuccessDesc = ["SUCCESS", "SUCCESSFUL"].includes(description);

  if (isSuccessCode && isSuccessDesc) {
    if (Array.isArray(data.data?.results) && data.data.results.length > 0) {
      const transaction = data.data.results.find((tx: any) =>
        ["SUCCESS", "SUCCESSFUL"].includes(tx.status?.toUpperCase())
      );

      if (transaction) return transaction;
    }

    if (data.data && !Array.isArray(data.data)) {
      const status = data.data.status?.toUpperCase() || "";
      if (
        ["SUCCESS", "SUCCESSFUL", "TRUE"].includes(status) ||
        data.data.status === true
      ) {
        return data.data;
      }
    }
  }

  console.log("Transaction validation failed or status was not SUCCESS");
  return null;
}
