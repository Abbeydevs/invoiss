import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AnimatedText } from "@/components/auth/AnimatedText";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-left duration-500">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
                Invoiss
              </h1>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Start managing your invoices professionally
            </p>
          </div>

          <RegisterForm />

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#1451cb] hover:text-[#1451cb]/90 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-8 text-xs text-center text-gray-500">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1451cb] via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-16 text-white">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold mb-4 leading-tight">
              <AnimatedText />
            </h2>
            <p className="text-xl text-blue-100">
              Professional invoicing made simple. Create, send, and track all
              your invoices in one place.
            </p>
          </div>

          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-16 h-16 bg-linear-to-br from-[#1451cb] to-purple-600 rounded-lg mb-3"></div>
                  <p className="text-xs text-gray-500">Your Company</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">INVOICE</p>
                  <p className="text-xs text-gray-500 mt-1">#INV-0001</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="text-xs text-gray-500 mb-2">Bill To</p>
                <p className="font-semibold text-gray-900">Client Name</p>
                <p className="text-sm text-gray-600">client@example.com</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Description</span>
                  <span className="font-semibold text-gray-900">₦50,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Consulting Fee</span>
                  <span className="font-semibold text-gray-900">₦30,000</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[#1451cb]">
                    ₦80,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Easy to Use</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Fast Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Secure & Safe</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
