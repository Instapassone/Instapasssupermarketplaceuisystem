import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import founderPhoto from 'figma:asset/86a086dfd94e1f3d0e90f7670d16273beb94d89a.png';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Zap, Users, Globe, Shield, QrCode, BarChart3, Heart, ArrowRight,
  Mail, Phone, Ticket, Star, TrendingUp, CalendarDays, Sparkles,
} from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';

function AnimSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: '2M+', label: 'Tickets Sold', icon: Ticket },
  { value: '15K+', label: 'Events Created', icon: CalendarDays },
  { value: '250K+', label: 'App Downloads', icon: Users },
  { value: '4.9★', label: 'App Store Rating', icon: Star },
];

const values = [
  { icon: Zap, title: 'Speed First', desc: 'Instant ticket delivery, real-time analytics, and 3-day payouts. We believe every second matters.', color: '#E52324' },
  { icon: Shield, title: 'Trust & Security', desc: 'Every ticket is 100% guaranteed authentic. Our AI-powered fraud detection protects buyers and organizers.', color: '#3B82F6' },
  { icon: Users, title: 'Community Driven', desc: 'Built for clubs, churches, schools, nonprofits, and promoters. Every community deserves world-class tools.', color: '#10B981' },
  { icon: QrCode, title: 'Innovation', desc: 'Dynamic QR codes, AI concierge, branded SmartCodes — we build what other platforms won\'t.', color: '#8B5CF6' },
  { icon: Globe, title: 'Accessibility', desc: 'Free to create events. No monthly fees. Transparent pricing so anyone can get started.', color: '#F59E0B' },
  { icon: Heart, title: 'Creator Obsessed', desc: 'Every feature is designed to help organizers sell more tickets and deliver unforgettable experiences.', color: '#F43F5E' },
];

const timeline = [
  { year: '2023', title: 'Founded', desc: 'InstaPass launched with a mission to modernize ticketing for independent event creators.' },
  { year: '2024', title: 'QR Code Studio', desc: 'Introduced dynamic branded QR codes and the SmartCodes platform for organizers and businesses.' },
  { year: '2025', title: '1M Tickets Sold', desc: 'Crossed 1 million tickets sold. Launched the Organizer Portal with real-time analytics dashboard.' },
  { year: '2026', title: 'AI & Scale', desc: 'Rolled out AI Concierge, InstaPoints loyalty program, and expanded to 50+ cities nationwide.' },
];

const team = [
  { name: 'Alex Rivera', role: 'CEO & Co-Founder', desc: 'Former product lead at Eventbrite. Passionate about live experiences.' },
  { name: 'Jordan Lee', role: 'CTO & Co-Founder', desc: 'Full-stack engineer. Built ticketing systems processing $50M+ annually.' },
  { name: 'Samira Patel', role: 'VP of Product', desc: 'Ex-Spotify. Leads the team designing the organizer and buyer experience.' },
  { name: 'Marcus Chen', role: 'Head of Growth', desc: 'Growth marketing expert. Scaled 3 startups from zero to 100K+ users.' },
];

