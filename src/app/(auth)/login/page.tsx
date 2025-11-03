"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-[#1451cb] to-[#cb14ca] bg-clip-text text-transparent">
            Invoiss
          </h1>
          <p className="text-gray-600 mt-2">Create, Send, Track Invoices</p>
        </div>

        <Card className="border-0 shadow-xl backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your Invoiss account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registered && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-green-800 text-center">
                  Account created successfully! Please sign in.
                </p>
              </div>
            )}

            <LoginForm />
          </CardContent>
          <CardFooter className="pt-2">
            <p className="text-sm text-center w-full text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-[#1451cb] hover:underline font-medium transition-all"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
