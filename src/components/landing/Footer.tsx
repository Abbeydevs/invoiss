import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
    { href: "#faq", label: "FAQs" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/invoiss-logo.svg"
                  alt="Invoiss Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm max-w-xs leading-relaxed">
              Simple invoicing for modern Nigerian businesses. Get paid faster
              with less hassle.
            </p>

            <div className="pt-2">
              <p className="text-sm text-gray-500">
                Invoiss is a product of{" "}
                <a
                  href="https://thesoftwarehub.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white font-medium underline transition-colors"
                >
                  Thesoftwarehub
                </a>
              </p>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Twitter / X
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Invoiss. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
