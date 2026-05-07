import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Download, Globe, User, Wifi, Mail, MessageSquare,
  Type, CalendarDays, Share2, Eye, Upload, X, ImageIcon,
} from 'lucide-react';
import { Card } from './Card';
import { Input } from './Input';
import {
  encodeData, renderQRSvg,
  QR_TYPES, STYLE_PRESETS, PATTERNS, CORNERS,
  type QRTypeId, type PatternId, type CornerId, type QRStyle,
} from './qr-engine';

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

interface QRGeneratorProps {
  /** Called after a successful download with the code name */
  onDownload?: (name: string) => void;
  /** Compact mode for embedding in landing page */
  compact?: boolean;
}

export function QRGenerator({ onDownload, compact = false }: QRGeneratorProps) {
  const [qrType, setQrType] = useState<QRTypeId>('website');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [stylePreset, setStylePreset] = useState('instapass');
  const [pattern, setPattern] = useState<PatternId>('instapass');
  const [corner, setCorner] = useState<CornerId>('bullseye');
  const [showLogo, setShowLogo] = useState(true);
  const [logoMode, setLogoMode] = useState<'instapass' | 'custom'>('instapass');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [customLogoName, setCustomLogoName] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [previewSize, setPreviewSize] = useState<256 | 320 | 512>(320);
  const [shape, setShape] = useState<'square' | 'circle'>('square');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentPreset = STYLE_PRESETS.find((p) => p.id === stylePreset) || STYLE_PRESETS[0];
  const currentType = QR_TYPES.find((t) => t.id === qrType) || QR_TYPES[0];

  const qrStyle: QRStyle = useMemo(() => ({
    bg: currentPreset.bg,
    fg: currentPreset.fg,
    pattern,
    corner,
    showLogo,
    customLogoUrl: logoMode === 'custom' ? customLogoUrl : undefined,
  }), [currentPreset, pattern, corner, showLogo, logoMode, customLogoUrl]);

  const previewContent = content || currentType.placeholder;

  const { svgMarkup, modules: qrModules, qrSize: qrModuleSize } = useMemo(() => {
    try {
      const { modules, size } = encodeData(previewContent);
      return { svgMarkup: renderQRSvg(modules, size, qrStyle, 300, 2, shape), modules, qrSize: size };
    } catch {
      return { svgMarkup: '', modules: [] as boolean[][], qrSize: 0 };
    }
  }, [previewContent, qrStyle, shape]);

  // Handle file upload
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB max
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCustomLogoUrl(result);
      setCustomLogoName(file.name);
      setLogoMode('custom');
      setShowLogo(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearCustomLogo = useCallback(() => {
    setCustomLogoUrl('');
    setCustomLogoName('');
    setLogoMode('instapass');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // Draw custom logo on canvas for preview overlay
  const [customLogoLoaded, setCustomLogoLoaded] = useState(false);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (logoMode === 'custom' && customLogoUrl) {
      const img = new Image();
      img.onload = () => {
        logoImgRef.current = img;
        setCustomLogoLoaded(true);
      };
      img.src = customLogoUrl;
    } else {
      setCustomLogoLoaded(false);
      logoImgRef.current = null;
    }
  }, [customLogoUrl, logoMode]);

  const downloadWithLogo = useCallback((format: 'png' | 'svg', size: number) => {
    const rawSvg = renderQRSvg(qrModules, qrModuleSize, qrStyle, size);
    // Replace responsive sizing with fixed dimensions for export
    const svgStr = rawSvg
      .replace(/width="100%"/, `width="${size}"`)
      .replace(/height="100%"/, `height="${size}"`);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    if (format === 'svg' && logoMode !== 'custom') {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || 'smartcode'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      onDownload?.(name);
      return;
    }

    // For PNG or custom logo — render to canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      // Draw custom logo if present
      if (logoMode === 'custom' && logoImgRef.current && showLogo) {
        const logoSize = size * 0.2;
        const cx = (size - logoSize) / 2;
        const cy = (size - logoSize) / 2;
        // White background circle
        ctx.beginPath();
        ctx.roundRect(cx - 4, cy - 4, logoSize + 8, logoSize + 8, 8);
        ctx.fillStyle = qrStyle.bg;
        ctx.fill();
        // Clip rounded rect
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(cx, cy, logoSize, logoSize, 6);
        ctx.clip();
        ctx.drawImage(logoImgRef.current, cx, cy, logoSize, logoSize);
        ctx.restore();
      }

      if (format === 'png') {
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `${name || 'smartcode'}.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      } else {
        // SVG with embedded logo — convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${name || 'smartcode'}.png`;
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
    onDownload?.(name);
  }, [qrModules, qrModuleSize, qrStyle, name, onDownload, logoMode, showLogo]);

  return (
    <div className={`grid grid-cols-1 ${compact ? 'xl:grid-cols-[1fr,320px]' : 'xl:grid-cols-[1fr,380px]'} gap-8 items-start`}>
      {/* ─── Left: Form ─── */}
      <div className="space-y-6">
        {/* QR Type Selector */}
        <Card variant="bordered" className="p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">QR Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QR_TYPES.map((type) => {
              const Icon = TYPE_ICONS[type.id];
              const isActive = qrType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all text-xs font-semibold ${
                    isActive
                      ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Name + Content */}
        <Card variant="bordered" className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Content</h3>
          <Input
            label="SmartCode Name"
            placeholder="e.g. Spring Fest Main Link"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="w-full">
            <label className="block text-xs uppercase tracking-wider text-white/40 mb-2">
              {currentType.label} Content
            </label>
            <textarea
              placeholder={currentType.placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E52324]/30 focus:border-[#E52324]/50 transition-all text-sm resize-none"
            />
          </div>
        </Card>

        {/* ── IMAGE UPLOAD SECTION ── */}
        <Card variant="bordered" className="p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#E52324]" />
            Logo / Image
          </h3>

          {/* Logo mode selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => { setLogoMode('instapass'); setShowLogo(true); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                logoMode === 'instapass' && showLogo
                  ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              InstaPass Logo
            </button>
            <button
              onClick={() => { setLogoMode('custom'); setShowLogo(true); }}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                logoMode === 'custom'
                  ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              Upload Custom
            </button>
            <button
              onClick={() => setShowLogo(false)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                !showLogo
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              None
            </button>
          </div>

          {/* Upload area - only when custom mode */}
          {logoMode === 'custom' && (
            <>
              {customLogoUrl ? (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/10">
                    <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-semibold truncate">{customLogoName}</div>
                    <div className="text-xs text-white/40 mt-0.5">Logo uploaded successfully</div>
                  </div>
                  <button
                    onClick={clearCustomLogo}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-[#E52324] bg-[#E52324]/5'
                      : 'border-white/15 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? 'text-[#E52324]' : 'text-white/30'}`} />
                  <p className="text-sm text-white/60 mb-1">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-white/30">
                    PNG, JPG, SVG, or GIF — max 5MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </>
          )}
        </Card>

        {/* Style Presets */}
        <Card variant="bordered" className="p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Style Preset</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {STYLE_PRESETS.map((preset) => {
              const isActive = stylePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setStylePreset(preset.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    isActive
                      ? 'ring-2 ring-[#E52324] ring-offset-2 ring-offset-[#111]'
                      : 'border border-white/5 hover:border-white/15'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: preset.preview.bg }}
                  >
                    <div
                      className="w-5 h-5 rounded-sm"
                      style={{ backgroundColor: preset.preview.fg }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Pattern + Corner */}
        <Card variant="bordered" className="p-6 space-y-6">
          {/* Shape */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shape</h3>
            <div className="flex gap-2">
              {(['square', 'circle'] as const).map((s) => {
                const isActive = shape === s;
                return (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    <div className={`w-4 h-4 border-2 ${isActive ? 'border-white' : 'border-white/40'} ${s === 'circle' ? 'rounded-full' : 'rounded-sm'}`} />
                    {s === 'square' ? 'Square' : 'Circle'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pattern */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Pattern</h3>
            <div className="flex flex-wrap gap-2">
              {PATTERNS.map((p) => {
                const isActive = pattern === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPattern(p.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Corner Style */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Corner Style</h3>
            <div className="flex flex-wrap gap-2">
              {CORNERS.map((c) => {
                const isActive = corner === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCorner(c.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Right: Sticky Preview — Enterprise QR Display ─── */}
      <div className="xl:sticky xl:top-8 space-y-4">
        {/* Preview Card */}
        <div
          className="rounded-2xl border"
          style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b" style={{ borderColor: '#1F2937' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-white/50" />
                <span className="text-xs text-white/70 uppercase tracking-wider" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  Live Preview
                </span>
              </div>
              {/* Size selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: '#0B1220' }}>
                {([256, 320, 512] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPreviewSize(s)}
                    className={`px-2.5 py-1 rounded-md text-[10px] transition-all ${
                      previewSize === s
                        ? 'bg-white/10 text-white'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* QR Display Area — no clipping, no overflow hidden, no border-radius on QR */}
          <div
            ref={previewRef}
            className="flex items-center justify-center"
            style={{ padding: '24px', backgroundColor: '#0B1220' }}
          >
            <div
              className="relative"
              style={{
                width: `${Math.min(previewSize, 320)}px`,
                height: `${Math.min(previewSize, 320)}px`,
                overflow: 'visible',
              }}
            >
              {/* QR SVG — perfect square, no border-radius, no clipping */}
              <div
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
                className="[&_svg]:w-full [&_svg]:h-full"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              />
              {/* Custom logo overlay — centered with padding */}
              {logoMode === 'custom' && customLogoUrl && showLogo && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ overflow: 'visible' }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '18%', height: '18%', padding: '3px', backgroundColor: currentPreset.bg, borderRadius: '6px' }}
                  >
                    <img src={customLogoUrl} alt="Custom logo" className="w-full h-full" style={{ objectFit: 'contain', borderRadius: '4px' }} />
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Dimensions footer */}
          <div className="px-5 py-2.5 border-t" style={{ borderColor: '#1F2937' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                {previewSize} &times; {previewSize}px
              </span>
              <span className="text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                ECC Level M &middot; Quiet Zone 2
              </span>
            </div>
          </div>
        </div>

        {/* Download Card */}
        <div className="rounded-2xl border p-5 space-y-2.5" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
          <button
            onClick={() => downloadWithLogo('png', 1200)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#E52324] text-white text-sm hover:bg-[#c91f20] transition-colors"
            style={{ fontWeight: 700 }}
          >
            <Download className="w-4 h-4" />
            Download PNG &middot; 1200px
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => downloadWithLogo('png', 512)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] text-white/60 border transition-all hover:text-white/80 hover:bg-white/[0.03]"
              style={{ fontWeight: 600, borderColor: '#1F2937' }}
            >
              <Download className="w-3.5 h-3.5" />
              PNG &middot; 512px
            </button>
            <button
              onClick={() => downloadWithLogo('svg', 600)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[11px] text-white/60 border transition-all hover:text-white/80 hover:bg-white/[0.03]"
              style={{ fontWeight: 600, borderColor: '#1F2937' }}
            >
              <Download className="w-3.5 h-3.5" />
              SVG Vector
            </button>
          </div>
        </div>

        {/* Meta Info Card */}
        <div className="rounded-2xl border p-5" style={{ backgroundColor: '#111827', borderColor: '#1F2937' }}>
          <div className="space-y-2.5">
            {[
              { label: 'Type', value: QR_TYPES.find(t => t.id === qrType)?.label },
              { label: 'Shape', value: shape === 'circle' ? 'Circle' : 'Square' },
              { label: 'Pattern', value: PATTERNS.find(p => p.id === pattern)?.label },
              { label: 'Corners', value: CORNERS.find(c => c.id === corner)?.label },
              { label: 'Logo', value: !showLogo ? 'None' : logoMode === 'custom' && customLogoUrl ? 'Custom' : 'InstaPass' },
              { label: 'Output', value: `${previewSize}\u00D7${previewSize}px` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[11px] text-white/30 uppercase tracking-wider" style={{ fontWeight: 600 }}>{row.label}</span>
                <span className="text-[11px] text-white/60" style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}