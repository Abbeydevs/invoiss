"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function SummitPreview({ invoice }: InvoicePreviewProps) {
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
      className="bg-white font-sans text-slate-900"
      style={{ minHeight: "297mm" }}
    >
      {/* Minimalist Premium Header */}
      <div className="px-14 pt-14 pb-10">
        <div className="flex justify-between items-start mb-12">
          <div>
            {profile?.logoUrl ? (
              <div className="relative w-[140px] h-[70px] mb-8">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            ) : (
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 tracking-tight">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="text-sm text-slate-600 space-y-1">
              <p>{profile?.address || ""}</p>
              <p>{profile?.phone || ""}</p>
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-7xl font-light text-slate-900 tracking-tighter mb-6">
              INVOICE
            </h1>
            <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-full">
              <span className="text-xs font-semibold tracking-widest">NO.</span>
              <div className="h-6 w-px bg-white/20"></div>
              <span className="text-sm font-bold tracking-wider">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Sleek Divider */}
        <div className="h-1 bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500 mb-12 rounded-full"></div>

        {/* Client Info */}
        <div className="grid grid-cols-3 gap-12 mb-12">
          <div className="col-span-2">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
              Billed To
            </p>
            <h3 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
              {customer?.name || invoice.billToName}
            </h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p className="font-medium">
                {customer?.email || invoice.billToEmail}
              </p>
              <p>{customer?.phone || invoice.billToPhone || ""}</p>
              <p className="leading-relaxed">
                {customer?.address || invoice.billToAddress || ""}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Issue Date
              </p>
              <p className="text-slate-900 font-semibold text-lg">
                {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
                Due Date
              </p>
              <p className="text-indigo-900 font-semibold text-lg">
                {format(new Date(invoice.dueDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Modern Items Table */}
        <div className="mb-12">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 rounded-t-xl border-b-2 border-slate-200">
            <div className="col-span-6 text-xs font-bold text-slate-600 uppercase tracking-widest">
              Description
            </div>
            <div className="col-span-2 text-xs font-bold text-slate-600 uppercase tracking-widest text-center">
              Quantity
            </div>
            <div className="col-span-2 text-xs font-bold text-slate-600 uppercase tracking-widest text-right">
              Rate
            </div>
            <div className="col-span-2 text-xs font-bold text-slate-600 uppercase tracking-widest text-right">
              Amount
            </div>
          </div>

          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-4 px-6 py-5 ${
                index !== invoice.items.length - 1
                  ? "border-b border-slate-100"
                  : ""
              } hover:bg-slate-50/50 transition-colors`}
            >
              <div className="col-span-6 text-slate-900 font-medium">
                {item.description}
              </div>
              <div className="col-span-2 text-slate-700 text-center font-semibold">
                {item.quantity}
              </div>
              <div className="col-span-2 text-slate-600 text-right">
                {formatCurrency(item.unitPrice)}
              </div>
              <div className="col-span-2 text-slate-900 font-bold text-right">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-5 gap-12">
          {/* Notes & Payment */}
          <div className="col-span-3 space-y-8">
            {bankAccount && (
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-xl">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                  Payment Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Bank Name</span>
                    <span className="font-semibold text-slate-900">
                      {bankAccount.bankName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Account Number</span>
                    <span className="font-mono font-bold text-slate-900">
                      {bankAccount.accountNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Account Name</span>
                    <span className="font-semibold text-slate-900">
                      {bankAccount.accountName}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="border-l-4 border-indigo-600 bg-slate-50 p-6 rounded-r-lg">
                <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="col-span-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Tax ({invoice.taxRate}%)</span>
                    <span className="font-semibold">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}

                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-slate-700">
                    <span>Discount</span>
                    <span className="text-red-600 font-semibold">
                      -{formatCurrency(invoice.discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-slate-300 to-transparent mb-6"></div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-base font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>

              <div className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl -mx-8 -mb-8">
                <p className="text-xs text-white/70 uppercase tracking-widest mb-2">
                  Balance Due
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(invoice.balanceDue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {invoice.hasPaymentSchedule &&
          invoice.paymentMilestones &&
          invoice.paymentMilestones.length > 0 && (
            <div className="mb-16">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">
                Payment Schedule
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="py-4 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider">
                        Milestone
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Due Date
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Status
                      </th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.paymentMilestones.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-medium text-slate-900 text-sm">
                          {m.name}
                        </td>
                        <td className="py-4 px-6 text-right text-slate-700 text-sm">
                          {format(new Date(m.dueDate), "MMM d, yyyy")}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              m.status === "PAID"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-pink-100 text-pink-800"
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-900 text-sm">
                          {formatCurrency(m.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Footer */}
        <div className="text-center pt-16 pb-12 mt-16">
          <div className="inline-block">
            <p className="text-slate-700 font-semibold mb-2 text-lg">
              Thank You
            </p>
            <div className="h-0.5 w-24 bg-linear-to-r from-indigo-600 to-purple-600 mx-auto mb-3 rounded-full"></div>
            <p className="text-slate-500 text-xs">
              Professional invoice • Digitally generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
