"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AddCustomer } from "@/components/customers/AddCustomer";
import { Customer } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/SkeletonLoader";
import { CustomerDataTable } from "@/components/customers/CustomerDataTable";
import { columns } from "@/components/customers/CustomerTableColumns";

async function getCustomers(): Promise<{ customers: Customer[] }> {
  const response = await fetch("/api/customers");
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
}

export default function CustomersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const renderContent = () => {
    if (isLoading) {
      return <TableSkeleton rows={5} />;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-10">
          <p className="text-center text-red-500 bg-red-50 px-4 py-2 rounded-lg">
            Error loading customers: {error.message}
          </p>
        </div>
      );
    }

    const customerList = data?.customers || [];

    if (customerList.length === 0) {
      return (
        <EmptyState
          icon={Users}
          title="No customers found"
          description="Add your first customer to get started."
          actionButton={<AddCustomer />}
        />
      );
    }

    return <CustomerDataTable columns={columns} data={customerList} />;
  };

  return (
    <DashboardLayout
      title="Customers"
      subtitle="Manage your customer list"
      action={
        !isLoading && data?.customers && data.customers.length > 0 ? (
          <AddCustomer />
        ) : null
      }
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 lg:pb-0">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
