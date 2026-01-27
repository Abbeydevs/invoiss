"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function CurrencyForm() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      console.error("Error saving currency:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Currency Preference
        </CardTitle>
        <CardDescription>
          Select the default currency for your invoices and dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="w-[200px]">
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
        </div>
        <Button
          onClick={onSave}
          disabled={loading || value === session?.user?.currency}
          className="bg-[#1451cb] hover:bg-[#1451cb]/90"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
