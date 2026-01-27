import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number | string,
  currencyCode: string = "NGN",
) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  const locale = currencyCode === "NGN" ? "en-NG" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}
