import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes! There are no long-term contracts. You can cancel your subscription at any time from your dashboard settings.",
  },
  {
    question: "What happens to my data if I downgrade?",
    answer:
      "If you downgrade to the free plan, you will lose access to Pro features like the Wallet and Email sending, but all your existing invoice data will be preserved safe and sound.",
  },
  {
    question: "Do you charge transaction fees?",
    answer:
      "No. Invoiss does not charge fees on your invoice payments. However, if you use online payment gateways (like Paystack/Flutterwave), they may charge their standard processing fees.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 7-day free trial for the Pro plan so you can test it risk-free. We generally do not offer refunds for partial months, but please contact support if you have a specific issue.",
  },
];

export function PricingFAQ() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
