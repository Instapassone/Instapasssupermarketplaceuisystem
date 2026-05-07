import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Calendar, Ticket, Megaphone, QrCode, ChevronLeft, ChevronRight,
  ArrowRight, Star, Church, PartyPopper, Users, Music,
  MapPin, Upload, Type, Globe, Tag, Gift, Percent, BarChart3,
  Zap, Shield, Heart, GraduationCap, Handshake, Crown,
  CheckCircle2, TrendingUp, DollarSign, ScanLine, Sparkles,
  CalendarPlus, Rocket, Layers, Check, X,
  Mail, Smartphone, Bot, RefreshCw, Palette,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/* ═══════════════════════════════════════════
   ANIMATED SECTION WRAPPER
   ═══════════════════════════════════════════ */

function AnimSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   DATA — COMMUNITY SLIDER
   ═══════════════════════════════════════════ */

const communitySlides = [
  {
    id: 'clubs',
    badge: 'CLUBS',
    title: 'Sell out your next Friday night.',
    tagline: 'VIP tickets, guest lists, QR entry scanning.',
    image: 'https://images.unsplash.com/photo-1574154894072-18ba0d48321b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBjcm93ZCUyMERKJTIwbGlnaHRzJTIwcGFydHl8ZW58MXx8fHwxNzcyMTAwMDMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: 'from-purple-900/90 via-black/70 to-black/90',
    accent: '#A855F7',
    icon: Music,
  },
  {
    id: 'churches',
    badge: 'CHURCH',
    title: 'Organize services, conferences, and fundraisers.',
    tagline: 'Free or paid tickets, check-in tracking.',
    image: 'https://images.unsplash.com/photo-1760319726429-fcda77d3cb05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjB3b3JzaGlwJTIwZ2F0aGVyaW5nJTIwY29uZ3JlZ2F0aW9ufGVufDF8fHx8MTc3MjEwMDAzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: 'from-amber-900/90 via-black/70 to-black/90',
    accent: '#F59E0B',
    icon: Church,
  },
  {
    id: 'private',
    badge: 'PRIVATE EVENT',
    title: 'Manage guest lists effortlessly.',
    tagline: 'Private QR access and RSVP tracking.',
    image: 'https://images.unsplash.com/photo-1771850644922-fffb01043ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cHNjYWxlJTIwYmlydGhkYXklMjBjZWxlYnJhdGlvbiUyMHByaXZhdGUlMjBwYXJ0eXxlbnwxfHx8fDE3NzIxMDAwMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: 'from-rose-900/90 via-black/70 to-black/90',
    accent: '#F43F5E',
    icon: PartyPopper,
  },
  {
    id: 'festivals',
    badge: 'FESTIVAL',
    title: 'Scale to thousands with ease.',
    tagline: 'Tiered pricing and real-time analytics.',
    image: 'https://images.unsplash.com/photo-1761926826313-a1787661b7b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwbXVzaWMlMjBmZXN0aXZhbCUyMGNyb3dkJTIwc3VtbWVyfGVufDF8fHx8MTc3MjA4MzY4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: 'from-blue-900/90 via-black/70 to-black/90',
    accent: '#3B82F6',
    icon: Sparkles,
  },
  {
    id: 'community',
    badge: 'COMMUNITY',
    title: 'Bring your neighborhood together.',
    tagline: 'Donation tickets and sponsor options.',
    image: 'https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwYXJrJTIwZXZlbnQlMjBmYW1pbHklMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzcyMTAwMDMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradient: 'from-emerald-900/90 via-black/70 to-black/90',
    accent: '#10B981',
    icon: Users,
  },
];

/* ═══════════════════════════════════════════
   DATA — HOW IT WORKS PROCESS STEPS
   ═══════════════════════════════════════════ */

