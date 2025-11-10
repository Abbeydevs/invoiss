"use client";

import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  customerId: z.string().optional(),
  billToName: z.string().min(2, "Customer name is required"),
  billToEmail: z.string().email("Valid email is required"),
  billToPhone: z.string().optional(),
  billToAddress: z.string().optional(),
  invoiceDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  taxRate: z.number().min(0).max(100).optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().min(0).optional(),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
  bankAccountId: z.string().min(1, "Bank account is required"),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
