import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Zap, CheckCircle2, TrendingUp } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative bg-linear-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-100">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  A
                </div>
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-400 to-purple-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  B
                </div>
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  C
                </div>
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  +
                </div>
              </div>
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  500+ happy users
                </p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Create professional invoices in{" "}
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-[#1451cb] via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  60 seconds
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9C60 3 140 3 198 9"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#1451cb" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
              The simplest invoicing tool for Nigerian freelancers and small
              businesses. Create, send, and track invoices to get paid faster.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  No credit card required
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Setup in 2 minutes
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Free forever plan
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-linear-to-r from-[#1451cb] to-blue-600 hover:from-[#1451cb]/90 hover:to-blue-600/90 text-white shadow-xl shadow-blue-500/30 text-base h-14 px-8 font-semibold group transition-all duration-300 hover:scale-105"
              >
                <Link href="/register">
                  Get Started - It&apos;s Free
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-base h-14 px-8 font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
              >
                <Link href="#pricing">View Plans</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-8 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Trusted by freelancers across Nigeria</span>
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 lg:delay-300">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <div className="relative w-full aspect-4/3">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-purple-50/50"></div>
                  <Image
                    src="/images/dashboard.png"
                    alt="Invoiss Dashboard"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 95vw, 50vw"
                  />

                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-100 animate-in fade-in slide-in-from-top duration-700 delay-1000">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Total Revenue
                        </p>
                        <p className="text-lg font-bold text-gray-900">₦2.4M</p>
                      </div>
                    </div>
                  </div>

                  {/* <div className="absolute top-6 left-6 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-left duration-700 delay-1000">
                    PAID ✓
                  </div> */}
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 z-20 animate-in fade-in slide-in-from-bottom duration-700 delay-1000 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#1451cb]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Invoice Created
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      in 45 seconds
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-linear-to-br from-blue-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
