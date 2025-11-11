"use client";

import { InvoiceDetail } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const profile = invoice.profile;
  const customer = invoice.customer;
  const bankAccount = invoice.bankAccount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <Card className="border-0 shadow-lg max-w-4xl mx-auto">
      <CardContent className="p-8 md:p-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            {profile?.logoUrl ? (
              <Image
                src={profile.logoUrl}
                alt={profile.businessName || "Logo"}
                width={140}
                height={70}
                className="object-contain"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <p className="text-sm text-gray-500 mt-2">{profile?.address}</p>
            <p className="text-sm text-gray-500">{profile?.phone}</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 uppercase">
              Invoice
            </h1>
            <p className="text-gray-500 mt-1">{invoice.invoiceNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <p className="font-semibold text-gray-500 text-sm uppercase mb-2">
              Bill To
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              {customer?.name || invoice.billToName}
            </h3>
            <p className="text-gray-600">
              {customer?.email || invoice.billToEmail}
            </p>
            <p className="text-gray-600">
              {customer?.phone || invoice.billToPhone}
            </p>
            <p className="text-gray-600">
              {customer?.address || invoice.billToAddress}
            </p>
          </div>
          <div className="text-right">
            <div className="mb-4">
              <p className="font-semibold text-gray-500 text-sm">
                Invoice Date
              </p>
              <p className="text-gray-800 font-medium">
                {format(new Date(invoice.invoiceDate), "MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 text-sm">Due Date</p>
              <p className="text-gray-800 font-medium">
                {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Items Table */}
        <div className="mb-8">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold text-center">Qty</th>
                <th className="p-3 font-semibold text-right">Unit Price</th>
                <th className="p-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="p-3 text-gray-800">{item.description}</td>
                  <td className="p-3 text-gray-600 text-center">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-gray-600 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="p-3 text-gray-800 font-semibold text-right">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Totals and Bank Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {invoice.notes && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Notes</h4>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}
            {invoice.paymentTerms && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Payment Terms
                </h4>
                <p className="text-sm text-gray-600">{invoice.paymentTerms}</p>
              </div>
            )}
            {bankAccount && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Payment Details
                </h4>
                <p className="text-sm text-gray-600">
                  {bankAccount.bankName}: {bankAccount.accountNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {bankAccount.accountName}
                </p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxAmount && invoice.taxAmount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Tax ({invoice.taxRate}%)</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            {invoice.discountAmount && invoice.discountAmount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Discount</span>
                <span className="text-red-600">
                  -{formatCurrency(invoice.discountAmount)}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-700">
              <span>Amount Due</span>
              <span>{formatCurrency(invoice.balanceDue)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
