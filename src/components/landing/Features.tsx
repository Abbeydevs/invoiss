import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Wallet, Send } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional Invoices",
    description:
      "Create beautiful, branded invoices in seconds. Choose a template, add your logo, and impress your clients.",
  },
  {
    icon: Send,
    title: "Send & Track",
    description:
      "Email invoices directly to your clients and get notified when they are viewed. Stop guessing, start knowing.",
  },
  {
    icon: Wallet,
    title: "Get Paid Faster",
    description:
      "Track payments, record transactions, and manage your cash flow with our simple, integrated wallet.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-[#1451cb] rounded-full mb-3">
            FEATURES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-lg text-gray-600">
            Focus on your work, not on billing. Invoiss is built to be simple,
            powerful, and fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-linear-to-br from-[#1451cb] to-[#0ea5e9] text-white flex items-center justify-center rounded-lg mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 pt-2 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
