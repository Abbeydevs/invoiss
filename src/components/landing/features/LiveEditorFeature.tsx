"use client";

import { CheckCircle2, Zap, Eye, Calculator } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LiveEditorFeature() {
  type ColorType = "blue" | "purple" | "green";

  const features: Array<{
    icon: typeof Eye;
    text: string;
    color: ColorType;
  }> = [
    {
      icon: Eye,
      text: "Real-time preview as you type",
      color: "blue",
    },
    {
      icon: Zap,
      text: "Choose from professional templates",
      color: "purple",
    },
    {
      icon: Calculator,
      text: "Auto-calculated totals and taxes",
      color: "green",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-linear-to-br from-white via-blue-50/20 to-purple-50/20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-linear-to-r from-blue-50 to-purple-50 px-4 py-2 text-sm font-semibold text-blue-800 mb-6 shadow-sm">
              <Zap className="w-4 h-4" />
              WYSIWYG Editor
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Design Invoices{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  in Real-Time.
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-linear-to-r from-blue-200 to-purple-200 z-0 transform -rotate-1"></span>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Stop guessing what your invoice will look like. With our
              split-screen editor, you type on the left and see the result on
              the right instantly.
            </p>

            <ul className="space-y-5 mb-10">
              {features.map((item, index) => {
                const Icon = item.icon;
                const colorClasses = {
                  blue: "bg-blue-100 text-blue-600 border-blue-200",
                  purple: "bg-purple-100 text-purple-600 border-purple-200",
                  green: "bg-green-100 text-green-600 border-green-200",
                };

                return (
                  <li
                    key={item.text}
                    className="flex items-start gap-4 group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl ${colorClasses[item.color]} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <span className="text-gray-800 font-medium text-lg">
                        {item.text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/register"
              className="cursor-pointer group inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Try the Editor
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
          </div>

          <div className="order-1 lg:order-2 animate-slide-in-right">
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm hover:bg-red-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm hover:bg-green-600 transition-colors cursor-pointer"></div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200 text-xs text-gray-500 font-medium">
                    <div className="w-3 h-3 text-gray-400">🔒</div>
                    invoiss.com/editor
                  </div>
                  <div className="w-12"></div>
                </div>

                <div className="bg-linear-to-br from-gray-50 to-gray-100 p-1">
                  <Image
                    src="/images/invoice-editor.png"
                    alt="Invoiss live invoice editor with split-screen real-time preview"
                    width={1200}
                    height={750}
                    className="w-full h-auto rounded-lg"
                    priority
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float hidden md:block border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-xl p-2 border border-green-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">
                      Live Preview
                    </p>
                    <p className="text-xs text-gray-500">Update instantly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out backwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
