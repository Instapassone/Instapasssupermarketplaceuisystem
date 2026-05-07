import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion, useInView } from 'motion/react';
import {
  QrCode, ArrowRight, Zap, Palette, Download, Shield,
  Globe, User, Wifi, Mail, MessageSquare, Type, CalendarDays, Share2,
  ChevronDown, Sparkles, Layers, Eye, Ticket,
  Coffee, ShoppingBag, Building2, Heart, Play, CheckCircle2,
  BarChart3, TrendingUp,
} from 'lucide-react';
import {
  encodeData, type PatternId, type CornerId,
} from '../components/qr-engine';
import {
  renderBrandedFrame, getQRInnerPaths, FRAME_OPTIONS,
} from '../components/qr-branded-frames';

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const R = '#E52324';

const SHOWCASE_CODES: { label: string; dest: string; fg: string; bg: string; pattern: PatternId; corner: CornerId; category: string }[] = [
  { label: 'Summer Festival', dest: 'https://instapass.ai/summer', fg: '#E52324', bg: '#FFFFFF', pattern: 'instapass', corner: 'bullseye', category: 'Events' },
  { label: 'VIP Pre-Sale', dest: 'https://instapass.ai/vip', fg: '#000000', bg: '#FFD700', pattern: 'dots', corner: 'rounded', category: 'Tickets' },
  { label: 'Artist Merch', dest: 'https://instapass.ai/merch', fg: '#8B5CF6', bg: '#FFFFFF', pattern: 'rounded', corner: 'bullseye', category: 'Retail' },
  { label: 'Venue WiFi', dest: 'WiFi:VenueNet', fg: '#10B981', bg: '#FFFFFF', pattern: 'dots', corner: 'rounded', category: 'Hospitality' },
  { label: 'Street Team LA', dest: 'https://instapass.ai/la', fg: '#E52324', bg: '#0a0a0a', pattern: 'instapass', corner: 'bullseye', category: 'Marketing' },
  { label: 'Contact Card', dest: 'vcard:InstaPass', fg: '#3B82F6', bg: '#FFFFFF', pattern: 'rounded', corner: 'rounded', category: 'Business' },
  { label: 'Holiday Promo', dest: 'https://instapass.ai/holiday', fg: '#DC2626', bg: '#FEF2F2', pattern: 'diamond', corner: 'bullseye', category: 'Seasonal' },
  { label: 'DJ Set Link', dest: 'https://instapass.ai/dj', fg: '#EC4899', bg: '#0a0a0a', pattern: 'dots', corner: 'bullseye', category: 'Music' },
  { label: 'Sports Arena', dest: 'https://instapass.ai/game', fg: '#F59E0B', bg: '#FFFFFF', pattern: 'square', corner: 'sharp', category: 'Sports' },
  { label: 'Conference', dest: 'https://instapass.ai/conf', fg: '#1E293B', bg: '#F8FAFC', pattern: 'rounded', corner: 'rounded', category: 'Corporate' },
  { label: 'Rooftop Party', dest: 'https://instapass.ai/rooftop', fg: '#E52324', bg: '#FFFFFF', pattern: 'dots', corner: 'bullseye', category: 'Events' },
  { label: 'Food Truck', dest: 'https://instapass.ai/food', fg: '#F97316', bg: '#FFFFFF', pattern: 'rounded', corner: 'rounded', category: 'Hospitality' },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Choose Your Destination',
    desc: 'Pick from 8 QR code types — website URLs, event pages, WiFi credentials, contact cards, social profiles, and more. Every code supports dynamic editing.',
    icon: Globe,
    color: R,
    features: ['8 QR Types', 'Dynamic Links', 'UTM Builder'],
  },
  {
    step: 2,
    title: 'Customize Your Design',
    desc: 'Match your brand with custom colors, dot patterns, corner eye styles, and logo placement. Choose from 6 pro presets or create your own unique look.',
    icon: Palette,
    color: '#8B5CF6',
    features: ['6 Color Presets', '5 Dot Patterns', '3 Corner Styles'],
  },
  {
    step: 3,
    title: 'Download & Deploy',
    desc: 'Export as high-resolution PNG (1200×1200px) or scalable SVG. Print on tickets, posters, merch, wristbands, signage — anywhere your audience is.',
    icon: Download,
    color: '#10B981',
    features: ['Hi-Res PNG', 'Vector SVG', 'Print Ready'],
  },
  {
    step: 4,
    title: 'Track Every Scan',
    desc: 'Monitor real-time analytics — scan counts, device breakdown, geographic data, and conversion tracking. Know exactly how your QR codes perform.',
    icon: BarChart3,
    color: '#3B82F6',
    features: ['Real-Time Data', 'Geo Tracking', 'Device Analytics'],
  },
];

