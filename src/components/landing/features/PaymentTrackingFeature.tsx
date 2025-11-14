import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function PaymentTrackingFeature() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative bg-white rounded-2xl p-2 border border-gray-200 shadow-xl overflow-hidden">
          <div className="flex items-center gap-1.5 p-2 bg-gray-100 rounded-t-xl border-b border-gray-200">
            <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
          </div>
          <Image
            src="/images/payment-schedule.png"
            alt="Invoiss Payment Tracking and Milestones"
            width={1200}
            height={900}
            className="w-full h-auto rounded-b-xl"
            priority
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 mb-6">
            Milestones
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Track Deposits & Split Payments.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Perfect for freelancers. Record a 50% deposit upfront and track the
            balance due automatically. Your clients see exactly what is paid and
            what is owed.
          </p>

          <ul className="space-y-4">
            {[
              "Create custom payment schedules",
              "Track 'Partial' and 'Paid' statuses",
              "Clear history of every transaction",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-[#1451cb] shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
