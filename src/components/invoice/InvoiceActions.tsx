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

interface InvoiceActionsProps {
  invoice: InvoiceDetail;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const { data: session } = useSession();
  const isProUser = session?.user?.planType === "PRO";

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSend = () => {
    if (!isProUser) {
      // TODO: Open Upgrade Modal
      alert("Upgrade to Pro to send invoices directly!");
      return;
    }
    // TODO: Implement send logic
    alert("Sending invoice... (Not implemented)");
  };

  const DownloadButton = (
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Download PDF
    </Button>
  );

  return (
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

          <Button variant="outline" size="sm" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
