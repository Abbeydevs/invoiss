import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { PricingFAQ } from "@/components/landing/pricing/PricingFAQ";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="-mt-20">
          <Pricing />
        </div>

        <PricingFAQ />
      </main>
      <Footer />
    </div>
  );
}
