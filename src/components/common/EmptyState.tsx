"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionButton,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-200 shadow-none">
      <CardContent className="p-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <Icon className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 mt-2 mb-6">{description}</p>
        {actionButton}
      </CardContent>
    </Card>
  );
}
