"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/lib/types";
import { Check, Sparkles, X, Lock } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UpgradeModal } from "@/components/billing/UpgradeModal";

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
  const { data: session } = useSession();
  const isProUser = session?.user?.planType === "PRO";
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!template) return null;

  const handleUse = () => {
    if (template.isPremium && !isProUser) {
      setShowUpgrade(true);
    } else {
      onUseTemplate();
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden rounded-2xl flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
            <div className="flex flex-col gap-1">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                {template.name}
                {template.isPremium && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                    <Sparkles className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </DialogTitle>
              <p className="text-sm text-gray-500 hidden sm:block">
                Preview how your invoice will look with this template.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-8">
            <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-lg overflow-hidden bg-white ring-1 ring-black/5">
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
                <div className="flex items-center justify-center h-[400px] sm:h-[600px] bg-white text-gray-400 border-2 border-dashed border-gray-200 m-8 rounded-lg">
                  No Preview Available
                </div>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hidden sm:flex"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUse}
              className={
                template.isPremium && !isProUser
                  ? "bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                  : "bg-[#1451cb] hover:bg-[#1451cb]/90 w-full sm:w-auto"
              }
              size="lg"
            >
              {template.isPremium && !isProUser ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Unlock Template
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Use This Template
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal open={showUpgrade} onOpenChange={setShowUpgrade} />
    </>
  );
}
