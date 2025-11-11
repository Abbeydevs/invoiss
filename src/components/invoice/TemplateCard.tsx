"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Sparkles } from "lucide-react";
import { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  href: string;
}

export function TemplateCard({ template, href }: TemplateCardProps) {
  return (
    <Card className="border-0 shadow-lg transition-all hover:shadow-xl group relative overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-sm">Template Preview</span>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          {template.isPremium && (
            <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              Pro
            </div>
          )}
        </div>
      </CardContent>

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement preview modal
            alert(`Previewing ${template.name}`);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          asChild
          size="sm"
          className="bg-[#1451cb] hover:bg-[#1451cb]/90"
        >
          <Link href={href}>
            <Plus className="h-4 w-4 mr-2" />
            Use Template
          </Link>
        </Button>
      </div>
    </Card>
  );
}

export function StartFromScratchCard() {
  return (
    <Link href="/dashboard/invoices/create?template=custom">
      <Card className="border-2 border-dashed border-gray-300 shadow-none h-full transition-all hover:shadow-lg hover:border-blue-500 group">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-500 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="font-semibold text-gray-900">Start from Scratch</h3>
          <p className="text-sm text-gray-500">
            Use the plain, default layout to build your invoice.
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
