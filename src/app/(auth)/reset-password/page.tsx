import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-16 text-white">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Create a Strong Password
            </h2>
            <p className="text-xl text-purple-100 max-w-md">
              Your new password should be unique and secure to protect your
              account.
            </p>
          </div>

          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Password Requirements
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    At least 8 characters
                  </p>
                  <p className="text-sm text-purple-100">
                    Longer passwords are more secure
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-white">Mix of characters</p>
                  <p className="text-sm text-purple-100">
                    Use uppercase, lowercase, and numbers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-white">Unique password</p>
                  <p className="text-sm text-purple-100">
                    Don&apos;t reuse passwords from other sites
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                </div>
                <div>
                  <p className="font-medium text-white">Avoid common words</p>
                  <p className="text-sm text-purple-100">
                    Don&apos;t use dictionary words or personal info
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-start gap-3 bg-yellow-500/20 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-100">
                  <span className="font-semibold">Pro tip:</span> Use a password
                  manager to generate and store strong passwords securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right duration-500">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Set new password
            </h2>
            <p className="text-gray-600">
              Choose a strong password to secure your account
            </p>
          </div>

          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1451cb]"></div>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>

          <p className="mt-8 text-xs text-center text-gray-500">
            Your password is encrypted and stored securely
          </p>
        </div>
      </div>
    </div>
  );
}
