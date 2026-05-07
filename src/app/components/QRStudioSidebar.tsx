import { Link, useLocation } from 'react-router';
import {
  QrCode, BarChart3, Palette, FolderOpen, ArrowLeft,
  Sparkles, Users, Layers, Zap, HelpCircle,
} from 'lucide-react';
import { InstaPassLogo } from './InstaPassLogo';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const mainItems = [
  { icon: QrCode, label: 'Generator', href: '/qr-studio/create', badge: null },
  { icon: FolderOpen, label: 'My QR Codes', href: '/qr-studio/library', badge: '24' },
  { icon: Palette, label: 'Templates', href: '/qr-studio/templates', badge: null },
  { icon: BarChart3, label: 'Analytics', href: '/qr-studio/analytics', badge: null },
];

const advancedItems = [
  { icon: Layers, label: 'Batch Generator', href: '/qr-studio/batch' },
  { icon: Sparkles, label: 'AI Designer', href: '/qr-studio/ai' },
  { icon: Users, label: 'Team', href: '/qr-studio/team' },
];

export function QRStudioSidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/qr-studio') return location.pathname === '/qr-studio';
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[220px] bg-[#0D1117] border-r border-[#E52324]/[0.06] flex flex-col z-40"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="px-5 h-[64px] flex items-center justify-between border-b border-[#E52324]/[0.06]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E52324]/20 to-[#C41E1E]/20 border border-[#E52324]/[0.15] flex items-center justify-center">
            <QrCode className="w-4 h-4 text-[#E52324]" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-white/70" style={{ fontWeight: 600 }}>QR Code</span>
            <span className="text-[9px] text-[#E52324]/60 uppercase tracking-[0.12em]" style={{ fontWeight: 700 }}>Studio</span>
          </div>
        </Link>
        <WorkspaceSwitcher compact />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="px-3 mb-3">
          <span className="text-[9px] text-white/15 uppercase tracking-[0.18em]" style={{ fontWeight: 700 }}>TOOLS</span>
        </div>
        <div className="space-y-0.5">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
                  active
                    ? 'text-white bg-[#E52324]/[0.10] border border-[#E52324]/[0.15]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-[16px] h-[16px] ${active ? 'text-[#E52324]' : ''}`} strokeWidth={1.8} />
                  <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                    active ? 'bg-[#E52324]/20 text-[#E52324]' : 'bg-white/[0.04] text-white/25'
                  }`} style={{ fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Advanced */}
        <div className="mt-6 mb-3 px-3">
          <span className="text-[9px] text-white/15 uppercase tracking-[0.18em]" style={{ fontWeight: 700 }}>ADVANCED</span>
        </div>
        <div className="space-y-0.5">
          {advancedItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
                  active
                    ? 'text-white bg-[#E52324]/[0.10] border border-[#E52324]/[0.15]'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-[16px] h-[16px] ${active ? 'text-[#E52324]' : ''}`} strokeWidth={1.8} />
                <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Pro Card */}
        <div className="mt-6 mx-1 p-3.5 rounded-xl bg-gradient-to-br from-[#E52324]/[0.06] to-transparent border border-[#E52324]/[0.08]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
            <span className="text-[10px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>Pro Plan</span>
          </div>
          <p className="text-[10px] text-white/25 leading-relaxed mb-2.5">Unlimited codes, analytics, and team access.</p>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] text-white" style={{ fontWeight: 800 }}>$29</span>
            <span className="text-[10px] text-white/25">/month</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[#E52324]/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <InstaPassLogo size="sm" />
          <span className="text-[10px] text-white/15">SmartCodes</span>
        </div>
        <div className="flex gap-1">
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[11px] text-white/20 hover:text-white/45 hover:bg-white/[0.03] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
            Marketplace
          </Link>
          <button className="flex items-center justify-center w-8 h-8 rounded-xl text-white/15 hover:text-white/30 hover:bg-white/[0.03] transition-all">
            <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}