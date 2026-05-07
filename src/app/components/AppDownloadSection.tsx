import { motion } from 'motion/react';
import { Zap, Star, Shield } from 'lucide-react';
import { InstaPassLogo } from './InstaPassLogo';
import appPhotoImg from 'figma:asset/c9301345845724ce103ec6a5d21b4474e7ff1591.png';

export function AppDownloadSection() {
  return (
    <section className="relative bg-white py-20 lg:py-24 overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E52324]/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00C853]/5 rounded-full blur-[100px] translate-y-1/3" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* App Photo Card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={appPhotoImg}
              alt="Download the InstaPass app — Discover live events, tickets, and experiences near you"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Extra feature pills below */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Zap, text: 'Instant Delivery' },
              { icon: Shield, text: 'Secure Wallet' },
              { icon: Star, text: '4.9★ App Store Rating' },
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.text}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5f5f5] border border-gray-200 text-xs text-[#555]"
                >
                  <Icon className="w-3.5 h-3.5 text-[#00C853]" />
                  {feat.text}
                </div>
              );
            })}
          </div>

          {/* Download stats */}
          <div className="flex justify-center gap-8 mt-6 text-xs text-[#999]">
            <span><span className="text-[#111] font-black">250K+</span> Downloads</span>
            <span><span className="text-[#111] font-black">4.9</span> App Store Rating</span>
            <span><span className="text-[#111] font-black">#1</span> Ticketing App</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}