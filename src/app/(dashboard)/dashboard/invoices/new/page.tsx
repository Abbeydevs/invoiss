"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  TemplateCard,
  StartFromScratchCard,
} from "@/components/invoice/TemplateCard";
import { getTemplates } from "@/lib/api/action";
import { ListSkeleton } from "@/components/common/SkeletonLoader";
import { useSession } from "next-auth/react";

export default function NewInvoiceTemplatePage() {
  const { data: session } = useSession();
  const isPro = session?.user?.planType === "PRO";

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

    // Filter out "custom" because we have a dedicated StartFromScratchCard for it
    const defaultTemplates = templateData?.defaultTemplates.filter(
      (t) => t.id !== "custom",
    );
    const customTemplates = templateData?.customTemplates.filter(
      (t) => t.id !== "custom",
    );

    return (
      <div className="space-y-8">
        {/* Free Templates Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Free Templates
            </h2>
            <p className="text-sm text-gray-500">Available for all users</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StartFromScratchCard />

            {defaultTemplates?.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                href={`/dashboard/invoices/create?template=${template.id}`}
              />
            ))}
          </div>
        </div>

        {/* Premium Templates Section */}
        {customTemplates && customTemplates.length > 0 && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Premium Templates
                </h2>
                <p className="text-sm text-gray-500">
                  {isPro
                    ? "Unlock the full collection"
                    : "Upgrade to Pro to access"}
                </p>
              </div>
              {!isPro && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-blue-600 to-purple-600 text-white">
                  PRO ONLY
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  href={`/dashboard/invoices/create?template=${template.id}`}
                />
              ))}
            </div>
          </div>
        )}
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
