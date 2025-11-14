import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
// import { PricingHero } from "@/components/landing/pricing/PricingHero";
import { Pricing } from "@/components/landing/Pricing"; // Reuse
import { PricingFAQ } from "@/components/landing/pricing/PricingFAQ";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        {/* <PricingHero /> */}

        <div className="-mt-20">
          <Pricing />
        </div>

        <PricingFAQ />

        <section className="py-24 bg-white text-center border-t border-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Still have questions?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
              Our support team is here to help you get set up and paid faster.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#1451cb] hover:bg-[#1451cb]/90 h-12 px-8"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
