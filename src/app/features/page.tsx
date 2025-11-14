import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LiveEditorFeature } from "@/components/landing/features/LiveEditorFeature";
import { PaymentTrackingFeature } from "@/components/landing/features/PaymentTrackingFeature";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeaturesHero } from "@/components/landing/features/FeatureHero";

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <FeaturesHero />
        <LiveEditorFeature />
        <PaymentTrackingFeature />

        <section className="py-24 bg-[#1451cb] text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to upgrade your workflow?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join hundreds of Nigerian businesses getting paid faster with
              Invoiss.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-[#1451cb]"
            >
              <Link href="/register">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
