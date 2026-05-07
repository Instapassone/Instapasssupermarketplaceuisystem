import { Link, useLocation } from 'react-router';
import {
  QrCode, BarChart3, FolderOpen, Palette, Bell, Search, User,
} from 'lucide-react';
import { InstaPassLogo } from '../../components/InstaPassLogo';
import { WorkspaceSwitcher } from '../../components/WorkspaceSwitcher';
import { QRFullApp } from '../../components/QRFullApp';

const navTabs = [
  { label: 'Generator', href: '/qr-studio/create', icon: QrCode },
  { label: 'My Codes', href: '/qr-studio/library', icon: FolderOpen },
  { label: 'Analytics', href: '/qr-studio/analytics', icon: BarChart3 },
  { label: 'Templates', href: '/qr-studio/templates', icon: Palette },
];

export function QRStudioGenerate() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      {/* ─── FULL-WIDTH HEADER ─── */}
      <header className="h-[64px] bg-[#0D1117]/95 backdrop-blur-xl border-b border-white/[0.04] flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-5">
          <Link to="/" className="shrink-0">
            <InstaPassLogo size="sm" />
          </Link>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] text-white/10">|</span>
            <h1 className="text-[14px] text-white/60 tracking-wide" style={{ fontWeight: 600 }}>
              QR Code Generator
            </h1>
          </div>
        </div>

        {/* Center: Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.03]">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.href;
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E52324]/10 text-[#E52324]'
                    : 'text-white/30 hover:text-white/55 hover:bg-white/[0.03]'
                }`}
                style={{ fontWeight: isActive ? 700 : 500 }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.2 : 1.8} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <WorkspaceSwitcher compact />
          <button className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white/20 hover:text-white/40 transition-all">
            <Search className="w-3.5 h-3.5" strokeWidth={1.8} />
            <span className="text-[11px]" style={{ fontWeight: 500 }}>Search</span>
          </button>
          <button className="relative w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center text-white/25 hover:text-white/50 transition-all">
            <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E52324]" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E52324] to-[#C41E1E] flex items-center justify-center cursor-pointer">
            <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-[#0D1117] border-b border-white/[0.03] overflow-x-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.href;
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap transition-all ${
                isActive ? 'bg-[#E52324]/10 text-[#E52324]' : 'text-white/25'
              }`}
              style={{ fontWeight: isActive ? 700 : 500 }}
            >
              <Icon className="w-3 h-3" strokeWidth={1.8} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <QRFullApp />
    </div>
  );
}