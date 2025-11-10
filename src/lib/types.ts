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
    name: string;
  } | null;
};
