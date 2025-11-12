"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getInvoiceById } from "@/lib/api/action";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { PageSkeleton } from "@/components/common/SkeletonLoader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const {
    data: invoice,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceById(invoiceId),
    enabled: !!invoiceId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageSkeleton />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-semibold">Error</h1>
        <p className="text-center text-red-500">
          {error?.message || "Invoice not found."}
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard/invoices">Back to Invoices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <InvoiceActions invoice={invoice} />

      <div className="p-4 md:p-8">
        <InvoicePreview invoice={invoice} />
      </div>
    </div>
  );
}
