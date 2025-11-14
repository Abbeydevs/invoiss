"use client";

import Image from "next/image";
import Link from "next/link";

export function FeaturesHero() {
  return (
    <section className="relative bg-linear-to-b from-white via-blue-50/30 to-white py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-sm font-medium text-blue-900">
            Trusted by 1,000+ Nigerian Businesses
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight animate-slide-up">
          More Than Just Invoices.
          <br />
          <span className="relative inline-block mt-2">
            <span className="relative z-10 bg-linear-to-r from-[#1451cb] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              A Complete Financial Toolkit.
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-200/40 z-0 transform -skew-x-12"></span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up animation-delay-200">
          From creating estimates to tracking every Naira, Invoiss gives you the
          tools to look professional and get paid faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up animation-delay-400">
          <Link
            href="/register"
            className="cursor-pointer group relative inline-flex items-center gap-2 bg-[#1451cb] hover:bg-[#0f3fa3] text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Get Started Free
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <button className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            Watch Demo
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-6xl mx-auto animate-slide-up animation-delay-600">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl opacity-20 blur-2xl"></div>

          {/* Image container */}
          <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 bg-white p-2 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="rounded-xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
              <Image
                src="/images/dashboard.png"
                alt="Invoiss Dashboard showcasing invoice management and financial tools"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>

          {/* Floating elements */}
          <div className="hidden lg:block absolute -left-8 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-float">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">
                  Invoice Sent
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block absolute -right-8 top-2/3 bg-white rounded-2xl shadow-xl p-4 animate-float animation-delay-2000">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">₦245,000</p>
                <p className="text-xs text-gray-500">Payment Received</p>
              </div>
            </div>
          </div>
        </div>
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
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

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
