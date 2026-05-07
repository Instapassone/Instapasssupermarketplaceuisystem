import { useRef, useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  ArrowRight, QrCode, Palette, Download, BarChart3, Sparkles,
  Globe, User, Wifi, Mail, CalendarDays, Share2, Zap, Shield,
  Eye, Upload, Layers, ChevronRight, Play, CheckCircle2,
  Smartphone, MapPin, TrendingUp, Star, Ticket, Building2,
  ShoppingBag, Coffee,
} from "lucide-react";
import { InstaPassLogo } from "../../components/InstaPassLogo";
import { WorkspaceSwitcher } from "../../components/WorkspaceSwitcher";
import { PacManQR } from "../../components/PacManQR";
import {
  encodeData, type PatternId, type CornerId,
} from "../../components/qr-engine";
import {
  renderBrandedFrame, getQRInnerPaths, FRAME_OPTIONS,
} from "../../components/qr-branded-frames";

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const R = "#E52324";

const SHOWCASE_CODES: { label: string; dest: string; fg: string; bg: string; pattern: PatternId; corner: CornerId; category: string; shape: 'square' | 'circle'; accent: string; logo: string; logoBg: string }[] = [
  { label: "Apple",             dest: "https://apple.com",            fg: "#000000", bg: "#FFFFFF", pattern: "square",    corner: "sharp",    category: "Technology",   shape: "square", accent: "#A2AAAD", logo: "⌘",  logoBg: "#000000" },
  { label: "McDonald's",        dest: "https://mcdonalds.com",        fg: "#DA291C", bg: "#FFC72C", pattern: "square",    corner: "sharp",    category: "Food & Bev",   shape: "square", accent: "#FFC72C", logo: "M",  logoBg: "#DA291C" },
  { label: "Starbucks",         dest: "https://starbucks.com",        fg: "#00704A", bg: "#FFFFFF", pattern: "dots",      corner: "rounded",  category: "Coffee",       shape: "circle", accent: "#00704A", logo: "SB", logoBg: "#00704A" },
  { label: "TikTok",            dest: "https://tiktok.com",           fg: "#00F2EA", bg: "#010101", pattern: "dots",      corner: "bullseye", category: "Social",       shape: "square", accent: "#00F2EA", logo: "TT", logoBg: "#000000" },
  { label: "YouTube",           dest: "https://youtube.com",          fg: "#FF0000", bg: "#FFFFFF", pattern: "rounded",   corner: "bullseye", category: "Video",        shape: "square", accent: "#FF0000", logo: "▶",  logoBg: "#FF0000" },
  { label: "Burger King",       dest: "https://bk.com",               fg: "#D62300", bg: "#F5EBDC", pattern: "square",    corner: "sharp",    category: "Food & Bev",   shape: "square", accent: "#F5A623", logo: "BK", logoBg: "#D62300" },
  { label: "Nike",              dest: "https://nike.com",             fg: "#111111", bg: "#FFFFFF", pattern: "diamond",   corner: "sharp",    category: "Sportswear",   shape: "square", accent: "#111111", logo: "✓",  logoBg: "#111111" },
  { label: "Spotify",           dest: "https://spotify.com",          fg: "#1DB954", bg: "#191414", pattern: "dots",      corner: "rounded",  category: "Music",        shape: "circle", accent: "#1DB954", logo: "♫",  logoBg: "#1DB954" },
  { label: "DHL",               dest: "https://dhl.com",              fg: "#D40511", bg: "#FFCC00", pattern: "square",    corner: "sharp",    category: "Logistics",    shape: "square", accent: "#FFCC00", logo: "DHL",logoBg: "#D40511" },
  { label: "Coca-Cola",         dest: "https://coca-cola.com",        fg: "#F40009", bg: "#FFFFFF", pattern: "rounded",   corner: "rounded",  category: "Beverage",     shape: "circle", accent: "#F40009", logo: "CC", logoBg: "#F40009" },
  { label: "Netflix",           dest: "https://netflix.com",          fg: "#E50914", bg: "#141414", pattern: "rounded",   corner: "bullseye", category: "Streaming",    shape: "square", accent: "#E50914", logo: "N",  logoBg: "#E50914" },
  { label: "Amazon",            dest: "https://amazon.com",           fg: "#FF9900", bg: "#232F3E", pattern: "instapass", corner: "rounded",  category: "E-Commerce",   shape: "square", accent: "#FF9900", logo: "a→", logoBg: "#FF9900" },
  { label: "Amex",              dest: "https://americanexpress.com",  fg: "#006FCF", bg: "#FFFFFF", pattern: "square",    corner: "sharp",    category: "Finance",      shape: "square", accent: "#006FCF", logo: "AX", logoBg: "#006FCF" },
  { label: "InstaPass",         dest: "https://instapass.ai",         fg: "#E52324", bg: "#FFFFFF", pattern: "instapass", corner: "bullseye", category: "Events",       shape: "circle", accent: "#E52324", logo: "IP", logoBg: "#E52324" },
];

