"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Invoice } from "@/lib/types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { InvoiceTableRowActions } from "./InvoiceTableRowActions";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Number",
    cell: ({ row }) => (
      <div className="font-semibold text-gray-900 text-xs sm:text-sm whitespace-nowrap">
        {row.getValue("invoiceNumber")}
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.getValue("customer") as Invoice["customer"];
      return (
        <div className="flex flex-col max-w-[120px] sm:max-w-[200px]">
          <span className="text-sm font-medium text-gray-700 truncate">
            {customer?.name || row.original.billToName || "Unknown"}
          </span>
          <span className="text-[10px] text-gray-400 truncate hidden sm:inline-block">
            {customer?.email || row.original.billToEmail}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "invoiceDate",
    header: () => <span className="hidden md:inline">Date</span>, // Hide Header on Mobile
    cell: ({ row }) => {
      const date = new Date(row.getValue("invoiceDate"));
      return (
        <div className="text-gray-500 text-sm hidden md:block whitespace-nowrap">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: () => <span className="hidden lg:inline">Due Date</span>, // Hide on Tablet/Mobile
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return (
        <div className="text-gray-500 text-sm hidden lg:block whitespace-nowrap">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);
      return (
        <div className="font-bold text-gray-900 text-right whitespace-nowrap">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex justify-center sm:justify-start">
        <InvoiceStatusBadge status={row.getValue("status")} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <div className="text-right">
          <InvoiceTableRowActions invoice={invoice} />
        </div>
      );
    },
  },
];
