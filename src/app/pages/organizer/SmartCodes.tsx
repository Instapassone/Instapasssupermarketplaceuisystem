import { useState, useCallback } from 'react';
import {
  Search, Plus, ArrowLeft, QrCode, Globe, User, Wifi,
  Mail, MessageSquare, Type, CalendarDays, Share2, BarChart3,
  Check,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { QRGenerator } from '../../components/QRGenerator';
import {
  encodeData, renderQRSvg,
  QR_TYPES,
  type QRTypeId, type SmartCodeEntry,
} from '../../components/qr-engine';

const TYPE_ICONS: Record<QRTypeId, typeof Globe> = {
  website: Globe,
  vcard: User,
  wifi: Wifi,
  email: Mail,
  sms: MessageSquare,
  text: Type,
  event: CalendarDays,
  social: Share2,
};

/* ─── Initial mock data ─── */
const INITIAL_CODES: SmartCodeEntry[] = [
  {
    id: 'sc-1',
    name: 'Main Event Landing',
    qrType: 'website',
    content: 'https://instapass.com/events/spring-fest-2026',
    style: { bg: '#0a0a0a', fg: '#E52324', pattern: 'instapass', corner: 'bullseye', showLogo: true },
    scans: 1247,
    status: 'active',
    createdAt: '2026-02-20',
    svgMarkup: '',
  },
  {
    id: 'sc-2',
    name: 'VIP WiFi Access',
    qrType: 'wifi',
    content: 'WIFI:T:WPA;S:InstaPass-VIP;P:vip2026pass;;',
    style: { bg: '#ffffff', fg: '#000000', pattern: 'square', corner: 'sharp', showLogo: false },
    scans: 583,
    status: 'active',
    createdAt: '2026-02-18',
    svgMarkup: '',
  },
  {
    id: 'sc-3',
    name: 'Organizer Contact',
    qrType: 'vcard',
    content: 'BEGIN:VCARD\nFN:Alex Rivera\nTEL:+13105551234\nEND:VCARD',
    style: { bg: '#1e293b', fg: '#94a3b8', pattern: 'dots', corner: 'rounded', showLogo: true },
    scans: 92,
    status: 'paused',
    createdAt: '2026-02-15',
    svgMarkup: '',
  },
  {
    id: 'sc-4',
    name: 'Merch Store Link',
    qrType: 'website',
    content: 'https://shop.instapass.com/merch',
    style: { bg: '#1a1207', fg: '#d4a017', pattern: 'rounded', corner: 'bullseye', showLogo: true },
    scans: 318,
    status: 'active',
    createdAt: '2026-02-12',
    svgMarkup: '',
  },
];

function initCodes(): SmartCodeEntry[] {
  return INITIAL_CODES.map((code) => {
    const { modules, size } = encodeData(code.content || 'InstaPass');
    return { ...code, svgMarkup: renderQRSvg(modules, size, code.style, 300) };
  });
}

/* ═══════════════════════════════════════════════════════════════
   SMARTCODES COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export function SmartCodes() {
  const [sub, setSub] = useState<'list' | 'create'>('list');
  const [codes, setCodes] = useState<SmartCodeEntry[]>(() => initCodes());

  const handleDownload = useCallback((name: string) => {
    setCodes((prev) =>
      prev.map((c) => (c.name === name ? { ...c, scans: c.scans + 1 } : c))
    );
  }, []);

  const headerTitle = sub === 'create' ? 'Create SmartCode' : 'QR Code Generator';
  const headerDesc = sub === 'create'
    ? 'Design a branded QR code for your event or campaign'
    : 'Generate and manage branded QR codes for events, links, and more';

  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        {/* ─── Header ─── */}
        <div className="border-b border-border bg-card">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {sub === 'create' && (
                  <button
                    onClick={() => setSub('list')}
                    className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold">{headerTitle}</h1>
                  <p className="text-muted-foreground mt-1">{headerDesc}</p>
                </div>
              </div>
              {sub === 'list' && (
                <Button onClick={() => setSub('create')}>
                  <Plus className="w-5 h-5" />
                  New SmartCode
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="flex-1 overflow-y-auto">
          {sub === 'list' && <SmartCodesList codes={codes} onNewCode={() => setSub('create')} />}
          {sub === 'create' && (
            <div className="p-8">
              <QRGenerator onDownload={handleDownload} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIST VIEW
   ═══════════════════════════════════════════════════════════════ */

function SmartCodesList({ codes, onNewCode }: { codes: SmartCodeEntry[]; onNewCode: () => void }) {
  return (
    <div className="p-8">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search SmartCodes..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E52324]/30 focus:border-[#E52324]/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {codes.length === 0 ? (
        <Card variant="bordered" className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#E52324]/10 flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-[#E52324]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No SmartCodes Yet</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm">
            Create your first branded QR code to share event links, WiFi access, contact info, and more.
          </p>
          <Button onClick={onNewCode}>
            <Plus className="w-5 h-5" />
            Create SmartCode
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {codes.map((code) => (
            <SmartCodeCard key={code.id} code={code} />
          ))}
        </div>
      )}
    </div>
  );
}

function SmartCodeCard({ code }: { code: SmartCodeEntry }) {
  const typeLabel = QR_TYPES.find((t) => t.id === code.qrType)?.label || code.qrType;
  const TypeIcon = TYPE_ICONS[code.qrType] || QrCode;

  return (
    <Card variant="bordered" className="overflow-hidden group hover:border-white/15 transition-all">
      {/* QR Preview */}
      <div
        className="aspect-square flex items-center justify-center p-6"
        style={{ backgroundColor: code.style.bg }}
      >
        <div
          className="w-full h-full max-w-[200px] max-h-[200px]"
          dangerouslySetInnerHTML={{ __html: code.svgMarkup }}
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-sm text-white truncate pr-2">{code.name}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase shrink-0 ${
              code.status === 'active'
                ? 'bg-[#E52324]/10 text-[#E52324]'
                : 'bg-yellow-500/10 text-yellow-500'
            }`}
          >
            {code.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-white/40 text-xs mb-3">
          <TypeIcon className="w-3.5 h-3.5" />
          <span>{typeLabel}</span>
        </div>

        <div className="text-white/30 text-xs truncate mb-3" title={code.content}>
          {code.content}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="font-semibold text-white">{code.scans.toLocaleString()}</span>
            <span>scans</span>
          </div>
          <div className="text-white/30 text-xs">{code.createdAt}</div>
        </div>
      </div>
    </Card>
  );
}