"use client";

import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  variant?: "default" | "primary" | "success" | "warning";
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  change,
  variant = "default",
  icon,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-white hover:shadow-xl",
    primary:
      "bg-gradient-to-br from-[#1451cb] to-[#0ea5e9] text-white hover:shadow-2xl hover:shadow-blue-500/30",
    success:
      "bg-gradient-to-br from-emerald-500 to-teal-500 text-white hover:shadow-2xl hover:shadow-emerald-500/30",
    warning:
      "bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-amber-500/30",
  };

  const isIncreasing = change && change.value > 0;

  return (
    <Card
      className={cn(
        "border-0 shadow-lg transition-all duration-300 group overflow-hidden relative",
        variantStyles[variant]
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <h3
            className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-gray-600" : "text-white/90"
            )}
          >
            {title}
          </h3>
          {icon && (
            <div
              className={cn(
                "p-2 rounded-lg transition-all group-hover:scale-110",
                variant === "default"
                  ? "bg-blue-50 text-[#1451cb]"
                  : "bg-white/20"
              )}
            >
              {icon}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p
            className={cn(
              "text-3xl font-bold",
              variant === "default" ? "text-gray-900" : "text-white"
            )}
          >
            {value}
          </p>

          {change && (
            <div className="flex items-center gap-2">
              {isIncreasing ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isIncreasing ? "text-green-600" : "text-red-600",
                  variant !== "default" && "text-white/90"
                )}
              >
                {isIncreasing ? "+" : ""}
                {change.value}%
              </span>
              <span
                className={cn(
                  "text-xs",
                  variant === "default" ? "text-gray-500" : "text-white/70"
                )}
              >
                {change.label}
              </span>
            </div>
          )}
        </div>

        {/* Arrow Icon */}
        <Button
          className={cn(
            "absolute bottom-6 right-6 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
            variant === "default"
              ? "bg-[#1451cb] text-white"
              : "bg-white/20 text-white"
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
