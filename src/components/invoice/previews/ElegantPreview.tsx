"use client";

import { InvoiceDetail } from "@/lib/types";
import Image from "next/image";
import { format } from "date-fns";

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function ElegantPreview({ invoice }: InvoicePreviewProps) {
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
    <div className="min-h-[1000px] font-sans text-[#2d3748] bg-white">
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 p-10 pb-16">
        <div className="flex justify-between items-start">
          <div>
            {profile?.logoUrl ? (
              <div className="relative w-[140px] h-[70px] mb-4 bg-white p-3 rounded-lg">
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName || "Logo"}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-white mb-4">
                {profile?.businessName || "Your Company"}
              </h2>
            )}
            <div className="text-sm text-emerald-50 space-y-0.5">
              <p>{profile?.address}</p>
              <p>{profile?.phone}</p>
            </div>
          </div>

          <div className="text-right text-white">
            <h1 className="text-5xl font-bold tracking-tight mb-2">INVOICE</h1>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
              <p className="text-xs text-emerald-100 font-medium">
                Invoice Number
              </p>
              <p className="text-white font-bold text-lg">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-10 -mt-8">
        {/* Bill To and Dates Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
                Bill To
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {customer?.name || invoice.billToName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{customer?.email || invoice.billToEmail}</p>
                <p>{customer?.phone || invoice.billToPhone}</p>
                <p className="leading-relaxed">
                  {customer?.address || invoice.billToAddress}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Invoice Date
                </p>
                <p className="text-gray-900 font-semibold text-base mt-1">
                  {format(new Date(invoice.invoiceDate), "MMMM d, yyyy")}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-300">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Due Date
                </p>
                <p className="text-amber-900 font-semibold text-base mt-1">
                  {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="flex bg-linear-to-r from-emerald-600 to-teal-600 text-white py-4 px-6">
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
              className={`flex py-4 px-6 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${index !== invoice.items.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="w-[50%] text-gray-800 font-medium">
                {item.description}
              </div>
              <div className="w-[15%] text-gray-600 text-center font-semibold">
                {item.quantity}
              </div>
              <div className="w-[17.5%] text-gray-600 text-right">
                {formatCurrency(item.unitPrice)}
              </div>
              <div className="w-[17.5%] text-emerald-700 font-bold text-right">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* Notes and Payment Details */}
          <div className="space-y-4">
            {bankAccount && (
              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-2 text-sm uppercase tracking-wider flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Payment Details
                </h4>
                <div className="text-sm text-emerald-800 space-y-1">
                  <p className="font-semibold">{bankAccount.bankName}</p>
                  <p>{bankAccount.accountNumber}</p>
                  <p>{bankAccount.accountName}</p>
                </div>
              </div>
            )}
            {invoice.notes && (
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wider flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Notes
                </h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {invoice.notes}
                </p>
              </div>
            )}
            {invoice.paymentTerms && (
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Payment Terms
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {invoice.paymentTerms}
                </p>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700 pb-2">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>

                {invoice.taxAmount && invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-gray-700 pb-2">
                    <span className="font-medium">
                      Tax ({invoice.taxRate}%)
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}

                {invoice.discountAmount && invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-gray-700 pb-2">
                    <span className="font-medium">Discount</span>
                    <span className="text-red-600 font-semibold">
                      -{formatCurrency(invoice.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="w-full h-px bg-gray-300 my-3" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white p-5 rounded-lg mt-5">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Amount Due</span>
                  <span className="text-2xl font-bold">
                    {formatCurrency(invoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-10 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm font-medium">
            Thank you for your business!
          </p>
          <p className="text-gray-400 text-xs mt-1">
            This invoice was generated electronically and is valid without
            signature.
          </p>
        </div>
      </div>
    </div>
  );
}
