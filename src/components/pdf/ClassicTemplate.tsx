/* eslint-disable jsx-a11y/alt-text */
"use client";

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { InvoiceDetail } from "@/lib/types";
import { format } from "date-fns";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx0.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: "#1a202c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  companyDetails: {
    maxWidth: "50%",
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: "contain",
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#000000",
  },
  companyAddress: {
    fontSize: 10,
    color: "#4a5568",
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#000000",
    textAlign: "right",
  },
  invoiceNumber: {
    fontSize: 11,
    color: "#4a5568",
    textAlign: "right",
    marginTop: 4,
  },
  billToSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  billTo: {
    maxWidth: "45%",
  },
  billToLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#4a5568",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  billToName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a202c",
  },
  billToAddress: {
    fontSize: 10,
    color: "#4a5568",
    marginTop: 2,
    lineHeight: 1.4,
  },
  datesSection: {
    maxWidth: "45%",
    textAlign: "right",
  },
  dateItem: {
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#4a5568",
  },
  dateValue: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a202c",
    marginTop: 2,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f7fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeaderCol: {
    padding: 8,
    fontWeight: 700,
    color: "#4a5568",
    fontSize: 10,
    textTransform: "uppercase",
  },
  thDescription: {
    width: "50%",
  },
  thQty: {
    width: "15%",
    textAlign: "center",
  },
  thPrice: {
    width: "15%",
    textAlign: "right",
  },
  thAmount: {
    width: "20%",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowCol: {
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
  },
  colDescription: {
    width: "50%",
  },
  colQty: {
    width: "15%",
    textAlign: "center",
  },
  colPrice: {
    width: "15%",
    textAlign: "right",
  },
  colAmount: {
    width: "20%",
    textAlign: "right",
    fontWeight: 700,
  },
  summarySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  notesSection: {
    width: "60%",
    paddingRight: 20,
  },
  notesLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a202c",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.4,
  },
  totalsSection: {
    width: "35%",
  },
  totalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#4a5568",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: "#1a202c",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  totalDue: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  totalDueLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a202c",
  },
  totalDueValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1451cb",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#a0aec0",
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-45deg)",
    fontSize: 60,
    color: "rgba(0, 0, 0, 0.05)",
    fontWeight: 700,
  },
});

interface ClassicTemplateProps {
  invoice: InvoiceDetail;
  isProUser: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export function ClassicTemplate({ invoice, isProUser }: ClassicTemplateProps) {
  const profile = invoice.profile;
  const customer = invoice.customer;
  const bankAccount = invoice.bankAccount;

  return (
    <Document title={invoice.invoiceNumber}>
      <Page size="A4" style={styles.page}>
        {!isProUser && (
          <Text style={styles.watermark}>Created with Invoiss</Text>
        )}

        <View style={styles.header}>
          <View style={styles.companyDetails}>
            {profile?.logoUrl ? (
              <Image style={styles.logo} src={profile.logoUrl} />
            ) : (
              <Text style={styles.companyName}>
                {profile?.businessName || "Your Company"}
              </Text>
            )}
            <Text style={styles.companyAddress}>{profile?.address}</Text>
            <Text style={styles.companyAddress}>{profile?.phone}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.billToSection}>
          <View style={styles.billTo}>
            <Text style={styles.billToLabel}>Bill To</Text>
            <Text style={styles.billToName}>
              {customer?.name || invoice.billToName}
            </Text>
            <Text style={styles.billToAddress}>
              {customer?.email || invoice.billToEmail}
            </Text>
            <Text style={styles.billToAddress}>
              {customer?.phone || invoice.billToPhone}
            </Text>
            <Text style={styles.billToAddress}>
              {customer?.address || invoice.billToAddress}
            </Text>
          </View>
          <View style={styles.datesSection}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Invoice Date</Text>
              <Text style={styles.dateValue}>
                {format(new Date(invoice.invoiceDate), "MMMM d, yyyy")}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateValue}>
                {format(new Date(invoice.dueDate), "MMMM d, yyyy")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCol, styles.thDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCol, styles.thQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCol, styles.thPrice]}>Price</Text>
            <Text style={[styles.tableHeaderCol, styles.thAmount]}>Amount</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text
                style={[
                  styles.tableRowCol,
                  styles.colDescription,
                  styles.tableCell,
                ]}
              >
                {item.description}
              </Text>
              <Text
                style={[styles.tableRowCol, styles.colQty, styles.tableCell]}
              >
                {item.quantity}
              </Text>
              <Text
                style={[styles.tableRowCol, styles.colPrice, styles.tableCell]}
              >
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text
                style={[styles.tableRowCol, styles.colAmount, styles.tableCell]}
              >
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summarySection}>
          <View style={styles.notesSection}>
            {bankAccount && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.notesLabel}>Payment Details</Text>
                <Text style={styles.notesText}>{bankAccount.bankName}</Text>
                <Text style={styles.notesText}>
                  {bankAccount.accountNumber}
                </Text>
                <Text style={styles.notesText}>{bankAccount.accountName}</Text>
              </View>
            )}
            {invoice.notes && (
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.notesLabel}>Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}
            {invoice.paymentTerms && (
              <View>
                <Text style={styles.notesLabel}>Payment Terms</Text>
                <Text style={styles.notesText}>{invoice.paymentTerms}</Text>
              </View>
            )}
          </View>
          <View style={styles.totalsSection}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(invoice.subtotal)}
              </Text>
            </View>
            {invoice.taxAmount && invoice.taxAmount > 0 && (
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(invoice.taxAmount)}
                </Text>
              </View>
            )}
            {invoice.discountAmount && invoice.discountAmount > 0 && (
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  -{formatCurrency(invoice.discountAmount)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalDue}>
              <Text style={styles.totalDueLabel}>Total Due</Text>
              <Text style={styles.totalDueValue}>
                {formatCurrency(invoice.balanceDue)}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Thank you for your business.</Text>
      </Page>
    </Document>
  );
}
