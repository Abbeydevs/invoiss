"use client";

import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AddCustomer } from "@/components/customers/AddCustomer";
import { Customer } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { TableSkeleton } from "@/components/common/SkeletonLoader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

    return (
      <div className="shadow-lg border border-gray-200/50 rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">
                Name
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Email
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Phone
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerList.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-gray-900">
                  {customer.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {customer.email}
                </TableCell>
                <TableCell className="text-gray-600">
                  {customer.phone ? (
                    customer.phone
                  ) : (
                    <Badge
                      variant="outline"
                      className="font-normal text-gray-400 border-gray-200"
                    >
                      N/A
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
