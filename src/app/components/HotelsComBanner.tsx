import { motion } from 'motion/react';
import { Bed, ExternalLink } from 'lucide-react';
import hotelsComIcon from 'figma:asset/3ed6bf5e9660fc679b4a0ad1725cc6a2426a5cc2.png';

export function HotelsComBanner() {
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
          href="https://www.hotels.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#E42C38]/20 transition-all duration-300"
        >
          {/* Background gradient — Hotels.com crimson red */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#D32735] via-[#D32735]/95 to-[#B71F2B]/90" />
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Glow accent */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-white/5 rounded-full blur-[80px]" />

          <div className="relative flex items-center justify-between gap-4 px-5 sm:px-8 py-4 sm:py-5">
            {/* Left side — branding + message */}
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              {/* Hotels.com icon */}
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-lg shadow-black/30 ring-1 ring-white/10">
                <img src={hotelsComIcon} alt="Hotels.com" className="w-full h-full object-cover" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className="text-white text-sm sm:text-base whitespace-nowrap"
                    style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}
                  >
                    Find Your Perfect Stay
                  </span>
                  <span
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[9px] uppercase tracking-wider"
                    style={{ fontWeight: 700 }}
                  >
                    <Bed className="w-2.5 h-2.5" />
                    Partner
                  </span>
                </div>
                <p className="text-white/60 text-[11px] sm:text-[12px] truncate">
                  Compare &amp; book hotels near your next event — collect stamps with Hotels.com Rewards
                </p>
              </div>
            </div>

            {/* Right side — CTA */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* Hotels.com text logo (desktop) */}
              <span
                className="hidden md:block text-white/30 text-[13px] group-hover:text-white/50 transition-opacity"
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
              >
                Hotels.com
              </span>

              {/* CTA button */}
              <div
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white text-[#D32735] text-[12px] sm:text-[13px] whitespace-nowrap group-hover:bg-white/90 transition-all shadow-lg shadow-black/10 group-hover:shadow-black/20"
                style={{ fontWeight: 700 }}
              >
                Browse Hotels
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </div>
            </div>
          </div>
        </a>
      </div>
    </motion.section>
  );
}
