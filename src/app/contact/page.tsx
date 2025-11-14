"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    });
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question about Invoiss? We&apos;re here to help. Our team
              is available Monday to Friday, 9am to 5pm.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Left Column: Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Fill out the form and our team will get back to you within
                    24 hours.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <Card className="p-6 border-0 shadow-lg flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-[#1451cb]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Visit Us
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        4a Ogunnaike Street, Admiralty Way,
                        <br />
                        Lekki Phase 1, Lagos, Nigeria.
                      </p>
                    </div>
                  </Card>

                  {/* Phone */}
                  <Card className="p-6 border-0 shadow-lg flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-[#1451cb]">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Call Us
                      </h3>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>+234 707 703 3583</p>
                        <p>+234 701 718 1619</p>
                      </div>
                    </div>
                  </Card>

                  {/* Email */}
                  <Card className="p-6 border-0 shadow-lg flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 text-[#1451cb]">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Email Us
                      </h3>
                      <p className="text-gray-600 text-sm">
                        <a
                          href="mailto:invoiss@thesoftwarehub.tech"
                          className="hover:text-[#1451cb] transition-colors"
                        >
                          invoiss@thesoftwarehub.tech
                        </a>
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <Card className="p-8 border border-gray-200 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#1451cb] hover:bg-[#1451cb]/90 text-white h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50 border-t border-gray-200 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Have a quick question?
            </h2>
            <p className="text-gray-600 mb-8">
              Check our frequently asked questions to find the answer
              you&apos;re looking for.
            </p>
            <Button asChild variant="outline" className="h-12 px-8">
              <Link href="/pricing#faq">View FAQs</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
