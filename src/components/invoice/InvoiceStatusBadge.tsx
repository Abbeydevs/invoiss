"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Invoice } from "@/lib/types";

type InvoiceStatus = Invoice["status"];

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const statusConfig = {
    PAID: "bg-green-100 text-green-800 hover:bg-green-100",
    UNPAID: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    OVERDUE: "bg-red-100 text-red-800 hover:bg-red-100",
    SENT: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    VIEWED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    DRAFT: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    CANCELLED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-semibold",
        statusConfig[status] || "bg-gray-100 text-gray-800"
      )}
    >
      {status.replace("_", " ")}
    </Badge>
  );
}
