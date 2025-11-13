"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function ClassicPreview({ invoice }: InvoicePreviewProps) {
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
    <div className="min-h-[1000px] bg-white p-12">
      <div className="h-2 bg-linear-to-r from-slate-700 via-slate-600 to-slate-700 -mx-12 -mt-12 mb-10"></div>

      <div className="flex justify-between items-start mb-10">
        <div className="space-y-3">
          {profile?.logoUrl ? (
            <div className="relative w-[140px] h-[70px]">
              <Image
                src={profile.logoUrl}
                alt={profile.businessName || "Logo"}
                fill
                className="object-contain object-left"
              />
            </div>
          ) : (
            <h2 className="text-2xl font-bold text-slate-800">
              {profile?.businessName || "Your Company"}
            </h2>
          )}
          <div className="text-sm text-slate-600 space-y-0.5">
            <p className="font-medium">{profile?.address}</p>
            <p>{profile?.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            INVOICE
          </h1>
          <div className="mt-3 inline-block bg-slate-100 px-4 py-2 rounded-lg">
            <p className="text-xs text-slate-500 font-medium">Invoice Number</p>
            <p className="text-slate-800 font-bold text-lg">
              {invoice.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Bill To
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {customer?.name || invoice.billToName}
          </h3>
          <div className="space-y-1 text-sm text-slate-600">
            <p>{customer?.email || invoice.billToEmail}</p>
            <p>{customer?.phone || invoice.billToPhone}</p>
            <p>{customer?.address || invoice.billToAddress}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Invoice Date
            </p>
            <p className="text-slate-900 font-semibold text-lg mt-1">
              {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Due Date
            </p>
            <p className="text-amber-900 font-semibold text-lg mt-1">
              {format(new Date(invoice.dueDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex bg-slate-800 text-white rounded-t-lg py-3 px-4">
          <div className="w-[50%] font-bold text-sm uppercase tracking-wider">
            Description
          </div>
          <div className="w-[15%] font-bold text-sm uppercase tracking-wider text-center">
            Qty
          </div>
          <div className="w-[17.5%] font-bold text-sm uppercase tracking-wider text-right">
            Unit Price
          </div>
          <div className="w-[17.5%] font-bold text-sm uppercase tracking-wider text-right">
            Amount
          </div>
        </div>

        {invoice.items.map((item, index) => (
          <div
            key={item.id}
            className={`flex border-b border-slate-200 py-4 px-4 ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
          >
            <div className="w-[50%] text-slate-800 font-medium">
              {item.description}
            </div>
            <div className="w-[15%] text-slate-600 text-center font-semibold">
              {item.quantity}
            </div>
            <div className="w-[17.5%] text-slate-600 text-right">
              {formatCurrency(item.unitPrice)}
            </div>
            <div className="w-[17.5%] text-slate-900 font-bold text-right">
              {formatCurrency(item.amount)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          {invoice.notes && (
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wider">
                Notes
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
          {invoice.paymentTerms && (
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">
                Payment Terms
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {invoice.paymentTerms}
              </p>
            </div>
          )}
          {bankAccount && (
            <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-2 text-sm uppercase tracking-wider">
                Payment Details
              </h4>
              <div className="text-sm text-emerald-800 space-y-1">
                <p className="font-semibold">{bankAccount.bankName}</p>
                <p>{bankAccount.accountNumber}</p>
                <p>{bankAccount.accountName}</p>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-3">
            <div className="flex justify-between text-slate-700">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>

            {invoice.taxAmount && invoice.taxAmount > 0 && (
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Tax ({invoice.taxRate}%)</span>
                <span className="font-semibold">
                  {formatCurrency(invoice.taxAmount)}
                </span>
              </div>
            )}

            {invoice.discountAmount && invoice.discountAmount > 0 && (
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">Discount</span>
                <span className="text-red-600 font-semibold">
                  -{formatCurrency(invoice.discountAmount)}
                </span>
              </div>
            )}

            <div className="w-full h-px bg-slate-300 my-3" />

            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-slate-900">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>

            <div className="bg-slate-800 text-white p-5 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Amount Due</span>
                <span className="text-2xl font-bold">
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invoice.hasPaymentSchedule &&
        invoice.paymentMilestones &&
        invoice.paymentMilestones.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">
              Payment Schedule
            </h4>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="py-3 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">
                      Due Date
                    </th>
                    <th className="py-3 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">
                      Status
                    </th>
                    <th className="py-3 px-4 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.paymentMilestones.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-800 text-sm">
                        {m.name}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600 text-sm">
                        {format(new Date(m.dueDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            m.status === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(m.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      <div className="mt-12 pt-8 border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Thank you for your business!</p>
      </div>
    </div>
  );
}
