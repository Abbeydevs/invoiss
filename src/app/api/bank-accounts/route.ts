import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { bankAccountSchema } from "@/lib/validators/bank-account.schema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bankAccountSchema.parse(body);

    if (session.user.planType === "BASIC") {
      const existingAccountCount = await prisma.bankAccount.count({
        where: { userId: session.user.id },
      });

      if (existingAccountCount >= 1) {
        return NextResponse.json(
          {
            error:
              "Basic plan allows only 1 bank account. Upgrade to Pro for unlimited accounts.",
          },
          { status: 403 },
        );
      }
    }

    if (validatedData.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAccount = await prisma.bankAccount.create({
      data: {
        userId: session.user.id,
        bankName: validatedData.bankName,
        accountNumber: validatedData.accountNumber,
        accountName: validatedData.accountName,
        isDefault: validatedData.isDefault,
        isManual: validatedData.isManual,
        currency: validatedData.currency,
        swiftCode: validatedData.swiftCode,
        iban: validatedData.iban,
        routingNumber: validatedData.routingNumber,
        sortCode: validatedData.sortCode,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Bank account added successfully",
        account: newAccount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create bank account error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to add bank account" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bankAccounts });
  } catch (error) {
    console.error("Get bank accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank accounts" },
      { status: 500 },
    );
  }
}
