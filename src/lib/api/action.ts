/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Customer,
  BankAccount,
  Invoice,
  Template,
  InvoiceDetail,
} from "@/lib/types";
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

export async function getInvoices(): Promise<Invoice[]> {
  const response = await fetch("/api/invoices");
  if (!response.ok) throw new Error("Failed to fetch invoices");
  const data = await response.json();
  return data.invoices;
}

export async function getTemplates(): Promise<{
  defaultTemplates: Template[];
  customTemplates: Template[];
}> {
  const response = await fetch("/api/templates");
  if (!response.ok) throw new Error("Failed to fetch templates");
  return response.json();
}

export async function getInvoiceById(id: string): Promise<InvoiceDetail> {
  const response = await fetch(`/api/invoices/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch invoice details");
  }
  return response.json();
}

export async function deleteInvoice(id: string): Promise<any> {
  const response = await fetch(`/api/invoices/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete invoice");
  }
  return response.json();
}
