"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md border-b border-gray-200/50"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-200"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl bg-linear-to-br from-[#1451cb] to-[#0ea5e9] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl md:text-2xl">
                I
              </span>
              <div className="absolute -inset-0.5 bg-linear-to-br from-[#1451cb] to-[#0ea5e9] rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
            </div>
            <span className="font-bold text-xl md:text-2xl text-gray-900 group-hover:text-[#1451cb] transition-colors">
              Invoiss
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-linear-to-r from-[#1451cb] to-[#0ea5e9] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
              className="font-medium hover:text-[#1451cb] hover:bg-blue-50"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="relative bg-linear-to-r from-[#1451cb] to-[#0ea5e9] hover:from-[#0f3fa3] hover:to-[#0284c7] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
            >
              <Link href="/register" className="flex items-center gap-2">
                <span className="relative z-10">Get Started</span>
                <Sparkles className="w-4 h-4 relative z-10" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={cn(
                    "h-6 w-6 absolute inset-0 transition-all duration-300",
                    isMobileMenuOpen
                      ? "rotate-90 opacity-0"
                      : "rotate-0 opacity-100"
                  )}
                />
                <X
                  className={cn(
                    "h-6 w-6 absolute inset-0 transition-all duration-300",
                    isMobileMenuOpen
                      ? "rotate-0 opacity-100"
                      : "-rotate-90 opacity-0"
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden absolute top-16 md:top-20 left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen
            ? "max-h-screen opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-4 space-y-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[#1451cb] transition-all duration-200 animate-slide-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div
            className="border-t border-gray-200 pt-4 mt-2 space-y-3 animate-slide-in"
            style={{ animationDelay: "200ms" }}
          >
            <Button
              variant="outline"
              asChild
              className="w-full font-semibold border-2 hover:border-[#1451cb] hover:text-[#1451cb] hover:bg-blue-50"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="w-full bg-linear-to-r from-[#1451cb] to-[#0ea5e9] hover:from-[#0f3fa3] hover:to-[#0284c7] text-white font-semibold shadow-lg"
            >
              <Link
                href="/register"
                className="flex items-center justify-center gap-2"
              >
                Get Started
                <Sparkles className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out backwards;
        }
      `}</style>
    </header>
  );
}
