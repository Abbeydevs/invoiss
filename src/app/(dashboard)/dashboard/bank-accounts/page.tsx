"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BankAccountList } from "@/components/bank-accounts/BankAccountList";
import { AddBankAccount } from "@/components/bank-accounts/AddBankAccount";
import { BankAccount } from "@/lib/types";
import { EmptyState } from "@/components/common/EmptyState";
import { ListSkeleton } from "@/components/common/SkeletonLoader";

async function getBankAccounts(): Promise<{ bankAccounts: BankAccount[] }> {
  const response = await fetch("/api/bank-accounts");
  if (!response.ok) {
    throw new Error("Failed to fetch bank accounts");
  }
  return response.json();
}

export default function BankAccountsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: getBankAccounts,
  });

  const renderContent = () => {
    if (isLoading) {
      return <ListSkeleton items={3} />;
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error.message}</p>;
    }

    if (!data || data?.bankAccounts?.length === 0) {
      return (
        <EmptyState
          icon={CreditCard}
          title="No bank accounts found"
          description="Add your first bank account to use it on your invoices."
          actionButton={<AddBankAccount />}
        />
      );
    }

    return <BankAccountList accounts={data.bankAccounts} />;
  };

  return (
    <DashboardLayout
      title="Bank Accounts"
      subtitle="Manage your bank accounts for receiving payments"
      action={
        !isLoading && data && data?.bankAccounts?.length > 0 ? (
          <AddBankAccount />
        ) : null
      }
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
