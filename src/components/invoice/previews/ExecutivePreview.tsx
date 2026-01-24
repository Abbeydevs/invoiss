"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function ExecutivePreview({ invoice }: InvoicePreviewProps) {
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
      className="bg-white font-serif text-gray-900"
      style={{ minHeight: "297mm" }}
    >
      {/* Sophisticated Header with Gold Accent */}
      <div className="relative bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-12 pt-12 pb-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-400"></div>

        <div className="flex justify-between items-start">
          <div>
            {profile?.logoUrl ? (
              <div className="relative w-40 h-20 mb-6 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
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
            <div className="text-sm text-slate-300 space-y-1 font-sans">
              <p>{profile?.address || ""}</p>
              <p>{profile?.phone || ""}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-300 to-amber-200 tracking-tight mb-3">
                INVOICE
              </h1>
              <div className="bg-white/10 backdrop-blur-sm border border-amber-400/30 px-5 py-3 rounded-lg">
                <p className="text-xs text-amber-200 font-semibold tracking-widest mb-1">
                  NO.
                </p>
                <p className="text-white font-bold text-xl tracking-wider">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-12 -mt-12">
        {/* Bill To Card */}
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-8 mb-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-12 bg-linear-to-r from-amber-400 to-yellow-500"></div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  Billing Information
                </p>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {customer?.name || invoice.billToName}
              </h3>
              <div className="space-y-1.5 text-sm text-slate-600 font-sans">
                <p className="font-medium">
                  {customer?.email || invoice.billToEmail}
                </p>
                <p>{customer?.phone || invoice.billToPhone || ""}</p>
                <p className="leading-relaxed">
                  {customer?.address || invoice.billToAddress || ""}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 border-l-4 border-slate-900 p-4 rounded">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Invoice Date
                </p>
                <p className="text-slate-900 font-semibold text-base">
                  {format(new Date(invoice.invoiceDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Payment Due
                </p>
                <p className="text-amber-900 font-semibold text-base">
                  {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-xl border border-slate-200">
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="flex px-8 py-5">
              <div className="w-[50%] font-bold text-sm uppercase tracking-widest">
                Description
              </div>
              <div className="w-[15%] font-bold text-sm uppercase tracking-widest text-center">
                Quantity
              </div>
              <div className="w-[17.5%] font-bold text-sm uppercase tracking-widest text-right">
                Rate
              </div>
              <div className="w-[17.5%] font-bold text-sm uppercase tracking-widest text-right">
                Amount
              </div>
            </div>
          </div>

          <div className="bg-white">
            {invoice.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex px-8 py-5 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                } ${index !== invoice.items.length - 1 ? "border-b border-slate-100" : ""}`}
              >
                <div className="w-[50%] text-slate-900 font-medium font-sans">
                  {item.description}
                </div>
                <div className="w-[15%] text-slate-700 text-center font-semibold font-sans">
                  {item.quantity}
                </div>
                <div className="w-[17.5%] text-slate-600 text-right font-sans">
                  {formatCurrency(item.unitPrice)}
                </div>
                <div className="w-[17.5%] text-slate-900 font-bold text-right font-sans">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Area */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          {/* Left Column - Notes & Payment */}
          <div className="space-y-5">
            {bankAccount && (
              <div className="bg-slate-900 text-white p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-amber-400"></div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">
                    Payment Details
                  </h4>
                </div>
                <div className="text-sm space-y-2 font-sans text-slate-200">
                  <p className="font-semibold text-white text-base">
                    {bankAccount.bankName}
                  </p>
                  <p className="font-mono">{bankAccount.accountNumber}</p>
                  <p>{bankAccount.accountName}</p>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
                <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed font-sans">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Totals */}
          <div>
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8">
              <div className="space-y-4">
                <div className="flex justify-between text-slate-700 font-sans">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-700 font-sans">
                    <span className="font-medium">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}

                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-slate-700 font-sans">
                    <span className="font-medium">Discount</span>
                    <span className="text-red-600 font-semibold">
                      -{formatCurrency(invoice.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatCurrency(invoice.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-lg -mx-8 -mb-8 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                      Balance Due
                    </p>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-yellow-300 to-amber-200">
                      {formatCurrency(invoice.balanceDue)}
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
            <div className="mb-12 rounded-lg overflow-hidden shadow-xl border border-slate-200">
              <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4">
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-widest">
                  Payment Schedule
                </h4>
              </div>
              <table className="w-full text-left bg-white font-sans">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider">
                      Milestone
                    </th>
                    <th className="py-3 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Due Date
                    </th>
                    <th className="py-3 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Status
                    </th>
                    <th className="py-3 px-6 font-bold text-xs text-slate-600 uppercase tracking-wider text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.paymentMilestones.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-medium text-slate-900 text-sm">
                        {m.name}
                      </td>
                      <td className="py-3 px-6 text-right text-slate-600 text-sm">
                        {format(new Date(m.dueDate), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-bold border ${
                            m.status === "PAID"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-bold text-slate-900 text-sm">
                        {formatCurrency(m.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {/* Footer */}
        <div className="text-center pb-12 pt-8 border-t border-slate-200">
          <p className="text-slate-600 text-sm font-medium mb-2">
            Thank you for your business
          </p>
          <p className="text-slate-400 text-xs">
            This is a professional invoice generated electronically
          </p>
        </div>
      </div>
    </div>
  );
}
