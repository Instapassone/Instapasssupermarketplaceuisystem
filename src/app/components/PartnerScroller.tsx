import { motion } from 'motion/react';

/* ── Inline SVG partner logos ── */

const HotelsComLogo = () => (
  <svg viewBox="0 0 180 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="30" fill="#D32F2F" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', fontWeight: 800, fontStyle: 'italic' }}>hotels</text>
    <text x="108" y="30" fill="#D32F2F" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif', fontWeight: 800 }}>.com</text>
    <circle cx="170" cy="10" r="5" fill="#D32F2F" />
  </svg>
);

const VrboLogo = () => (
  <svg viewBox="0 0 120 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="32" fill="#345CF5" style={{ fontSize: '36px', fontFamily: 'Arial, sans-serif', fontWeight: 900 }}>vrbo</text>
    <circle cx="107" cy="10" r="4" fill="#FF6B35" />
  </svg>
);

const BraintreeLogo = () => (
  <svg viewBox="0 0 200 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="20" r="12" fill="none" stroke="#4B4B4B" strokeWidth="2" />
    <path d="M10 20 L16 14 L22 20 L16 26 Z" fill="#4B4B4B" />
    <text x="34" y="28" fill="white" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 300, letterSpacing: '1px' }}>braintree</text>
  </svg>
);

const InstagramLogo = () => (
  <svg viewBox="0 0 180 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFC107" />
        <stop offset="30%" stopColor="#F44336" />
        <stop offset="60%" stopColor="#E040FB" />
        <stop offset="100%" stopColor="#536DFE" />
      </linearGradient>
    </defs>
    <rect x="2" y="6" width="28" height="28" rx="8" fill="none" stroke="url(#igGrad)" strokeWidth="2.5" />
    <circle cx="16" cy="20" r="7" fill="none" stroke="url(#igGrad)" strokeWidth="2.5" />
    <circle cx="25" cy="11" r="2.5" fill="url(#igGrad)" />
    <text x="38" y="29" fill="white" style={{ fontSize: '26px', fontFamily: 'Palatino, Georgia, serif', fontStyle: 'italic' }}>Instagram</text>
  </svg>
);

const TicketNetworkLogo = () => (
  <svg viewBox="0 0 220 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="20" rx="3" fill="#1976D2" />
    <text x="6" y="27" fill="white" style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 900 }}>T</text>
    <text x="28" y="29" fill="white" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Ticket</text>
    <text x="108" y="29" fill="#1976D2" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Network</text>
  </svg>
);

const TicketEvolutionLogo = () => (
  <svg viewBox="0 0 240 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20 L14 10 L24 20 L14 30 Z" fill="#00897B" />
    <path d="M10 20 L14 16 L18 20 L14 24 Z" fill="white" />
    <text x="30" y="29" fill="white" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Ticket</text>
    <text x="110" y="29" fill="#00897B" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>Evolution</text>
  </svg>
);

const ExpediaLogo = () => (
  <svg viewBox="0 0 160 45" className="h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="33" fill="#FBCE00" style={{ fontSize: '34px', fontFamily: 'Arial, sans-serif', fontWeight: 800 }}>expedia</text>
    <path d="M142 8 Q152 2 156 10" stroke="#FBCE00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const VictoryLiveLogo = () => (
  <svg viewBox="0 0 200 40" className="h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="2,10 14,30 26,10" fill="none" stroke="#E52324" strokeWidth="2.5" strokeLinejoin="round" />
    <polygon points="8,14 14,24 20,14" fill="#E52324" />
    <text x="32" y="29" fill="white" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 800, letterSpacing: '1px' }}>VICTORY</text>
    <text x="148" y="29" fill="#E52324" style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif', fontWeight: 800, letterSpacing: '1px' }}>LIVE</text>
  </svg>
);

const partners = [
  { name: 'Hotels.com', render: () => <HotelsComLogo /> },
  { name: 'Vrbo', render: () => <VrboLogo /> },
  { name: 'Braintree', render: () => <BraintreeLogo /> },
  { name: 'Instagram', render: () => <InstagramLogo /> },
  { name: 'TicketNetwork', render: () => <TicketNetworkLogo /> },
  { name: 'TicketEvolution', render: () => <TicketEvolutionLogo /> },
  { name: 'Expedia', render: () => <ExpediaLogo /> },
  { name: 'VictoryLive', render: () => <VictoryLiveLogo /> },
];

// Duplicate for seamless infinite scroll
const scrollItems = [...partners, ...partners];

export function PartnerScroller() {
  return (
    <section className="bg-[#0d0d0d] py-14 lg:py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-2">
          Our Partners
        </h2>
        <p className="text-white/40 text-sm">
          Trusted by the big players in every industry
        </p>
      </div>

      {/* Scrolling logo strip */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              duration: 30,
              ease: 'linear',
              repeat: Infinity,
            },
          }}
        >
          {scrollItems.map((partner, idx) => (
            <div
              key={`${partner.name}-${idx}`}
              className="flex items-center justify-center shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300 select-none"
            >
              {partner.render()}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}