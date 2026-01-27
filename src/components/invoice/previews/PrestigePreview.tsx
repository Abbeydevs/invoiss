"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
  currency: string;
}

export function PrestigePreview({ invoice, currency }: InvoicePreviewProps) {
  const profile = invoice.profile;
  const customer = invoice.customer;
  const bankAccount = invoice.bankAccount;

  return (
    <div
      className="bg-linear-to-br from-slate-50 to-stone-50 font-sans"
      style={{ minHeight: "297mm" }}
    >
      <div className="relative bg-white border-b-4 border-double border-slate-800 px-14 py-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-linear-to-br from-blue-900/5 to-purple-900/5 rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-linear-to-tl from-blue-900/5 to-purple-900/5 rounded-full translate-x-20 translate-y-20"></div>

        <div className="relative flex justify-between items-start">
          <div>
            {profile?.logoUrl ? (
              <div className="relative w-[150px] h-[75px] mb-5 p-2">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-slate-900 mb-5 tracking-tight">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="text-sm text-slate-600 space-y-1 leading-relaxed">
              <p className="font-medium">{profile?.address || ""}</p>
              <p>{profile?.phone || ""}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block border-4 border-double border-slate-800 p-6 rounded-sm bg-white shadow-sm">
              <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-3">
                INVOICE
              </h1>
              <div className="h-0.5 w-full bg-linear-to-r from-blue-600 to-purple-600 mb-3"></div>
              <div>
                <p className="text-xs text-slate-500 font-semibold tracking-widest mb-1">
                  INVOICE NUMBER
                </p>
                <p className="text-slate-900 font-bold text-lg tracking-wide">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-14 py-10">
        <div className="bg-white rounded-none border-2 border-slate-800 shadow-lg mb-10 overflow-hidden">
          <div className="grid grid-cols-5">
            <div className="col-span-3 p-8 border-r-2 border-slate-800">
              <div className="mb-4 pb-2 border-b-2 border-slate-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                  Bill To
                </p>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {customer?.name || invoice.billToName}
              </h3>
              <div className="space-y-1.5 text-sm text-slate-700">
                <p className="font-semibold">
                  {customer?.email || invoice.billToEmail}
                </p>
                <p>{customer?.phone || invoice.billToPhone || ""}</p>
                <p className="leading-relaxed">
                  {customer?.address || invoice.billToAddress || ""}
                </p>
              </div>
            </div>

            <div className="col-span-2 bg-slate-50 p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Invoice Date
                </p>
                <p className="text-slate-900 font-bold text-lg">
                  {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="h-px bg-slate-300"></div>
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  Due Date
                </p>
                <p className="text-blue-900 font-bold text-lg">
                  {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 border-2 border-slate-800 rounded-none overflow-hidden shadow-lg bg-white">
          <div className="bg-slate-900 text-white">
            <div className="flex px-8 py-5">
              <div className="w-[48%] font-bold text-sm uppercase tracking-widest">
                Item Description
              </div>
              <div className="w-[14%] font-bold text-sm uppercase tracking-widest text-center">
                Qty
              </div>
              <div className="w-[19%] font-bold text-sm uppercase tracking-widest text-right">
                Unit Price
              </div>
              <div className="w-[19%] font-bold text-sm uppercase tracking-widest text-right">
                Total
              </div>
            </div>
          </div>

          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className={`flex px-8 py-5 ${
                index !== invoice.items.length - 1
                  ? "border-b border-slate-200"
                  : ""
              }`}
            >
              <div className="w-[48%] text-slate-900 font-semibold">
                {item.description}
              </div>
              <div className="w-[14%] text-slate-700 text-center font-bold">
                {item.quantity}
              </div>
              <div className="w-[19%] text-slate-600 text-right">
                {formatCurrency(item.unitPrice, currency)}
              </div>
              <div className="w-[19%] text-slate-900 font-bold text-right">
                {formatCurrency(item.amount, currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-10">
          {/* Payment Info & Notes */}
          <div className="space-y-6">
            {bankAccount && (
              <div className="bg-white border-2 border-slate-800 p-6 rounded-none shadow-lg">
                <div className="mb-4 pb-3 border-b-2 border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">
                    Payment Information
                  </h4>
                </div>
                <div className="text-sm space-y-2 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Bank:</span>
                    <span className="font-bold text-slate-900">
                      {bankAccount.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Account:</span>
                    <span className="font-mono font-bold">
                      {bankAccount.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Name:</span>
                    <span className="font-semibold">
                      {bankAccount.accountName}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
                <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wider">
                  Additional Notes
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div>
            <div className="bg-white border-2 border-slate-800 rounded-none shadow-lg overflow-hidden">
              <div className="bg-slate-50 px-8 py-4 border-b-2 border-slate-800">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest">
                  Invoice Summary
                </h4>
              </div>

              <div className="px-8 py-6 space-y-4">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">
                    {formatCurrency(invoice.subtotal, currency)}
                  </span>
                </div>

                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="font-bold">
                      {formatCurrency(invoice.taxAmount, currency)}
                    </span>
                  </div>
                )}

                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span className="font-medium">Discount</span>
                    <span className="text-red-600 font-bold">
                      -{formatCurrency(invoice.discountAmount, currency)}
                    </span>
                  </div>
                )}

                <div className="h-px bg-slate-300 my-4"></div>

                <div className="flex justify-between items-center pb-6">
                  <span className="text-lg font-bold text-slate-900">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(invoice.totalAmount, currency)}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-blue-100 uppercase tracking-widest mb-1">
                      Amount Due
                    </p>
                    <span className="text-3xl font-bold">
                      {formatCurrency(invoice.balanceDue, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {invoice.hasPaymentSchedule &&
          invoice.paymentMilestones &&
          invoice.paymentMilestones.length > 0 && (
            <div className="my-10 border-2 border-slate-800 rounded-none overflow-hidden shadow-lg bg-white">
              <div className="bg-slate-900 text-white px-8 py-4 border-b-2 border-slate-800">
                <h4 className="font-bold text-sm uppercase tracking-widest">
                  Payment Schedule
                </h4>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-8 font-bold text-xs text-slate-600 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="py-3 px-8 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Due Date
                    </th>
                    <th className="py-3 px-8 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Status
                    </th>
                    <th className="py-3 px-8 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.paymentMilestones.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 px-8 font-bold text-slate-900 text-sm">
                        {m.name}
                      </td>
                      <td className="py-3 px-8 text-right text-slate-700 text-sm">
                        {format(new Date(m.dueDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-8 text-right">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold border-2 ${
                            m.status === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-800"
                              : "bg-amber-50 text-amber-800 border-amber-800"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-8 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(m.amount, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <div className="text-center pt-12 mt-12 border-t-4 border-double border-slate-800">
          <p className="text-slate-700 font-semibold mb-2">
            Thank You For Your Business
          </p>
          <p className="text-slate-500 text-sm">
            Professional invoice • Electronically generated and validated
          </p>
        </div>
      </div>
    </div>
  );
}
