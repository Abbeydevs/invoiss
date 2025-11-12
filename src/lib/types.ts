export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
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
