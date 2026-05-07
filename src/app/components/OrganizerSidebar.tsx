import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard, PlusCircle, Calendar, TrendingUp, Users,
  Wallet, Settings, ArrowLeft, QrCode, FileText, Plug,
  Megaphone, ScanLine,
} from 'lucide-react';
import { InstaPassLogo } from './InstaPassLogo';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: 'MAIN',
    items: [
      { icon: PlusCircle, label: 'Create Event', href: '/organizer/create-event' },
      { icon: LayoutDashboard, label: 'Dashboard', href: '/organizer/dashboard' },
      { icon: Calendar, label: 'My Events', href: '/organizer/events' },
      { icon: TrendingUp, label: 'Sales & Revenue', href: '/organizer/sales' },
      { icon: Users, label: 'Attendees', href: '/organizer/attendees' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { icon: Wallet, label: 'Payouts', href: '/organizer/payouts' },
      { icon: FileText, label: 'Tax Settings', href: '/organizer/tax' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { icon: ScanLine, label: 'QR Scanner', href: '/organizer/scanner' },
      { icon: Megaphone, label: 'Marketing', href: '/organizer/marketing' },
      { icon: QrCode, label: 'SmartCodes', href: '/organizer/smartcodes' },
      { icon: Plug, label: 'Integrations', href: '/organizer/integrations' },
      { icon: Settings, label: 'Settings', href: '/organizer/settings' },
    ],
  },
];

export function OrganizerSidebar() {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[260px] bg-[#060D1B] border-r border-[#1E293B]/60 flex flex-col z-40"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="px-5 h-[64px] flex items-center justify-between border-b border-[#1E293B]/60">
        <Link to="/" className="flex items-center gap-2.5">
          <InstaPassLogo size="sm" />
          <div className="flex flex-col">
            <span className="text-[11px] text-white/70" style={{ fontWeight: 600 }}>Organizer</span>
            <span className="text-[9px] text-blue-400/60 uppercase tracking-[0.12em]" style={{ fontWeight: 700 }}>Portal</span>
          </div>
        </Link>
        <WorkspaceSwitcher compact />
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            <div className="px-3 mb-2">
              <span className="text-[9px] text-white/20 uppercase tracking-[0.18em]" style={{ fontWeight: 700 }}>
                {section.title}
              </span>
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-blue-500/[0.12] border border-blue-500/[0.15]'
                        : 'text-white/45 hover:text-white hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <Icon className={`w-[16px] h-[16px] ${isActive ? 'text-blue-400' : ''}`} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#1E293B]/60">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
          Back to Marketplace
        </Link>
      </div>
    </aside>
  );
}