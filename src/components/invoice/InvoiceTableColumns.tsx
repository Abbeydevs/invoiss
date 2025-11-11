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
      <div className="font-medium text-gray-900">
        {row.getValue("invoiceNumber")}
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.getValue("customer") as Invoice["customer"];
      return <div className="text-gray-600">{customer?.name || "N/A"}</div>;
    },
  },
  {
    accessorKey: "invoiceDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("invoiceDate"));
      return <div className="text-gray-600">{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return <div className="text-gray-600">{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);
      return <div className="font-semibold text-gray-800">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InvoiceStatusBadge status={row.getValue("status")} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      return <InvoiceTableRowActions invoice={invoice} />;
    },
  },
];
