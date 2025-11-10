"use client";

import { BankAccount } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface BankAccountListProps {
  accounts: BankAccount[];
}

export function BankAccountList({ accounts }: BankAccountListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="border-0 shadow-lg relative group transition-all hover:shadow-xl"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-linear-to-r from-[#1451cb] to-[#0ea5e9] text-white rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              {account.isDefault && (
                <Badge variant="default" className="bg-[#1451cb]">
                  Default
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900">
                {account.bankName}
              </p>
              <p className="text-2xl font-bold text-gray-800 tracking-wider">
                {account.accountNumber}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {account.accountName}
              </p>
            </div>
            {/* We will add Edit/Delete buttons here later */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
