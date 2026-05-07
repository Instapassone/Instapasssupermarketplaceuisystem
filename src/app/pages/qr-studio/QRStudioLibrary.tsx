import { useState, useMemo } from 'react';
import { QRStudioSidebar } from '../../components/QRStudioSidebar';
import {
  Bell, Search, Plus, MoreVertical, Download, Eye, Trash2,
  ExternalLink, Filter, ArrowUpDown, Grid3X3, List, Copy,
} from 'lucide-react';
import { encodeData, type PatternId, type CornerId } from '../../components/qr-engine';
import {
  renderBrandedFrame, getQRInnerPaths, FRAME_OPTIONS,
} from '../../components/qr-branded-frames';

const LIBRARY_FRAMES: { frameId: "ring-red" | "ring-cyan" | "badge-vip" | "badge-gold" | "badge-purple"; cta: string }[] = [
  { frameId: "ring-red",     cta: "SCAN NOW" },
  { frameId: "ring-cyan",    cta: "SCAN TO ACCESS" },
  { frameId: "badge-vip",    cta: "VIP ENTRY" },
  { frameId: "badge-gold",   cta: "SCAN TO SHOP" },
  { frameId: "badge-purple", cta: "SCAN TO UNLOCK" },
];

const CODES = [
  { id: '1', name: 'Summer Festival 2026', dest: 'https://instapass.ai/summer26', scans: 4821, status: 'active', type: 'Event', created: 'Feb 12, 2026', fg: '#E52324' },
  { id: '2', name: 'VIP Pre-Sale Link', dest: 'https://instapass.ai/vip', scans: 2314, status: 'active', type: 'URL', created: 'Feb 8, 2026', fg: '#3B82F6' },
  { id: '3', name: 'Street Team LA', dest: 'https://instapass.ai/la-street', scans: 1876, status: 'active', type: 'URL', created: 'Jan 28, 2026', fg: '#E52324' },
  { id: '4', name: 'Venue WiFi Access', dest: 'WiFi:VenueNet', scans: 952, status: 'paused', type: 'WiFi', created: 'Jan 15, 2026', fg: '#10B981' },
  { id: '5', name: 'Artist Merch Store', dest: 'https://instapass.ai/merch', scans: 3210, status: 'active', type: 'URL', created: 'Jan 10, 2026', fg: '#8B5CF6' },
  { id: '6', name: '@dj_mike Social', dest: 'https://instagram.com/dj_mike', scans: 1543, status: 'active', type: 'Social', created: 'Dec 22, 2025', fg: '#EC4899' },
  { id: '7', name: 'Contact Card', dest: 'vcard:Damone Bush', scans: 678, status: 'active', type: 'vCard', created: 'Dec 15, 2025', fg: '#06B6D4' },
  { id: '8', name: 'Holiday Promo', dest: 'https://instapass.ai/holiday', scans: 4102, status: 'expired', type: 'URL', created: 'Nov 20, 2025', fg: '#F59E0B' },
];

