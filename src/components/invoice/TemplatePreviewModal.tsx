"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";
import Image from "next/image";

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseTemplate: () => void;
}

export function TemplatePreviewModal({
  template,
  open,
  onOpenChange,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {template.name}
            {template.isPremium && (
              <span className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                Pro
              </span>
            )}
          </DialogTitle>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onUseTemplate();
                onOpenChange(false);
              }}
              className="bg-[#1451cb] hover:bg-[#1451cb]/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-lg overflow-hidden bg-white">
            {template.thumbnail ? (
              <Image
                src={template.thumbnail}
                alt={template.name}
                width={800}
                height={1131}
                className="w-full h-auto"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-[600px] bg-white text-gray-400 border-2 border-dashed border-gray-200">
                No Preview Available
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
