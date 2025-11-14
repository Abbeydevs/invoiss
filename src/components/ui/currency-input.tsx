"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, className, placeholder, ...props }, ref) => {
  const formatValue = (val: number | undefined) => {
    if (val === undefined || val === 0) return "";
    return new Intl.NumberFormat("en-US").format(val);
  };

  const [displayValue, setDisplayValue] = React.useState(formatValue(value));

  React.useEffect(() => {
    if (document.activeElement !== ref) {
      setDisplayValue(formatValue(value));
    }
  }, [value, ref]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const rawValue = inputValue.replace(/[^0-9.]/g, "");

    const numberValue = parseFloat(rawValue);

    if (isNaN(numberValue)) {
      onChange(0);
      setDisplayValue("");
    } else {
      onChange(numberValue);
      setDisplayValue(new Intl.NumberFormat("en-US").format(numberValue));
    }
  };

  return (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="decimal"
      placeholder={placeholder || "0.00"}
      value={displayValue}
      onChange={handleChange}
      className={className}
    />
  );
});

CurrencyInput.displayName = "CurrencyInput";
