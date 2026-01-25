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

async function sendInvoiceWithPdf({
  invoiceId,
  pdfBlob,
}: {
  invoiceId: string;
  pdfBlob: Blob;
}) {
  const formData = new FormData();
  formData.append("file", pdfBlob, "invoice.pdf");

  const response = await fetch(`/api/invoices/${invoiceId}/send`, {
    method: "POST",
    body: formData,
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
  const [isSending, setIsSending] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const canRecordPayment =
    invoice.status !== "DRAFT" &&
    invoice.status !== "CANCELLED" &&
    invoice.balanceDue > 0;

  const sendMutation = useMutation({
    mutationFn: sendInvoiceWithPdf,
    onSuccess: () => {
      toast.success("Invoice sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSending(false);
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

  const generatePdfBlob = async () => {
    const originalElement = document.getElementById("invoice-preview-capture");
    if (!originalElement) throw new Error("Preview not found");

    const ghostContainer = document.createElement("div");
    ghostContainer.style.position = "absolute";
    ghostContainer.style.top = "-9999px";
    ghostContainer.style.left = "0";
    ghostContainer.style.width = "800px";
    document.body.appendChild(ghostContainer);

    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    clonedElement.style.margin = "0";
    clonedElement.style.padding = "0";
    clonedElement.style.width = "800px";
    clonedElement.style.minHeight = "auto";
    ghostContainer.appendChild(clonedElement);

    try {
      const imgData = await toPng(clonedElement, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: 800,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = (clonedElement.scrollHeight * pdfWidth) / 800;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      return pdf.output("blob");
    } finally {
      document.body.removeChild(ghostContainer);
    }
  };

  const handleSend = async () => {
    if (!isProUser) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsSending(true);
    try {
      toast.info("Generating PDF and sending...");
      const pdfBlob = await generatePdfBlob();

      sendMutation.mutate({ invoiceId: invoice.id, pdfBlob });
    } catch (error) {
      console.error("Failed to generate PDF for sending", error);
      toast.error("Failed to generate PDF. Please try again.");
      setIsSending(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const pdfBlob = await generatePdfBlob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded perfectly!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleMarkAsSent = () => {
    statusMutation.mutate({ id: invoice.id, status: "SENT" });
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
                <Banknote className="h-4 w-4 mr-0 lg:mr-2" />
                <span className="hidden lg:flex">Record Payment</span>
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
                  <CheckCircle className="h-4 w-4 mr-0 lg:mr-2" />
                )}
                <span className="hidden lg:flex">Mark as Sent</span>
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
                <Download className="h-4 w-4 mr-0 lg:mr-2" />
              )}
              <span className="hidden lg:flex">
                {isDownloading ? "Generating..." : "Download PDF"}
              </span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSend}
              disabled={isSending}
              className="bg-[#1451cb] hover:bg-[#1451cb]/90"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-0 lg:mr-2" />
              )}
              <span className="hidden lg:flex">
                {isSending ? "Sending..." : "Send Invoice"}
              </span>
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
