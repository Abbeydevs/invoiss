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
import { ArrowLeft, Mail } from "lucide-react";

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
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Mail className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Check your email
        </h3>
        <p className="text-gray-600 text-sm">
          We have sent a password reset link to{" "}
          <span className="font-medium text-gray-900">
            {form.getValues("email")}
          </span>
        </p>
        <Button asChild className="w-full mt-4" variant="outline">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Link>
        </Button>
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
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@company.com"
                  {...field}
                  className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending Link..." : "Send Reset Link"}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-[#1451cb] flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