export function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0B1120]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0F1A2E] to-[#0B1120]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#E52324]/[0.05] rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#E52324]" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324]" style={{ fontWeight: 700 }}>Our Story</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6" style={{ fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
              We're Building the Future
              <br />
              of <span className="text-[#E52324]">Live Events.</span>
            </h1>

            <p className="text-white/40 text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
              InstaPass is the fastest-growing ticketing platform for independent event creators. We combine instant ticket delivery, dynamic QR technology, and real-time analytics to help organizers sell out and fans get in — faster than ever.
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="p-4 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60"
                  >
                    <Icon className="w-5 h-5 text-[#E52324] mx-auto mb-2" />
                    <div className="text-2xl text-white mb-0.5" style={{ fontWeight: 900 }}>{s.value}</div>
                    <div className="text-[11px] text-white/35 uppercase tracking-wider" style={{ fontWeight: 600 }}>{s.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MISSION ═══ */}
      <section className="py-20 bg-[#080E1C] border-t border-[#1F2937]/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimSection>
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] ring-3 ring-[#1E3A5F]">
                <ImageWithFallback
                  src={founderPhoto}
                  alt="InstaPass team"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080E1C]/60 to-transparent" />
              </div>
            </AnimSection>

            <AnimSection delay={0.15}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-blue-400" style={{ fontWeight: 700 }}>Our Mission</span>
              </div>

              <h2 className="text-3xl sm:text-4xl text-white mb-5" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                Empowering Every Event Creator
              </h2>

              <div className="space-y-4 text-white/50 text-[14px] leading-relaxed">
                <p>
                  We started InstaPass because we saw a gap: the biggest ticketing platforms were built for arenas and massive promoters — not for the club owner running weekly events, the church hosting a fundraiser, or the school organizing prom night.
                </p>
                <p>
                  Our mission is to democratize event technology. We believe every organizer — from a first-time host to a seasoned promoter — deserves access to professional-grade ticketing, real-time analytics, branded QR codes, and instant payouts. No enterprise contracts. No hidden fees. No gatekeeping.
                </p>
                <p>
                  Based in Los Angeles, our team is a mix of engineers, designers, and event industry veterans who live and breathe live experiences. We're building the platform we always wished existed — and we're just getting started.
                </p>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* ═══ VALUES ═══ */}
      <section className="py-20 bg-[#0B1120] border-t border-[#1F2937]/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                What We <span className="text-[#E52324]">Stand For</span>
              </h2>
              <p className="text-white/35 text-sm max-w-lg mx-auto">
                The principles that guide everything we build.
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <AnimSection key={v.title} delay={i * 0.06}>
                  <div className="p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60 hover:border-[#1F2937] transition-all h-full">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${v.color}12` }}>
                      <Icon className="w-5 h-5" style={{ color: v.color }} />
                    </div>
                    <h3 className="text-white text-[15px] mb-2" style={{ fontWeight: 800 }}>{v.title}</h3>
                    <p className="text-white/40 text-[13px] leading-relaxed">{v.desc}</p>
                  </div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="py-20 bg-[#080E1C] border-t border-[#1F2937]/40">
        <div className="max-w-[800px] mx-auto px-6">
          <AnimSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                Our <span className="text-[#E52324]">Journey</span>
              </h2>
            </div>
          </AnimSection>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#E52324]/40 via-[#1F2937] to-transparent" />

            <div className="space-y-8">
              {timeline.map((t, i) => (
                <AnimSection key={t.year} delay={i * 0.08}>
                  <div className="flex gap-6">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[#E52324]/10 border border-[#E52324]/20 flex items-center justify-center">
                        <span className="text-[#E52324] text-[11px]" style={{ fontWeight: 900 }}>{t.year}</span>
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-white text-[16px] mb-1" style={{ fontWeight: 800 }}>{t.title}</h3>
                      <p className="text-white/40 text-[13px] leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                </AnimSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="py-20 bg-[#0B1120] border-t border-[#1F2937]/40">
        <div className="max-w-[1200px] mx-auto px-6">
          <AnimSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                Meet the <span className="text-[#E52324]">Team</span>
              </h2>
              <p className="text-white/35 text-sm max-w-lg mx-auto">
                A small, focused team obsessed with making events better.
              </p>
            </div>
          </AnimSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {team.map((member, i) => (
              <AnimSection key={member.name} delay={i * 0.06}>
                <div className="p-6 rounded-2xl bg-[#111827]/60 border border-[#1F2937]/60 hover:border-[#1F2937] transition-all text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E52324]/20 to-blue-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl" style={{ fontWeight: 900 }}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-white text-[14px] mb-0.5" style={{ fontWeight: 800 }}>{member.name}</h3>
                  <p className="text-[#E52324] text-[11px] uppercase tracking-wider mb-3" style={{ fontWeight: 700 }}>{member.role}</p>
                  <p className="text-white/35 text-[12px] leading-relaxed">{member.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#0F172A] relative overflow-hidden border-t border-[#1F2937]/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E52324]/[0.05] rounded-full blur-[200px] pointer-events-none" />

        <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
          <AnimSection>
            <h2 className="text-3xl sm:text-4xl text-white mb-5" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
              Ready to Join the{' '}
              <span className="text-[#E52324]">Movement?</span>
            </h2>
            <p className="text-white/40 text-sm mb-8 max-w-lg mx-auto">
              Whether you're buying tickets or creating events, InstaPass is the platform built for you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#E52324] text-white text-[14px] hover:bg-[#c91f20] transition-all shadow-lg shadow-[#E52324]/25"
                style={{ fontWeight: 800 }}
              >
                Explore Events <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/create-event"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/15 text-white/60 text-[14px] hover:bg-white/5 hover:text-white transition-all"
                style={{ fontWeight: 600 }}
              >
                Create an Event
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-white/30">
              <a href="mailto:Admin@instapass.shop" className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
                <Mail className="w-3.5 h-3.5" /> Admin@instapass.shop
              </a>
              <a href="tel:+18442446782" className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
                <Phone className="w-3.5 h-3.5" /> (844) 244-6782
              </a>
            </div>
          </AnimSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}