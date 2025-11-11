"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Invoice } from "@/lib/types";
import { deleteInvoice } from "@/lib/api/action";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, MoreHorizontal, Trash2, Eye } from "lucide-react";

interface InvoiceTableRowActionsProps {
  invoice: Invoice;
}

export function InvoiceTableRowActions({
  invoice,
}: InvoiceTableRowActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditable = invoice.status === "DRAFT";

  const deleteMutation = useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setIsDeleting(false);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsDeleting(false);
    },
  });

  const onEdit = () => {
    router.push(`/dashboard/invoices/create?id=${invoice.id}`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View & Preview
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onEdit} disabled={!isEditable}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
            {!isEditable && (
              <span className="text-xs text-gray-400 ml-2">(Sent)</span>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleting(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={!isEditable}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleting}
        onOpenChange={(open) => !open && setIsDeleting(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              draft invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(invoice.id)}
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
