import { z } from "zod";
import crypto from "crypto";

export async function getNombaAccessToken() {
  const url = `${process.env.NOMBA_BASE_URL}/v1/auth/token/issue`;

  console.log("Trying to fetch this URL:", url);

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
    console.error("Missing one or more Nomba environment variables");
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
      console.error("Failed to get Nomba token:", await response.text());
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
  payload: string,
  signature: string
): boolean {
  const privateKey = process.env.NOMBA_PRIVATE_KEY;
  if (!privateKey) return false;

  const hash = crypto
    .createHmac("sha512", privateKey)
    .update(payload)
    .digest("hex");

  return hash === signature;
}
