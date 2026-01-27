import { InvoicePayment } from "@prisma/client";

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  isManual: boolean;
  currency: string;
  swiftCode?: string | null;
  iban?: string | null;
  routingNumber?: string | null;
  sortCode?: string | null;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
};

export type Profile = {
  id: string;
  userId: string;
  businessName: string | null;
  logoUrl: string | null;
  address: string | null;
  phone: string | null;
  subscriptionEndsAt?: string | null;
  billingCycle?: string | null;
  trialEndsAt?: string | null;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status:
    | "DRAFT"
    | "SENT"
    | "VIEWED"
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "OVERDUE"
    | "CANCELLED";
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  } | null;
  billToName: string;
  billToEmail: string;
  billToPhone: string | null;
  billToAddress: string | null;
};

export type Template = {
  id: string;
  name: string;
  isPremium: boolean;
  thumbnail?: string | null;
};

export type PaymentMilestone = {
  id: string;
  name: string;
  amount: number;
  percentage: number | null;
  dueDate: string;
  status: "PENDING" | "PAID";
};

export type InvoiceDetail = Invoice & {
  items: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  bankAccount: BankAccount | null;
  template: Template | null;
  profile: {
    businessName: string | null;
    logoUrl: string | null;
    address: string | null;
    phone: string | null;
  } | null;
  payments: InvoicePayment[];
  paymentMilestones: PaymentMilestone[];
  hasPaymentSchedule: boolean;
  subtotal: number;
  taxAmount: number | null;
  discountAmount: number | null;
  balanceDue: number;
  notes: string | null;
  paymentTerms: string | null;
  taxRate: number | null;
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number | null;
};

export type DashboardStats = {
  totalInvoices: number;
  totalCustomers: number;
  totalRevenue: number;
  totalPending: number;
  recentInvoices: Invoice[];
};

export type WalletTransaction = {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  description: string;
  reference?: string | null;
  createdAt: string;
};

export type Wallet = {
  id: string;
  balance: number;
  totalReceived: number;
  totalPending: number;
  transactions: WalletTransaction[];
};
