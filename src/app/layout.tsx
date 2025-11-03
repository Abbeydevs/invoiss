import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import Sessionprovider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Invoiss - Invoice Management Made Easy",
  description: "Create, send and track invoices effortlessly with Invoiss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={albertSans.className}>
        <Sessionprovider>{children}</Sessionprovider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #e5e7eb",
            },
          }}
        />
      </body>
    </html>
  );
}
