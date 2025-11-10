// src/components/bank-accounts/BankAccountList.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BankAccount } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreditCard, MoreVertical, Trash2, Loader2 } from "lucide-react";

interface BankAccountListProps {
  accounts: BankAccount[];
}

// Helper function to call the DELETE API
async function deleteBankAccount(id: string) {
  const response = await fetch(`/api/bank-accounts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete bank account");
  }

  return response.json();
}

export function BankAccountList({ accounts }: BankAccountListProps) {
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Mutation for deleting
  const deleteMutation = useMutation({
    mutationFn: deleteBankAccount,
    onSuccess: () => {
      toast.success("Bank account deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      setAccountToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setAccountToDelete(null);
    },
  });

  return (
    <>
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
                <div className="flex items-center gap-2">
                  {account.isDefault && (
                    <Badge variant="default" className="bg-[#1451cb]">
                      Default
                    </Badge>
                  )}

                  {/* --- ACTION MENU --- */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setAccountToDelete(account.id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  {account.bankName}
                </p>
                <p className="text-2xl font-bold text-gray-800 tracking-wider font-mono">
                  {account.accountNumber}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {account.accountName}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog
        open={!!accountToDelete}
        onOpenChange={(open) => !open && setAccountToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              bank account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (accountToDelete) {
                  deleteMutation.mutate(accountToDelete);
                }
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
