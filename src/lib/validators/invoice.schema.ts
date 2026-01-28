import { z } from "zod";

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
});

export const milestoneSchema = z.object({
  name: z.string().min(1, "Milestone name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  percentage: z.number().optional().nullable(),
  dueDate: z.date(),
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
  templateId: z.string().min(1, "A template is required"),
  hasPaymentSchedule: z.boolean().optional(),
  milestones: z.array(milestoneSchema).optional(),
  subtotal: z.number().optional(),
  taxAmount: z.number().optional(),
  discountAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  balanceDue: z.number().optional(),
});

export const invoiceApiSchema = invoiceSchema.extend({
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  milestones: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
        percentage: z.number().optional().nullable(),
        dueDate: z.coerce.date(),
      }),
    )
    .optional(),
  status: z
    .enum([
      "DRAFT",
      "SENT",
      "PAID",
      "OVERDUE",
      "CANCELLED",
      "VIEWED",
      "UNPAID",
      "PARTIALLY_PAID",
    ])
    .optional(),
});

export const updateInvoiceApiSchema = invoiceApiSchema.partial();
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type PaymentMilestoneValues = z.infer<typeof milestoneSchema>;
