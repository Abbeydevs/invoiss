import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL;

if (!fromEmail) {
  console.warn("RESEND_FROM_EMAIL is not set in .env");
}

type SendEmailProps = {
  to: string;
  subject: string;
  react: React.ReactElement;
  senderName?: string;
};

export async function sendEmail({
  to,
  subject,
  react,
  senderName,
}: SendEmailProps) {
  const fromName = senderName || "Invoiss";

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      react,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email System Error:", error);
    return { success: false, error };
  }
}
