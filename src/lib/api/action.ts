"use client";

import { Customer, BankAccount } from "@/lib/types";
import { CustomerFormValues } from "@/lib/validators/customer.schema";

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch("/api/customers");
  if (!response.ok) throw new Error("Failed to fetch customers");
  return (await response.json()).customers;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  const response = await fetch("/api/bank-accounts");
  if (!response.ok) throw new Error("Failed to fetch bank accounts");
  return (await response.json()).bankAccounts;
}

export async function createCustomer(
  values: CustomerFormValues
): Promise<{ customer: Customer }> {
  const response = await fetch("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create customer");
  }
  return response.json();
}
