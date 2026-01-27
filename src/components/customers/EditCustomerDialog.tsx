"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm, CustomerFormValues } from "./CustomerForm";
import { Customer } from "@/lib/types";

interface EditCustomerDialogProps {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function updateCustomer(id: string, values: CustomerFormValues) {
  const response = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update customer");
  }

  return response.json();
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
}: EditCustomerDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: CustomerFormValues) =>
      updateCustomer(customer.id, values),
    onSuccess: () => {
      toast.success("Customer updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (values: CustomerFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <CustomerForm
            onSubmit={handleSubmit}
            isLoading={mutation.isPending}
            defaultValues={{
              name: customer.name,
              email: customer.email,
              phone: customer.phone || "",
              address: customer.address || "",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
