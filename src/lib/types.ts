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
