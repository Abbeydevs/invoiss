"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  Phone,
  Mail,
  Loader2,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: (
        <>
          4a Ogunnaike Street, Admiralty Way,
          <br />
          Lekki Phase 1, Lagos, Nigeria.
        </>
      ),
      color: "blue",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: (
        <div className="space-y-1">
          <p>+234 707 703 3583</p>
          <p>+234 701 718 1619</p>
        </div>
      ),
      color: "green",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: (
        <a
          href="mailto:invoiss@thesoftwarehub.tech"
          className="hover:text-[#1451cb] transition-colors"
        >
          invoiss@thesoftwarehub.tech
        </a>
      ),
      color: "purple",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative bg-linear-to-br from-blue-50 via-white to-purple-50 py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center justify-center mb-6 animate-bounce-slow">
              <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl p-4 border border-blue-200 shadow-lg">
                <MessageCircle className="w-8 h-8 text-[#1451cb]" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Get in{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-linear-to-r from-[#1451cb] to-purple-600 bg-clip-text text-transparent">
                  Touch
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-linear-to-r from-blue-200 to-purple-200 z-0 transform -rotate-1"></span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              Have a question about Invoiss? We&apos;re here to help. Our team
              is available Monday to Friday, 9am to 5pm.
            </p>

            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md border border-gray-200 mt-8 animate-fade-in animation-delay-400">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                We typically respond within 24 hours
              </span>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
              <div className="space-y-8 animate-slide-in-left">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <p className="text-lg text-gray-600">
                    Fill out the form and our team will get back to you within
                    24 hours.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    const colorClasses: Record<string, string> = {
                      blue: "from-blue-500 to-cyan-500",
                      green: "from-green-500 to-emerald-500",
                      purple: "from-purple-500 to-pink-500",
                    };

                    return (
                      <Card
                        key={item.title}
                        className="group p-6 border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-14 h-14 bg-linear-to-br ${colorClasses[item.color]} rounded-xl flex items-center justify-center shrink-0 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="h-7 w-7" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">
                              {item.title}
                            </h3>
                            <div className="text-gray-600 text-sm leading-relaxed">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                <Card className="p-6 bg-linear-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1451cb] shadow-sm">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        Business Hours
                      </h3>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p className="font-medium">Monday - Friday</p>
                        <p>9:00 AM - 5:00 PM (WAT)</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="animate-slide-in-right">
                <Card className="p-8 md:p-10 border-2 border-gray-200 shadow-2xl rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#1451cb] via-purple-600 to-pink-600"></div>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Send us a Message
                    </h3>
                    <p className="text-gray-600">
                      We&apos;d love to hear from you. Fill out the form below.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="firstName"
                          className="text-sm font-semibold text-gray-700"
                        >
                          First Name
                        </label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          required
                          className="h-12 border-2 focus:border-[#1451cb]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="lastName"
                          className="text-sm font-semibold text-gray-700"
                        >
                          Last Name
                        </label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          required
                          className="h-12 border-2 focus:border-[#1451cb]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="h-12 border-2 focus:border-[#1451cb]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        required
                        className="h-12 border-2 focus:border-[#1451cb]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        className="min-h-[150px] border-2 focus:border-[#1451cb]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#0f3fa3] hover:to-purple-700 text-white h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 border-t border-gray-200">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl p-3 border border-blue-200">
                  <Sparkles className="w-6 h-6 text-[#1451cb]" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Have a quick question?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Check our frequently asked questions to find the answer
                you&apos;re looking for.
              </p>
              <Button
                asChild
                size="lg"
                className="h-14 px-10 bg-linear-to-r from-[#1451cb] to-purple-600 hover:from-[#0f3fa3] hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/pricing#faq">View FAQs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out backwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
