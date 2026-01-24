"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, MessageCircle, ExternalLink } from "lucide-react";

export default function HelpPage() {
  return (
    <DashboardLayout
      title="Help & Support"
      subtitle="Find answers or contact our support team"
    >
      <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help (e.g. 'How to create invoice')"
            className="pl-10 h-12 text-base bg-white"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Chat on WhatsApp
              </CardTitle>
              <CardDescription>
                Get instant answers from our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                asChild
              >
                <a
                  href="https://wa.me/2347079498062"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start Chat <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-blue-600" />
                Email Support
              </CardTitle>
              <CardDescription>
                Send us a detailed message. We reply in 24hrs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                asChild
              >
                <a href="mailto:support@invoiss.com">
                  Send Email <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Frequently Asked Questions
          </h3>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">
                    How do I create my first invoice?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Go to the <strong>Invoices</strong> tab and click &quot;New
                    Invoice&quot;. You can choose a template or start from
                    scratch. Fill in your customer&apos;s details and add items.
                    You can save it as a <em>Draft</em> to finish later, or
                    click <em>Preview & Continue</em> to finalize it.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">
                    How do I get paid through Invoiss?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    First, ensure you have added your Bank Account details in
                    the Settings page. When you send an invoice, your bank
                    details will appear on it. If you are on the{" "}
                    <strong>Pro Plan</strong>, you can also enable online
                    payments to let customers pay instantly via card or
                    transfer.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">
                    Can I edit an invoice after sending it?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    No, once an invoice status is changed to{" "}
                    <strong>Sent</strong> or <strong>Paid</strong>, it is locked
                    to prevent accounting errors. If you made a mistake, we
                    recommend cancelling the invoice and creating a new one (you
                    can duplicate the old one to save time).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-medium">
                    What are the benefits of the Pro Plan?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    The Pro Plan unlocks:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Unlimited Invoices</li>
                      <li>Premium Templates (Executive, Summit, etc.)</li>
                      <li>Online Payments via Wallet</li>
                      <li>
                        Removing the &quot;Created with Invoiss&quot; watermark
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-medium">
                    Is my data secure?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Yes. We use industry-standard encryption for all data. Your
                    password is hashed securely, and we do not store your credit
                    card information directly (payments are processed by secure
                    partners like Nomba).
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
