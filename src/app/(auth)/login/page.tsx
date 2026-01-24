"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AnimatedLoginText } from "@/components/auth/AnimatedLoginText";

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-right duration-500">
      {/* <div className="mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-bold bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
            Invoiss
          </h1>
        </Link>
      </div> */}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
        <p className="text-gray-600">
          Sign in to continue managing your invoices
        </p>
      </div>

      {registered && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-green-800 text-center font-medium">
            ✓ Account created successfully! Please sign in.
          </p>
        </div>
      )}

      <LoginForm />

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#1451cb] hover:text-[#1451cb]/90 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>

      <p className="mt-8 text-xs text-center text-gray-500">
        Protected by industry-standard encryption
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-16 text-white">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              <AnimatedLoginText />
            </h2>
            <p className="text-xl text-emerald-100">
              Access your dashboard, manage payments, and track all your
              invoices seamlessly.
            </p>
          </div>

          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-3">Dashboard Overview</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-3 rounded-lg border border-emerald-200">
                    <p className="text-xs text-emerald-700 font-medium mb-1">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold text-emerald-900">₦2.5M</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">
                      Invoices Sent
                    </p>
                    <p className="text-lg font-bold text-blue-900">48</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-3">Recent Activity</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-700">
                        Payment Received
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      ₦150K
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-700">
                        Invoice Sent
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      INV-0042
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-gray-700">
                        New Customer
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-900">
                      Acme Ltd
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1451cb]"></div>
            </div>
          }
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
