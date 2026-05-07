import { useState } from 'react';
import { QRStudioSidebar } from '../../components/QRStudioSidebar';
import {
  Bell, Sparkles, ArrowRight, Star, Music, Trophy,
  Utensils, Building2, ShoppingBag, Ticket,
} from 'lucide-react';
import { encodeData, type PatternId, type CornerId } from '../../components/qr-engine';
import {
  renderBrandedFrame, getQRInnerPaths, FRAME_OPTIONS,
} from '../../components/qr-branded-frames';

const TEMPLATE_FRAMES: { frameId: "ring-red" | "ring-cyan" | "badge-vip" | "badge-gold" | "badge-purple"; cta: string }[] = [
  { frameId: "ring-red",     cta: "SCAN NOW" },
  { frameId: "ring-cyan",    cta: "SCAN TO ACCESS" },
  { frameId: "badge-vip",    cta: "VIP ENTRY" },
  { frameId: "badge-gold",   cta: "SCAN TO SHOP" },
  { frameId: "badge-purple", cta: "SCAN TO UNLOCK" },
];

interface Template {
  id: string;
  name: string;
  category: string;
  fg: string;
  bg: string;
  pattern: PatternId;
  corner: CornerId;
  popular?: boolean;
}

const TEMPLATES: Template[] = [
  { id: '1', name: 'InstaPass Classic', category: 'Brand', fg: '#E52324', bg: '#FFFFFF', pattern: 'instapass', corner: 'bullseye', popular: true },
  { id: '2', name: 'Dark Mode', category: 'Brand', fg: '#E52324', bg: '#0a0a0a', pattern: 'instapass', corner: 'bullseye' },
  { id: '3', name: 'Ocean Breeze', category: 'Elegant', fg: '#06B6D4', bg: '#FFFFFF', pattern: 'dots', corner: 'rounded', popular: true },
  { id: '4', name: 'Midnight Purple', category: 'Elegant', fg: '#8B5CF6', bg: '#0F0520', pattern: 'rounded', corner: 'bullseye' },
  { id: '5', name: 'Concert Vibes', category: 'Events', fg: '#EC4899', bg: '#1a0010', pattern: 'dots', corner: 'bullseye' },
  { id: '6', name: 'Sports Arena', category: 'Events', fg: '#F59E0B', bg: '#FFFFFF', pattern: 'square', corner: 'sharp', popular: true },
  { id: '7', name: 'Minimal Black', category: 'Minimal', fg: '#000000', bg: '#FFFFFF', pattern: 'square', corner: 'sharp' },
  { id: '8', name: 'Neon Green', category: 'Bold', fg: '#22C55E', bg: '#0a0a0a', pattern: 'dots', corner: 'rounded' },
  { id: '9', name: 'Sunset Glow', category: 'Bold', fg: '#F97316', bg: '#FFFFFF', pattern: 'rounded', corner: 'bullseye' },
  { id: '10', name: 'Royal Gold', category: 'Elegant', fg: '#A16207', bg: '#FEF3C7', pattern: 'diamond', corner: 'rounded' },
  { id: '11', name: 'Festival Pass', category: 'Events', fg: '#E52324', bg: '#FFFFFF', pattern: 'dots', corner: 'bullseye' },
  { id: '12', name: 'Tech Blue', category: 'Minimal', fg: '#3B82F6', bg: '#F0F9FF', pattern: 'rounded', corner: 'rounded' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'Brand', label: 'Brand', icon: Star },
  { id: 'Events', label: 'Events', icon: Ticket },
  { id: 'Elegant', label: 'Elegant', icon: Building2 },
  { id: 'Minimal', label: 'Minimal', icon: ShoppingBag },
  { id: 'Bold', label: 'Bold', icon: Music },
];

export function QRStudioTemplates() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <QRStudioSidebar />

      <div className="ml-[220px]">
        {/* Top bar */}
        <header className="h-[56px] bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/[0.03] flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-[14px] text-white/70 tracking-wide" style={{ fontWeight: 600 }}>Design Templates</h1>
            <span className="text-[10px] text-white/10">|</span>
            <span className="text-[10px] text-[#E52324]/60" style={{ fontWeight: 600 }}>{TEMPLATES.length} templates</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-all">
              <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E52324] to-[#C41E1E] flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Hero */}
          <div className="relative mb-8 p-8 rounded-2xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(229,35,36,0.08) 0%, rgba(153,27,27,0.04) 50%, rgba(252,165,165,0.06) 100%)',
            border: '1px solid rgba(229,35,36,0.08)',
          }}>
            <div className="max-w-lg relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#E52324]" strokeWidth={2} />
                <span className="text-[10px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>DESIGN TEMPLATES</span>
              </div>
              <h2 className="text-[24px] text-white mb-2" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Start with a Template
              </h2>
              <p className="text-[13px] text-white/35 leading-relaxed">
                Choose from professionally designed QR code templates. Customize colors, patterns, and more to match your brand.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E52324]/10 text-[#E52324] border border-[#E52324]/20'
                      : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03] border border-transparent'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((template, idx) => {
              const frameCfg = TEMPLATE_FRAMES[idx % TEMPLATE_FRAMES.length];
              const frameOpt = FRAME_OPTIONS.find((f) => f.id === frameCfg.frameId)!;
              const data = encodeData('https://instapass.ai');
              const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, template.fg, template.bg, template.pattern, template.corner, true, 2);
              const svg = renderBrandedFrame(paths, 480, totalSize, {
                frameId: frameCfg.frameId,
                ctaText: `${frameCfg.cta} — ${template.name.toUpperCase()}`,
                watermarkText: template.category.toUpperCase(),
                borderColor: frameOpt.borderColor,
                accentColor: frameOpt.accentColor,
              }, template.bg);

              return (
                <div
                  key={template.id}
                  className="group relative bg-[#0A1020] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-cyan-400/15 transition-all duration-300 cursor-pointer"
                >
                  {template.popular && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E52324]/10 border border-[#E52324]/20">
                      <Star className="w-2.5 h-2.5 text-[#E52324] fill-[#E52324]" />
                      <span className="text-[8px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>Popular</span>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="p-6 flex items-center justify-center" style={{ backgroundColor: `${template.bg}08` }}>
                    <div
                      className="w-[160px] h-[160px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 [&_svg]:w-full [&_svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: svg }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 border-t border-white/[0.03]">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] text-white" style={{ fontWeight: 700 }}>{template.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="text-[10px] text-white/20" style={{ fontWeight: 500 }}>{template.category}</div>
                          <div className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25" style={{ fontWeight: 600 }}>{frameOpt.label}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-md border border-white/10" style={{ backgroundColor: template.fg }} />
                        <div className="w-4 h-4 rounded-md border border-white/10" style={{ backgroundColor: template.bg }} />
                      </div>
                    </div>

                    {/* Use Template Button */}
                    <a
                      href="/qr-studio/create"
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-white/30 hover:text-[#E52324] hover:bg-[#E52324]/[0.04] hover:border-[#E52324]/20 transition-all"
                      style={{ fontWeight: 700 }}
                    >
                      Use Template
                      <ArrowRight className="w-3 h-3" strokeWidth={2} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}