"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Loader2,
  Check,
  ChevronsUpDown,
  CheckCircle2,
  AlertCircle,
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

export const bankAccountFormSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
  isDefault: z.boolean().default(false).optional(),
});

export type BankAccountFormValues = z.infer<typeof bankAccountFormSchema>;

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

export function BankAccountForm({
  onSubmit,
  isLoading,
  defaultValues,
}: BankAccountFormProps) {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);

  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountFormSchema),
    defaultValues: defaultValues || {
      bankName: "",
      accountNumber: "",
      accountName: "",
      isDefault: false,
    },
  });

  const accountNumber = form.watch("accountNumber");

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

  useEffect(() => {
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
  ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoadingBanks}
                    >
                      {isLoadingBanks && "Loading banks..."}
                      {!isLoadingBanks &&
                        (field.value
                          ? banks?.find((bank) => bank.name === field.value)
                              ?.name
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

                              if (getValues("accountNumber").length === 10) {
                                mutate({
                                  bankCode: bank.code,
                                  accountNumber: getValues("accountNumber"),
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
                                  : "opacity-0"
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

        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number (10 digits)</FormLabel>
              <FormControl>
                <Input placeholder="0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    readOnly={verifyMutation.isSuccess}
                    className={cn(
                      verifyMutation.isSuccess && "border-green-500 pr-10",
                      verifyMutation.isError && "border-red-500"
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

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
          className="w-full"
          disabled={isLoading || !verifyMutation.isSuccess}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
