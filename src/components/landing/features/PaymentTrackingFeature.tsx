/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle2, Calendar, TrendingUp, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function PaymentTrackingFeature() {
  const features: {
    icon: any;
    text: string;
    color: "amber" | "blue" | "green";
  }[] = [
    {
      icon: Calendar,
      text: "Create custom payment schedules",
      color: "amber",
    },
    {
      icon: TrendingUp,
      text: "Track 'Partial' and 'Paid' statuses",
      color: "blue",
    },
    {
      icon: History,
      text: "Clear history of every transaction",
      color: "green",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-linear-to-br from-gray-50 via-amber-50/30 to-orange-50/30 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm hover:bg-red-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm hover:bg-yellow-600 transition-colors cursor-pointer"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm hover:bg-green-600 transition-colors cursor-pointer"></div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-200 text-xs text-gray-500 font-medium">
                    <div className="w-3 h-3 text-gray-400">🔒</div>
                    invoiss.com/payments
                  </div>
                  <div className="w-12"></div>
                </div>

                <div className="bg-linear-to-br from-gray-50 to-gray-100 p-1">
                  <Image
                    src="/images/payment-schedule.png"
                    alt="Invoiss payment tracking dashboard showing milestones and payment schedules"
                    width={1200}
                    height={900}
                    className="w-full h-auto rounded-lg"
                    priority
                  />
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-float hidden md:block border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-green-100 to-emerald-100 rounded-xl p-2 border border-green-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">50% Paid</p>
                    <p className="text-xs text-gray-500">₦122,500</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed hidden md:block border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-amber-100 to-orange-100 rounded-xl p-2 border border-amber-200">
                    <Calendar className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Due Soon</p>
                    <p className="text-xs text-gray-500">In 7 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 animate-slide-in-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm font-semibold text-amber-800 mb-6 shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Milestones
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Deposits &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Split Payments.
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-linear-to-r from-amber-200 to-orange-200 z-0 transform rotate-1"></span>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Perfect for freelancers. Record a 50% deposit upfront and track
              the balance due automatically. Your clients see exactly what is
              paid and what is owed.
            </p>

            <ul className="space-y-5 mb-10">
              {features.map((item, index) => {
                const Icon = item.icon;
                const colorClasses = {
                  amber: "bg-amber-100 text-amber-600 border-amber-200",
                  blue: "bg-blue-100 text-blue-600 border-blue-200",
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
              className="group inline-flex items-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Tracking Payments
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

        @keyframes float-delayed {
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

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </section>
  );
}