const PROCESS_STEPS = [
  {
    step: 1, title: "Choose Your Destination",
    desc: "Pick from 8 QR code types — website URLs, event pages, WiFi credentials, contact cards, social profiles, and more. Every code is dynamic and editable anytime.",
    icon: Globe, color: "#E52324",
    features: ["8 QR Types", "Dynamic Links", "UTM Builder"],
  },
  {
    step: 2, title: "Customize Your Design",
    desc: "Match your brand with custom colors, dot patterns, corner eye styles, and logo placement. Choose from pro presets or create your own unique look.",
    icon: Palette, color: "#8B5CF6",
    features: ["6 Color Presets", "5 Dot Patterns", "3 Corner Styles"],
  },
  {
    step: 3, title: "Download & Deploy",
    desc: "Export as high-resolution PNG (1200×1200px) or scalable SVG. Print on tickets, posters, merch, wristbands, signage — anywhere your audience is.",
    icon: Download, color: "#10B981",
    features: ["Hi-Res PNG", "Vector SVG", "Print Ready"],
  },
  {
    step: 4, title: "Track Every Scan",
    desc: "Monitor real-time analytics — scan counts, device breakdown, geographic data, and conversion tracking. Know exactly how your QR codes perform.",
    icon: BarChart3, color: "#3B82F6",
    features: ["Real-Time Data", "Geo Tracking", "Device Analytics"],
  },
];

const STATS = [
  { value: "2.4M+", label: "QR Codes Created" },
  { value: "18M+", label: "Total Scans" },
  { value: "140+", label: "Countries" },
  { value: "99.9%", label: "Scan Success Rate" },
];

const INDUSTRIES = [
  { icon: Ticket, title: "Events & Festivals", desc: "Tickets, wristbands, signage, check-in" },
  { icon: Building2, title: "Business", desc: "vCards, networking, presentations" },
  { icon: Coffee, title: "Hospitality", desc: "Menus, WiFi, reviews, ordering" },
  { icon: ShoppingBag, title: "Retail", desc: "Product links, coupons, loyalty" },
];

/* ═══════════════════════════════════════════════════════════════
   QR CODE SCROLLER COMPONENT
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

  const items = [...SHOWCASE_CODES, ...SHOWCASE_CODES]; // duplicate for infinite loop

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
                  className="w-[160px] h-[160px] rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 [&_svg]:w-full [&_svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: code.accent }} />
                  <div className="text-[12px] text-white" style={{ fontWeight: 700 }}>{code.label}</div>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <div className="text-[9px] text-white/20 uppercase tracking-wider ml-4" style={{ fontWeight: 600 }}>{code.category}</div>
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
   PROCESS STEP COMPONENT
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
        {/* Step Number + Icon */}
        <div className="shrink-0 flex items-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
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

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-[22px] text-white mb-2" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.01em" }}>
            {step.title}
          </h3>
          <p className="text-[14px] text-white/35 leading-relaxed mb-4 max-w-lg">
            {step.desc}
          </p>
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

