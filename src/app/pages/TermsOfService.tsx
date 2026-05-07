import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { FileText, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0B1120]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <Header />

      {/* Hero */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#0B1120]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-blue-400" style={{ fontWeight: 700 }}>Legal Agreement</span>
            </div>
            <h1 className="text-4xl sm:text-5xl text-white mb-4" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>Terms of Service</h1>
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
                Welcome to InstaPass. These Terms of Service ("Terms") govern your access to and use of the InstaPass website at <a href="https://instapass.shop" className="text-[#E52324] hover:underline">instapass.shop</a>, mobile application, and all related services (collectively, the "Platform") operated by InstaPass, Inc. ("InstaPass," "we," "us," or "our").
              </p>
              <p className="mt-3">
                By creating an account, purchasing tickets, listing events, or otherwise using the Platform, you agree to be bound by these Terms. If you do not agree, do not use the Platform.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>1. Eligibility</h2>
              <p>
                You must be at least 18 years of age (or the age of majority in your jurisdiction) to create an account, purchase tickets, or list events on the Platform. Users between 13 and 17 may use the Platform only with verifiable parental or guardian consent. By using the Platform, you represent that you meet these requirements.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>2. Account Registration</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                <li>One person or entity may not maintain more than one active account without prior written approval</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>3. Ticket Purchases</h2>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>3.1 Buying Tickets</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>All ticket purchases are final and non-refundable unless the event is cancelled or rescheduled by the organizer</li>
                <li>Prices displayed include the base ticket price; applicable service fees and taxes are shown at checkout</li>
                <li>Digital tickets are delivered instantly via email and in-app with unique QR codes</li>
                <li>Each QR code is valid for single use only; duplicate scans will be flagged and denied entry</li>
                <li>InstaPass guarantees the authenticity of all tickets purchased through the Platform</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>3.2 Refund Policy</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li><span className="text-white" style={{ fontWeight: 600 }}>Cancelled Events:</span> Full refund issued automatically within 5-7 business days</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Rescheduled Events:</span> Original tickets remain valid for the new date; refund available upon request within 14 days of rescheduling announcement</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Postponed Events:</span> Tickets remain valid; refund available if the event is not rescheduled within 90 days</li>
                <li><span className="text-white" style={{ fontWeight: 600 }}>Buyer's Remorse:</span> No refunds for change of mind, inability to attend, or failure to use tickets</li>
                <li>Service fees are non-refundable except in cases of event cancellation</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>3.3 Ticket Transfers</h3>
              <p>
                Tickets may be transferred to another InstaPass user at the original purchase price or lower. Resale above face value is prohibited unless explicitly permitted by the event organizer. Transferred tickets generate a new unique QR code; the original becomes invalid.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>4. Event Organizers</h2>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>4.1 Creating Events</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>You must have the legal authority and necessary permits to host the event you list</li>
                <li>Event descriptions, images, and details must be accurate and not misleading</li>
                <li>You are solely responsible for the execution and quality of your event</li>
                <li>InstaPass is a platform and does not organize, produce, or host events</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>4.2 Fees & Payouts</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>InstaPass charges a service fee on each ticket sold (displayed to organizers during event creation)</li>
                <li>Payouts are processed within 3-5 business days after the event concludes</li>
                <li>Organizers must provide valid banking information and complete identity verification for payouts</li>
                <li>InstaPass may withhold payouts if there are disputes, chargebacks, or suspected fraud</li>
                <li>Organizers are responsible for all applicable taxes on revenue earned through the Platform</li>
              </ul>

              <h3 className="text-white text-[15px] mb-2 mt-5" style={{ fontWeight: 700 }}>4.3 Cancellations by Organizer</h3>
              <p>
                If you cancel an event, you must notify InstaPass immediately. All ticket holders will receive automatic full refunds. Repeated cancellations may result in account suspension or termination. InstaPass reserves the right to charge a cancellation processing fee for events with significant ticket sales.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>5. InstaPoints Loyalty Program</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>InstaPoints are earned on eligible ticket purchases at the rate displayed at checkout</li>
                <li>Points can be redeemed for discounts on future ticket purchases</li>
                <li>Points have no cash value and cannot be transferred, sold, or exchanged for cash</li>
                <li>Points expire 12 months after the date of earning if not redeemed</li>
                <li>InstaPass reserves the right to modify the earning rate, redemption value, or program rules at any time with 30 days notice</li>
                <li>Fraudulent activity related to points accumulation will result in forfeiture of all points and account termination</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>6. QR Code Studio</h2>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>QR codes generated through the QR Code Studio are owned by you and may be used for any lawful purpose</li>
                <li>You may not use QR codes to distribute malware, phishing links, illegal content, or any content that violates these Terms</li>
                <li>Dynamic QR codes may be subject to usage limits based on your account tier</li>
                <li>InstaPass reserves the right to disable QR codes that are associated with fraudulent or illegal activity</li>
                <li>Scan analytics data is retained for the lifetime of the QR code or until account deletion</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>7. Prohibited Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1.5 ml-2">
                <li>Use the Platform for any unlawful purpose</li>
                <li>Create fraudulent events or listings</li>
                <li>Scalp, counterfeit, or forge tickets</li>
                <li>Use bots, scrapers, or automated tools to access the Platform</li>
                <li>Circumvent security measures, QR code validation, or access controls</li>
                <li>Harass, threaten, or discriminate against other users</li>
                <li>Upload content that infringes intellectual property rights</li>
                <li>Interfere with the operation or performance of the Platform</li>
                <li>Impersonate another person, organization, or InstaPass employee</li>
                <li>Engage in any activity that could damage, disable, or impair the Platform</li>
              </ul>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>8. Intellectual Property</h2>
              <p>
                The InstaPass name, logo, branding, and all content on the Platform (excluding user-generated content) are the property of InstaPass, Inc. and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our prior written consent.
              </p>
              <p className="mt-3">
                By uploading content to the Platform (event images, descriptions, etc.), you grant InstaPass a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with the operation of the Platform and marketing of your events.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>9. Disclaimer of Warranties</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. INSTAPASS DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. INSTAPASS IS NOT RESPONSIBLE FOR THE QUALITY, SAFETY, OR LEGALITY OF EVENTS LISTED ON THE PLATFORM.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, INSTAPASS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE PLATFORM, ATTENDANCE AT EVENTS, OR ANY ACTIONS TAKEN BY EVENT ORGANIZERS OR OTHER USERS.
              </p>
              <p className="mt-3">
                OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE AMOUNT YOU PAID TO INSTAPASS IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless InstaPass, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorney's fees) arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>12. Dispute Resolution</h2>
              <p>
                Any disputes arising from or relating to these Terms or the Platform shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall take place in Los Angeles County, California. You agree to waive any right to a jury trial or to participate in a class action lawsuit.
              </p>
              <p className="mt-3">
                Notwithstanding the foregoing, either party may seek injunctive or equitable relief in any court of competent jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>14. Modifications</h2>
              <p>
                InstaPass reserves the right to modify these Terms at any time. Material changes will be communicated via email or prominent notice on the Platform at least 30 days before they take effect. Your continued use of the Platform after modifications constitutes acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>15. Termination</h2>
              <p>
                We may suspend or terminate your account at any time for violation of these Terms or for any reason at our sole discretion with or without notice. Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive termination (including but not limited to intellectual property, indemnification, limitation of liability, and dispute resolution) shall survive.
              </p>
            </div>

            <div>
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>16. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60">
              <h2 className="text-white text-xl mb-4" style={{ fontWeight: 800 }}>17. Contact Us</h2>
              <p className="mb-4">For questions about these Terms, contact us:</p>
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
