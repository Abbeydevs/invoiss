import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <DashboardLayout
      title="Create Invoice"
      subtitle="Fill in the details below to create a new invoice"
    >
      <InvoiceForm />
    </DashboardLayout>
  );
}
