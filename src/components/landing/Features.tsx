import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Wallet, Send, Sparkles, ArrowRight } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional Invoices",
    description:
      "Create beautiful, branded invoices in seconds. Choose a template, add your logo, and impress your clients.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Send,
    title: "Send & Track",
    description:
      "Email invoices directly to your clients and get notified when they are viewed. Stop guessing, start knowing.",
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Wallet,
    title: "Get Paid Faster",
    description:
      "Track payments, record transactions, and manage your cash flow with our simple, integrated wallet.",
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 md:py-32 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              POWERFUL FEATURES
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-6">
            Everything you need.{" "}
            <span className="bg-gradient-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
              Nothing you don&apos;t.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Focus on your work, not on billing. Invoiss is built to be simple,
            powerful, and fast.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <CardHeader className="relative z-10 p-8">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </CardTitle>

                {/* Description */}
                <CardDescription className="text-gray-600 text-base leading-relaxed mb-4">
                  {feature.description}
                </CardDescription>

                {/* Learn More Link */}
                <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4 text-[#1451cb] group-hover:translate-x-1 transition-transform" />
                </div>
              </CardHeader>

              {/* Decorative corner element */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-y-16 translate-x-16`}
              />
            </Card>
          ))}
        </div>

        {/* Bottom CTA or Stats (Optional) */}
        <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                500+
              </p>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Active Users
              </p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                10K+
              </p>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Invoices Created
              </p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <div className="text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                98%
              </p>
              <p className="text-sm text-gray-600 font-medium mt-1">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