/* ─── BRANDED FRAMES SHOWCASE ─── */
const BRANDED_SHOWCASE = [
  { frameId: "ring-red" as const, fg: "#E52324", pattern: "instapass" as PatternId, corner: "bullseye" as CornerId, cta: "SCAN TO UNLOCK EXCLUSIVE CONTENT", label: "Red Ring" },
  { frameId: "ring-cyan" as const, fg: "#00D9FF", pattern: "dots" as PatternId, corner: "rounded" as CornerId, cta: "SCAN FOR EVENT ACCESS", label: "Cyan Ring" },
  { frameId: "badge-vip" as const, fg: "#8B5CF6", pattern: "rounded" as PatternId, corner: "bullseye" as CornerId, cta: "VIP ENTRY", label: "VIP Badge" },
  { frameId: "badge-gold" as const, fg: "#D4A017", pattern: "dots" as PatternId, corner: "rounded" as CornerId, cta: "SCAN TO SHOP", label: "Gold Badge" },
  { frameId: "badge-purple" as const, fg: "#6D28D9", pattern: "rounded" as PatternId, corner: "bullseye" as CornerId, cta: "SCAN TO UNLOCK CONTENT", label: "Purple Badge" },
];

function BrandedFramesShowcase() {
  const data = encodeData("https://instapass.ai");

  return (
    <section className="py-20 border-t border-white/[0.03] bg-gradient-to-b from-[#0B0F19] to-[#0D1117]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/8 border border-[#E52324]/15 mb-5">
            <Layers className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
            <span className="text-[10px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 800 }}>Premium Branding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}>
            Branded Frame <span className="text-[#E52324]">Collection</span>
          </h2>
          <p className="text-white/35 text-sm max-w-lg mx-auto leading-relaxed">
            Every QR code ships with your brand identity. Choose from circular rings, VIP badges, and premium frames — all with CTA text, watermarks, and glow effects.
          </p>
        </motion.div>

        {/* 5 Branded QR Frames */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          {BRANDED_SHOWCASE.map((item, idx) => {
            const frame = FRAME_OPTIONS.find((f) => f.id === item.frameId)!;
            const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, item.fg, "#FFFFFF", item.pattern, item.corner, true, 2);
            const svg = renderBrandedFrame(paths, 480, totalSize, {
              frameId: item.frameId,
              ctaText: item.cta,
              watermarkText: "INSTAPASS",
              borderColor: frame.borderColor,
              accentColor: frame.accentColor,
            }, "#FFFFFF");

            return (
              <motion.div
                key={item.frameId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden bg-[#111]/60 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 p-3 sm:p-4">
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${frame.borderColor}10, transparent 70%)` }}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: svg }}
                    className="w-full aspect-square [&_svg]:w-full [&_svg]:h-full group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-[12px] text-white/80" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{item.label}</div>
                  <div className="text-[10px] text-white/25 mt-0.5" style={{ fontWeight: 500 }}>{frame.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/qr-studio/create"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[13px] text-white transition-all hover:brightness-110"
            style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 8px 30px ${R}25` }}
          >
            Try Branded Frames <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════ */
export function QRStudioLanding() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Generate hero QR — branded frames
  const heroQrData = encodeData("https://instapass.ai");
  const { paths: sp1, totalSize: st1 } = getQRInnerPaths(heroQrData.modules, heroQrData.size, R, "#FFFFFF", "instapass", "bullseye", true, 2);
  const heroQrSvg = renderBrandedFrame(sp1, 480, st1, { frameId: "ring-red", ctaText: "SCAN TO UNLOCK EXCLUSIVE CONTENT", watermarkText: "INSTAPASS", borderColor: R, accentColor: "#FF4444" }, "#FFFFFF");

  const { paths: sp2, totalSize: st2 } = getQRInnerPaths(heroQrData.modules, heroQrData.size, "#D4A017", "#FFFFFF", "dots", "rounded", true, 2);
  const heroQrSvg2 = renderBrandedFrame(sp2, 480, st2, { frameId: "badge-gold", ctaText: "SCAN TO SHOP", watermarkText: "INSTAPASS", borderColor: "#D4A017", accentColor: "#FFD700" }, "#FFFFFF");

  const { paths: sp3, totalSize: st3 } = getQRInnerPaths(heroQrData.modules, heroQrData.size, "#8B5CF6", "#FFFFFF", "rounded", "bullseye", true, 2);
  const heroQrSvg3 = renderBrandedFrame(sp3, 480, st3, { frameId: "badge-vip", ctaText: "VIP ENTRY", watermarkText: "INSTAPASS", borderColor: "#8B5CF6", accentColor: "#C084FC" }, "#FFFFFF");

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── HEADER ─── */}
      <header className="h-[64px] bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        <div className="flex items-center gap-5">
          <Link to="/" className="shrink-0"><InstaPassLogo size="sm" /></Link>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-white/10">|</span>
            <span className="text-[13px] text-white/50" style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>QR Code Studio</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {["Features", "How It Works", "Use Cases"].map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/\s/g, "-")}`} className="text-[12px] text-white/30 hover:text-white/60 transition-colors" style={{ fontWeight: 600 }}>{s}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <WorkspaceSwitcher compact />
          <Link
            to="/qr-studio/create"
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12px] text-white transition-all hover:brightness-110"
            style={{ fontWeight: 700, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 4px 20px ${R}30` }}
          >
            <QrCode className="w-3.5 h-3.5" strokeWidth={2} />
            Create QR Code
          </Link>
        </div>
      </header>

      {/* ═══════════ SECTION 1 — HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${R}, transparent 70%)` }} />
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #8B5CF6, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Text */}
            <motion.div
              className="flex-1 max-w-xl"
              style={{ y: heroY, opacity: heroOpacity }}
            >
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
                className="text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.05] mb-5"
                style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}
              >
                Create QR Codes That
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
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl text-[13px] text-white/40 border border-white/[0.08] hover:text-white/60 hover:bg-white/[0.03] transition-all"
                  style={{ fontWeight: 700 }}
                >
                  <Play className="w-4 h-4" strokeWidth={2} />
                  See How It Works
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex items-center gap-4 mt-8 pt-6 border-t border-white/[0.04]"
              >
                {[
                  { icon: Shield, label: "No Sign-Up Required" },
                  { icon: Zap, label: "100% Free" },
                  { icon: Download, label: "Hi-Res Downloads" },
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
            </motion.div>

            {/* Right: Floating QR Codes */}
            <div className="flex-1 relative min-h-[420px] w-full max-w-[520px]">
              {/* Pac-Man Animated QR Code */}
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PacManQR size={380} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 2 — QR CODE SCROLLER ═══════════ */}
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
              <h2 className="text-[28px] text-white mb-1" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
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

      {/* ═══════════ BRANDED FRAMES SHOWCASE ═══════════ */}
      <BrandedFramesShowcase />

      {/* ═══════════ SECTION 3 — STATS BAR ═══════════ */}
      <section className="py-12 border-y border-white/[0.03] bg-[#0D1117]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
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

      {/* ═══════════ SECTION 4 — HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="py-20 scroll-mt-16">
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
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
              From Idea to Scan in <span className="text-[#E52324]">60 Seconds</span>
            </h2>
            <p className="text-[14px] text-white/25 max-w-md mx-auto">
              Four simple steps to create, customize, and deploy your QR codes anywhere.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-16 relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#E52324]/20 via-white/[0.03] to-transparent hidden lg:block" />

            {PROCESS_STEPS.map((step, i) => (
              <ProcessStep key={step.step} step={step} index={i} />
            ))}
          </div>

          {/* CTA */}
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

      {/* ═══════════ SECTION 5 — FEATURES GRID ═══════════ */}
      <section id="features" className="py-20 bg-[#0D1117] border-t border-white/[0.03] scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
              Everything You Need to <span className="text-[#E52324]">Create & Track</span>
            </h2>
            <p className="text-[14px] text-white/25 max-w-lg mx-auto">
              Professional QR code tools built for event organizers, marketers, and businesses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: QrCode, title: "8 QR Code Types", desc: "URL, vCard, WiFi, Email, SMS, Text, Event, Social", color: "#E52324" },
              { icon: Palette, title: "Full Customization", desc: "Colors, patterns, corners, logos — make it yours", color: "#8B5CF6" },
              { icon: Eye, title: "Live Preview", desc: "Watch your QR update in real-time as you design", color: "#10B981" },
              { icon: Download, title: "Hi-Res Export", desc: "1200px PNG and scalable SVG for print & digital", color: "#3B82F6" },
              { icon: BarChart3, title: "Scan Analytics", desc: "Track scans, devices, locations, and conversions", color: "#F59E0B" },
              { icon: Layers, title: "Dynamic Links", desc: "Change destination anytime without reprinting", color: "#EC4899" },
              { icon: Shield, title: "Error Correction", desc: "Reed-Solomon ECC ensures reliable scanning", color: "#06B6D4" },
              { icon: Sparkles, title: "100% Free Tier", desc: "No sign-up, no watermarks, no download limits", color: "#FF6B6B" },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="p-6 rounded-2xl bg-[#111827] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${feature.color}10` }}>
                    <Icon className="w-5 h-5" style={{ color: feature.color }} strokeWidth={1.8} />
                  </div>
                  <div className="text-[14px] text-white mb-1" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{feature.title}</div>
                  <p className="text-[12px] text-white/25 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 6 — USE CASES ═══════════ */}
      <section id="use-cases" className="py-20 scroll-mt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-[32px] sm:text-[40px] text-white mb-3" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
              Built for Every <span className="text-[#E52324]">Industry</span>
            </h2>
            <p className="text-[14px] text-white/25">QR codes that work across events, business, hospitality, and retail.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div
                  key={ind.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative p-6 rounded-2xl bg-[#111827] border border-white/[0.04] overflow-hidden group hover:border-[#E52324]/10 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.03] -translate-y-1/2 translate-x-1/2" style={{ background: `radial-gradient(circle, ${R}, transparent)` }} />
                  <Icon className="w-8 h-8 text-[#E52324] mb-4" strokeWidth={1.5} />
                  <div className="text-[16px] text-white mb-2" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{ind.title}</div>
                  <p className="text-[12px] text-white/25 leading-relaxed">{ind.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 7 — FINAL CTA ═══════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(ellipse, ${R}, transparent)` }} />
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
            <h2 className="text-[36px] sm:text-[48px] text-white mb-4" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}>
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
                to="/qr-studio/templates"
                className="flex items-center gap-2 px-8 py-4.5 rounded-2xl text-[14px] text-white/40 border border-white/[0.08] hover:text-white/60 hover:bg-white/[0.03] transition-all"
                style={{ fontWeight: 700 }}
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-8 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <InstaPassLogo size="sm" />
            <span className="text-[10px] text-white/15">SmartCodes Studio</span>
          </div>
          <div className="flex items-center gap-6">
            {["Generator", "Library", "Analytics", "Templates"].map((l) => (
              <Link key={l} to={`/qr-studio/${l === "Generator" ? "create" : l.toLowerCase()}`} className="text-[11px] text-white/20 hover:text-white/40 transition-colors" style={{ fontWeight: 500 }}>{l}</Link>
            ))}
          </div>
          <p className="text-[10px] text-white/15">&copy; 2026 InstaPass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}