"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  TemplateCard,
  StartFromScratchCard,
} from "@/components/invoice/TemplateCard";
import { getTemplates } from "@/lib/api/action";
import { ListSkeleton } from "@/components/common/SkeletonLoader";

export default function NewInvoiceTemplatePage() {
  const {
    data: templateData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });

  const renderContent = () => {
    if (isLoading) {
      return <ListSkeleton items={3} />;
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error.message}</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StartFromScratchCard />

        {templateData?.defaultTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            href={`/dashboard/invoices/create?template=${template.id}`}
          />
        ))}

        {templateData?.customTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            href={`/dashboard/invoices/create?template=${template.id}`}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout
      title="Choose a Template"
      subtitle="Select a design to start your invoice"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
