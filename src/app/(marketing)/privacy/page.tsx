import Link from "next/link";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30">
      <div className="bg-linear-to-r from-[#1451cb] to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-blue-100">Last updated: January 25, 2026</p>
            </div>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            Your privacy is important to us. This policy explains how Invoiss
            collects, uses, and protects your personal information.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1451cb]" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="#information"
              className="text-sm text-[#1451cb] hover:underline"
            >
              1. Information We Collect
            </a>
            <a href="#usage" className="text-sm text-[#1451cb] hover:underline">
              2. How We Use Your Information
            </a>
            <a
              href="#sharing"
              className="text-sm text-[#1451cb] hover:underline"
            >
              3. Information Sharing
            </a>
            <a
              href="#security"
              className="text-sm text-[#1451cb] hover:underline"
            >
              4. Data Security
            </a>
            <a
              href="#rights"
              className="text-sm text-[#1451cb] hover:underline"
            >
              5. Your Rights
            </a>
            <a
              href="#contact"
              className="text-sm text-[#1451cb] hover:underline"
            >
              6. Contact Us
            </a>
          </div>
        </div>

        <div className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Introduction
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Invoiss (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
                owned and operated by <strong>TheSoftwareHub</strong>, a
                technology company registered in Nigeria. We are committed to
                protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our invoicing platform.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using Invoiss, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with our policies and practices, please do not use our services.
              </p>
            </div>
          </section>

          <section id="information">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-[#1451cb]" />
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-[#1451cb] p-4 rounded-r-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  When you register for an account, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1 ml-4">
                  <li>
                    Name (first and last name for individuals, business name for
                    companies)
                  </li>
                  <li>Email address</li>
                  <li>Phone number (optional)</li>
                  <li>Business address and contact information</li>
                  <li>Password (encrypted and securely stored)</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#1451cb] p-4 rounded-r-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Financial Information
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To facilitate payments and invoicing, we collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1 ml-4">
                  <li>
                    Bank account details (bank name, account number, account
                    name)
                  </li>
                  <li>Invoice and payment transaction data</li>
                  <li>Customer information you input for invoicing purposes</li>
                  <li>Payment history and records</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-[#1451cb] p-4 rounded-r-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We automatically collect information about how you use our
                  platform:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our platform</li>
                  <li>Features used and actions taken</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                We use your information to:
              </p>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Provide, operate, and maintain our invoicing services
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Process payments and facilitate transactions through our
                    payment partners (Nomba)
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Send invoices and payment notifications to your customers
                    via email
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Improve, personalize, and expand our services based on user
                    feedback
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Communicate with you about updates, security alerts, and
                    customer support
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-[#1451cb] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Comply with Nigerian legal and regulatory requirements
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="sharing">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Information Sharing and Disclosure
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information in the following
                circumstances:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Payment Processing
                  </h3>
                  <p className="text-sm text-gray-700">
                    We share necessary financial information with Nomba, our
                    payment processing partner, to facilitate invoice payments.
                    Nomba is bound by strict data protection standards.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Legal Requirements
                  </h3>
                  <p className="text-sm text-gray-700">
                    We may disclose your information if required by Nigerian
                    law, court order, or government regulations, including
                    requests from the Central Bank of Nigeria (CBN) or other
                    regulatory bodies.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Service Providers
                  </h3>
                  <p className="text-sm text-gray-700">
                    We work with trusted third-party service providers (email
                    delivery, cloud hosting) who assist in operating our
                    platform. These providers have access to your information
                    only to perform specific tasks on our behalf.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="security">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#1451cb]" />
              4. Data Security
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your
                personal and financial information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Encryption
                  </h4>
                  <p className="text-sm text-gray-700">
                    All data transmitted between your browser and our servers is
                    encrypted using SSL/TLS protocols.
                  </p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Secure Storage
                  </h4>
                  <p className="text-sm text-gray-700">
                    Your passwords are hashed and stored securely. We never
                    store plain-text passwords.
                  </p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Access Controls
                  </h4>
                  <p className="text-sm text-gray-700">
                    Strict access controls ensure only authorized personnel can
                    access sensitive data.
                  </p>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Regular Audits
                  </h4>
                  <p className="text-sm text-gray-700">
                    We conduct regular security audits and updates to protect
                    against vulnerabilities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section id="rights">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Your Privacy Rights
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                Under Nigerian data protection regulations, you have the
                following rights:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#1451cb] font-bold">•</span>
                  <span className="text-gray-700">
                    <strong>Access:</strong> You can request a copy of the
                    personal information we hold about you.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1451cb] font-bold">•</span>
                  <span className="text-gray-700">
                    <strong>Correction:</strong> You can update or correct your
                    personal information at any time through your account
                    settings.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1451cb] font-bold">•</span>
                  <span className="text-gray-700">
                    <strong>Deletion:</strong> You can request deletion of your
                    account and associated data, subject to legal retention
                    requirements.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1451cb] font-bold">•</span>
                  <span className="text-gray-700">
                    <strong>Data Portability:</strong> You can export your data
                    in a commonly used format.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#1451cb] font-bold">•</span>
                  <span className="text-gray-700">
                    <strong>Withdraw Consent:</strong> You can withdraw consent
                    for data processing where consent is the legal basis.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to
              provide our services and comply with Nigerian tax and financial
              regulations. Invoice and transaction data may be retained for up
              to 7 years as required by Nigerian tax laws. You may request
              deletion of your account at any time, after which we will delete
              or anonymize your data within 30 days, except where retention is
              legally required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Invoiss is not intended for use by individuals under the age of
              18. We do not knowingly collect personal information from
              children. If we become aware that we have collected information
              from a child without parental consent, we will take steps to
              delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by posting the new policy on this page and
              updating the &quot;Last updated&quot; date. We encourage you to
              review this policy periodically.
            </p>
          </section>

          <section
            id="contact"
            className="bg-linear-to-br from-[#1451cb]/10 to-purple-600/10 p-6 rounded-xl border border-[#1451cb]/20"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or your personal data, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">
                <strong>Company:</strong> TheSoftwareHub
              </p>
              <p className="text-gray-900">
                <strong>Product:</strong> Invoiss
              </p>
              <p className="text-gray-900">
                <strong>Email:</strong> privacy@invoiss.com
              </p>
              <p className="text-gray-900">
                <strong>Support:</strong> support@invoiss.com
              </p>
              <p className="text-gray-900">
                <strong>Location:</strong> Nigeria
              </p>
            </div>
          </section>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2026 Invoiss by TheSoftwareHub. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <Link
              href="/terms"
              className="text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
