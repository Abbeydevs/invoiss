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
import { Crown } from "lucide-react";

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
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-red-500 mb-2">
            Something went wrong loading templates.
          </p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      );
    }

    const systemTemplates = templateData?.defaultTemplates || [];

    const freeTemplates = systemTemplates.filter(
      (t) => !t.isPremium && t.id !== "custom",
    );

    const premiumTemplates = systemTemplates.filter(
      (t) => t.isPremium && t.id !== "custom",
    );

    const userCustomTemplates = templateData?.customTemplates || [];

    return (
      <div className="space-y-12 pb-20 lg:pb-0">
        <section>
          <div className="mb-6 px-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Free Templates
            </h2>
            <p className="text-sm text-gray-500">
              Professional designs available for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            <StartFromScratchCard />

            {freeTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                href={`/dashboard/invoices/create?template=${template.id}`}
              />
            ))}
          </div>
        </section>

        {premiumTemplates.length > 0 && (
          <section className="pt-4 border-t border-gray-100/50">
            <div className="mb-6 px-1">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                  Premium Templates
                </h2>
                {!isPro && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm ring-1 ring-white/20">
                    Pro Only
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {isPro
                  ? "Exclusive designs included in your plan."
                  : "Unlock these exclusive designs with Pro."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {premiumTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  href={`/dashboard/invoices/create?template=${template.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {userCustomTemplates.length > 0 && (
          <section className="pt-4 border-t border-gray-100/50">
            <div className="mb-6 px-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                My Custom Templates
              </h2>
              <p className="text-sm text-gray-500">Templates you have saved.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {userCustomTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  href={`/dashboard/invoices/create?template=${template.id}`}
                />
              ))}
            </div>
          </section>
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
