"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function ModernPreview({ invoice }: InvoicePreviewProps) {
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
    <div className="flex flex-row min-h-[1000px] font-sans bg-white">
      <div className="w-[30%] bg-linear-to-br from-[#1451cb] via-[#1565d8] to-[#1451cb] text-white p-8 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

        <div className="relative z-10">
          <div className="mb-10">
            {profile?.logoUrl ? (
              <div className="relative w-[100px] h-[50px] mb-5 bg-white/10 backdrop-blur-sm p-2 rounded-lg">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <h2 className="text-lg font-bold text-white mb-5 wrap-break-word">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="space-y-0.5 text-xs text-blue-100">
              <p className="leading-relaxed wrap-break-word">
                {profile?.address}
              </p>
              <p className="wrap-break-word">{profile?.phone}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 mb-8">
            <p className="font-bold text-blue-100 text-[10px] uppercase tracking-wider mb-2">
              Bill To
            </p>
            <h3 className="text-base font-bold text-white mb-2 wrap-break-words">
              {customer?.name || invoice.billToName}
            </h3>
            <div className="space-y-1 text-xs text-blue-100">
              <p className="wrap-break-words">
                {customer?.email || invoice.billToEmail}
              </p>
              <p className="wrap-break-words">
                {customer?.phone || invoice.billToPhone}
              </p>
              <p className="leading-relaxed wrap-break-words">
                {customer?.address || invoice.billToAddress}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="font-bold text-blue-100 text-[10px] uppercase tracking-wider mb-1">
                Invoice Date
              </p>
              <p className="text-white font-semibold text-sm">
                {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-amber-300/30">
              <p className="font-bold text-amber-100 text-[10px] uppercase tracking-wider mb-1">
                Due Date
              </p>
              <p className="text-white font-semibold text-sm">
                {format(new Date(invoice.dueDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[65%] p-8 bg-gray-50">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500 font-medium">
                Invoice Number:
              </span>
              <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">
                {invoice.invoiceNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="grid grid-cols-12 gap-2 bg-gray-900 text-white py-3 px-4">
            <div className="col-span-5 font-bold text-[10px] uppercase tracking-wider">
              Description
            </div>
            <div className="col-span-2 font-bold text-[10px] uppercase tracking-wider text-center">
              Qty
            </div>
            <div className="col-span-2 font-bold text-[10px] uppercase tracking-wider text-right">
              Price
            </div>
            <div className="col-span-3 font-bold text-[10px] uppercase tracking-wider text-right">
              Amount
            </div>
          </div>

          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-2 py-3 px-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${index !== invoice.items.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="col-span-5 text-gray-800 font-medium text-[11px] wrap-break-words">
                {item.description}
              </div>
              <div className="col-span-2 text-gray-700 text-center font-semibold text-[11px]">
                {item.quantity}
              </div>
              <div className="col-span-2 text-gray-600 text-right text-[11px] wrap-break-words">
                {formatCurrency(item.unitPrice)}
              </div>
              <div className="col-span-3 text-gray-900 font-bold text-right text-[11px] wrap-break-words">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            {bankAccount && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#1451cb] rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 text-[10px] uppercase tracking-wider">
                    Payment Details
                  </h4>
                </div>
                <div className="text-[11px] text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900 wrap-break-words">
                    {bankAccount.bankName}
                  </p>
                  <p className="wrap-break-words">
                    {bankAccount.accountNumber}
                  </p>
                  <p className="wrap-break-words">{bankAccount.accountName}</p>
                </div>
              </div>
            )}

            {invoice.notes && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1.5 text-[10px] uppercase tracking-wider">
                  Notes
                </h4>
                <p className="text-[11px] text-blue-800 leading-relaxed wrap-break-words">
                  {invoice.notes}
                </p>
              </div>
            )}

            {invoice.paymentTerms && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-1.5 text-[10px] uppercase tracking-wider">
                  Payment Terms
                </h4>
                <p className="text-[11px] text-gray-700 leading-relaxed wrap-break-words">
                  {invoice.paymentTerms}
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="space-y-2.5">
                <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                  <span className="font-medium text-[11px] text-gray-700">
                    Subtotal
                  </span>
                  <span className="font-semibold text-[11px] text-gray-900 wrap-break-words text-right ml-2">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                    <span className="font-medium text-[11px] text-gray-700">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="font-semibold text-[11px] text-gray-900 wrap-break-words text-right ml-2">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}

                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between items-start pb-2 border-b border-gray-100">
                    <span className="font-medium text-[11px] text-gray-700">
                      Discount
                    </span>
                    <span className="text-red-600 font-semibold text-[11px] wrap-break-words text-right ml-2">
                      -{formatCurrency(invoice.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start pt-2">
                  <span className="text-base font-bold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 wrap-break-words text-right ml-2">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-[#1451cb] to-[#1565d8] text-white p-4 rounded-xl mt-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs">Amount Due</span>
                  <span className="text-lg font-bold wrap-break-words text-right ml-2">
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs font-medium">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
}