const processSteps = [
  {
    step: 1,
    title: 'Build Your Event',
    subtitle: 'Set up in minutes, not hours',
    icon: CalendarPlus,
    color: '#3B82F6',
    features: [
      'Custom event pages with rich media',
      'Media upload — images, videos, galleries',
      'In-person venue or virtual event support',
      'Flexible ticket tiers and add-ons',
      'AI-assisted event description writer',
    ],
    preview: {
      type: 'wizard' as const,
      items: [
        { label: 'Basic Info', done: true },
        { label: 'Date & Venue', done: true },
        { label: 'Tickets', done: false },
        { label: 'Media', done: false },
        { label: 'Publish', done: false },
      ],
    },
  },
  {
    step: 2,
    title: 'Customize Your Tickets',
    subtitle: 'Pricing that converts',
    icon: Layers,
    color: '#8B5CF6',
    features: [
      'Early Bird, GA, VIP, and custom tiers',
      'Bundle pricing and group discounts',
      'Promo codes and referral tracking',
      'Dynamic pricing with demand signals',
      'Payment plans for premium events',
    ],
    preview: {
      type: 'badges' as const,
      items: [
        { label: 'Early Bird', color: '#10B981' },
        { label: 'VIP', color: '#8B5CF6' },
        { label: 'Sold Out', color: '#EF4444' },
        { label: 'Limited', color: '#F59E0B' },
        { label: 'Free', color: '#3B82F6' },
      ],
    },
  },
  {
    step: 3,
    title: 'Launch + Amplify',
    subtitle: 'Reach your audience everywhere',
    icon: Rocket,
    color: '#E52324',
    features: [
      'Instant marketplace visibility to millions',
      'Shareable event link with social previews',
      'Built-in branded QR code for every event',
      'Email capture and attendee list builder',
      'AI Concierge chatbot for attendee support',
    ],
    preview: {
      type: 'metrics' as const,
      items: [
        { label: 'Impressions', value: '24.8K', trend: '+32%' },
        { label: 'Clicks', value: '3,210', trend: '+18%' },
        { label: 'Conversions', value: '847', trend: '+24%' },
      ],
    },
  },
  {
    step: 4,
    title: 'Scan + Analyze',
    subtitle: 'Real-time operations & insights',
    icon: ScanLine,
    color: '#06B6D4',
    features: [
      'Real-time QR scanning and check-in',
      'Fraud prevention and duplicate detection',
      'Live revenue dashboard with payouts',
      'Attendee demographics and analytics',
      'Export data and integrate with CRM',
    ],
    preview: {
      type: 'chart' as const,
      items: [35, 52, 48, 72, 68, 85, 92, 88, 95],
    },
  },
];

/* ═══════════════════════════════════════════
   DATA — COMPARISON TABLE
   ═══════════════════════════════════════════ */

const comparisons = [
  { traditional: 'Complicated multi-page setup', instapass: 'Guided 5-step wizard' },
  { traditional: 'Hidden fees and surprise charges', instapass: 'Transparent pricing and fast payouts' },
  { traditional: 'Basic static QR codes', instapass: 'Dynamic branded QR with analytics' },
  { traditional: 'Generic event pages', instapass: 'AI-enhanced conversion-optimized pages' },
  { traditional: 'Limited post-event data', instapass: 'Full real-time performance tracking' },
  { traditional: 'Email-only support', instapass: 'AI Concierge + dedicated support' },
];

/* ═══════════════════════════════════════════
   DATA — DASHBOARD FEATURES
   ═══════════════════════════════════════════ */

const dashboardFeatures = [
  { icon: BarChart3, label: 'Transparent real-time reporting' },
  { icon: Zap, label: 'Instant actionable insights' },
  { icon: Users, label: 'Audience demographics tracking' },
  { icon: Smartphone, label: 'Mobile scanner mode built-in' },
  { icon: DollarSign, label: 'Fast payouts within 3 days' },
  { icon: Shield, label: 'Fraud detection and prevention' },
];

/* ═══════════════════════════════════════════
   DATA — COMMUNITY CARDS
   ═══════════════════════════════════════════ */

const communityCards = [
  { icon: Music, title: 'Clubs & Nightlife', desc: 'VIP tables, guest lists, and QR entry for the nightlife industry.', color: '#A855F7', bg: 'bg-purple-500/10' },
  { icon: Church, title: 'Churches', desc: 'Services, conferences, retreats, and donation-based events.', color: '#F59E0B', bg: 'bg-amber-500/10' },
  { icon: PartyPopper, title: 'Private Hosts', desc: 'Birthdays, weddings, galas — invite-only with QR access.', color: '#F43F5E', bg: 'bg-rose-500/10' },
  { icon: GraduationCap, title: 'Schools', desc: 'Proms, fundraisers, sports events, and graduation ceremonies.', color: '#3B82F6', bg: 'bg-blue-500/10' },
  { icon: Heart, title: 'Nonprofits', desc: 'Charity events, galas, and donation ticket campaigns.', color: '#10B981', bg: 'bg-emerald-500/10' },
  { icon: Handshake, title: 'Promoters', desc: 'Multi-event management, affiliate tracking, and fast payouts.', color: '#E52324', bg: 'bg-red-500/10' },
];

