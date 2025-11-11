"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getInvoiceById } from "@/lib/api/action";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvoiceActions } from "@/components/invoice/InvoiceActions";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { PageSkeleton } from "@/components/common/SkeletonLoader";

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
      <DashboardLayout title="Loading Invoice..." subtitle="Please wait...">
        <PageSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Error" subtitle="Failed to load invoice">
        <p className="text-center text-red-500">{error.message}</p>
      </DashboardLayout>
    );
  }

  if (!invoice) {
    return (
      <DashboardLayout title="Not Found" subtitle="Invoice not found">
        <p className="text-center">This invoice could not be found.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Invoice Preview" subtitle={invoice.invoiceNumber}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <InvoiceActions invoice={invoice} />

        <InvoicePreview invoice={invoice} />
      </div>
    </DashboardLayout>
  );
}
