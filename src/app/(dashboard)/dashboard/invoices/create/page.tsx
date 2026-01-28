/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { Loader2, ArrowLeft, Eye, PenLine } from "lucide-react";
import { FormSkeleton } from "@/components/common/SkeletonLoader";
import { InvoiceDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

function CreateInvoicePageContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const invoiceId = searchParams.get("id");
  const isEditMode = !!invoiceId;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      discountValue: 0,
      bankAccountId: "",
      templateId: templateId || "",
      customerId: "",

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
      console.log("=== DEBUGGING EDIT MODE ===");
      console.log("1. Full Invoice Data:", existingInvoice);

      console.log("2. Bank Account Relation:", existingInvoice.bankAccount);
      console.log("3. Template Relation:", existingInvoice.template);
      console.log("4. Customer Relation:", existingInvoice.customer);

      console.log("5. Bank Account ID found:", existingInvoice.bankAccount?.id);
      console.log("6. Template ID found:", existingInvoice.template?.id);

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

        hasPaymentSchedule: existingInvoice.hasPaymentSchedule,
        milestones: existingInvoice.paymentMilestones?.map((m: any) => ({
          name: m.name,
          amount: m.amount,
          percentage: m.percentage,
          dueDate: new Date(m.dueDate),
        })),
      });
    }
  }, [isEditMode, existingInvoice, form]);

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
    <div className="fixed inset-0 flex flex-col bg-gray-50 h-dvh">
      <div className="flex-none bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4 z-20">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-2 lg:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/invoices")}
              className="hover:bg-gray-100 -ml-2 lg:ml-0"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                {isEditMode ? "Edit Invoice" : "Create Invoice"}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                {isEditMode ? "Update details" : "Fill details"} to continue
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant="secondary"
                onClick={() => setMobileView("edit")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mobileView === "edit"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500",
                )}
              >
                <PenLine className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => setMobileView("preview")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mobileView === "preview"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500",
                )}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              size="sm"
              className="bg-linear-to-r from-[#1451cb] to-[#0ea5e9] hover:from-[#1451cb]/90 hover:to-[#0ea5e9]/90 text-white shadow-lg lg:h-10 lg:px-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {isEditMode ? "Save Changes" : "Save & Preview"}
                  </span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div
          className={cn(
            "flex-none bg-white border-r border-gray-200 overflow-y-auto w-full lg:w-[420px] transition-transform duration-300 absolute inset-0 lg:relative z-10 lg:z-0",
            mobileView === "preview"
              ? "-translate-x-full lg:translate-x-0"
              : "translate-x-0",
          )}
        >
          <InvoiceEditorForm form={form} isSubmitting={isSubmitting} />
        </div>

        <div
          className={cn(
            "flex-1 overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100 absolute inset-0 lg:relative transition-transform duration-300",
            mobileView === "edit"
              ? "translate-x-full lg:translate-x-0"
              : "translate-x-0",
          )}
        >
          <div className="p-4 lg:p-8 min-h-full flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 hidden lg:block">
                  Live Preview
                </h2>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hidden lg:block">
                  Draft
                </div>
              </div>

              {/* Scaled preview container */}
              <div className="w-full overflow-x-auto lg:overflow-visible pb-10">
                <div className="min-w-[600px] lg:min-w-0 origin-top transform lg:scale-95">
                  <InvoicePreview invoice={previewData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <>
      {/* Removed MobileRestriction */}
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
