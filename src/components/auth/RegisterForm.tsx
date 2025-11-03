"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const individualSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

const companySchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
});

type IndividualFormValues = z.infer<typeof individualSchema>;
type CompanyFormValues = z.infer<typeof companySchema>;

export function RegisterForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "COMPANY">(
    "INDIVIDUAL"
  );
  const [isLoading, setIsLoading] = useState(false);

  const individualForm = useForm<IndividualFormValues>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
    },
  });

  const onIndividualSubmit = async (values: IndividualFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          accountType: "INDIVIDUAL",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Account created successfully!");
      router.push("/login?registered=true");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onCompanySubmit = async (values: CompanyFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          accountType: "COMPANY",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Account created successfully!");
      router.push("/login?registered=true");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs
      defaultValue="INDIVIDUAL"
      onValueChange={(value) =>
        setAccountType(value as "INDIVIDUAL" | "COMPANY")
      }
    >
      <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
        <TabsTrigger
          value="INDIVIDUAL"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-[#1451cb] data-[state=active]:to-[#1451cb] data-[state=active]:text-white transition-all"
        >
          Individual
        </TabsTrigger>
        <TabsTrigger
          value="COMPANY"
          className="data-[state=active]:bg-linear-to-r data-[state=active]:from-[#1451cb] data-[state=active]:to-[#1451cb] data-[state=active]:text-white transition-all"
        >
          Company
        </TabsTrigger>
      </TabsList>

      <TabsContent value="INDIVIDUAL">
        <Form {...individualForm}>
          <form
            onSubmit={individualForm.handleSubmit(onIndividualSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={individualForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={individualForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={individualForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={individualForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-[#1451cb] to-[#1451cb] hover:from-[#1451cb]/90 hover:to-[#1451cb]/90 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="COMPANY">
        <Form {...companyForm}>
          <form
            onSubmit={companyForm.handleSubmit(onCompanySubmit)}
            className="space-y-5"
          >
            <FormField
              control={companyForm.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Inc."
                      {...field}
                      className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={companyForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                      className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={companyForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="border-gray-200 focus:border-[#1451cb] focus:ring-[#1451cb] transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-[#1451cb] to-[#1451cb] hover:from-[#1451cb]/90 hover:to-[#1451cb]/90 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
