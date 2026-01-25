"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvoiceDataTable } from "@/components/invoice/InvoiceDataTable";
import { columns } from "@/components/invoice/InvoiceTableColumns";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/SkeletonLoader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getInvoices } from "@/lib/api/action";

export default function InvoicesPage() {
  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton rows={5} />;
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error.message}</p>;
    }

    if (!invoices || invoices.length === 0) {
      return (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description="Create your first invoice to get started."
          actionButton={
            <Button
              asChild
              className="bg-[#1451cb] hover:bg-[#1451cb]/90 w-full sm:w-auto"
            >
              <Link href="/dashboard/invoices/new">Create Invoice</Link>
            </Button>
          }
        />
      );
    }

    return <InvoiceDataTable columns={columns} data={invoices} />;
  };

  return (
    <DashboardLayout
      title="Invoices"
      subtitle="View and manage all your invoices"
      action={
        !isLoading && invoices && invoices.length > 0 ? (
          <Button
            asChild
            className="bg-[#1451cb] hover:bg-[#1451cb]/90 w-full sm:w-auto shadow-sm"
          >
            <Link href="/dashboard/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Link>
          </Button>
        ) : null
      }
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
