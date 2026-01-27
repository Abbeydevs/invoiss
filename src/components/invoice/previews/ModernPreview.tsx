"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
  currency: string;
}

export function ModernPreview({ invoice, currency }: InvoicePreviewProps) {
  const profile = invoice.profile;
  const customer = invoice.customer;
  const bankAccount = invoice.bankAccount;

  return (
    <div
      id="invoice-preview-capture"
      className="flex flex-row w-full mx-auto font-sans bg-white"
      style={{ minHeight: "297mm" }}
    >
      <div className="w-[28%] bg-linear-to-br from-[#1451cb] via-[#1565d8] to-[#1451cb] text-white p-6 flex flex-col relative overflow-hidden print:bg-[#1451cb] rounded-l-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="relative z-10">
          <div className="mb-8">
            {profile?.logoUrl ? (
              <div className="relative w-[100px] h-[50px] mb-4 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <h2 className="text-base font-bold text-white mb-4 wrap-break-word">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="space-y-1 text-[10px] text-blue-100">
              <p className="leading-relaxed wrap-break-word">
                {profile?.address || ""}
              </p>
              <p className="wrap-break-word">{profile?.phone || ""}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
            <p className="font-bold text-blue-100 text-[9px] uppercase tracking-wider mb-2">
              Bill To
            </p>
            <h3 className="text-sm font-bold text-white mb-1 wrap-break-word">
              {customer?.name || invoice.billToName}
            </h3>
            <div className="space-y-1 text-[10px] text-blue-100">
              <p className="wrap-break-word">
                {customer?.email || invoice.billToEmail}
              </p>
              <p className="wrap-break-word">
                {customer?.phone || invoice.billToPhone || ""}
              </p>
              <p className="leading-relaxed wrap-break-word">
                {customer?.address || invoice.billToAddress || ""}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="font-bold text-blue-100 text-[8px] uppercase tracking-wider mb-0.5">
                Invoice Date
              </p>
              <p className="text-white font-semibold text-xs">
                {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-3 border border-amber-300/30">
              <p className="font-bold text-amber-100 text-[8px] uppercase tracking-wider mb-0.5">
                Due Date
              </p>
              <p className="text-white font-semibold text-xs">
                {format(new Date(invoice.dueDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[72%] p-8 bg-gray-50 rounded-r-xl border border-l-0 border-gray-200">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">INVOICE</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-medium">No:</span>
              <span className="text-[10px] font-bold text-gray-900 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="grid grid-cols-12 gap-2 bg-gray-900 text-white py-3 px-4 text-[9px] font-bold uppercase tracking-wider">
            <div className="col-span-5">Description</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-3 text-right">Price</div>
            <div className="col-span-3 text-right">Amount</div>
          </div>

          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-2 py-3 px-4 items-center ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${index !== invoice.items.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="col-span-5 text-gray-800 font-medium text-[10px] wrap-break-word">
                {item.description}
              </div>
              <div className="col-span-1 text-gray-700 text-center font-semibold text-[10px]">
                {item.quantity}
              </div>
              <div className="col-span-3 text-gray-600 text-right text-[10px]">
                {formatCurrency(item.unitPrice, currency)}
              </div>
              <div className="col-span-3 text-gray-900 font-bold text-right text-[10px]">
                {formatCurrency(item.amount, currency)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-6 space-y-4">
            {bankAccount && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 text-[9px] uppercase tracking-wider mb-2">
                  Payment Details
                </h4>
                <div className="text-[10px] text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900">
                    {bankAccount.bankName}
                  </p>
                  <p>{bankAccount.accountNumber}</p>
                  <p>{bankAccount.accountName}</p>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1 text-[9px] uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-[10px]">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(invoice.subtotal, currency)}
                </span>
              </div>
              {(invoice.taxAmount ?? 0) > 0 && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 text-[10px]">
                  <span className="text-gray-600">
                    Tax ({invoice.taxRate}%)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(invoice.taxAmount ?? 0, currency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-gray-900">Total</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(invoice.totalAmount, currency)}
                </span>
              </div>

              <div className="bg-[#1451cb] text-white p-4 rounded-lg mt-2 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    Amount Due
                  </span>
                  <span className="text-sm font-bold">
                    {formatCurrency(invoice.balanceDue, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {invoice.hasPaymentSchedule &&
          invoice.paymentMilestones?.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold text-gray-900 text-[9px] uppercase tracking-wider mb-3">
                Payment Schedule
              </h4>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                {invoice.paymentMilestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex justify-between items-center p-3 text-[10px]"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{m.name}</p>
                      <p className="text-[8px] text-gray-500">
                        {format(new Date(m.dueDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        {formatCurrency(m.amount, currency)}
                      </p>
                      <span
                        className={`text-[8px] font-bold ${m.status === "PAID" ? "text-green-600" : "text-amber-600"}`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="mt-8 pt-4 border-t border-gray-200 text-center">
          <p className="text-gray-400 text-[10px]">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
}
