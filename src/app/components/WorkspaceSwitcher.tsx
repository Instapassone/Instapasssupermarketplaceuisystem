import { Link, useLocation } from 'react-router';
import {
  Globe, LayoutDashboard, Shield, QrCode, ChevronDown, ArrowUpRight,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const workspaces = [
  { label: 'Organizer Portal', desc: 'Event Creators', icon: LayoutDashboard, href: '/organizer', accent: '#3B82F6', prefix: '/organizer' },
  { label: 'Admin Control', desc: 'Internal Platform', icon: Shield, href: '/admin', accent: '#E52324', prefix: '/admin' },
  { label: 'QR Code Studio', desc: 'SmartCodes Tool', icon: QrCode, href: '/qr-studio', accent: '#E52324', prefix: '/qr-studio' },
];

interface WorkspaceSwitcherProps {
  compact?: boolean;
}

export function WorkspaceSwitcher({ compact = false }: WorkspaceSwitcherProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = workspaces.find(w =>
    w.prefix ? location.pathname.startsWith(w.prefix) : location.pathname === '/' || (!location.pathname.startsWith('/organizer') && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/qr-studio'))
  ) || workspaces[0];

  const CurrentIcon = current.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-xl border transition-all duration-200 ${
          open
            ? 'bg-white/[0.08] border-white/[0.12]'
            : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]'
        } ${compact ? 'p-2' : 'px-3 py-2'}`}
      >
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${current.accent}20` }}>
          <CurrentIcon className="w-3.5 h-3.5" style={{ color: current.accent }} strokeWidth={2} />
        </div>
        {!compact && (
          <>
            <span className="text-[12px] text-white/70 hidden sm:inline">{current.label}</span>
            <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[#111111] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
        >
          <div className="px-4 py-3 border-b border-white/[0.05]">
            <div className="text-[10px] text-white/25 uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>Switch Workspace</div>
          </div>
          <div className="p-1.5">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              const isActive = ws.label === current.label;
              return (
                <Link
                  key={ws.label}
                  to={ws.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all group ${
                    isActive
                      ? 'bg-white/[0.06] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      backgroundColor: isActive ? `${ws.accent}20` : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <Icon className="w-4 h-4 transition-colors" style={{ color: isActive ? ws.accent : undefined }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] truncate" style={{ fontWeight: isActive ? 600 : 400 }}>{ws.label}</div>
                    <div className="text-[10px] text-white/25">{ws.desc}</div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ws.accent }} />
                  )}
                  {!isActive && (
                    <ArrowUpRight className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}