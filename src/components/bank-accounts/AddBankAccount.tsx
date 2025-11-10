"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BankAccountForm, BankAccountFormValues } from "./BankAccountForm";

async function createBankAccount(values: BankAccountFormValues) {
  const response = await fetch("/api/bank-accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create bank account");
  }

  return response.json();
}

export function AddBankAccount() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBankAccount,
    onSuccess: () => {
      toast.success("Bank account added successfully!");
      queryClient.invalidateQueries({ queryKey: ["bankAccounts"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: BankAccountFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1451cb] hover:bg-[#1451cb]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Bank Account</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <BankAccountForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