const qrTypes = [
  { icon: Globe, label: 'Website', desc: 'Drive traffic to any URL', example: 'https://yourevent.com' },
  { icon: User, label: 'Contact', desc: 'Share info instantly', example: 'vCard with name, phone, email' },
  { icon: Wifi, label: 'WiFi', desc: 'No more typing passwords', example: 'Auto-connect to your network' },
  { icon: Mail, label: 'Email', desc: 'Start conversations faster', example: 'Pre-filled email compose' },
  { icon: MessageSquare, label: 'SMS', desc: 'Drive SMS engagement', example: 'Pre-filled text message' },
  { icon: Type, label: 'Text', desc: 'Share info without a link', example: 'Any plain text content' },
  { icon: CalendarDays, label: 'Event', desc: 'Boost event attendance', example: 'Add to calendar instantly' },
  { icon: Share2, label: 'Social', desc: 'Grow your following', example: 'Link to any social profile' },
];

const features = [
  { icon: QrCode, title: '8 QR Types', desc: 'URL, vCard, WiFi, Email, SMS, Text, Event, Social', color: R },
  { icon: Palette, title: 'Full Customization', desc: 'Colors, patterns, corners, logos — make it yours', color: '#8B5CF6' },
  { icon: Eye, title: 'Live Preview', desc: 'Watch your QR update in real-time as you design', color: '#10B981' },
  { icon: Download, title: 'Hi-Res Export', desc: '1200px PNG and scalable SVG for print & digital', color: '#3B82F6' },
  { icon: BarChart3, title: 'Scan Analytics', desc: 'Track scans, devices, locations, and conversions', color: '#F59E0B' },
  { icon: Layers, title: 'Dynamic Links', desc: 'Change destination anytime without reprinting', color: '#EC4899' },
  { icon: Shield, title: 'Error Correction', desc: 'Reed-Solomon ECC ensures reliable scanning', color: '#06B6D4' },
  { icon: Sparkles, title: '100% Free Tier', desc: 'No sign-up, no watermarks, no download limits', color: '#FF6B6B' },
];

