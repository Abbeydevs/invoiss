"use server";

import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/mail";
import { ResetPasswordTemplate } from "@/components/email/ResetPasswordTemplate";
import { hash } from "bcryptjs";

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: true };
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your Invoiss Password",
    react: <ResetPasswordTemplate resetLink={resetLink} userEmail={email} />,
  });

  return { success: true };
}

export async function resetPassword(token: string, newPassword: string) {
  const resetRequest = await prisma.passwordReset.findFirst({
    where: { token },
    include: { user: true },
  });

  if (!resetRequest) {
    throw new Error("Invalid or expired reset token.");
  }

  if (new Date() > resetRequest.expiresAt) {
    await prisma.passwordReset.delete({ where: { id: resetRequest.id } });
    throw new Error("This link has expired. Please request a new one.");
  }

  const hashedPassword = await hash(newPassword, 12);

  await prisma.user.update({
    where: { id: resetRequest.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordReset.delete({
    where: { id: resetRequest.id },
  });

  return { success: true };
}
