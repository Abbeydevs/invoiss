import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";
import Sessionprovider from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PublicLayoutWrapper } from "@/components/providers/PublicLayoutWrapper";

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
      <body className={cn(albertSans.className, "tracking-tighter")}>
        <QueryProvider>
          <Sessionprovider>
            <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
          </Sessionprovider>
        </QueryProvider>
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
