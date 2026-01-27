"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  Trash2,
  ChevronsUpDown,
  Check,
  Sparkles,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Customer, BankAccount } from "@/lib/types";
import {
  getCustomers,
  getBankAccounts,
  createCustomer,
  getTemplates,
} from "@/lib/api/action";
import { InvoiceFormValues } from "@/lib/validators/invoice.schema";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { MilestoneManager } from "./MilestoneManager";
import { CurrencyInput } from "../ui/currency-input";

interface InvoiceEditorFormProps {
  form: UseFormReturn<InvoiceFormValues>;
  isSubmitting: boolean;
}

export function InvoiceEditorForm({ form }: InvoiceEditorFormProps) {
  const { data: session } = useSession();
  const currency = session?.user?.currency || "NGN";
  const queryClient = useQueryClient();
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [customerComboboxOpen, setCustomerComboboxOpen] = useState(false);

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const getCurrencySymbol = (code: string) => {
    try {
      return (
        new Intl.NumberFormat("en-US", { style: "currency", currency: code })
          .formatToParts(0)
          .find((part) => part.type === "currency")?.value || code
      );
    } catch {
      return code;
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

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

  const availableTemplates = [
    ...(templateData?.defaultTemplates || []),
    ...(templateData?.customTemplates || []),
  ].filter((template) => {
    if (session?.user?.planType === "PRO") return true;
    return !template.isPremium;
  });

  return (
    <Form {...form}>
      <form className="space-y-6 p-4 lg:p-6 pb-24 lg:pb-6">
        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">Bill To</CardTitle>
            <Dialog
              open={customerModalOpen}
              onOpenChange={setCustomerModalOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs lg:text-sm"
                >
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                  New Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-lg">
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
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs lg:text-sm">
                    Select Customer
                  </FormLabel>
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
                            "w-full justify-between h-9 lg:h-10 text-sm",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={isLoadingCustomers}
                        >
                          {isLoadingCustomers && "Loading customers..."}
                          {!isLoadingCustomers &&
                            (field.value
                              ? customers?.find(
                                  (c: Customer) => c.id === field.value,
                                )?.name
                              : "Select customer")}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search customers..."
                          className="h-9"
                        />
                        <CommandEmpty>No customers found.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {Array.isArray(customers) &&
                              customers?.map((customer: Customer) => (
                                <CommandItem
                                  value={customer.name}
                                  key={customer.id}
                                  onSelect={() => {
                                    form.setValue("customerId", customer.id);
                                    form.setValue("billToName", customer.name);
                                    form.setValue(
                                      "billToEmail",
                                      customer.email,
                                    );
                                    form.setValue(
                                      "billToPhone",
                                      customer.phone || "",
                                    );
                                    form.setValue(
                                      "billToAddress",
                                      customer.address || "",
                                    );
                                    setCustomerComboboxOpen(false);
                                  }}
                                  className="text-sm"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === customer.id
                                        ? "opacity-100"
                                        : "opacity-0",
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
                  <FormLabel className="text-xs lg:text-sm">
                    Customer Name *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="h-9 lg:h-10 bg-white"
                    />
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
                  <FormLabel className="text-xs lg:text-sm">Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      className="h-9 lg:h-10 bg-white"
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
                  <FormLabel className="text-xs lg:text-sm">Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+234 800 000 0000"
                      {...field}
                      className="h-9 lg:h-10 bg-white"
                    />
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
                  <FormLabel className="text-xs lg:text-sm">Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Customer address"
                      {...field}
                      className="min-h-20 bg-white text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs lg:text-sm">
                    Invoice Date *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal h-9 lg:h-10 text-sm",
                            !field.value && "text-muted-foreground",
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
                  <FormLabel className="text-xs lg:text-sm">
                    Due Date *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal h-9 lg:h-10 text-sm",
                            !field.value && "text-muted-foreground",
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
                  <FormLabel className="text-xs lg:text-sm">
                    Bank Account *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingBanks}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 lg:h-10 text-sm">
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
                      {Array.isArray(bankAccounts) &&
                        bankAccounts?.map((account: BankAccount) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="text-sm"
                          >
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

        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">Items</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs lg:text-sm"
              onClick={() =>
                append({ description: "", quantity: 1, unitPrice: 0 })
              }
            >
              <Plus className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Item description"
                            {...field}
                            className="h-9 bg-white text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Qty
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            className="h-9 bg-white text-sm"
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
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500">
                          Price
                        </FormLabel>
                        <FormControl>
                          <CurrencyInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="0.00"
                            className="h-9 bg-white text-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 flex items-end pb-1 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-9 w-9"
                    disabled={fields.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">
              Tax & Discount
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs lg:text-sm">
                    Tax Rate (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="h-9 lg:h-10 bg-white"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs lg:text-sm">Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 lg:h-10 bg-white">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">%</SelectItem>
                        <SelectItem value="FIXED">{currencySymbol}</SelectItem>
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
                    <FormLabel className="text-xs lg:text-sm">
                      Discount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        {...field}
                        className="h-9 lg:h-10 bg-white"
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

        <MilestoneManager />

        <Card className="border-0 shadow-sm lg:shadow-lg">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-base lg:text-lg">
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs lg:text-sm">Template</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingTemplates}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 lg:h-10">
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
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs lg:text-sm">
                    Payment Terms
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Net 30"
                      {...field}
                      className="h-9 lg:h-10 bg-white"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
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
                  <FormLabel className="text-xs lg:text-sm">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes or instructions"
                      className="min-h-[100px] bg-white text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