/* ═══════════════════════════════════════════
   DATA — TESTIMONIALS
   ═══════════════════════════════════════════ */

const testimonials = [
  {
    name: 'Jessica Martinez',
    role: 'Festival Director',
    event: 'Neon Nights Festival',
    result: 'Sold out 2,400 tickets in 48 hours',
    quote: 'InstaPass transformed how we sell tickets. The QR Studio alone saved us $8K in print costs.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1696960181436-1b6d9576354e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGV2ZW50JTIwcGxhbm5lciUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjA5OTEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    revenue: '$187,200',
  },
  {
    name: 'Marcus Chen',
    role: 'Venue Owner',
    event: 'The Grand LA',
    result: '3x ticket revenue in 6 months',
    quote: 'The organizer dashboard gives me everything I need. Real-time sales, instant payouts, zero guesswork.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1769071166862-8cc3a6f2ac5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBlbnRyZXByZW5ldXIlMjBzdGFydHVwJTIwZm91bmRlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjA5OTEwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    revenue: '$342,500',
  },
  {
    name: 'Priya Sharma',
    role: 'Event Producer',
    event: 'TechConnect Summit',
    result: '92% check-in rate with QR scanning',
    quote: "From event setup to door scanning, InstaPass is the most complete platform I've used. Period.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1657310771828-ec5bbc25df98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwY3JlYXRpdmUlMjBkaXJlY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjA5OTEwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    revenue: '$95,800',
  },
];

/* ═══════════════════════════════════════════
   COMMUNITY SLIDER COMPONENT
   ═══════════════════════════════════════════ */

function CommunitySlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % communitySlides.length);
    }, 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((p) => (p + dir + communitySlides.length) % communitySlides.length);
    startTimer();
  };

  const slide = communitySlides[current];
  const Icon = slide.icon;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="relative w-full aspect-[16/7] min-h-[400px] max-h-[600px] overflow-hidden rounded-3xl group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 w-fit"
              style={{ backgroundColor: `${slide.accent}20`, border: `1px solid ${slide.accent}40` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: slide.accent }} />
              <span className="text-[11px] tracking-[0.2em] uppercase" style={{ color: slide.accent, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                {slide.badge}
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl text-white max-w-lg mb-3"
              style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {slide.title}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-white/50 text-sm sm:text-base mb-6 max-w-md"
            >
              {slide.tagline}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm tracking-wider hover:brightness-110 transition-all shadow-lg"
                style={{ backgroundColor: slide.accent, fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}
              >
                Create Similar Event <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {communitySlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); startTimer(); }}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: i === current ? 32 : 8, backgroundColor: i === current ? slide.accent : 'rgba(255,255,255,0.25)' }}
          >
            {i === current && (
              <motion.div
                className="absolute inset-0 bg-white/30 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE EXPORT
   ═══════════════════════════════════════════ */

export function CreateEventLanding() {
  return (
    <div className="min-h-screen bg-[#0B1120]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <Header />

      {/* ═══════════════════════════════════════════
          SECTION 1 — HERO + COMMUNITY SLIDER
          ═══════════════════════════════════════════ */}
      <section className="relative bg-black pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#E52324]/[0.04] rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/15 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#E52324]" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324]" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                Event Creation Platform
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl text-white mb-5"
              style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em', lineHeight: 1 }}
            >
              Bring Your Community
              <br />
              <span className="text-[#E52324]">Together.</span>
            </h1>

            <p className="text-white/40 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8">
              From clubs to churches to private events — create, sell, and manage your event in minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/organizer/create-event"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#E52324] text-white text-sm tracking-wider hover:bg-[#c91f20] transition-colors shadow-lg shadow-[#E52324]/25"
                style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}
              >
                Start Creating <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/15 text-white/60 text-sm hover:bg-white/5 hover:text-white transition-all"
                style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}
              >
                See Examples
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <CommunitySlider />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 2 — TRANSITION: "Creating is easy"
          ═══════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-[#0B1120]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[1400px] mx-auto px-4"
        >
          <div className="flex items-center gap-6 justify-center mb-6">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-white/10" />
            <Sparkles className="w-5 h-5 text-[#E52324]/60" />
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-white/70"
            style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}
          >
            Creating an event is{' '}
            <span className="text-white" style={{ fontWeight: 800 }}>easier than you think.</span>
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 3 — HOW INSTAPASS WORKS (Full Process)
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0B1120] relative">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-10">
          <AnimSection>
            <div className="text-center mb-16 lg:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5">
                <Zap className="w-3.5 h-3.5 text-[#E52324]" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-white/40" style={{ fontWeight: 700 }}>
                  Simple 4-Step Process
                </span>
              </div>
              <h2 className="text-[36px] sm:text-[44px] lg:text-[52px] text-white leading-[0.95] tracking-tight mb-4" style={{ fontWeight: 900 }}>
                HOW INSTAPASS
                <br />
                <span className="text-[#E52324]">WORKS</span>
              </h2>
              <p className="text-[16px] text-white/35 max-w-xl mx-auto">
                Built for modern event creators who want results, not complexity.
              </p>
            </div>
          </AnimSection>

          {/* Process Steps — rich horizontal cards */}
          <div className="space-y-6">
            {processSteps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <AnimSection key={s.step} delay={idx * 0.08}>
                  <div className="group relative rounded-3xl bg-[#111827]/60 border border-[#1F2937]/60 hover:border-[#1F2937] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/20">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                      {/* Left — Info (3 cols) */}
                      <div className="lg:col-span-3 p-8 lg:p-10">
                        <div className="flex items-start gap-5 mb-6">
                          <div className="shrink-0">
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                              style={{ backgroundColor: `${s.color}12` }}
                            >
                              <StepIcon className="w-6 h-6" style={{ color: s.color }} />
                              <span
                                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full text-[10px] flex items-center justify-center"
                                style={{ backgroundColor: s.color, fontWeight: 800, color: '#fff' }}
                              >
                                {s.step}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-[22px] sm:text-[26px] text-white tracking-tight mb-1" style={{ fontWeight: 800 }}>
                              {s.title}
                            </h3>
                            <p className="text-[14px] text-white/35">{s.subtitle}</p>
                          </div>
                        </div>

                        <div className="space-y-3 ml-[76px]">
                          {s.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="mt-1 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}15` }}>
                                <Check className="w-2.5 h-2.5" style={{ color: s.color }} strokeWidth={3} />
                              </div>
                              <span className="text-[14px] text-white/50">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {s.step === 3 && (
                          <div className="ml-[76px] mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E52324]/8 border border-[#E52324]/15">
                            <Bot className="w-4 h-4 text-[#E52324]" />
                            <span className="text-[12px] text-[#E52324]" style={{ fontWeight: 700 }}>
                              Powered by InstaPass AI Concierge
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right — Preview (2 cols) */}
                      <div className="lg:col-span-2 bg-[#0B1220]/60 border-t lg:border-t-0 lg:border-l border-[#1F2937]/40 p-8 lg:p-10 flex items-center justify-center">
                        {s.preview.type === 'wizard' && (
                          <div className="w-full max-w-[260px]">
                            <div className="text-[10px] text-white/25 uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>Event Creation Wizard</div>
                            <div className="space-y-2">
                              {(s.preview.items as { label: string; done: boolean }[]).map((item, i) => (
                                <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${item.done ? 'bg-emerald-500/[0.06] border-emerald-500/20' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${item.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/25'}`} style={{ fontWeight: 800 }}>
                                    {item.done ? <Check className="w-3 h-3" /> : i + 1}
                                  </div>
                                  <span className={`text-[12px] ${item.done ? 'text-emerald-400' : 'text-white/40'}`} style={{ fontWeight: 600 }}>
                                    {item.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {s.preview.type === 'badges' && (
                          <div className="w-full max-w-[260px]">
                            <div className="text-[10px] text-white/25 uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>Ticket Tier Badges</div>
                            <div className="flex flex-wrap gap-2">
                              {(s.preview.items as { label: string; color: string }[]).map((item, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  whileInView={{ scale: 1, opacity: 1 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.3 + i * 0.08 }}
                                  className="px-4 py-2 rounded-xl text-[12px] text-white border"
                                  style={{ fontWeight: 700, backgroundColor: `${item.color}12`, borderColor: `${item.color}25` }}
                                >
                                  {item.label}
                                </motion.span>
                              ))}
                            </div>
                            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>VIP Access</span>
                                <span className="text-[15px] text-white" style={{ fontWeight: 800 }}>$149</span>
                              </div>
                              <div className="text-[11px] text-white/30 mb-2">Front row, drinks included</div>
                              <div className="w-full h-1.5 rounded-full bg-white/5">
                                <div className="w-[72%] h-full rounded-full bg-purple-500/60" />
                              </div>
                              <div className="text-[10px] text-white/20 mt-1">72% sold</div>
                            </div>
                          </div>
                        )}

                        {s.preview.type === 'metrics' && (
                          <div className="w-full max-w-[260px]">
                            <div className="text-[10px] text-white/25 uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>Campaign Performance</div>
                            <div className="space-y-3">
                              {(s.preview.items as { label: string; value: string; trend: string }[]).map((item, i) => (
                                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/35" style={{ fontWeight: 600 }}>{item.label}</span>
                                    <span className="text-[10px] text-emerald-400" style={{ fontWeight: 700 }}>{item.trend}</span>
                                  </div>
                                  <div className="text-[18px] text-white mt-0.5" style={{ fontWeight: 800 }}>{item.value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {s.preview.type === 'chart' && (
                          <div className="w-full max-w-[260px]">
                            <div className="text-[10px] text-white/25 uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>Live Analytics</div>
                            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[12px] text-white" style={{ fontWeight: 700 }}>Check-ins</span>
                                <span className="text-[11px] text-emerald-400" style={{ fontWeight: 700 }}>847 / 1,200</span>
                              </div>
                              <div className="flex items-end gap-[3px] h-[80px]">
                                {(s.preview.items as number[]).map((h, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 rounded-sm transition-all"
                                    style={{ height: `${h}%`, backgroundColor: i === (s.preview.items as number[]).length - 1 ? '#06B6D4' : '#06B6D420' }}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[9px] text-white/15">9 AM</span>
                                <span className="text-[9px] text-white/15">Now</span>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <div className="flex-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                                <div className="text-[10px] text-white/25" style={{ fontWeight: 600 }}>Avg Time</div>
                                <div className="text-[13px] text-white" style={{ fontWeight: 700 }}>1.2s</div>
                              </div>
                              <div className="flex-1 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-center">
                                <div className="text-[10px] text-white/25" style={{ fontWeight: 600 }}>Fraud</div>
                                <div className="text-[13px] text-emerald-400" style={{ fontWeight: 700 }}>0</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 4 — QR CODE STUDIO
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#080E1C] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#E52324]/[0.03] rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — QR Preview */}
            <AnimSection>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-[300px] h-[300px] rounded-3xl bg-[#111827] border border-[#1F2937] shadow-2xl shadow-black/40 p-8 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-white p-4 flex items-center justify-center">
                      <div className="grid grid-cols-7 gap-[3px] w-full h-full">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-[1px]"
                            style={{ backgroundColor: [0,1,2,7,8,9,14,15,16,4,5,6,11,12,13,18,19,20,28,29,30,35,36,37,42,43,44].includes(i) ? '#0B1220' : (i % 3 === 0 ? '#0B1220' : 'transparent') }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-[#E52324] text-white text-[10px] shadow-lg"
                    style={{ fontWeight: 700 }}
                  >
                    Dynamic
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                    className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[10px] shadow-lg"
                    style={{ fontWeight: 700 }}
                  >
                    Trackable
                  </motion.div>
                </div>
              </div>
            </AnimSection>

            {/* Right — Copy */}
            <AnimSection delay={0.15}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-5">
                <QrCode className="w-3.5 h-3.5 text-[#E52324]" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324]" style={{ fontWeight: 700 }}>
                  Competitive Differentiator
                </span>
              </div>

              <h2 className="text-[36px] sm:text-[44px] text-white leading-[0.95] tracking-tight mb-4" style={{ fontWeight: 900 }}>
                DYNAMIC QR
                <br />
                <span className="text-[#E52324]">CODE STUDIO</span>
              </h2>

              <p className="text-[16px] text-white/40 leading-relaxed mb-8 max-w-lg">
                Generate branded, trackable QR codes for every event. Change destinations anytime, track scan analytics, and embed anywhere.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Palette, label: 'Custom branded design with your colors and logo', color: '#E52324' },
                  { icon: BarChart3, label: 'Real-time scan analytics and heatmaps', color: '#3B82F6' },
                  { icon: RefreshCw, label: 'Change destination URL anytime — even after print', color: '#8B5CF6' },
                  { icon: Globe, label: 'Embed on flyers, merch, screens, and social media', color: '#06B6D4' },
                ].map((item) => {
                  const FIcon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}12` }}>
                        <FIcon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <span className="text-[14px] text-white/50 pt-1">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/qr-studio"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#E52324] text-white text-[14px] hover:bg-[#c91f20] transition-all shadow-lg shadow-[#E52324]/25"
                style={{ fontWeight: 800, letterSpacing: '0.04em' }}
              >
                Launch QR Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 5 — ORGANIZER DASHBOARD PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0B1120] relative">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Copy */}
            <AnimSection>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-blue-400" style={{ fontWeight: 700 }}>
                  SaaS-Grade Dashboard
                </span>
              </div>

              <h2 className="text-[36px] sm:text-[44px] text-white leading-[0.95] tracking-tight mb-4" style={{ fontWeight: 900 }}>
                FULL CONTROL.
                <br />
                <span className="text-blue-400">REAL-TIME DATA.</span>
              </h2>

              <p className="text-[16px] text-white/40 leading-relaxed mb-8 max-w-lg">
                Your command center for every event. Revenue tracking, ticket analytics, audience insights, and instant payouts — all in one premium dashboard.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {dashboardFeatures.map(item => {
                  const FIcon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <FIcon className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[12px] text-white/50" style={{ fontWeight: 500 }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/organizer/dashboard"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-500 text-white text-[14px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                style={{ fontWeight: 800, letterSpacing: '0.04em' }}
              >
                Access Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimSection>

            {/* Right — Dashboard Mockup */}
            <AnimSection delay={0.15}>
              <div className="rounded-2xl bg-[#111827] border border-[#1F2937] shadow-2xl shadow-black/30 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1F2937]">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-3 text-[10px] text-white/20">InstaPass — Organizer Dashboard</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Revenue', value: '$237K', color: '#3B82F6' },
                      { label: 'Tickets', value: '1,589', color: '#8B5CF6' },
                      { label: 'Events', value: '3', color: '#06B6D4' },
                      { label: 'Views', value: '24.8K', color: '#F59E0B' },
                    ].map(k => (
                      <div key={k.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-[9px] text-white/25 uppercase mb-1" style={{ fontWeight: 700 }}>{k.label}</div>
                        <div className="text-[16px] text-white" style={{ fontWeight: 800 }}>{k.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-white/30" style={{ fontWeight: 700 }}>Revenue Overview</span>
                      <span className="text-[9px] text-emerald-400" style={{ fontWeight: 700 }}>+32%</span>
                    </div>
                    <div className="flex items-end gap-[3px] h-[50px]">
                      {[25, 38, 32, 55, 48, 62, 58, 72, 68, 78, 82, 90].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i >= 10 ? '#3B82F6' : '#3B82F618' }} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {['Neon Nights Festival', 'Lakers vs Celtics', 'EDC Las Vegas'].map((name) => (
                      <div key={name} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/[0.01]">
                        <span className="text-[11px] text-white/50" style={{ fontWeight: 600 }}>{name}</span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] bg-emerald-500/10 text-emerald-400" style={{ fontWeight: 700 }}>Live</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 6 — WHY INSTAPASS IS DIFFERENT (Comparison)
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#080E1C] relative">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 lg:px-10">
          <AnimSection>
            <div className="text-center mb-16">
              <h2 className="text-[36px] sm:text-[44px] text-white leading-[0.95] tracking-tight mb-4" style={{ fontWeight: 900 }}>
                WHY INSTAPASS
                <br />
                <span className="text-[#E52324]">IS DIFFERENT</span>
              </h2>
              <p className="text-[16px] text-white/35 max-w-xl mx-auto">
                We built what existing platforms wouldn't.
              </p>
            </div>
          </AnimSection>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 px-6 pb-2">
              <span className="text-[11px] text-white/20 uppercase tracking-wider" style={{ fontWeight: 700 }}>Traditional Platforms</span>
              <span className="text-[11px] text-[#E52324]/60 uppercase tracking-wider" style={{ fontWeight: 700 }}>InstaPass</span>
            </div>

            {comparisons.map((c, i) => (
              <AnimSection key={i} delay={i * 0.05}>
                <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#111827]/40 border border-[#1F2937]/40 hover:border-[#1F2937]/80 transition-all group">
                  <div className="flex items-center gap-3">
                    <X className="w-4 h-4 text-red-400/40 shrink-0" />
                    <span className="text-[14px] text-white/30">{c.traditional}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] text-white/70 group-hover:text-white transition-colors" style={{ fontWeight: 600 }}>
                      {c.instapass}
                    </span>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 7 — BUILT FOR EVERY COMMUNITY
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-[#0B1120] border-t border-[#1F2937]/40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <AnimSection>
            <div className="text-center mb-14">
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-white mb-4"
                style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}
              >
                Built for <span className="text-[#E52324]">Every</span> Community
              </h2>
              <p className="text-white/35 text-sm sm:text-base max-w-lg mx-auto">
                Whether you're a first-time host or a seasoned promoter, InstaPass has you covered.
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityCards.map((card, i) => {
              const CIcon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#111827]/60 border border-[#1F2937]/60 rounded-2xl p-6 hover:border-[#1F2937] transition-all cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                    <CIcon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <h3 className="text-white text-[15px] mb-2" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                    {card.title}
                  </h3>
                  <p className="text-white/40 text-[12px] leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 8 — SOCIAL PROOF / TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0B1120] relative">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-8 lg:px-10">
          <AnimSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-amber-400" style={{ fontWeight: 700 }}>
                  Trusted By Organizers
                </span>
              </div>
              <h2 className="text-[36px] sm:text-[44px] text-white leading-[0.95] tracking-tight mb-4" style={{ fontWeight: 900 }}>
                REAL RESULTS FROM
                <br />
                <span className="text-[#E52324]">REAL ORGANIZERS</span>
              </h2>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <AnimSection key={t.name} delay={idx * 0.1}>
                <div className="h-full p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60 hover:border-[#1F2937] transition-all group">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[14px] text-white/50 leading-relaxed mb-5 italic">
                    "{t.quote}"
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 mb-5">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400" style={{ fontWeight: 700 }}>{t.result}</span>
                  </div>
                  <div className="border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-white" style={{ fontWeight: 700 }}>{t.name}</div>
                        <div className="text-[11px] text-white/30">{t.role} · {t.event}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] text-white" style={{ fontWeight: 800 }}>{t.revenue}</div>
                        <div className="text-[9px] text-white/20 uppercase tracking-wider">Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 9 — FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E52324]/[0.06] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-blue-600/[0.04] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-[800px] mx-auto px-6 sm:px-8 lg:px-10 text-center">
          <AnimSection>
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-6">
                <Zap className="w-3.5 h-3.5 text-[#E52324]" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324]" style={{ fontWeight: 700 }}>
                  Start Today — Free
                </span>
              </div>

              <h2 className="text-[40px] sm:text-[52px] lg:text-[60px] text-white leading-[0.92] tracking-tight mb-5" style={{ fontWeight: 900 }}>
                READY TO LAUNCH
                <br />
                YOUR NEXT
                <br />
                <span className="text-[#E52324]">EVENT?</span>
              </h2>

              <p className="text-[16px] sm:text-[18px] text-white/40 leading-relaxed mb-10 max-w-lg mx-auto">
                Join thousands of event creators who trust InstaPass for ticketing, QR technology, and real-time analytics.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <Link
                  to="/organizer/create-event"
                  className="inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl bg-[#E52324] text-white text-[16px] tracking-wide hover:bg-[#c91f20] transition-all shadow-xl shadow-[#E52324]/30 hover:shadow-2xl hover:shadow-[#E52324]/40 hover:-translate-y-0.5"
                  style={{ fontWeight: 800 }}
                >
                  Create Event <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-2xl border border-white/10 text-white/50 text-[16px] hover:bg-white/5 hover:text-white transition-all"
                  style={{ fontWeight: 600 }}
                >
                  <Mail className="w-4.5 h-4.5" /> Schedule Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                {['No credit card required', 'Free to create events', 'Cancel anytime'].map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-[12px] text-white/25">
                    <Check className="w-3.5 h-3.5 text-emerald-500/60" strokeWidth={2.5} />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimSection>
        </div>
      </section>

      <Footer />

      {/* ═══ Mobile Sticky CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0B1120]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3">
        <Link
          to="/organizer/create-event"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-[#E52324] text-white text-[14px] shadow-lg shadow-[#E52324]/25"
          style={{ fontWeight: 800, letterSpacing: '0.04em' }}
        >
          Create Your Event <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
