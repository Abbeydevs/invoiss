import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-left duration-500">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset your password
            </h2>
            <p className="text-gray-600">
              Enter your email and we&apos;ll send you instructions to reset
              your password
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-16 text-white">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Secure Account Recovery
            </h2>
            <p className="text-xl text-purple-100 max-w-md">
              Your security is our priority. We&apos;ll help you regain access
              to your account safely.
            </p>
          </div>

          <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            <h3 className="text-lg font-semibold mb-6 text-white">
              How Password Reset Works
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    Enter your email
                  </p>
                  <p className="text-sm text-purple-100">
                    Provide the email address associated with your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    Check your inbox
                  </p>
                  <p className="text-sm text-purple-100">
                    We&apos;ll send a secure reset link to your email
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    Create new password
                  </p>
                  <p className="text-sm text-purple-100">
                    Follow the link and set a new secure password
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white mb-1">
                    You&apos;re all set!
                  </p>
                  <p className="text-sm text-purple-100">
                    Sign in with your new password and continue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
