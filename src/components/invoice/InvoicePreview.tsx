"use client";

import { InvoiceDetail } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ClassicPreview } from "./previews/ClassicPreview";
import { ModernPreview } from "./previews/ModernPreview";
import { BlankPreview } from "./previews/BlankPreview";
import { ElegantPreview } from "./previews/ElegantPreview";
import { ExecutivePreview } from "./previews/ExecutivePreview";
import { PrestigePreview } from "./previews/PrestigePreview";
import { SummitPreview } from "./previews/SummitPreview";
import { useSession } from "next-auth/react";

const Watermark = ({ isProUser }: { isProUser: boolean }) => {
  if (isProUser) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 text-6xl font-bold text-black/5 pointer-events-none z-50 whitespace-nowrap select-none">
      Created with Invoiss
    </div>
  );
};

interface InvoicePreviewProps {
  invoice: InvoiceDetail;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const { data: session } = useSession();
  const isProUser = session?.user?.planType === "PRO";
  const currency = session?.user?.currency || "NGN";
  const templateId = invoice.template?.id;

  const renderTemplate = () => {
    const props = { invoice, currency };

    switch (templateId) {
      case "custom":
        return <BlankPreview {...props} />;
      case "modern":
        return <ModernPreview {...props} />;
      case "elegant":
        return <ElegantPreview {...props} />;
      case "executive":
        return <ExecutivePreview {...props} />;
      case "prestige":
        return <PrestigePreview {...props} />;
      case "summit":
        return <SummitPreview {...props} />;
      case "classic":
      default:
        return <ClassicPreview {...props} />;
    }
  };

  return (
    <Card
      id="invoice-preview-capture"
      className="relative w-full max-w-4xl mx-auto border-0 shadow-xl overflow-hidden bg-white"
    >
      <Watermark isProUser={isProUser} />

      {renderTemplate()}
    </Card>
  );
}
