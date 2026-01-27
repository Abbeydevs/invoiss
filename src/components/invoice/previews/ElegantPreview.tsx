"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
  currency?: string;
}

export function ElegantPreview({ invoice, currency }: InvoicePreviewProps) {
  const profile = invoice.profile;
  const customer = invoice.customer;
  const bankAccount = invoice.bankAccount;

  return (
    <div
      className="font-sans text-slate-900 bg-white"
      style={{ minHeight: "297mm" }}
    >
      <div className="relative bg-linear-to-br from-emerald-700 via-teal-600 to-emerald-800 px-14 py-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative flex justify-between items-start">
          <div>
            {profile?.logoUrl ? (
              <div className="relative w-[150px] h-[75px] mb-6 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="text-sm text-emerald-50/90 space-y-1 leading-relaxed">
              <p className="font-medium">{profile?.address || ""}</p>
              <p>{profile?.phone || ""}</p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              INVOICE
            </h1>
            <div className="inline-block bg-white/15 backdrop-blur-xl border border-white/30 px-6 py-4 rounded-2xl shadow-xl">
              <p className="text-xs text-emerald-100 font-bold tracking-widest mb-1">
                NUMBER
              </p>
              <p className="text-white font-bold text-xl tracking-wide">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-14 py-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-10 mb-10 -mt-8 relative z-10">
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-1 w-16 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Invoice To
                </p>
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                {customer?.name || invoice.billToName}
              </h3>
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
                <p className="font-semibold text-slate-800">
                  {customer?.email || invoice.billToEmail}
                </p>
                <p>{customer?.phone || invoice.billToPhone || ""}</p>
                <p className="leading-relaxed">
                  {customer?.address || invoice.billToAddress || ""}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-slate-50 border-l-4 border-emerald-500 p-5 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Invoice Date
                </p>
                <p className="text-slate-900 font-bold text-lg">
                  {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
                </p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-lg">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                  Payment Due
                </p>
                <p className="text-amber-900 font-bold text-lg">
                  {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
          <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
            <div className="flex px-10 py-6">
              <div className="w-[48%] font-bold text-sm uppercase tracking-widest">
                Description
              </div>
              <div className="w-[14%] font-bold text-sm uppercase tracking-widest text-center">
                Qty
              </div>
              <div className="w-[19%] font-bold text-sm uppercase tracking-widest text-right">
                Unit Price
              </div>
              <div className="w-[19%] font-bold text-sm uppercase tracking-widest text-right">
                Amount
              </div>
            </div>
          </div>

          <div className="bg-white">
            {invoice.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex px-10 py-6 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                } ${index !== invoice.items.length - 1 ? "border-b border-slate-100" : ""}`}
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
                <div className="w-[19%] text-emerald-700 font-bold text-right">
                  {formatCurrency(item.amount, currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-12">
          <div className="space-y-6">
            {bankAccount && (
              <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white p-7 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">
                    Payment Details
                  </h4>
                </div>
                <div className="space-y-3 text-sm text-emerald-50">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Bank</span>
                    <span className="font-bold text-white">
                      {bankAccount.bankName}
                    </span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Account</span>
                    <span className="font-mono font-bold text-white">
                      {bankAccount.accountNumber}
                    </span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Name</span>
                    <span className="font-semibold text-white">
                      {bankAccount.accountName}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wider">
                  Additional Notes
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
              <div className="space-y-4 mb-6">
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

                <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent my-5"></div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-xl font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-slate-900">
                    {formatCurrency(invoice.totalAmount, currency)}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white p-7 rounded-2xl -mx-8 -mb-8 shadow-xl">
                <p className="text-xs text-emerald-100 uppercase tracking-widest mb-2">
                  Balance Due
                </p>
                <p className="text-4xl font-bold">
                  {formatCurrency(invoice.balanceDue, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {invoice.hasPaymentSchedule &&
          invoice.paymentMilestones &&
          invoice.paymentMilestones.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-1 w-16 bg-linear-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Payment Schedule
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
                <table className="w-full text-left bg-white">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-4 px-10 font-bold text-xs text-slate-600 uppercase tracking-wider">
                        Milestone
                      </th>
                      <th className="py-4 px-10 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Due Date
                      </th>
                      <th className="py-4 px-10 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Status
                      </th>
                      <th className="py-4 px-10 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.paymentMilestones.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-10 font-semibold text-slate-900 text-sm">
                          {m.name}
                        </td>
                        <td className="py-4 px-10 text-right text-slate-600 text-sm">
                          {format(new Date(m.dueDate), "MMM d, yyyy")}
                        </td>
                        <td className="py-4 px-10 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                              m.status === "PAID"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-4 px-10 text-right font-bold text-slate-900 text-sm">
                          {formatCurrency(m.amount, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        <div className="text-center pt-10 pb-8 border-t border-slate-200">
          <div className="inline-block">
            <p className="text-slate-700 font-semibold text-lg mb-3">
              Thank You For Your Business
            </p>
            <div className="h-1 w-32 bg-linear-to-r from-emerald-500 to-teal-500 mx-auto mb-3 rounded-full"></div>
            <p className="text-slate-500 text-sm">
              Professional Invoice • Electronically Generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
