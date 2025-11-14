"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LiveEditorFeature } from "@/components/landing/features/LiveEditorFeature";
import { PaymentTrackingFeature } from "@/components/landing/features/PaymentTrackingFeature";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeaturesHero } from "@/components/landing/features/FeatureHero";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function FeaturesPage() {
  const benefits = [
    "No credit card required",
    "Free forever plan",
    "Setup in 2 minutes",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <FeaturesHero />
        <LiveEditorFeature />
        <PaymentTrackingFeature />

        <section className="relative py-24 md:py-32 bg-linear-to-br from-[#1451cb] via-[#0f3fa3] to-[#1451cb] text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>

            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center mb-6 animate-bounce-slow">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20">
                  <Sparkles className="w-8 h-8 text-yellow-300" />
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
                Ready to upgrade your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">workflow?</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 10C60 2 140 2 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-yellow-300 opacity-60"
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in animation-delay-200">
                Join hundreds of Nigerian businesses getting paid faster with
                Invoiss.
              </p>

              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 animate-fade-in animation-delay-400">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in animation-delay-600">
                <Button
                  asChild
                  size="lg"
                  className="group h-14 px-10 bg-white text-[#1451cb] hover:bg-gray-50 font-semibold text-lg shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Get Started for Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-10 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white font-semibold text-lg backdrop-blur-sm transition-all duration-300 rounded-xl"
                >
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-200 text-sm animate-fade-in animation-delay-800">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-400 border-2 border-[#1451cb] flex items-center justify-center text-xs font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p>
                  <span className="font-semibold text-white">500+</span>{" "}
                  businesses already using Invoiss
                </p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          <style jsx>{`
            @keyframes blob {
              0%,
              100% {
                transform: translate(0, 0) scale(1);
              }
              33% {
                transform: translate(30px, -50px) scale(1.1);
              }
              66% {
                transform: translate(-20px, 20px) scale(0.9);
              }
            }

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

            @keyframes bounce-slow {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }

            .animate-blob {
              animation: blob 7s infinite;
            }

            .animate-bounce-slow {
              animation: bounce-slow 2s ease-in-out infinite;
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

            .animation-delay-600 {
              animation-delay: 0.6s;
            }

            .animation-delay-800 {
              animation-delay: 0.8s;
            }

            .animation-delay-2000 {
              animation-delay: 2s;
            }

            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </div>
  );
}
