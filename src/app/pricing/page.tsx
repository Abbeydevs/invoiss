import { Pricing } from "@/components/landing/Pricing";
import { PricingFAQ } from "@/components/landing/pricing/PricingFAQ";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <div className="-mt-20">
          <Pricing />
        </div>

        <PricingFAQ />
      </main>
    </div>
  );
}
