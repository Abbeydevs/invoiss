"use client";

import { FormSkeleton } from "@/components/common/SkeletonLoader";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CreateInvoicePageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const invoiceId = searchParams.get("id");

  if (invoiceId) {
    return <InvoiceForm invoiceId={invoiceId} />;
  }

  if (templateId) {
    return <InvoiceForm templateId={templateId} />;
  }

  return (
    <div className="text-center p-8">
      <p>
        No template selected. Please go back and choose a template to create an
        invoice.
      </p>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <DashboardLayout
      title="Create Invoice"
      subtitle="Fill in the details below to create a new invoice"
    >
      <Suspense fallback={<FormSkeleton />}>
        <CreateInvoicePageContent />
      </Suspense>
    </DashboardLayout>
  );
}