export function QRStudioLibrary() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return CODES.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <QRStudioSidebar />

      <div className="ml-[220px]">
        {/* Top bar */}
        <header className="h-[56px] bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/[0.03] flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-[14px] text-white/70 tracking-wide" style={{ fontWeight: 600 }}>
              My QR Codes
            </h1>
            <span className="text-[10px] text-white/10">|</span>
            <span className="text-[10px] text-[#E52324]/60" style={{ fontWeight: 600 }}>{CODES.length} codes</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/25 hover:text-white/50 transition-all">
              <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] w-[280px]">
                <Search className="w-4 h-4 text-white/20" strokeWidth={1.8} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search QR codes..."
                  className="bg-transparent text-[13px] text-white placeholder:text-white/20 outline-none flex-1"
                />
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                {['all', 'active', 'paused', 'expired'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                      statusFilter === s
                        ? 'bg-[#E52324]/10 text-[#E52324]'
                        : 'text-white/25 hover:text-white/50'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 p-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[#E52324]/10 text-[#E52324]' : 'text-white/20'}`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[#E52324]/10 text-[#E52324]' : 'text-white/20'}`}
                >
                  <List className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </div>
              <a
                href="/qr-studio/create"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] text-white uppercase tracking-wider transition-all hover:opacity-90"
                style={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #E52324, #FF4444)',
                  boxShadow: '0 4px 16px rgba(229,35,36,0.2)',
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                New QR Code
              </a>
            </div>
          </div>

          {/* Grid View */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((code, idx) => {
                const frameCfg = LIBRARY_FRAMES[idx % LIBRARY_FRAMES.length];
                const frameOpt = FRAME_OPTIONS.find((f) => f.id === frameCfg.frameId)!;
                const data = encodeData(code.dest);
                const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, code.fg, '#FFFFFF', 'instapass', 'bullseye', true, 2);
                const svg = renderBrandedFrame(paths, 480, totalSize, {
                  frameId: frameCfg.frameId,
                  ctaText: `${frameCfg.cta} — ${code.name.toUpperCase()}`,
                  watermarkText: code.type.toUpperCase(),
                  borderColor: frameOpt.borderColor,
                  accentColor: frameOpt.accentColor,
                }, '#FFFFFF');
                return (
                  <div key={code.id} className="group bg-[#0A1020] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-cyan-400/10 transition-all duration-300">
                    {/* QR Preview */}
                    <div className="relative p-5 bg-white/[0.02] flex items-center justify-center">
                      <div
                        className="w-[160px] h-[160px] rounded-xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 [&_svg]:w-full [&_svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all">
                          <Download className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all">
                          <Eye className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all">
                          <Copy className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] text-white truncate" style={{ fontWeight: 700 }}>{code.name}</div>
                          <div className="text-[10px] text-white/20 truncate mt-0.5">{code.dest}</div>
                        </div>
                        <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ml-2 ${
                          code.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' :
                          code.status === 'paused' ? 'bg-amber-400/10 text-amber-400' :
                          'bg-white/[0.04] text-white/25'
                        }`} style={{ fontWeight: 700 }}>
                          {code.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="text-[14px] text-white" style={{ fontWeight: 800 }}>{code.scans.toLocaleString()}</div>
                            <div className="text-[8px] text-white/15 uppercase tracking-wider" style={{ fontWeight: 600 }}>Scans</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-white/15" style={{ fontWeight: 500 }}>{code.created}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-[#0A1020] border border-white/[0.04] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.04] text-[9px] text-white/20 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                <span className="w-10">QR</span>
                <span>Name</span>
                <span className="w-20 text-center">Type</span>
                <span className="w-20 text-center">Status</span>
                <span className="w-20 text-right">Scans</span>
                <span className="w-8" />
              </div>
              {filtered.map((code) => {
                const data = encodeData(code.dest);
                const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, code.fg, '#FFFFFF', 'dots', 'bullseye', false, 1);
                const svg = renderBrandedFrame(paths, 120, totalSize, {
                  frameId: 'ring-red',
                  ctaText: '',
                  watermarkText: '',
                  borderColor: '#E52324',
                  accentColor: '#E52324',
                }, '#FFFFFF');
                return (
                  <div key={code.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-white/[0.02] hover:bg-white/[0.01] transition-all">
                    <div className="w-10 h-10 rounded-lg overflow-hidden [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: svg }} />
                    <div className="min-w-0">
                      <div className="text-[13px] text-white truncate" style={{ fontWeight: 600 }}>{code.name}</div>
                      <div className="text-[10px] text-white/15 truncate">{code.dest}</div>
                    </div>
                    <span className="w-20 text-center text-[10px] text-white/30" style={{ fontWeight: 500 }}>{code.type}</span>
                    <span className={`w-20 text-center text-[9px] uppercase tracking-wider ${
                      code.status === 'active' ? 'text-emerald-400' :
                      code.status === 'paused' ? 'text-amber-400' : 'text-white/20'
                    }`} style={{ fontWeight: 700 }}>
                      {code.status}
                    </span>
                    <span className="w-20 text-right text-[13px] text-white" style={{ fontWeight: 700 }}>{code.scans.toLocaleString()}</span>
                    <button className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center text-white/15 hover:text-white/40 transition-all">
                      <MoreVertical className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}