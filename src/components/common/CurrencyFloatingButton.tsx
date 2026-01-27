"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { code: "NGN", name: "Nigerian Naira (₦)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GHS", name: "Ghanaian Cedi (₵)" },
  { code: "KES", name: "Kenyan Shilling (KSh)" },
  { code: "ZAR", name: "South African Rand (R)" },
];

export function CurrencyFloatingButton() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(session?.user?.currency || "NGN");

  const onSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings/currency", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: value }),
      });

      if (!res.ok) throw new Error("Failed to update");

      await update({ currency: value });
      toast.success("Currency updated successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error saving currency:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Don't show if session isn't loaded yet
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-xl bg-[#1451cb] hover:bg-[#1451cb]/90 text-white z-50 transition-transform hover:scale-105"
        >
          <Banknote className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Currency</DialogTitle>
          <DialogDescription>
            Select your preferred currency for invoices and dashboards.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onSave}
            disabled={loading}
            className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Currency
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
