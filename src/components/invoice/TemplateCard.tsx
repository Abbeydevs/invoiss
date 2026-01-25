"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Template } from "@/lib/types";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  href: string;
}

export function TemplateCard({ template, href }: TemplateCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isProUser = session?.user?.planType === "PRO";

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleAction = (action: "preview" | "use") => {
    if (template.isPremium && !isProUser) {
      setShowUpgradeModal(true);
      return;
    }

    if (action === "preview") {
      setShowPreviewModal(true);
    } else {
      router.push(href);
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden border-0 shadow-md transition-all hover:shadow-xl active:scale-[0.98] duration-200 bg-white rounded-xl">
        <CardContent className="p-0 flex flex-col h-full">
          <div
            className="relative aspect-3/4 sm:aspect-4/3 w-full bg-gray-100 overflow-hidden cursor-pointer"
            onClick={() => handleAction("preview")}
          >
            {template.thumbnail ? (
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                <FileText className="h-8 w-8 opacity-20" />
                <span>No Preview</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

            {template.isPremium && (
              <div className="absolute top-3 right-3 z-10">
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md",
                    isProUser
                      ? "bg-amber-100/90 text-amber-700 border border-amber-200"
                      : "bg-gray-900/90 text-white border border-gray-700",
                  )}
                >
                  {isProUser ? (
                    <Sparkles className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                  <span>PRO</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3 border-t border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Professional Invoice
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAction("preview")}
                className="w-full text-xs h-9 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Preview
              </Button>

              <Button
                size="sm"
                onClick={() => handleAction("use")}
                className={cn(
                  "w-full text-xs h-9 shadow-sm",
                  template.isPremium && !isProUser
                    ? "bg-gray-900 hover:bg-gray-800 text-white"
                    : "bg-[#1451cb] hover:bg-[#1451cb]/90 text-white",
                )}
              >
                {template.isPremium && !isProUser ? (
                  <>
                    <Lock className="h-3.5 w-3.5 mr-1.5" />
                    Unlock
                  </>
                ) : (
                  <>
                    Use
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />

      <TemplatePreviewModal
        template={template}
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        onUseTemplate={() => router.push(href)}
      />
    </>
  );
}

import { FileText } from "lucide-react";

export function StartFromScratchCard() {
  return (
    <Link
      href="/dashboard/invoices/create?template=custom"
      className="block h-full"
    >
      <Card className="h-full border-2 border-dashed border-gray-300 shadow-none hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200 group rounded-xl bg-gray-50/50">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-[#1451cb] transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1451cb] transition-colors">
              Start from Scratch
            </h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
              Create a simple, clean invoice with no predefined styling.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-[#1451cb] hover:text-[#1451cb] hover:bg-blue-100/50 group-hover:bg-blue-100/50 -mb-2"
          >
            Create Blank <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
