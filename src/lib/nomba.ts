import { z } from "zod";

export async function getNombaAccessToken() {
  console.log("--- DEBUGGING NOMBA AUTH ---");
  console.log("Raw ENV NOMBA_BASE_URL:", process.env.NOMBA_BASE_URL);
  console.log("Raw ENV NOMBA_CLIENT_ID:", process.env.NOMBA_CLIENT_ID);
  console.log("Raw ENV HAS_PRIVATE_KEY:", !!process.env.NOMBA_PRIVATE_KEY);
  console.log("Raw ENV NOMBA_ACCOUNT_ID:", process.env.NOMBA_ACCOUNT_ID);

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
