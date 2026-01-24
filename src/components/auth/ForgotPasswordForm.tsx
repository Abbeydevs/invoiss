"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requestPasswordReset } from "@/lib/api/password-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      await requestPasswordReset(values.email);
      setIsSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-50 to-emerald-100 border-4 border-green-200 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Check your email</h3>
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to
          </p>
          <p className="font-semibold text-gray-900 text-lg">
            {form.getValues("email")}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <p className="text-sm text-blue-800 mb-2 font-medium">
            📧 What to do next:
          </p>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Check your inbox and spam folder</li>
            <li>Click the reset link in the email</li>
            <li>Create your new password</li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <Button
            asChild
            className="w-full h-11 bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#1451cb]/90 hover:to-purple-600/90 font-semibold"
          >
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </Button>

          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email?{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[#1451cb] hover:text-[#1451cb]/90 font-semibold transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="you@example.com"
                    {...field}
                    className="h-11 pl-10 border-gray-300 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11 bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#1451cb]/90 hover:to-purple-600/90 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sending link...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-[#1451cb] inline-flex items-center gap-2 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
