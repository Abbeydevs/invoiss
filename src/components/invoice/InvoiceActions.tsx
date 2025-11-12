"use client";

import { useSession } from "next-auth/react";
import { InvoiceDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Download,
  Send,
  Loader2,
  ArrowLeft,
  CheckCircle,
  Banknote,
} from "lucide-react";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { RecordPaymentModal } from "./RecordPaymentModal";

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

async function updateStatus({ id, status }: { id: string; status: string }) {
  const response = await fetch(`/api/invoices/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update status");
  }
  return response.json();
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const isProUser = session?.user?.planType === "PRO";

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const canRecordPayment =
    invoice.status !== "DRAFT" &&
    invoice.status !== "CANCELLED" &&
    invoice.balanceDue > 0;

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

  const statusMutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      toast.success("Invoice marked as Sent");
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

  const handleMarkAsSent = () => {
    statusMutation.mutate({ id: invoice.id, status: "SENT" });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("invoice-preview-capture");
      if (!element) {
        throw new Error("Invoice preview not found");
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const imgData = await toPng(element, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        quality: 1,
        width: element.offsetWidth,
        height: element.offsetHeight,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = pdfWidth;
      const imgHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      if (imgHeight > pdfHeight) {
        const scale = pdfHeight / imgHeight;
        const scaledWidth = imgWidth * scale;
        const scaledHeight = pdfHeight;
        const xOffset = (pdfWidth - scaledWidth) / 2;
        pdf.addImage(imgData, "PNG", xOffset, 0, scaledWidth, scaledHeight);
      } else {
        const yOffset = (pdfHeight - imgHeight) / 2;
        pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      }

      pdf.save(`${invoice.invoiceNumber}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 w-full bg-white shadow-sm p-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard/invoices")}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {invoice.invoiceNumber}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {canRecordPayment && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaymentModalOpen(true)}
                className="text-green-700 border-green-200 hover:bg-green-50"
              >
                <Banknote className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            )}

            {invoice.status === "DRAFT" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsSent}
                disabled={statusMutation.isPending}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
              >
                {statusMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Mark as Sent
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSend}
              disabled={sendMutation.isPending}
              className="bg-[#1451cb] hover:bg-[#1451cb]/90"
            >
              {sendMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Invoice
            </Button>
          </div>
        </div>
      </div>

      <RecordPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        invoiceId={invoice.id}
        balanceDue={invoice.balanceDue}
        invoiceNumber={invoice.invoiceNumber}
      />

      <UpgradeModal
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
      />
    </>
  );
}
