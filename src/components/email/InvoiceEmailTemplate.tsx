import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { format } from "date-fns";
import * as React from "react";

interface InvoiceEmailTemplateProps {
  invoiceNumber: string;
  totalAmount: number;
  invoiceDate: Date;
  dueDate: Date;
  customerName: string;
  businessName: string;
  businessLogo?: string | null;
  invoiceViewUrl: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export function InvoiceEmailTemplate({
  invoiceNumber,
  totalAmount,
  invoiceDate,
  dueDate,
  customerName,
  businessName,
  businessLogo,
  invoiceViewUrl,
}: InvoiceEmailTemplateProps) {
  const previewText = `New invoice from ${businessName} for ${formatCurrency(totalAmount)}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg shadow-sm my-12 mx-auto max-w-lg p-10">
            <Section className="text-center mb-8">
              {businessLogo ? (
                <Img
                  src={businessLogo}
                  width="140"
                  height="70"
                  alt={`${businessName} Logo`}
                  className="object-contain my-0 mx-auto"
                />
              ) : (
                <Heading
                  as="h1"
                  className="text-2xl font-bold text-gray-900 m-0"
                >
                  {businessName}
                </Heading>
              )}
            </Section>

            <Heading
              as="h2"
              className="text-xl font-semibold text-gray-800 text-center m-0"
            >
              You have a new invoice
            </Heading>

            <Text className="text-gray-700 text-4xl font-bold text-center mt-4 mb-8 m-0">
              {formatCurrency(totalAmount)}
            </Text>

            <Text className="text-gray-600 text-base leading-6">
              Hi {customerName},
            </Text>
            <Text className="text-gray-600 text-base leading-6">
              This is an invoice for {formatCurrency(totalAmount)} from{" "}
              {businessName}.
            </Text>

            <Section className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Invoice Number</span>
                <span className="text-gray-900 font-medium">
                  {invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Invoice Date</span>
                <span className="text-gray-900 font-medium">
                  {format(invoiceDate, "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="text-gray-900 font-medium">
                  {format(dueDate, "MMM d, yyyy")}
                </span>
              </div>
            </Section>

            <Section className="text-center">
              <Button
                href={invoiceViewUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-base"
              >
                View Invoice and Pay
              </Button>
            </Section>

            <Text className="text-gray-500 text-sm mt-8">
              If you have any questions, please reply to this email.
            </Text>
            <Text className="text-gray-500 text-sm">
              Thank you for your business!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
