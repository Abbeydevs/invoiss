import Link from "next/link";
import { Scale, FileCheck, AlertTriangle, Users } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-purple-50/30">
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
              <p className="text-purple-100">Last updated: January 25, 2026</p>
            </div>
          </div>
          <p className="text-lg text-purple-100 max-w-2xl">
            These terms govern your use of Invoiss. Please read them carefully
            before using our services.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-600" />
            Quick Navigation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="#acceptance"
              className="text-sm text-purple-600 hover:underline"
            >
              1. Acceptance of Terms
            </a>
            <a
              href="#services"
              className="text-sm text-purple-600 hover:underline"
            >
              2. Description of Services
            </a>
            <a
              href="#accounts"
              className="text-sm text-purple-600 hover:underline"
            >
              3. User Accounts
            </a>
            <a
              href="#usage"
              className="text-sm text-purple-600 hover:underline"
            >
              4. Acceptable Use
            </a>
            <a
              href="#payments"
              className="text-sm text-purple-600 hover:underline"
            >
              5. Payments & Billing
            </a>
            <a
              href="#liability"
              className="text-sm text-purple-600 hover:underline"
            >
              6. Limitation of Liability
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
                Welcome to Invoiss, an invoicing and billing platform owned and
                operated by <strong>TheSoftwareHub</strong>, a technology
                company based in Nigeria. These Terms of Service
                (&quot;Terms&quot;) constitute a legally binding agreement
                between you and TheSoftwareHub regarding your use of the Invoiss
                platform.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By accessing or using Invoiss, you agree to be bound by these
                Terms and our Privacy Policy. If you do not agree to these
                Terms, you may not use our services.
              </p>
            </div>
          </section>

          <section id="acceptance">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                By creating an account, accessing, or using Invoiss, you:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700">
                    Confirm that you are at least 18 years of age or have the
                    legal capacity to enter into binding contracts in Nigeria
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700">
                    Represent that all information provided during registration
                    is accurate and complete
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700">
                    Agree to comply with all applicable Nigerian laws and
                    regulations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold">•</span>
                  <span className="text-gray-700">
                    Accept these Terms and our Privacy Policy in their entirety
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <section id="services">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              2. Description of Services
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Invoiss provides a cloud-based platform for creating, managing,
                and sending invoices. Our services include:
              </p>
              <div className="grid gap-3">
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Invoice Creation & Management
                  </h3>
                  <p className="text-sm text-gray-700">
                    Create professional invoices with customizable templates,
                    track payment status, and manage invoice history.
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Customer Management
                  </h3>
                  <p className="text-sm text-gray-700">
                    Store and manage customer information, including contact
                    details and payment history.
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Payment Processing
                  </h3>
                  <p className="text-sm text-gray-700">
                    Accept payments through our integrated payment gateway
                    (Nomba) for Nigerian Naira (NGN) transactions.
                  </p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Email Delivery
                  </h3>
                  <p className="text-sm text-gray-700">
                    Send invoices directly to customers via email with automatic
                    notifications.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="accounts">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. User Accounts and Responsibilities
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Security
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  You are responsible for:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>
                    • Maintaining the confidentiality of your account
                    credentials
                  </li>
                  <li>• All activities that occur under your account</li>
                  <li>
                    • Notifying us immediately of any unauthorized access or
                    security breach
                  </li>
                  <li>• Using a strong password and changing it regularly</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Types
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Individual Accounts:</strong> For freelancers and sole
                  proprietors conducting business in their personal capacity.
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  <strong>Company Accounts:</strong> For registered businesses
                  and corporations. You represent that you have the authority to
                  bind the company to these Terms.
                </p>
              </div>
            </div>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  You agree NOT to:
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Use the platform for any illegal activities or fraudulent
                      purposes
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>Create false or misleading invoices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Violate any Nigerian laws, including tax evasion or money
                      laundering regulations
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Upload malicious code, viruses, or any harmful content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Attempt to gain unauthorized access to our systems or
                      other users&apos; accounts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Reverse engineer, decompile, or attempt to extract our
                      source code
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Use automated tools to scrape data from our platform
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">✗</span>
                    <span>
                      Resell or redistribute our services without written
                      permission
                    </span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-700 italic">
                Violation of these terms may result in immediate account
                suspension or termination without refund.
              </p>
            </div>
          </section>

          {/* Payments & Billing */}
          <section id="payments">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Payments, Billing & Subscriptions
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Free Tier (Basic)
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Limited features and templates</li>
                    <li>• 7-day trial for all new users</li>
                    <li>• Basic invoicing capabilities</li>
                  </ul>
                </div>
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Pro Tier (Paid)
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Unlimited invoices and customers</li>
                    <li>• Premium templates</li>
                    <li>• Advanced features and analytics</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Billing Terms
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    • Subscriptions are billed monthly or annually in Nigerian
                    Naira (NGN)
                  </li>
                  <li>
                    • All fees are non-refundable except as required by Nigerian
                    law
                  </li>
                  <li>
                    • We reserve the right to change pricing with 30 days&apos;
                    notice
                  </li>
                  <li>• Failed payments may result in service suspension</li>
                  <li>
                    • You can cancel your subscription at any time through your
                    account settings
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Payment Processing Fees
                </h3>
                <p className="text-sm text-gray-700">
                  When you receive payments through Invoiss via Nomba, standard
                  payment processing fees apply as determined by Nomba. These
                  fees are separate from your subscription fees and are deducted
                  from the payment amount. Please refer to Nombas&apos;s fee
                  schedule for current rates.
                </p>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property Rights
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>Our Rights:</strong> All rights, title, and interest in
                and to Invoiss, including all software, designs, logos,
                trademarks, and content, are owned by TheSoftwareHub. You may
                not copy, modify, distribute, or reverse engineer any part of
                our platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Your Content:</strong> You retain ownership of all
                invoices, customer data, and content you create on our platform.
                By using Invoiss, you grant us a limited license to store,
                display, and transmit your content solely for the purpose of
                providing our services.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section id="liability">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                <strong>
                  TO THE MAXIMUM EXTENT PERMITTED BY NIGERIAN LAW:
                </strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  • Invoiss is provided &quot;AS IS&quot; without warranties of
                  any kind, express or implied
                </li>
                <li>
                  • We do not guarantee uninterrupted or error-free service
                </li>
                <li>
                  • We are not liable for any indirect, incidental, special, or
                  consequential damages
                </li>
                <li>
                  • Our total liability shall not exceed the amount you paid us
                  in the 12 months preceding the claim
                </li>
                <li>
                  • We are not responsible for payment disputes between you and
                  your customers
                </li>
                <li>
                  • We are not liable for any tax obligations arising from your
                  use of the platform
                </li>
              </ul>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless TheSoftwareHub,
              its officers, directors, employees, and agents from any claims,
              damages, liabilities, and expenses (including legal fees) arising
              from: (a) your use of Invoiss; (b) your violation of these Terms;
              (c) your violation of any Nigerian law or regulation; (d) any
              invoices or content you create or transmit through our platform.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Termination
            </h2>
            <div className="space-y-3">
              <p className="text-gray-700 leading-relaxed">
                <strong>By You:</strong> You may terminate your account at any
                time through your account settings or by contacting support.
                Upon termination, you will lose access to all data, and no
                refunds will be provided.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>By Us:</strong> We reserve the right to suspend or
                terminate your account immediately if you violate these Terms,
                engage in fraudulent activity, or for any other reason at our
                sole discretion. We will attempt to provide notice when
                possible, but are not obligated to do so.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Governing Law and Dispute Resolution
            </h2>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                These Terms shall be governed by and construed in accordance
                with the laws of the Federal Republic of Nigeria. Any disputes
                arising from these Terms or your use of Invoiss shall be subject
                to the exclusive jurisdiction of the Nigerian courts.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Before initiating formal legal proceedings, both parties agree
                to attempt to resolve disputes through good-faith negotiation
                for at least 30 days.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms at any time. Material changes will be
              communicated via email or through a prominent notice on our
              platform at least 30 days before they take effect. Your continued
              use of Invoiss after changes become effective constitutes
              acceptance of the modified Terms.
            </p>
          </section>

          {/* Miscellaneous */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Miscellaneous
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Entire Agreement:</strong> These Terms, together with
                our Privacy Policy, constitute the entire agreement between you
                and TheSoftwareHub.
              </li>
              <li>
                <strong>Severability:</strong> If any provision of these Terms
                is found to be invalid or unenforceable, the remaining
                provisions shall remain in full effect.
              </li>
              <li>
                <strong>Waiver:</strong> Our failure to enforce any right or
                provision shall not constitute a waiver of such right or
                provision.
              </li>
              <li>
                <strong>Assignment:</strong> You may not assign these Terms
                without our written consent. We may assign our rights and
                obligations without restriction.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-linear-to-br from-purple-600/10 to-indigo-600/10 p-6 rounded-xl border border-purple-600/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">
                <strong>Company:</strong> TheSoftwareHub
              </p>
              <p className="text-gray-900">
                <strong>Product:</strong> Invoiss
              </p>
              <p className="text-gray-900">
                <strong>Email:</strong> legal@invoiss.com
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

      {/* Footer */}
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
