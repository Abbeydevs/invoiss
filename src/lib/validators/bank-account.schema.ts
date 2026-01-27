import { z } from "zod";

export const bankAccountSchema = z
  .object({
    bankName: z.string().min(2, "Bank name is required"),
    accountNumber: z
      .string()
      .min(5, "Account number is required")
      .max(34, "Account number too long"),
    accountName: z.string().min(2, "Account name is required"),
    isDefault: z.boolean().optional(),

    isManual: z.boolean(),
    currency: z.string(),
    swiftCode: z.string().optional(),
    iban: z.string().optional(),
    routingNumber: z.string().optional(),
    sortCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.isManual) {
        return /^\d{10}$/.test(data.accountNumber);
      }
      return true;
    },
    {
      message: "Nigerian account numbers must be exactly 10 digits",
      path: ["accountNumber"],
    },
  );

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
