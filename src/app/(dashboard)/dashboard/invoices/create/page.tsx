"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  invoiceSchema,
  InvoiceFormValues,
} from "@/lib/validators/invoice.schema";
import {
  getInvoiceById,
  getCustomers,
  getBankAccounts,
  getTemplates,
} from "@/lib/api/action";
import { InvoiceEditorForm } from "@/components/invoice/InvoiceEditorForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormSkeleton } from "@/components/common/SkeletonLoader";
import { InvoiceDetail } from "@/lib/types";
import { MobileRestriction } from "@/components/common/MobileRestriction";

function CreateInvoicePageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const invoiceId = searchParams.get("id");
  const isEditMode = !!invoiceId;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      discountValue: 0,
      templateId: templateId || undefined,
      hasPaymentSchedule: false,
    },
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: bankAccounts, isLoading: isLoadingBanks } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: getBankAccounts,
  });

  const { data: templateData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const { data: existingInvoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => getInvoiceById(invoiceId as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingInvoice) {
      form.reset({
        billToName: existingInvoice.billToName,
        billToEmail: existingInvoice.billToEmail,
        invoiceDate: new Date(existingInvoice.invoiceDate),
        dueDate: new Date(existingInvoice.dueDate),
        items: existingInvoice.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        bankAccountId: existingInvoice.bankAccount?.id,
        templateId: existingInvoice.template?.id,
        customerId: existingInvoice.customer?.id ?? undefined,
        billToPhone: existingInvoice.billToPhone ?? undefined,
        billToAddress: existingInvoice.billToAddress ?? undefined,
        taxRate: existingInvoice.taxRate ?? undefined,
        discountType: existingInvoice.discountType ?? undefined,
        discountValue: existingInvoice.discountValue ?? undefined,
        paymentTerms: existingInvoice.paymentTerms ?? undefined,
        notes: existingInvoice.notes ?? undefined,
      });
    }
  }, [isEditMode, existingInvoice, form.reset, form]);

  const watchedData = form.watch();

  const calculateTotals = (data: Partial<InvoiceFormValues>) => {
    const items = data.items || [];
    const taxRate = data.taxRate || 0;
    const discountType = data.discountType;
    const discountValue = data.discountValue || 0;
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0);
    const taxAmount = (subtotal * taxRate) / 100;
    let discountAmount = 0;
    if (discountType === "PERCENTAGE") {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (discountType === "FIXED") {
      discountAmount = discountValue;
    }
    const totalAmount = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, totalAmount };
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    const totals = calculateTotals(data);

    if (
      data.hasPaymentSchedule &&
      data.milestones &&
      data.milestones.length > 0
    ) {
      const milestoneTotal = data.milestones.reduce(
        (sum, m) => sum + (m.amount || 0),
        0,
      );

      const difference = Math.abs(totals.totalAmount - milestoneTotal);

      if (difference > 1) {
        toast.error("Payment Schedule Mismatch", {
          description: `Your milestones total (₦${milestoneTotal.toLocaleString()}) does not match the invoice total (₦${totals.totalAmount.toLocaleString()}). Please fix the amounts.`,
        });
        setIsSubmitting(false);
        return;
      }
    }

    const payload = {
      ...data,
      status: "DRAFT",
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      totalAmount: totals.totalAmount,
      balanceDue: totals.totalAmount,
    };

    try {
      let result;
      if (isEditMode) {
        const response = await fetch(`/api/invoices/${invoiceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update invoice");
        }
        result = await response.json();
        toast.success("Draft updated! Redirecting to preview...");
      } else {
        const response = await fetch("/api/invoices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create invoice");
        }
        result = await response.json();
        toast.success("Draft saved! Redirecting to preview...");
      }

      router.push(`/dashboard/invoices/${result.invoice.id}`);
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({
        queryKey: ["invoice", result.invoice.id],
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (
    isLoadingInvoice ||
    isLoadingCustomers ||
    isLoadingBanks ||
    isLoadingTemplates
  ) {
    return (
      <div className="p-8">
        <FormSkeleton />
      </div>
    );
  }

  const totals = calculateTotals(watchedData);
  const previewData = {
    ...form.getValues(),
    ...watchedData,
    ...totals,
    id: invoiceId || "new",
    invoiceNumber: existingInvoice?.invoiceNumber || "INV-XXXX",
    status: "DRAFT",
    invoiceDate: watchedData.invoiceDate.toISOString(),
    dueDate: watchedData.dueDate.toISOString(),
    items: (watchedData.items || []).map((item, index) => ({
      id: `item-${index}`,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: (item.quantity || 0) * (item.unitPrice || 0),
    })),
    hasPaymentSchedule: watchedData.hasPaymentSchedule,
    paymentMilestones: (watchedData.milestones || []).map((m, index) => ({
      id: `milestone-${index}`,
      name: m.name,
      amount: m.amount,
      percentage: m.percentage || null,
      dueDate: m.dueDate.toISOString(),
      status: "PENDING",
    })),
    payments: existingInvoice?.payments || [],
    profile: existingInvoice?.profile || null,
    customer: Array.isArray(customers)
      ? customers.find((c) => c.id === watchedData.customerId) || null
      : null,
    bankAccount: Array.isArray(bankAccounts)
      ? bankAccounts.find((b) => b.id === watchedData.bankAccountId) || null
      : null,

    template: Array.isArray(templateData?.defaultTemplates)
      ? templateData?.defaultTemplates.find(
          (t) => t.id === watchedData.templateId,
        ) || null
      : null,
    balanceDue: totals.totalAmount,
  } as InvoiceDetail;

  return (
    <div className="flex h-screen -m-6">
      <div className="w-1/3 h-full overflow-y-auto bg-white border-r border-gray-200">
        <InvoiceEditorForm form={form} isSubmitting={isSubmitting} />
      </div>

      <div className="w-2/3 h-full overflow-y-auto bg-gray-100 p-8">
        <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-[#1451cb] hover:bg-[#1451cb]/90"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              "Save Changes & Preview"
            ) : (
              "Save & Preview"
            )}
          </Button>
        </div>

        <div className="transform scale-[.8] origin-top">
          <InvoicePreview invoice={previewData} />
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <>
      <MobileRestriction />
      <Suspense
        fallback={
          <div className="p-8">
            <FormSkeleton />
          </div>
        }
      >
        <CreateInvoicePageContent />
      </Suspense>
    </>
  );
}
