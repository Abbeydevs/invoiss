"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes! There are no long-term contracts. You can cancel your subscription at any time from your dashboard settings.",
    icon: "✨",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "If you downgrade to the free plan, you will lose access to Pro features like the Wallet and Email sending, but all your existing invoice data will be preserved safe and sound.",
    icon: "💾",
  },
  {
    question: "Do you charge transaction fees?",
    answer:
      "No. Invoiss does not charge fees on your invoice payments. However, if you use online payment gateways (like Paystack/Flutterwave), they may charge their standard processing fees.",
    icon: "💰",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 7-day free trial for the Pro plan so you can test it risk-free. We generally do not offer refunds for partial months, but please contact support if you have a specific issue.",
    icon: "🔄",
  },
];

export function PricingFAQ() {
  return (
    <section className="relative bg-linear-to-b from-white via-gray-50 to-white py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200 shadow-lg">
                <HelpCircle className="w-8 h-8 text-[#1451cb]" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white shadow-md">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-linear-to-r from-blue-200 to-purple-200 z-0 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. Can&apos;t find what
            you&apos;re looking for?
          </p>
        </div>

        <div className="mb-12 animate-fade-in animation-delay-200">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-2xl px-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#1451cb] py-6 hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {faq.icon}
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed text-base pb-6 pt-2">
                  <div className="pl-12">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-8 md:p-10 border border-blue-100 shadow-lg animate-fade-in animation-delay-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <MessageCircle className="w-6 h-6 text-[#1451cb]" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Still have questions?
                </h3>
              </div>
              <p className="text-gray-600">
                Our support team is here to help. Get in touch and we&apos;ll
                respond as soon as possible.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                variant="outline"
                className="border-2 border-gray-300 hover:border-[#1451cb] hover:text-[#1451cb] hover:bg-blue-50 font-semibold"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                asChild
                className="bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#0f3fa3] hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 opacity-30">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-gray-300"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out backwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
}
