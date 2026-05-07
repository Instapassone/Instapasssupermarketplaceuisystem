import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Shield, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0B1120]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <Header />

      {/* Hero */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#0B1120]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E52324]/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-6">
              <Shield className="w-3.5 h-3.5 text-[#E52324]" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324]" style={{ fontWeight: 700 }}>Your Data, Protected</span>
            </div>
            <h1 className="text-4xl sm:text-5xl text-white mb-4" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Privacy Policy</h1>
            <p className="text-white/40 text-sm">Last updated: January 15, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-10 text-white/60 text-[14px] leading-relaxed">

            <div className="p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60">
              <p>
                InstaPass, Inc. ("InstaPass," "we," "us," or "our") is committed to protecting the privacy of our users. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://instapass.shop" className="text-[#E52324] hover:underline">instapass.shop</a>, use our mobile application, or interact with our services (collectively, the "Platform").
              </p>
              <p className="mt-3">
                By accessing or using the Platform, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree, please discontinue use of the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>1. Information We Collect</h2>

              <h3 className="text-white text-[15px] mb-2 mt-6" style={{ fontWeight: 700 }}>Personal Information</h3>
              <p className="mb-3">When you register, purchase tickets, create events, or contact us, we may collect:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Full name, email address, phone number</li>
                <li>Billing address and payment information (processed securely via Stripe)</li>
                <li>Date of birth (for age-restricted events)</li>
                <li>Profile photo and display name</li>
                <li>Government-issued ID (for organizer verification only)</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-6" style={{ fontWeight: 700 }}>Event & Transaction Data</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Events browsed, purchased, and attended</li>
                <li>Ticket types, quantities, and pricing selected</li>
                <li>QR code scan history and check-in timestamps</li>
                <li>Organizer dashboard analytics and payout records</li>
                <li>InstaPoints loyalty balance and redemption history</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-6" style={{ fontWeight: 700 }}>Automatically Collected Information</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Device type, operating system, and browser version</li>
                <li>IP address and approximate geolocation</li>
                <li>Pages viewed, links clicked, and time spent on pages</li>
                <li>Referral source and campaign tracking parameters</li>
                <li>Cookies, pixels, and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Process ticket purchases and issue digital tickets with QR codes</li>
                <li>Facilitate event creation, management, and payouts for organizers</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send transactional emails (order confirmations, event reminders, payout notifications)</li>
                <li>Send marketing communications (with your consent) including pre-sale alerts and event recommendations</li>
                <li>Personalize your experience with AI-powered event recommendations</li>
                <li>Detect and prevent fraud, unauthorized transactions, and duplicate ticket usage</li>
                <li>Generate anonymized analytics and reporting for organizers</li>
                <li>Administer the InstaPoints loyalty rewards program</li>
                <li>Comply with legal obligations and enforce our Terms of Service</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>3. How We Share Your Information</h2>
              <p className="mb-3">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><span className="text-white" style={{ fontWeight: 600 }}>Event Organizers:</span> Name, email, and ticket details for events you attend (required for check-in and event operations)</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Payment Processors:</span> Stripe processes all payments; we never store full credit card numbers</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Service Providers:</span> Email delivery (SendGrid), hosting (AWS/Vercel), analytics (Google Analytics, Mixpanel), and customer support tools</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Legal Authorities:</span> When required by law, subpoena, or to protect the rights, safety, or property of InstaPass or others</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Business Transfers:</span> In connection with a merger, acquisition, or sale of all or a portion of our assets</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>4. Cookies & Tracking</h2>
              <p className="mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Keep you logged in and remember your preferences</li>
                <li>Analyze traffic patterns and Platform performance</li>
                <li>Deliver targeted advertisements and measure campaign effectiveness</li>
                <li>Detect and prevent fraudulent activity</li>
              </ul>
              <p className="mt-3">
                You can manage cookie preferences through your browser settings. Disabling cookies may limit certain features of the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information, including SSL/TLS encryption for all data in transit, encrypted storage for sensitive data at rest, PCI DSS compliance for payment processing through Stripe, role-based access controls and audit logging, and regular security assessments and penetration testing.
              </p>
              <p className="mt-3">
                While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>6. Data Retention</h2>
              <p>
                We retain your personal information for as long as your account is active or as needed to provide services. Transaction records are retained for 7 years for tax and legal compliance. You may request deletion of your account and associated data at any time by contacting us.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>7. Your Rights & Choices</h2>
              <p className="mb-3">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your personal information (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Opt out of the sale of personal information (California residents under CCPA)</li>
                <li>Request data portability in a machine-readable format</li>
                <li>Withdraw consent for data processing where consent is the legal basis</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:Admin@instapass.shop" className="text-[#E52324] hover:underline">Admin@instapass.shop</a>.</p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>8. California Privacy Rights (CCPA)</h2>
              <p>
                If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your personal information, the right to opt out of the sale of personal information (we do not sell your data), and the right to non-discrimination for exercising your privacy rights. To submit a CCPA request, email <a href="mailto:Admin@instapass.shop" className="text-[#E52324] hover:underline">Admin@instapass.shop</a> with the subject line "CCPA Request."
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>9. Children's Privacy</h2>
              <p>
                The Platform is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly. If you believe a child under 13 has provided us with personal information, please contact us immediately.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>10. Third-Party Links</h2>
              <p>
                The Platform may contain links to third-party websites, services, or applications. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party services you access through our Platform.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on the Platform and updating the "Last updated" date. Your continued use of the Platform after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60">
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>12. Contact Us</h2>
              <p className="mb-4">If you have questions about this Privacy Policy or our data practices, contact us:</p>
              <div className="space-y-2">
                <p className="text-white" style={{ fontWeight: 700 }}>InstaPass, Inc.</p>
                <a href="mailto:Admin@instapass.shop" className="flex items-center gap-2 text-[#E52324] hover:underline">
                  <Mail className="w-4 h-4" /> Admin@instapass.shop
                </a>
                <a href="tel:+18442446782" className="flex items-center gap-2 text-[#E52324] hover:underline">
                  <Phone className="w-4 h-4" /> (844) 244-6782
                </a>
                <p>Website: <a href="https://instapass.shop" className="text-[#E52324] hover:underline">instapass.shop</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
