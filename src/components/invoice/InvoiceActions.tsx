/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useSession } from "next-auth/react";
import { InvoiceDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Send, Loader2 } from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ClassicTemplate } from "@/components/pdf/ClassicTemplate";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpgradeModal } from "../billing/UpgradeModal";

interface InvoiceActionsProps {
  invoice: InvoiceDetail;
}

async function sendInvoice(invoiceId: string) {
  const response = await fetch(`/api/invoices/${invoiceId}/send`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send invoice");
  }

  return response.json();
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isProUser = session?.user?.planType === "PRO";

  const [isClient, setIsClient] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendMutation = useMutation({
    mutationFn: sendInvoice,
    onSuccess: () => {
      toast.success("Invoice sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSend = () => {
    if (!isProUser) {
      setIsUpgradeModalOpen(true);
      return;
    }
    sendMutation.mutate(invoice.id);
  };

  const DownloadButton = (
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );

  return (
    <>
      <Card className="border-0 shadow-lg mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Status:</span>
            <InvoiceStatusBadge status={invoice.status} />
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {isClient ? (
              <PDFDownloadLink
                document={
                  <ClassicTemplate invoice={invoice} isProUser={isProUser} />
                }
                fileName={`${invoice.invoiceNumber}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <Button variant="outline" size="sm" disabled>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating PDF...
                    </Button>
                  ) : (
                    DownloadButton
                  )
                }
              </PDFDownloadLink>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSend}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
      />
    </>
  );
}
