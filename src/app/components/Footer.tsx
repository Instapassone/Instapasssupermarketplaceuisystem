import { Link } from 'react-router';
import { InstaPassLogo } from './InstaPassLogo';
import { Mail, Phone, ArrowRight, CheckCircle2, Smartphone, Zap, Shield, ShoppingBag, Bed, Plane, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import qrCodeImg from 'figma:asset/a6d735f9d5f5e554731a09df3d9836ae9450a683.png';
import hotelsComIcon from 'figma:asset/3ed6bf5e9660fc679b4a0ad1725cc6a2426a5cc2.png';
import expediaIcon from 'figma:asset/97fc8e92d493cdb0873aea10563f811bd8a24604.png';

export function Footer() {
  const [subEmail, setSubEmail] = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubDone(true);
    setTimeout(() => { setSubDone(false); setSubEmail(''); }, 4000);
  };

  const footerSections = [
    {
      title: 'Events',
      links: [
        { label: 'All Events', href: '/events' },
        { label: 'Concerts', href: '/events' },
        { label: 'Sports', href: '/events' },
        { label: 'Comedy', href: '/events' },
        { label: 'Festivals', href: '/events' },
        { label: 'News Feed', href: '/news' },
      ],
    },
    {
      title: 'Organizers',
      links: [
        { label: 'Sell Tickets', href: '/sell' },
        { label: 'Pricing', href: '/sell' },
        { label: 'Dashboard', href: '/organizer' },
        { label: 'QR Generator', href: '/qr-generator' },
        { label: 'SmartCodes', href: '/organizer/smartcodes' },
        { label: 'Merch Shop', href: '/merch' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* ═══════════════════════════════════════════
            APP DOWNLOAD + STAY IN THE LOOP — Side by side
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">

          {/* ─── App Download (condensed) ─── */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111]">
            <div className="h-[2px] w-full bg-gradient-to-r from-[#E52324] via-[#E52324]/60 to-transparent" />
            <div className="flex items-center gap-5 p-5">
              {/* QR Code */}
              <div className="relative shrink-0">
                <div className="relative w-[80px] h-[80px] rounded-xl overflow-hidden bg-black border border-white/10 p-1">
                  <img
                    src={qrCodeImg}
                    alt="Scan to download InstaPass"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#E52324] rounded-tl-sm" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#E52324] rounded-tr-sm" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#E52324] rounded-bl-sm" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#E52324] rounded-br-sm" />
              </div>

              {/* Text + Buttons */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white text-[13px] uppercase tracking-wider" style={{ fontWeight: 800 }}>
                    Get the App
                  </h3>
                  <div className="flex items-center gap-1 bg-[#E52324]/10 border border-[#E52324]/20 rounded-full px-2 py-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E52324] animate-pulse" />
                    <span className="text-[7px] uppercase tracking-[0.15em] text-[#E52324]/80">Live</span>
                  </div>
                </div>
                <p className="text-white/30 text-[10px] mb-3">Scan QR or download from stores</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 bg-white text-black rounded-lg px-2.5 py-1.5 hover:bg-white/90 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[6px] leading-none opacity-50">Download on the</div>
                      <div className="text-[10px] leading-tight" style={{ fontWeight: 700 }}>App Store</div>
                    </div>
                  </button>
                  <button className="flex items-center gap-1.5 bg-white/[0.07] text-white border border-white/15 rounded-lg px-2.5 py-1.5 hover:bg-white/12 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.651 1.535a1 1 0 010 1.729l-2.244 1.3-2.53-2.531 2.123-2.034zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-[6px] leading-none opacity-50">Get it on</div>
                      <div className="text-[10px] leading-tight" style={{ fontWeight: 700 }}>Google Play</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:flex flex-col gap-1.5 shrink-0 text-[9px] text-white/30 border-l border-white/[0.06] pl-5">
                <span><span className="text-white/70" style={{ fontWeight: 800 }}>250K+</span> Downloads</span>
                <span><span className="text-white/70" style={{ fontWeight: 800 }}>4.9★</span> Rating</span>
                <span><span className="text-white/70" style={{ fontWeight: 800 }}>iOS</span> & <span className="text-white/70" style={{ fontWeight: 800 }}>Android</span></span>
              </div>
            </div>
          </div>

          {/* ─── Stay in the Loop (newsletter) ─── */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111]">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E52324]/60 to-[#E52324]" />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#E52324]" strokeWidth={1.8} />
                <h3 className="text-white text-[13px] uppercase tracking-wider" style={{ fontWeight: 800 }}>
                  Stay in the Loop
                </h3>
              </div>
              <p className="text-white/30 text-[10px] mb-4">
                Get exclusive pre-sale access, event drops, and platform updates. No spam, ever.
              </p>
              {subDone ? (
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={2} />
                  <span className="text-sm text-emerald-300" style={{ fontWeight: 600 }}>You're subscribed! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" strokeWidth={1.8} />
                    <input
                      type="email"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[12px] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#E52324]/25 focus:border-[#E52324]/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-lg shadow-[#E52324]/15"
                    style={{ fontWeight: 700 }}
                  >
                    Subscribe
                    <ArrowRight className="w-3 h-3" strokeWidth={2} />
                  </button>
                </form>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-white/25">
                {['No spam, ever', 'Unsubscribe anytime', 'Weekly event drops'].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500/50" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            FOOTER COLUMNS — with travel partner banners
            ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] gap-6 items-start">

          {/* ─── LEFT: Hotels.com Banner ─── */}
          <a
            href="https://www.hotels.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#E42C38]/20 transition-all duration-300 order-last xl:order-first"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#D32735] via-[#D32735]/95 to-[#B71F2B]/90" />
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }} />
            <div className="relative flex flex-col items-center text-center p-5 gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-black/30 ring-1 ring-white/10">
                <img src={hotelsComIcon} alt="Hotels.com" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-white text-[13px]" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                    Find Your Stay
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-white text-[8px] uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                  <Bed className="w-2.5 h-2.5" /> Partner
                </span>
                <p className="text-white/60 text-[10px] leading-relaxed mt-1">
                  Compare &amp; book hotels near your next event
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#D32735] text-[11px] whitespace-nowrap group-hover:bg-white/90 transition-all shadow-lg shadow-black/10" style={{ fontWeight: 700 }}>
                Browse Hotels
                <ExternalLink className="w-3 h-3 opacity-60" />
              </div>
            </div>
          </a>

          {/* ─── CENTER: Footer Columns ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <InstaPassLogo size="md" />
              </Link>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                The fastest-growing ticketing platform for live events. Buy, sell,
                and manage with confidence.
              </p>
              <div className="flex gap-3">
                {['𝕏', 'in', 'f', '📷'].map((icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-white/50 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white text-xs uppercase tracking-wider mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Support Column */}
            <div>
              <h4 className="text-white text-xs uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-white/40 hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-white/40 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>

              <h4 className="text-white text-xs uppercase tracking-wider mt-6 mb-3">
                Contact Us
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:Admin@instapass.shop"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                    Admin@instapass.shop
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+18442446782"
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                    (844) 244-6782
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ─── RIGHT: Expedia Banner ─── */}
          <a
            href="https://www.expedia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#FFD700]/20 transition-all duration-300 order-last"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A6C] via-[#1A1A6C]/95 to-[#1A1A6C]/80" />
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }} />
            <div className="relative flex flex-col items-center text-center p-5 gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-black/30 ring-1 ring-white/10">
                <img src={expediaIcon} alt="Expedia" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <span className="text-white text-[13px]" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                    Need a Hotel?
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-[8px] uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                  <Plane className="w-2.5 h-2.5" /> Partner
                </span>
                <p className="text-white/40 text-[10px] leading-relaxed mt-1">
                  Book hotels, flights &amp; cars near your next event
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD700] text-[#1A1A6C] text-[11px] whitespace-nowrap group-hover:bg-[#FFE233] transition-all shadow-lg shadow-[#FFD700]/10" style={{ fontWeight: 700 }}>
                Search Deals
                <ExternalLink className="w-3 h-3 opacity-60" />
              </div>
            </div>
          </a>

        </div>

        {/* ─── Bottom bar ─── */}
        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; 2026 InstaPass Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link to="/about" className="hover:text-white/60 transition-colors">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}