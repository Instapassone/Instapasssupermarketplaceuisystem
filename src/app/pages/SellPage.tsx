import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { organizerFeatures, howItWorks, pricingPlans, trustBadges } from '../data/mockData';
import { motion } from 'motion/react';

export function SellPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Green gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d0a0a] via-[#2e0a0a] to-[#100000] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#E52324]/3 to-[#E52324]/8 -z-10" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-xs tracking-[0.2em] uppercase text-[#E52324] mb-4">
                For Event Organizers
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-[0.95] mb-6 tracking-tight">
                Launch Your<br />
                Event on<br />
                <span className="text-[#E52324]">InstaPass</span>
              </h1>
              <p className="text-white/60 text-sm mb-8 max-w-lg leading-relaxed">
                Whether you're organizing a club night, a corporate conference, an
                indie concert, or a massive festival — InstaPass gives you the tools
                to sell out and scale up. No tech skills required.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link
                  to="/organizer/create-event"
                  className="px-6 py-3 rounded-lg bg-[#E52324] text-white text-sm hover:bg-[#c91f20] transition-colors flex items-center gap-2"
                >
                  Create Your First Event <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/organizer"
                  className="px-6 py-3 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5 transition-colors"
                >
                  See Organizer Demo
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/50">
                <span>✓ Free to create events</span>
                <span>✓ No monthly fees</span>
                <span>✓ Built-in live streaming</span>
                <span>✓ Dedicated organizer support</span>
              </div>
            </motion.div>

            {/* Right - Feature Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {organizerFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all ${
                    index === 4 ? 'sm:col-span-2 bg-[#E52324]/10 border-[#E52324]/20' : ''
                  }`}
                >
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tight mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-[#0d0d0d] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] uppercase text-[#E52324] mb-3">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2">
              Sell Out Your Event in
            </h2>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#E52324]">
              4 Simple Steps
            </h2>
            <p className="text-white/50 text-sm mt-4 max-w-lg mx-auto">
              From idea to sold-out in minutes. Our organizer platform is built for
              speed and simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.step * 0.1 }}
                className="relative bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#E52324] text-white text-xs font-black flex items-center justify-center">
                  {step.step}
                </div>
                <div className="text-3xl mt-4 mb-4">{step.icon}</div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section className="bg-gradient-to-b from-[#0d0d0d] to-[#111] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] uppercase text-[#E52324] mb-3">
              Organizer Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              Simple, Transparent Fees
            </h2>
            <p className="text-white/50 text-sm max-w-lg mx-auto">
              No monthly fees. Pay only when you sell. Upgrade for more features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-[#E52324]/30 bg-[#E52324]/5'
                    : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E52324] text-white text-[10px] font-black uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="text-xs text-white/50 uppercase tracking-wider mb-2">
                  {plan.name}
                </div>
                <div className="text-4xl font-black text-white mb-1">
                  {plan.price}
                </div>
                <div className="text-xs text-white/40 mb-6">
                  {plan.subtitle}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#E52324] shrink-0 mt-0.5" />
                      <span className="text-white/70">{feature}</span>
                    </div>
                  ))}
                  {plan.extras.map((extra) => (
                    <div key={extra} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
                      <span className="text-white/30 line-through">{extra}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-lg text-sm font-black transition-colors ${
                    plan.popular
                      ? 'bg-[#E52324] text-white hover:bg-[#c91f20]'
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="bg-[#111] py-10 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm">
                <span className="text-[#E52324]">{badge.icon}</span>
                <span className="text-white/90">
                  <span className="font-black">{badge.bold}</span>
                  <span className="text-white/50 ml-1">{badge.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MOBILE APP CTA ============ */}
      <section className="bg-gradient-to-b from-[#1a0d0d] to-black py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs tracking-[0.2em] uppercase text-[#E52324] mb-3">
              InstaPass Mobile
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              Tickets in Your Pocket
            </h2>
            <p className="text-white/50 text-sm mb-8">
              Buy, sell, or manage your event — all from the InstaPass app. Buyers
              get instant digital tickets. Organizers get real-time door scanning
              and live sales tracking.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-6 py-3 rounded-lg bg-white text-black text-sm hover:bg-white/90 transition-colors">
                Download iOS
              </button>
              <button className="px-6 py-3 rounded-lg border border-white/20 text-white text-sm hover:bg-white/5 transition-colors">
                Download Android
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}