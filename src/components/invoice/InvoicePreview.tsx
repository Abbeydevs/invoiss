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
  const templateId = invoice.template?.id;

  let TemplateComponent;
  switch (templateId) {
    case "custom":
      TemplateComponent = <BlankPreview invoice={invoice} />;
      break;
    case "modern":
      TemplateComponent = <ModernPreview invoice={invoice} />;
      break;
    case "elegant":
      TemplateComponent = <ElegantPreview invoice={invoice} />;
      break;
    case "executive":
      TemplateComponent = <ExecutivePreview invoice={invoice} />;
      break;
    case "prestige":
      TemplateComponent = <PrestigePreview invoice={invoice} />;
      break;
    case "summit":
      TemplateComponent = <SummitPreview invoice={invoice} />;
      break;
    case "classic":
    default:
      TemplateComponent = <ClassicPreview invoice={invoice} />;
  }

  return (
    <Card
      id="invoice-preview-capture"
      className="relative w-full max-w-4xl mx-auto border-0 shadow-xl overflow-hidden bg-white"
    >
      <Watermark isProUser={isProUser} />

      {TemplateComponent}
    </Card>
  );
}
