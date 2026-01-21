"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function BlankPreview({ invoice }: InvoicePreviewProps) {
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
    <div
      className="bg-white p-12 w-full mx-auto"
      style={{ minHeight: "297mm" }}
    >
      <div className="mb-6">
        {profile?.logoUrl && (
          <div className="relative w-[120px] h-[60px] mb-2">
            <Image
              src={profile.logoUrl}
              alt={profile.businessName || "Logo"}
              fill
              className="object-contain object-left"
              unoptimized
            />
          </div>
        )}
        {profile?.businessName && (
          <p className="text-base font-normal text-black mb-1">
            {profile.businessName}
          </p>
        )}
        {profile?.address && (
          <p className="text-sm text-black">{profile.address}</p>
        )}
        {profile?.phone && (
          <p className="text-sm text-black">{profile.phone}</p>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-normal text-black mb-1">INVOICE</h1>
        <p className="text-sm text-black">
          Invoice Number: {invoice.invoiceNumber}
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm font-normal text-black mb-1">Bill To:</p>
        <p className="text-sm text-black">
          {customer?.name || invoice.billToName}
        </p>
        <p className="text-sm text-black">
          {customer?.email || invoice.billToEmail}
        </p>
        {(customer?.phone || invoice.billToPhone) && (
          <p className="text-sm text-black">
            {customer?.phone || invoice.billToPhone}
          </p>
        )}
        {(customer?.address || invoice.billToAddress) && (
          <p className="text-sm text-black">
            {customer?.address || invoice.billToAddress}
          </p>
        )}
      </div>

      <div className="mb-6">
        <p className="text-sm text-black">
          Invoice Date: {format(new Date(invoice.invoiceDate), "MMMM d, yyyy")}
        </p>
        <p className="text-sm text-black">
          Due Date: {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
        </p>
      </div>

      <div className="mb-6">
        <table className="w-full border-collapse border border-black">
          <thead>
            <tr>
              <th className="border border-black p-2 text-left text-sm font-normal">
                Description
              </th>
              <th className="border border-black p-2 text-left text-sm font-normal">
                Quantity
              </th>
              <th className="border border-black p-2 text-left text-sm font-normal">
                Unit Price
              </th>
              <th className="border border-black p-2 text-left text-sm font-normal">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-sm">
                  {item.description}
                </td>
                <td className="border border-black p-2 text-sm">
                  {item.quantity}
                </td>
                <td className="border border-black p-2 text-sm">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="border border-black p-2 text-sm">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6 ml-auto" style={{ width: "300px" }}>
        <div className="flex justify-between mb-1">
          <p className="text-sm text-black">Subtotal:</p>
          <p className="text-sm text-black">
            {formatCurrency(invoice.subtotal)}
          </p>
        </div>

        {invoice.taxAmount && invoice.taxAmount > 0 && (
          <div className="flex justify-between mb-1">
            <p className="text-sm text-black">Tax ({invoice.taxRate}%):</p>
            <p className="text-sm text-black">
              {formatCurrency(invoice.taxAmount)}
            </p>
          </div>
        )}

        {invoice.discountAmount && invoice.discountAmount > 0 && (
          <div className="flex justify-between mb-1">
            <p className="text-sm text-black">Discount:</p>
            <p className="text-sm text-black">
              -{formatCurrency(invoice.discountAmount)}
            </p>
          </div>
        )}

        <div className="flex justify-between mb-1 pt-2 border-t border-black">
          <p className="text-sm font-normal text-black">Total:</p>
          <p className="text-sm font-normal text-black">
            {formatCurrency(invoice.totalAmount)}
          </p>
        </div>

        <div className="flex justify-between mb-1">
          <p className="text-sm font-normal text-black">Amount Due:</p>
          <p className="text-sm font-normal text-black">
            {formatCurrency(invoice.balanceDue)}
          </p>
        </div>
      </div>

      {bankAccount && (
        <div className="mb-6">
          <p className="text-sm font-normal text-black mb-1">
            Payment Details:
          </p>
          <p className="text-sm text-black">Bank: {bankAccount.bankName}</p>
          <p className="text-sm text-black">
            Account Number: {bankAccount.accountNumber}
          </p>
          <p className="text-sm text-black">
            Account Name: {bankAccount.accountName}
          </p>
        </div>
      )}

      {invoice.hasPaymentSchedule &&
        invoice.paymentMilestones &&
        invoice.paymentMilestones.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-normal text-black mb-2">
              Payment Schedule:
            </p>
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-left text-sm font-normal">
                    Milestone
                  </th>
                  <th className="border border-black p-2 text-left text-sm font-normal">
                    Due Date
                  </th>
                  <th className="border border-black p-2 text-left text-sm font-normal">
                    Amount
                  </th>
                  <th className="border border-black p-2 text-left text-sm font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.paymentMilestones.map((m) => (
                  <tr key={m.id}>
                    <td className="border border-black p-2 text-sm">
                      {m.name}
                    </td>
                    <td className="border border-black p-2 text-sm">
                      {format(new Date(m.dueDate), "MMMM d, yyyy")}
                    </td>
                    <td className="border border-black p-2 text-sm">
                      {formatCurrency(m.amount)}
                    </td>
                    <td className="border border-black p-2 text-sm">
                      {m.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {invoice.paymentTerms && (
        <div className="mb-6">
          <p className="text-sm font-normal text-black mb-1">Payment Terms:</p>
          <p className="text-sm text-black">{invoice.paymentTerms}</p>
        </div>
      )}

      {invoice.notes && (
        <div className="mb-6">
          <p className="text-sm font-normal text-black mb-1">Notes:</p>
          <p className="text-sm text-black">{invoice.notes}</p>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-black">
        <p className="text-sm text-black text-center">
          Thank you for your business!
        </p>
      </div>
    </div>
  );
}
