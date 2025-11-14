import Image from "next/image";

export function FeaturesHero() {
  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          More Than Just Invoices. <br />
          <span className="text-[#1451cb]">A Complete Financial Toolkit.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
          From creating estimates to tracking every Naira, Invoiss gives you the
          tools to look professional and get paid faster.
        </p>

        <div className="relative max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden border border-gray-200">
          <Image
            src="/images/dashboard.png"
            alt="Invoiss Dashboard"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
