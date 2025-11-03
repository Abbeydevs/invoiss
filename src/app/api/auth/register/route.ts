import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z.enum(["INDIVIDUAL", "COMPANY"]),
  businessName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        accountType: validatedData.accountType,
        planType: "BASIC",
        profile: {
          create: {
            businessName: validatedData.businessName,
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
