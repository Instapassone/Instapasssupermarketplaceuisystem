import { Smartphone, Zap, Shield, Ticket } from 'lucide-react';
import qrCodeImg from 'figma:asset/a6d735f9d5f5e554731a09df3d9836ae9450a683.png';

/* ───────────────────────────────────────────────
   Inline SVG gear for decorative background
   ─────────────────────────────────────────────── */
function Gear({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 18a3 3 0 01-3-3V5a3 3 0 016 0v10a3 3 0 01-3 3zm0 79a3 3 0 01-3-3V84a3 3 0 016 0v10a3 3 0 01-3 3zM82 53H92a3 3 0 000-6H82a3 3 0 000 6zM8 53H18a3 3 0 000-6H8a3 3 0 000 6zm64.6-28.6l7.07-7.07a3 3 0 00-4.24-4.24L68.36 20.16a3 3 0 004.24 4.24zM27.4 75.76l-7.07 7.07a3 3 0 004.24 4.24l7.07-7.07a3 3 0 00-4.24-4.24zm45.2 0a3 3 0 000 4.24l7.07 7.07a3 3 0 004.24-4.24l-7.07-7.07a3 3 0 00-4.24 0zM27.4 24.4a3 3 0 000-4.24l-7.07-7.07a3 3 0 00-4.24 4.24l7.07 7.07a3 3 0 004.24 0z"
        fill="currentColor"
      />
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="5" fill="currentColor" />
    </svg>
  );
}

export function AppBanner() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 30%, #0d0d0d 60%, #080808 100%)' }}>
      
      {/* ── Decorative Background Layer ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Gears */}
        <Gear size={100} className="absolute -top-4 -right-4 text-white/[0.04] rotate-12" />
        <Gear size={70} className="absolute top-12 right-[200px] text-white/[0.03] -rotate-20" />
        <Gear size={120} className="absolute -bottom-8 -left-6 text-white/[0.03] rotate-45" />
        <Gear size={50} className="absolute top-4 left-[300px] text-[#E52324]/[0.06] rotate-30" />

        {/* Diagonal scan lines */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(229,35,36,0.5) 4px, rgba(229,35,36,0.5) 5px)',
          }}
        />

        {/* Red accent glow */}
        <div className="absolute top-0 right-[10%] w-[300px] h-[200px] bg-[#E52324]/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[5%] w-[200px] h-[150px] bg-[#E52324]/[0.04] rounded-full blur-[80px]" />

        {/* Circuit lines */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40" x2="120" y2="40" stroke="#E52324" strokeWidth="1" />
          <line x1="120" y1="40" x2="120" y2="80" stroke="#E52324" strokeWidth="1" />
          <circle cx="120" cy="80" r="3" fill="#E52324" />
          <line x1="600" y1="0" x2="600" y2="30" stroke="white" strokeWidth="1" />
          <line x1="600" y1="30" x2="750" y2="30" stroke="white" strokeWidth="1" />
          <line x1="900" y1="100" x2="1000" y2="100" stroke="white" strokeWidth="1" />
          <line x1="1000" y1="100" x2="1000" y2="60" stroke="white" strokeWidth="1" />
          <circle cx="1000" cy="60" r="3" fill="white" />
          <line x1="1200" y1="120" x2="1200" y2="80" stroke="#E52324" strokeWidth="1" />
          <line x1="1200" y1="80" x2="1400" y2="80" stroke="#E52324" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Top Red Accent Bar ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#E52324] via-[#E52324] to-transparent relative z-10" />

      {/* ── Main Content — horizontal layout ── */}
      <div className="relative z-10 px-6 py-5 flex items-center gap-6">

        {/* QR Code */}
        <div className="relative shrink-0">
          {/* Glow */}
          <div className="absolute inset-0 scale-110 bg-[#E52324]/10 rounded-2xl blur-[20px]" />
          {/* QR plate — black background */}
          <div className="relative w-[110px] h-[110px] rounded-xl overflow-hidden bg-black border border-white/10 p-1.5">
            <img
              src={qrCodeImg}
              alt="Scan to download InstaPass"
              className="w-full h-full object-contain"
            />
          </div>
          {/* Corner brackets */}
          <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#E52324] rounded-tl-md" />
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#E52324] rounded-tr-md" />
          <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#E52324] rounded-bl-md" />
          <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#E52324] rounded-br-md" />
        </div>

        {/* Text + feature pills */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className="text-white text-[15px] uppercase tracking-wider"
              style={{ fontWeight: 800 }}
            >
              Scan &amp; Download
            </h3>
            <div className="flex items-center gap-1.5 bg-[#E52324]/10 border border-[#E52324]/20 rounded-full px-2.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E52324] animate-pulse" />
              <span className="text-[8px] uppercase tracking-[0.15em] text-[#E52324]/80">Live</span>
            </div>
          </div>
          <p className="text-white/35 text-[10px] leading-relaxed mb-2.5">
            Point your camera at the QR code to get InstaPass on iOS or Android instantly.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { icon: Zap, text: 'Instant' },
              { icon: Shield, text: 'Secure' },
              { icon: Smartphone, text: 'Mobile' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.text}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/8"
                >
                  <Icon className="w-2.5 h-2.5 text-[#E52324]" />
                  <span className="text-[8px] text-white/50 uppercase tracking-wider">{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-20 bg-white/10 shrink-0" />

        {/* App store buttons — stacked */}
        <div className="flex flex-col gap-2 shrink-0 w-[180px]">
          <button className="flex items-center justify-center gap-2 bg-white text-black rounded-xl px-3 py-2.5 hover:bg-white/90 transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div className="text-left">
              <div className="text-[7px] leading-none opacity-50">Download on the</div>
              <div className="text-[11px] leading-tight" style={{ fontWeight: 700 }}>App Store</div>
            </div>
          </button>
          <button className="flex items-center justify-center gap-2 bg-white/[0.07] text-white border border-white/15 rounded-xl px-3 py-2.5 hover:bg-white/12 transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.651 1.535a1 1 0 010 1.729l-2.244 1.3-2.53-2.531 2.123-2.034zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            <div className="text-left">
              <div className="text-[7px] leading-none opacity-50">Get it on</div>
              <div className="text-[11px] leading-tight" style={{ fontWeight: 700 }}>Google Play</div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-20 bg-white/10 shrink-0" />

        {/* Stats — vertical stack */}
        <div className="flex flex-col gap-2.5 shrink-0 text-[10px] text-white/30">
          <span><span className="text-white/80" style={{ fontWeight: 800 }}>250K+</span> Downloads</span>
          <div className="h-px w-full bg-white/5" />
          <span><span className="text-white/80" style={{ fontWeight: 800 }}>4.9★</span> Rating</span>
          <div className="h-px w-full bg-white/5" />
          <span><span className="text-white/80" style={{ fontWeight: 800 }}>iOS</span> & <span className="text-white/80" style={{ fontWeight: 800 }}>Android</span></span>
        </div>
      </div>
    </div>
  );
}
