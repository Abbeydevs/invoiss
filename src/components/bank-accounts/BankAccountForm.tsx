/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Check,
  ChevronsUpDown,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Bank } from "@/lib/nomba";
import {
  bankAccountSchema,
  BankAccountFormValues,
} from "@/lib/validators/bank-account.schema";

interface BankAccountFormProps {
  onSubmit: (values: BankAccountFormValues) => void;
  isLoading: boolean;
  defaultValues?: Partial<BankAccountFormValues>;
}

async function getBankList(): Promise<Bank[]> {
  const response = await fetch("/api/banks");
  if (!response.ok) {
    throw new Error("Failed to fetch bank list");
  }
  return response.json();
}

async function verifyBankAccount(payload: {
  bankCode: string;
  accountNumber: string;
}) {
  const response = await fetch("/api/banks/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Could not verify account");
  }
  return response.json() as Promise<{ accountName: string }>;
}

const currencies = ["NGN", "USD", "GBP", "EUR", "GHS", "KES", "ZAR"];

export function BankAccountForm({
  onSubmit,
  isLoading,
  defaultValues,
}: BankAccountFormProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("auto");

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: defaultValues || {
      bankName: "",
      accountNumber: "",
      accountName: "",
      isDefault: false,
      isManual: false,
      currency: "NGN",
    },
  });

  const accountNumber = form.watch("accountNumber");
  const isManual = form.watch("isManual");

  const { setValue, clearErrors, getValues } = form;

  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ["nombaBankList"],
    queryFn: getBankList,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyBankAccount,
    onSuccess: (data) => {
      setValue("accountName", data.accountName, { shouldValidate: true });
      clearErrors("accountName");
    },
    onError: (error) => {
      toast.error(error.message);
      form.setError("accountName", { type: "manual", message: error.message });
      setValue("accountName", "");
    },
  });

  const { mutate, reset } = verifyMutation;

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    if (val === "manual") {
      setValue("isManual", true);
      setValue("currency", "USD");
      clearErrors("accountNumber");
    } else {
      setValue("isManual", false);
      setValue("currency", "NGN");
    }
  };

  useEffect(() => {
    if (isManual) return;

    setValue("accountName", "");
    reset();

    if (
      accountNumber.length === 10 &&
      selectedBankCode &&
      !defaultValues?.accountName
    ) {
      mutate({
        bankCode: selectedBankCode,
        accountNumber: accountNumber,
      });
    }
  }, [
    accountNumber,
    selectedBankCode,
    setValue,
    clearErrors,
    reset,
    mutate,
    defaultValues?.accountName,
    isManual,
  ]);

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auto">Nigeria (Auto-Verify)</TabsTrigger>
          <TabsTrigger value="manual">International (Manual)</TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {activeTab === "manual" ? (
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-2">
                <FormLabel>Currency</FormLabel>
                <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground opacity-50 cursor-not-allowed">
                  Nigerian Naira (NGN)
                </div>
              </div>
            )}

            {activeTab === "auto" ? (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between pl-3 font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={isLoadingBanks}
                          >
                            {isLoadingBanks && "Loading..."}
                            {!isLoadingBanks &&
                              (field.value
                                ? banks?.find(
                                    (bank) => bank.name === field.value,
                                  )?.name
                                : "Select bank")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Search bank..." />
                          <CommandEmpty>No bank found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {banks?.map((bank) => (
                                <CommandItem
                                  value={bank.name}
                                  key={bank.code}
                                  onSelect={() => {
                                    form.setValue("bankName", bank.name, {
                                      shouldValidate: true,
                                    });
                                    setSelectedBankCode(bank.code);

                                    if (
                                      getValues("accountNumber").length === 10
                                    ) {
                                      mutate({
                                        bankCode: bank.code,
                                        accountNumber:
                                          getValues("accountNumber"),
                                      });
                                    }
                                    setComboboxOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === bank.name
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {bank.name}
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
            ) : (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chase, HSBC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {activeTab === "auto"
                    ? "Account Number (10 digits)"
                    : "Account / IBAN Number"}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      activeTab === "auto"
                        ? "0123456789"
                        : "Account Number or IBAN"
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {activeTab === "auto" && (
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Auto-verifies..."
                        {...field}
                        readOnly={true}
                        className={cn(
                          verifyMutation.isSuccess && "border-green-500 pr-10",
                          verifyMutation.isError && "border-red-500",
                        )}
                      />
                      {verifyMutation.isPending && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                      {verifyMutation.isSuccess && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      {verifyMutation.isError && (
                        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {activeTab === "manual" && (
            <>
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Account Holder Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="h-3 w-3" /> International Details (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="swiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">SWIFT / BIC</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDUS33"
                            {...field}
                            className="h-8 text-sm"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Routing/Sort Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Code"
                            {...field}
                            className="h-8 text-sm"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium mt-0!">
                  Set as default account
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90"
            disabled={
              isLoading || (activeTab === "auto" && !verifyMutation.isSuccess)
            }
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
