import { motion } from 'motion/react';
import { Plane, ExternalLink } from 'lucide-react';
import expediaIcon from 'figma:asset/97fc8e92d493cdb0873aea10563f811bd8a24604.png';
import expediaGroupLogo from 'figma:asset/fdd3f0ab3bada61ef96ee903596a454e77911e06.png';

export function ExpediaWidget() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <a
          href="https://www.expedia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#FFD700]/20 transition-all duration-300"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A6C] via-[#1A1A6C]/95 to-[#1A1A6C]/80" />
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }} />
          {/* Yellow glow accent */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-[#FFD700]/8 rounded-full blur-[80px]" />

          <div className="relative flex items-center justify-between gap-4 px-5 sm:px-8 py-4 sm:py-5">
            {/* Left side — branding + message */}
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              {/* Expedia icon */}
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg shadow-black/30 ring-1 ring-white/10">
                <img src={expediaIcon} alt="Expedia" className="w-full h-full object-cover" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className="text-white text-sm sm:text-base whitespace-nowrap"
                    style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
                  >
                    Need a Hotel?
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-[9px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    <Plane className="w-2.5 h-2.5" />
                    Partner
                  </span>
                </div>
                <p className="text-white/40 text-[11px] sm:text-[12px] truncate">
                  Book hotels, flights &amp; car rentals near your next event on Expedia
                </p>
              </div>
            </div>

            {/* Right side — CTA + logo */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* Expedia Group logo (desktop) */}
              <img
                src={expediaGroupLogo}
                alt="Expedia Group"
                className="hidden md:block h-5 opacity-30 group-hover:opacity-50 transition-opacity"
              />

              {/* CTA button */}
              <div className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#FFD700] text-[#1A1A6C] text-[12px] sm:text-[13px] whitespace-nowrap group-hover:bg-[#FFE233] transition-all shadow-lg shadow-[#FFD700]/10 group-hover:shadow-[#FFD700]/20"
                style={{ fontWeight: 700 }}
              >
                Search Deals
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </motion.section>
  );
}
