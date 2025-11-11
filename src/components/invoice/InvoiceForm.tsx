"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  ChevronsUpDown,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Customer, BankAccount } from "@/lib/types";
import {
  getCustomers,
  getBankAccounts,
  createCustomer,
  getTemplates,
  getInvoiceById,
} from "@/lib/api/action";
import {
  invoiceSchema,
  InvoiceFormValues,
} from "@/lib/validators/invoice.schema";
import { CustomerForm } from "../customers/CustomerForm";
import { FormSkeleton } from "../common/SkeletonLoader";

interface InvoiceFormProps {
  templateId?: string;
  invoiceId?: string;
}

export function InvoiceForm({ templateId, invoiceId }: InvoiceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerComboboxOpen, setCustomerComboboxOpen] = useState(false);

  const isEditMode = !!invoiceId;

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

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      taxRate: 0,
      discountValue: 0,
      templateId: templateId,
    },
  });

  const { setValue, reset, control, watch } = form;

  useEffect(() => {
    if (isEditMode && existingInvoice) {
      reset({
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
  }, [isEditMode, existingInvoice, reset]);

  useEffect(() => {
    if (!isEditMode) {
      if (bankAccounts && bankAccounts.length > 0) {
        const defaultAccount = bankAccounts.find((acc) => acc.isDefault);
        setValue("bankAccountId", defaultAccount?.id || bankAccounts[0].id);
      }
      if (
        templateId &&
        templateData?.defaultTemplates &&
        templateData.defaultTemplates.length > 0
      ) {
        if (templateId === "custom") {
          const classic = templateData.defaultTemplates.find(
            (t) => t.id === "classic"
          );
          setValue(
            "templateId",
            classic?.id || templateData.defaultTemplates[0].id
          );
        } else {
          setValue("templateId", templateId);
        }
      }
    }
  }, [isEditMode, bankAccounts, templateData, templateId, setValue]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const customerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      toast.success("Customer created successfully!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      const newCustomer = data.customer;
      form.setValue("customerId", newCustomer.id);
      form.setValue("billToName", newCustomer.name);
      form.setValue("billToEmail", newCustomer.email);
      form.setValue("billToPhone", newCustomer.phone || "");
      form.setValue("billToAddress", newCustomer.address || "");
      setCustomerModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    const totals = calculateTotals();

    const payload = {
      ...data,
      status: "DRAFT",
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      discountAmount: totals.discountAmount,
      totalAmount: totals.total,
      balanceDue: totals.total,
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
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotals = () => {
    const items = watch("items");
    const taxRate = watch("taxRate") || 0;
    const discountType = watch("discountType");
    const discountValue = watch("discountValue") || 0;
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
    const total = subtotal + taxAmount - discountAmount;
    return { subtotal, taxAmount, discountAmount, total };
  };

  const totals = calculateTotals();

  const availableTemplates = [
    ...(templateData?.defaultTemplates || []),
    ...(templateData?.customTemplates || []),
  ].filter((template) => {
    if (session?.user?.planType === "PRO") {
      return true;
    }
    return !template.isPremium;
  });

  if (isEditMode && isLoadingInvoice) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Bill To</CardTitle>
                <Dialog
                  open={customerModalOpen}
                  onOpenChange={setCustomerModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Customer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <CustomerForm
                      isLoading={customerMutation.isPending}
                      onSubmit={(values) => customerMutation.mutate(values)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Customer</FormLabel>
                      <Popover
                        open={customerComboboxOpen}
                        onOpenChange={setCustomerComboboxOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isLoadingCustomers}
                            >
                              {isLoadingCustomers && "Loading customers..."}
                              {!isLoadingCustomers &&
                                (field.value
                                  ? customers?.find(
                                      (c: Customer) => c.id === field.value
                                    )?.name
                                  : "Select customer")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search customers..." />
                            <CommandEmpty>No customers found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {customers?.map((customer: Customer) => (
                                  <CommandItem
                                    value={customer.name}
                                    key={customer.id}
                                    onSelect={() => {
                                      form.setValue("customerId", customer.id);
                                      form.setValue(
                                        "billToName",
                                        customer.name
                                      );
                                      form.setValue(
                                        "billToEmail",
                                        customer.email
                                      );
                                      form.setValue(
                                        "billToPhone",
                                        customer.phone || ""
                                      );
                                      form.setValue(
                                        "billToAddress",
                                        customer.address || ""
                                      );
                                      setCustomerComboboxOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === customer.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {customer.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="billToName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billToEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billToPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+234 800 000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billToAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Customer address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Items</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ description: "", quantity: 1, unitPrice: 0 })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              Description
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Item description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <FormLabel className="text-xs">Amount</FormLabel>
                      <div className="h-10 flex items-center font-semibold">
                        ₦
                        {(
                          (form.watch(`items.${index}.quantity`) || 0) *
                          (form.watch(`items.${index}.unitPrice`) || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                    {fields.length > 1 && (
                      <div className="col-span-12 md:col-span-1 flex md:items-end md:pb-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Net 30" {...field} />
                      </FormControl>
                      <FormDescription>
                        Payment terms and conditions
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes or instructions"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Invoice Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingBanks}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingBanks
                                  ? "Loading banks..."
                                  : "Select account"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bankAccounts?.map((account: BankAccount) => (
                            <SelectItem key={account.id} value={account.id}>
                              {`${account.bankName} - (...${account.accountNumber.slice(-4)})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {isEditMode ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    readOnly
                    value={
                      templateData?.defaultTemplates.find(
                        (t) => t.id === existingInvoice?.template?.id
                      )?.name || "Custom"
                    }
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Design</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isLoadingTemplates}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  isLoadingTemplates
                                    ? "Loading templates..."
                                    : "Select a design"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                <div className="flex items-center gap-2">
                                  {template.name}
                                  {template.isPremium && (
                                    <Sparkles className="h-4 w-4 text-yellow-500" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Tax & Discount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">%</SelectItem>
                            <SelectItem value="FIXED">₦</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    ₦{totals.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">
                    ₦{totals.taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-semibold text-red-600">
                    -₦{totals.discountAmount.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#1451cb]">
                    ₦{totals.total.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90"
                disabled={isSubmitting}
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
          </div>
        </div>
      </form>
    </Form>
  );
}
