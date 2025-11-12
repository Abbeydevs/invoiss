"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Sparkles, Lock } from "lucide-react";
import { Template } from "@/lib/types";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import Image from "next/image";

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
      <Card className="border-0 shadow-lg transition-all hover:shadow-xl group relative overflow-hidden h-[300px]">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="relative flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
            {template.thumbnail ? (
              <Image
                src={template.thumbnail}
                alt={template.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Preview Available
              </div>
            )}

            {template.isPremium && !isProUser && (
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10">
                <Lock className="h-3 w-3" /> Pro
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              {template.isPremium && (
                <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  Pro
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleAction("preview");
            }}
            className="bg-white text-gray-900 border-0 hover:bg-gray-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              handleAction("use");
            }}
            className="bg-[#1451cb] hover:bg-[#1451cb]/90 border-0"
          >
            {template.isPremium && !isProUser ? (
              <Lock className="h-4 w-4 mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Use Template
          </Button>
        </div>
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

export function StartFromScratchCard() {
  return (
    <Link href="/dashboard/invoices/create?template=custom">
      <Card className="border-2 border-dashed border-gray-300 shadow-none h-[300px] transition-all hover:shadow-lg hover:border-blue-500 group cursor-pointer">
        <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
            <Plus className="h-8 w-8 text-gray-400 group-hover:text-[#1451cb] transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Start from Scratch
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Simple, clean invoice layout
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