const useCases = [
  {
    icon: Ticket, title: 'Events & Festivals',
    desc: 'Print QR codes on tickets, wristbands, and signage for instant check-in and info access.',
    image: 'https://images.unsplash.com/photo-1696569083014-ea89faf5c7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwZXZlbnQlMjB0aWNrZXRzJTIwY3Jvd2R8ZW58MXx8fHwxNzcyMDc3MDkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Building2, title: 'Business & Networking',
    desc: 'Share your vCard, portfolio, or LinkedIn profile with a single scan at conferences.',
    image: 'https://images.unsplash.com/photo-1758887248912-03a0c34a2f41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNhcmQlMjBuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjA3ODE4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: Coffee, title: 'Restaurants & Cafes',
    desc: 'Let diners scan for menus, WiFi access, reviews, or loyalty programs.',
    image: 'https://images.unsplash.com/photo-1762711667451-5ecb419c4c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwbWVudSUyMHRhYmxlJTIwZGluaW5nfGVufDF8fHx8MTc3MjA3ODE4NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    icon: ShoppingBag, title: 'Retail & E-Commerce',
    desc: 'Link products to reviews, unboxing videos, or reorder pages.',
    image: 'https://images.unsplash.com/photo-1759153820384-12c9ddf8bd8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzdG9yZSUyMHNob3BwaW5nJTIwbW9kZXJufGVufDF8fHx8MTc3MjA1MTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const faqs = [
  { q: 'Is the QR Code Generator really free?', a: 'Yes — 100% free with no sign-up, no watermarks, and no limits on how many codes you create or download.' },
  { q: 'Can I upload my own logo?', a: 'Absolutely. Drag and drop any PNG, JPG, SVG, or GIF up to 5MB. It will render in the center of your QR code with a clean background cutout.' },
  { q: 'Will the QR codes scan reliably?', a: 'Yes. Our engine uses Reed-Solomon error correction (ECC level M), which means up to 15% of the code can be obscured and it will still scan perfectly.' },
  { q: 'What file formats can I download?', a: 'High-resolution PNG (1200×1200px) for print and digital, or scalable SVG for infinite-resolution use in design tools like Figma, Illustrator, or Canva.' },
  { q: 'Do the QR codes expire?', a: 'No. The codes encode content directly — there\'s no redirect server or expiration. They\'ll work forever as long as the destination URL is live.' },
  { q: 'Can I use these for commercial purposes?', a: 'Yes, all generated QR codes are yours to use commercially — on merch, marketing materials, packaging, signage, or anywhere else.' },
];

/* ═══════════════════════════════════════════════════════════════
   QR CODE SCROLLER
   ═══════════════════════════════════════════════════════════════ */
const SCROLLER_FRAMES: { frameId: "ring-red" | "ring-cyan" | "badge-vip" | "badge-gold" | "badge-purple"; cta: string }[] = [
  { frameId: "ring-red",     cta: "SCAN NOW" },
  { frameId: "ring-cyan",    cta: "SCAN TO ACCESS" },
  { frameId: "badge-vip",    cta: "VIP ENTRY" },
  { frameId: "badge-gold",   cta: "SCAN TO SHOP" },
  { frameId: "badge-purple", cta: "SCAN TO UNLOCK" },
];

function QRScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const speed = 0.5;
    const animate = () => {
      if (!isHovered) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  const items = [...SHOWCASE_CODES, ...SHOWCASE_CODES];

  return (
    <div
      ref={scrollRef}
      className="flex gap-5 overflow-hidden py-4 px-6 cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.map((code, i) => {
        const frameCfg = SCROLLER_FRAMES[i % SCROLLER_FRAMES.length];
        const frameOpt = FRAME_OPTIONS.find((f) => f.id === frameCfg.frameId)!;
        const data = encodeData(code.dest);
        const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, code.fg, code.bg, code.pattern, code.corner, true, 2);
        const svg = renderBrandedFrame(paths, 480, totalSize, {
          frameId: frameCfg.frameId,
          ctaText: `${frameCfg.cta} — ${code.label.toUpperCase()}`,
          watermarkText: code.label.toUpperCase(),
          borderColor: frameOpt.borderColor,
          accentColor: frameOpt.accentColor,
        }, code.bg);
        return (
          <div key={`${code.label}-${i}`} className="shrink-0 w-[200px] group">
            <div className="relative rounded-2xl overflow-hidden bg-[#111827] border border-white/[0.04] hover:border-[#E52324]/15 transition-all duration-300 hover:shadow-lg hover:shadow-[#E52324]/5">
              <div className="p-4 flex items-center justify-center">
                <div
                  className="w-[160px] h-[160px] rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: svg }}
                  style={{ }}
                />
              </div>
              <div className="px-4 pb-4">
                <div className="text-[12px] text-white" style={{ fontWeight: 700 }}>{code.label}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="text-[9px] text-white/20 uppercase tracking-wider" style={{ fontWeight: 600 }}>{code.category}</div>
                  <div className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25" style={{ fontWeight: 600 }}>{frameOpt.label}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROCESS STEP
   ═══════════════════════════════════════════════════════════════ */
function ProcessStep({ step, index }: { step: typeof PROCESS_STEPS[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
        <div className="shrink-0 flex items-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${step.color}12` }}>
              <Icon className="w-7 h-7" style={{ color: step.color }} strokeWidth={1.8} />
            </div>
            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0B0F19] border-2 flex items-center justify-center" style={{ borderColor: step.color }}>
              <span className="text-[10px] text-white" style={{ fontWeight: 800 }}>{step.step}</span>
            </div>
          </motion.div>
        </div>
        <div className="flex-1">
          <h3 className="text-[22px] text-white mb-2" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.01em' }}>
            {step.title}
          </h3>
          <p className="text-[14px] text-white/35 leading-relaxed mb-4 max-w-lg">{step.desc}</p>
          <div className="flex flex-wrap gap-2">
            {step.features.map((f) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] bg-white/[0.03] border border-white/[0.06] text-white/40"
                style={{ fontWeight: 600 }}
              >
                <CheckCircle2 className="w-3 h-3" style={{ color: step.color }} strokeWidth={2} />
                {f}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export function QRGeneratorPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hero QR codes — branded frames
  const heroData = encodeData('https://instapass.ai');
  const { paths: hp1, totalSize: ht1 } = getQRInnerPaths(heroData.modules, heroData.size, R, '#FFFFFF', 'instapass', 'bullseye', true, 2);
  const heroSvg1 = renderBrandedFrame(hp1, 480, ht1, { frameId: 'ring-red', ctaText: 'SCAN TO UNLOCK EXCLUSIVE CONTENT', watermarkText: 'INSTAPASS', borderColor: R, accentColor: '#FF4444' }, '#FFFFFF');

  const { paths: hp2, totalSize: ht2 } = getQRInnerPaths(heroData.modules, heroData.size, '#00D9FF', '#FFFFFF', 'dots', 'rounded', true, 2);
  const heroSvg2 = renderBrandedFrame(hp2, 480, ht2, { frameId: 'ring-cyan', ctaText: 'SCAN FOR EVENT ACCESS', watermarkText: 'INSTAPASS', borderColor: '#00D9FF', accentColor: '#00FFD1' }, '#FFFFFF');

  const { paths: hp3, totalSize: ht3 } = getQRInnerPaths(heroData.modules, heroData.size, '#6D28D9', '#FFFFFF', 'rounded', 'bullseye', true, 2);
  const heroSvg3 = renderBrandedFrame(hp3, 480, ht3, { frameId: 'badge-purple', ctaText: 'SCAN TO UNLOCK CONTENT', watermarkText: 'INSTAPASS', borderColor: '#6D28D9', accentColor: '#A78BFA' }, '#FFFFFF');

  return (
    <div className="min-h-screen bg-[#0B0F19]">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${R}, transparent 70%)` }} />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left */}
            <div className="flex-1 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/8 border border-[#E52324]/15 mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
                <span className="text-[10px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 800 }}>SmartCodes by InstaPass</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.05] text-white mb-5"
                style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
              >
                QR Codes That
                <br />
                <span className="text-[#E52324]">Drive Action</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[16px] text-white/35 leading-relaxed mb-8 max-w-md"
              >
                Design custom, branded QR codes in seconds. Track every scan with real-time analytics. Power your events, marketing, and business.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/qr-studio/create"
                  className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[14px] text-white uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 12px 40px ${R}30` }}
                >
                  Start Creating — Free
                  <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
                </Link>
                <Link
                  to="/qr-studio"
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl text-[13px] text-white/40 border border-white/[0.08] hover:text-white/60 hover:bg-white/[0.03] transition-all"
                  style={{ fontWeight: 700 }}
                >
                  <Play className="w-4 h-4" strokeWidth={2} />
                  Explore Studio
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-4 mt-8 pt-6 border-t border-white/[0.04]"
              >
                {[
                  { icon: Shield, label: 'No Sign-Up Required' },
                  { icon: Zap, label: '100% Free' },
                  { icon: Download, label: 'Hi-Res Downloads' },
                ].map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-white/15" strokeWidth={1.8} />
                      <span className="text-[10px] text-white/20" style={{ fontWeight: 600 }}>{b.label}</span>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Right: Floating QR Codes */}
            <div className="flex-1 relative min-h-[420px] w-full max-w-[520px]">
              {/* Main QR */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 100 }}
                className="absolute top-[10%] left-[15%] z-20"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-3xl overflow-hidden shadow-2xl"
                  style={{ boxShadow: `0 40px 80px ${R}20, 0 20px 40px rgba(0,0,0,0.4)` }}
                >
                  <div dangerouslySetInnerHTML={{ __html: heroSvg1 }} className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] [&_svg]:w-full [&_svg]:h-full" />
                </motion.div>
              </motion.div>

              {/* Secondary QR */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute top-[5%] right-[5%] z-10"
              >
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [6, 8, 6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-2xl overflow-hidden shadow-xl opacity-70 rotate-6"
                >
                  <div dangerouslySetInnerHTML={{ __html: heroSvg2 }} className="w-[120px] h-[120px] [&_svg]:w-full [&_svg]:h-full" />
                </motion.div>
              </motion.div>

              {/* Tertiary QR */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
                className="absolute bottom-[15%] right-[10%] z-10"
              >
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-4, -6, -4] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="rounded-2xl overflow-hidden shadow-xl opacity-60 -rotate-4"
                >
                  <div dangerouslySetInnerHTML={{ __html: heroSvg3 }} className="w-[100px] h-[100px] [&_svg]:w-full [&_svg]:h-full" />
                </motion.div>
              </motion.div>

              {/* Floating stats pill */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="absolute bottom-[5%] left-[5%] z-30"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#111827]/90 backdrop-blur-xl border border-white/[0.06] shadow-xl"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E52324]/10 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5 text-[#E52324]" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-[16px] text-white" style={{ fontWeight: 800 }}>18.4M+</div>
                    <div className="text-[9px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 600 }}>Total Scans</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Live scan pill */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="absolute top-[45%] left-[0%] z-30"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827]/90 backdrop-blur-xl border border-white/[0.06] shadow-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-white/50" style={{ fontWeight: 600 }}>Live Scan — Los Angeles</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ BRANDED QR SCROLLER ═══════════ */}
      <section className="py-16 border-t border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h2 className="text-[28px] text-white mb-1" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
                Branded QR Codes for Every Use Case
              </h2>
              <p className="text-[13px] text-white/25">Fully customizable designs that match your brand. Scroll to explore →</p>
            </div>
            <Link
              to="/qr-studio/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] text-[#E52324] border border-[#E52324]/20 hover:bg-[#E52324]/5 transition-all"
              style={{ fontWeight: 700 }}
            >
              Create Your Own <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </motion.div>
        </div>
        <QRScroller />
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="py-12 border-y border-white/[0.03] bg-[#0D1117]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '2.4M+', label: 'QR Codes Created' },
              { value: '18M+', label: 'Total Scans' },
              { value: '140+', label: 'Countries' },
              { value: '99.9%', label: 'Scan Success Rate' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-[36px] sm:text-[42px] text-white mb-1" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-[11px] text-white/20 uppercase tracking-[0.12em]" style={{ fontWeight: 600 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5">
              <Zap className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
              <span className="text-[10px] text-white/40 uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>How It Works</span>
            </div>
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              From Idea to Scan in <span className="text-[#E52324]">60 Seconds</span>
            </h2>
            <p className="text-[14px] text-white/25 max-w-md mx-auto">
              Four simple steps to create, customize, and deploy your QR codes anywhere.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-16 relative">
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#E52324]/20 via-white/[0.03] to-transparent hidden lg:block" />
            {PROCESS_STEPS.map((step, i) => (
              <ProcessStep key={step.step} step={step} index={i} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link
              to="/qr-studio/create"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl text-[14px] text-white uppercase tracking-wider transition-all hover:brightness-110"
              style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 12px 40px ${R}25` }}
            >
              Create Your First QR Code
              <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES GRID ═══════════ */}
      <section className="py-20 lg:py-24 bg-[#0D1117] border-t border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              Everything You Need to <span className="text-[#E52324]">Create & Track</span>
            </h2>
            <p className="text-[14px] text-white/25 max-w-lg mx-auto">
              Professional QR code tools built for event organizers, marketers, and businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[#111827] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${feat.color}10` }}>
                    <Icon className="w-5 h-5" style={{ color: feat.color }} strokeWidth={1.8} />
                  </div>
                  <div className="text-[14px] text-white mb-1" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{feat.title}</div>
                  <p className="text-[12px] text-white/25 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ QR TYPE SHOWCASE ═══════════ */}
      <section className="py-20 lg:py-24 border-t border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              8 QR Code <span className="text-[#E52324]">Types</span>
            </h2>
            <p className="text-[14px] text-white/25 max-w-lg mx-auto">
              Every type of content you need, encoded directly into a scannable QR code.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {qrTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link
                    to="/qr-studio/create"
                    className="block p-5 rounded-2xl bg-[#111827] border border-white/[0.04] hover:border-[#E52324]/20 hover:bg-[#E52324]/[0.02] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E52324]/8 flex items-center justify-center mb-3 group-hover:bg-[#E52324]/15 transition-colors">
                      <Icon className="w-5 h-5 text-[#E52324]" strokeWidth={1.8} />
                    </div>
                    <h4 className="text-white text-[14px] mb-1" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{type.label}</h4>
                    <p className="text-white/25 text-[11px] leading-relaxed mb-2">{type.desc}</p>
                    <p className="text-[10px] text-white/15 truncate" style={{ fontFamily: 'monospace' }}>{type.example}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ USE CASES ═══════════ */}
      <section className="py-20 lg:py-24 bg-[#0D1117] border-t border-white/[0.03]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5">
              <Heart className="w-3 h-3 text-[#E52324]" strokeWidth={2} />
              <span className="text-[10px] text-white/40 uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>Use Cases</span>
            </div>
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              Built for Every <span className="text-[#E52324]">Industry</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc, idx) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="rounded-2xl overflow-hidden bg-[#111827] border border-white/[0.04] group hover:border-white/[0.08] transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={uc.image} alt={uc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E52324]/90 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-white text-[14px] mb-1.5" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{uc.title}</h4>
                    <p className="text-white/25 text-[12px] leading-relaxed">{uc.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-20 lg:py-24 border-t border-white/[0.03]">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
              Frequently Asked <span className="text-[#E52324]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full text-left rounded-2xl p-5 transition-all ${
                      isOpen
                        ? 'bg-[#E52324]/[0.03] border border-[#E52324]/20'
                        : 'bg-[#111827] border border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[14px] text-white" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#E52324]' : 'text-white/20'}`} />
                    </div>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="text-white/30 text-[13px] leading-relaxed mt-3 pr-8"
                      >
                        {faq.a}
                      </motion.p>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(ellipse, ${R}, transparent 70%)` }} />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/8 border border-[#E52324]/15 mb-6">
              <QrCode className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
              <span className="text-[10px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 800 }}>Ready to Start?</span>
            </div>
            <h2 className="text-[36px] sm:text-[48px] text-white mb-4" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
              Your Next QR Code
              <br />
              <span className="text-[#E52324]">Starts Here</span>
            </h2>
            <p className="text-[15px] text-white/30 max-w-md mx-auto mb-10">
              Join thousands of event organizers and businesses using InstaPass SmartCodes to connect with their audience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/qr-studio/create"
                className="flex items-center gap-2.5 px-10 py-4.5 rounded-2xl text-[15px] text-white uppercase tracking-wider transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 16px 48px ${R}30` }}
              >
                Create QR Code — Free
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </Link>
              <Link
                to="/organizer/create-event"
                className="flex items-center gap-2 px-8 py-4.5 rounded-2xl text-[14px] text-white/40 border border-white/[0.08] hover:text-white/60 hover:bg-white/[0.03] transition-all"
                style={{ fontWeight: 700 }}
              >
                Or Create an Event
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}