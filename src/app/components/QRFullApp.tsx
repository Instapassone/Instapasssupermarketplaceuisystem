import { useState, useMemo, useCallback } from "react";
import {
  Globe, User, Wifi, Mail, MessageSquare, Type, CalendarDays, Share2,
  Download, Upload, Eye, Check, Copy, QrCode, ChevronDown, ChevronRight,
  Link as LinkIcon, Zap, Image as ImageIcon, RotateCcw, Sparkles,
  Lock, Unlock, Clock, BarChart3, Smartphone, Monitor, MapPin,
  ExternalLink, TrendingUp, ScanLine, FileImage, FileCode,
  ShoppingBag, Ticket, UserPlus, Building2, Megaphone, CreditCard,
  LayoutTemplate, Layers, AlertCircle, CheckCircle2, X,
  FileSpreadsheet, ArrowRight, GripVertical, Info,
} from "lucide-react";
import {
  encodeData, renderQRSvg,
  QR_TYPES, STYLE_PRESETS, PATTERNS, CORNERS,
  type QRTypeId, type PatternId, type CornerId, type QRStyle,
} from "./qr-engine";
import {
  FRAME_OPTIONS, getQRInnerPaths, renderBrandedFrame,
  type FrameId, type BrandedFrameConfig,
} from "./qr-branded-frames";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & TYPES
   ═══════════════════════════════════════════════════════════════ */
const R = "#E52324";

const TYPE_ICONS: Record<QRTypeId, typeof Globe> = {
  website: Globe, vcard: User, wifi: Wifi, email: Mail,
  sms: MessageSquare, text: Type, event: CalendarDays, social: Share2,
};

/* ─── Template Library ─── */
interface Template {
  id: string;
  name: string;
  description: string;
  category: "retail" | "events" | "brand";
  fg: string;
  bg: string;
  pattern: PatternId;
  corner: CornerId;
  showLogo: boolean;
  linkType: "dynamic" | "static";
  defaultUrl: string;
}

const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "retail", label: "Retail", icon: ShoppingBag },
  { id: "events", label: "Events", icon: Ticket },
  { id: "brand", label: "Brand", icon: Building2 },
] as const;

const TEMPLATES: Template[] = [
  {
    id: "t1", name: "Product Promo", description: "Drive traffic to your product page with branded QR",
    category: "retail", fg: "#E52324", bg: "#FFFFFF", pattern: "instapass", corner: "bullseye",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://shop.example.com/product",
  },
  {
    id: "t2", name: "Loyalty Program", description: "Sign up customers for rewards & loyalty perks",
    category: "retail", fg: "#8B5CF6", bg: "#FFFFFF", pattern: "rounded", corner: "rounded",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://loyalty.example.com/signup",
  },
  {
    id: "t3", name: "Inventory Check", description: "Internal stock check QR for warehouse staff",
    category: "retail", fg: "#10B981", bg: "#FFFFFF", pattern: "square", corner: "sharp",
    showLogo: false, linkType: "static", defaultUrl: "https://internal.example.com/inventory",
  },
  {
    id: "t4", name: "Event Registration", description: "Fast-scan registration for live events & festivals",
    category: "events", fg: "#E52324", bg: "#FFFFFF", pattern: "instapass", corner: "bullseye",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://events.instapass.ai/register",
  },
  {
    id: "t5", name: "Social Follow", description: "Link directly to your social media profiles",
    category: "events", fg: "#3B82F6", bg: "#FFFFFF", pattern: "dots", corner: "rounded",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://linktr.ee/yourbrand",
  },
  {
    id: "t6", name: "Contact Card", description: "Share vCard contact info with a single scan",
    category: "events", fg: "#0EA5E9", bg: "#FFFFFF", pattern: "rounded", corner: "rounded",
    showLogo: false, linkType: "static", defaultUrl: "BEGIN:VCARD\nVERSION:3.0\nFN:Your Name",
  },
  {
    id: "t7", name: "Corporate Standard", description: "On-brand QR for company communications",
    category: "brand", fg: "#1E293B", bg: "#FFFFFF", pattern: "square", corner: "sharp",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://company.example.com",
  },
  {
    id: "t8", name: "Campaign Tracker", description: "Pre-configured with UTM analytics tracking",
    category: "brand", fg: "#E52324", bg: "#FFFFFF", pattern: "instapass", corner: "bullseye",
    showLogo: true, linkType: "dynamic", defaultUrl: "https://campaign.example.com?utm_source=qr",
  },
];

/* ─── Size Presets ─── */
const SIZE_PRESETS = [
  { id: "sm", label: "Small", px: 200, desc: "Digital use" },
  { id: "md", label: "Medium", px: 600, desc: "Print standard" },
  { id: "lg", label: "Large", px: 1200, desc: "High-res print" },
] as const;

/* ─── Analytics/History Data ─── */
const HISTORY = [
  { id: "1", name: "Summer Festival 2026", scans: 4821, status: "active" as const, type: "Event", created: "Feb 12", fg: "#E52324" },
  { id: "2", name: "VIP Pre-Sale Link", scans: 2314, status: "active" as const, type: "URL", created: "Feb 8", fg: "#3B82F6" },
  { id: "3", name: "Street Team LA", scans: 1876, status: "active" as const, type: "URL", created: "Jan 28", fg: "#E52324" },
  { id: "4", name: "Venue WiFi Access", scans: 952, status: "paused" as const, type: "WiFi", created: "Jan 15", fg: "#10B981" },
  { id: "5", name: "Artist Merch Store", scans: 3210, status: "active" as const, type: "URL", created: "Jan 10", fg: "#8B5CF6" },
  { id: "6", name: "Holiday Promo", scans: 4102, status: "active" as const, type: "URL", created: "Dec 22", fg: "#F59E0B" },
];

const SCAN_DATA = [
  { day: "Mon", scans: 142 }, { day: "Tue", scans: 258 }, { day: "Wed", scans: 185 },
  { day: "Thu", scans: 371 }, { day: "Fri", scans: 489 }, { day: "Sat", scans: 520 }, { day: "Sun", scans: 395 },
];

const DEVICE_DATA = [
  { name: "iPhone", pct: 45, color: R },
  { name: "Android", pct: 32, color: "#FF6B6B" },
  { name: "Desktop", pct: 15, color: "#991B1B" },
  { name: "Tablet", pct: 8, color: "#FCA5A5" },
];

const GEO_DATA = [
  { city: "Los Angeles, CA", scans: 1240 },
  { city: "New York, NY", scans: 980 },
  { city: "Chicago, IL", scans: 620 },
  { city: "Houston, TX", scans: 510 },
  { city: "Atlanta, GA", scans: 430 },
];

type WorkflowMode = "single" | "bulk" | "templates";

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════���════ */
export function QRFullApp() {
  /* ── Core State ── */
  const [qrType, setQrType] = useState<QRTypeId>("website");
  const [content, setContent] = useState("https://instapass.ai");
  const [codeName, setCodeName] = useState("");
  const [fg, setFg] = useState(R);
  const [bg, setBg] = useState("#FFFFFF");
  const [pattern, setPattern] = useState<PatternId>("instapass");
  const [corner, setCorner] = useState<CornerId>("bullseye");
  const [showLogo, setShowLogo] = useState(true);
  const [linkType, setLinkType] = useState<"dynamic" | "static">("dynamic");
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [expiration, setExpiration] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sizePreset, setSizePreset] = useState<"sm" | "md" | "lg">("lg");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateCategory, setTemplateCategory] = useState<string>("all");

  /* ── Branded Frame State ── */
  const [frameId, setFrameId] = useState<FrameId>("ring-red");
  const [ctaText, setCtaText] = useState("SCAN TO UNLOCK EXCLUSIVE CONTENT");
  const [watermarkText, setWatermarkText] = useState("INSTAPASS");

  /* ── Progressive Disclosure ── */
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ── Workflow Mode ── */
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>("single");

  /* ── Bulk Upload State ── */
  const [bulkStep, setBulkStep] = useState(1);
  const [bulkFile, setBulkFile] = useState<string | null>(null);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  /* ── Validation ── */
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    if (field === "content" && !value.trim()) {
      newErrors.content = "Destination URL is required";
    } else if (field === "content" && qrType === "website" && !value.match(/^https?:\/\/.+/)) {
      newErrors.content = "Please enter a valid URL starting with http:// or https://";
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  };

  const handleBlur = (field: string, value: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, value);
  };

  /* ── QR generation ── */
  const qrSvg = useMemo(() => {
    let url = content || "https://instapass.ai";
    if (utmSource || utmMedium || utmCampaign) {
      const params = new URLSearchParams();
      if (utmSource) params.set("utm_source", utmSource);
      if (utmMedium) params.set("utm_medium", utmMedium);
      if (utmCampaign) params.set("utm_campaign", utmCampaign);
      url += (url.includes("?") ? "&" : "?") + params.toString();
    }
    const data = encodeData(url);

    if (frameId !== "none") {
      const quiet = 2;
      const { paths, totalSize } = getQRInnerPaths(
        data.modules, data.size, fg, bg, pattern, corner, showLogo, quiet,
      );
      const activeFrame = FRAME_OPTIONS.find(f => f.id === frameId)!;
      const frameConfig: BrandedFrameConfig = {
        frameId,
        ctaText: ctaText || activeFrame.defaultCta,
        watermarkText: watermarkText || "INSTAPASS",
        borderColor: activeFrame.borderColor,
        accentColor: activeFrame.accentColor,
      };
      return renderBrandedFrame(paths, 480, totalSize, frameConfig, bg);
    }

    const style: QRStyle = { bg, fg, pattern, corner, showLogo };
    return renderQRSvg(data.modules, data.size, style, 480, 2);
  }, [content, fg, bg, pattern, corner, showLogo, utmSource, utmMedium, utmCampaign, frameId, ctaText, watermarkText]);

  /* ── Download ── */
  const exportSize = SIZE_PRESETS.find(s => s.id === sizePreset)?.px || 1200;

  const handleDownload = useCallback((format: "png" | "svg") => {
    const filename = codeName || "instapass-qr";
    const exportSvg = qrSvg
      .replace(/width="100%"/, `width="${exportSize}"`)
      .replace(/height="100%"/, `height="${exportSize}"`);
    if (format === "svg") {
      const blob = new Blob([exportSvg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${filename}.svg`; a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize; canvas.height = exportSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const blob = new Blob([exportSvg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, exportSize, exportSize);
        URL.revokeObjectURL(url);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `${filename}.png`; a.click();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        const b64 = btoa(unescape(encodeURIComponent(exportSvg)));
        img.onload = () => {
          ctx.drawImage(img, 0, 0, exportSize, exportSize);
          const a = document.createElement("a");
          a.href = canvas.toDataURL("image/png");
          a.download = `${filename}.png`; a.click();
        };
        img.src = `data:image/svg+xml;base64,${b64}`;
      };
      img.src = url;
    }
  }, [qrSvg, codeName, exportSize]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setContent("https://instapass.ai"); setCodeName(""); setFg(R); setBg("#FFFFFF");
    setPattern("instapass"); setCorner("bullseye"); setShowLogo(true);
    setLinkType("dynamic"); setUtmSource(""); setUtmMedium(""); setUtmCampaign("");
    setExpiration(false); setSelectedTemplate(null); setErrors({}); setTouched({});
    setSizePreset("lg"); setShowAdvanced(false); setFrameId("none"); setCtaText(""); setWatermarkText("INSTAPASS");
  };

  const applyTemplate = (template: Template) => {
    setSelectedTemplate(template.id);
    setFg(template.fg);
    setBg(template.bg);
    setPattern(template.pattern);
    setCorner(template.corner);
    setShowLogo(template.showLogo);
    setLinkType(template.linkType);
    setContent(template.defaultUrl);
    setShowAdvanced(false);
    setWorkflowMode("single");
  };

  const simulateBulkProcess = () => {
    setBulkProcessing(true);
    setBulkProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setBulkProcessing(false);
          setBulkStep(3);
        }, 500);
      }
      setBulkProgress(Math.min(100, Math.round(p)));
    }, 300);
  };

  const maxScans = Math.max(...SCAN_DATA.map(d => d.scans));
  const filteredTemplates = templateCategory === "all" ? TEMPLATES : TEMPLATES.filter(t => t.category === templateCategory);

  /* ═════════════════════════��═════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

        {/* ═══════════ LEFT — LIVE PREVIEW ═══════════ */}
        <div className="w-full lg:w-[50%] xl:w-[48%] lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] flex flex-col bg-[#0B0F19]">
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 lg:py-0 relative">
            {/* Decorative bg */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: `radial-gradient(circle, ${fg}, transparent 70%)` }} />
              <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)", backgroundSize: "24px 24px" }} />
            </div>

            {/* Status */}
            <div className="relative z-10 flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-white/30 uppercase tracking-[0.12em]" style={{ fontWeight: 600 }}>Live Preview</span>
              <span className="text-white/10 mx-1">&bull;</span>
              <span className="text-[11px] text-white/20">{linkType === "dynamic" ? "Dynamic" : "Static"} QR</span>
              <span className="text-white/10 mx-1">&bull;</span>
              <span className="text-[11px] text-white/20">{exportSize}px</span>
              {frameId !== "none" && (
                <>
                  <span className="text-white/10 mx-1">&bull;</span>
                  <span className="text-[11px] text-[#E52324]" style={{ fontWeight: 600 }}>
                    {FRAME_OPTIONS.find(f => f.id === frameId)?.label}
                  </span>
                </>
              )}
            </div>

            {/* QR CODE */}
            <motion.div
              className="relative z-10 group"
              key={`${fg}-${bg}-${pattern}-${corner}-${showLogo}`}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" style={{ boxShadow: `0 40px 100px ${fg}15, 0 20px 60px rgba(0,0,0,0.5)` }}>
                <div
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                  className="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px]"
                />
              </div>
              <div className="absolute -inset-4 rounded-[36px] border border-white/[0.03] pointer-events-none" />
            </motion.div>

            {/* Code meta */}
            <div className="relative z-10 mt-6 text-center">
              <div className="text-[14px] text-white/60 mb-1" style={{ fontWeight: 600 }}>{codeName || "Untitled QR Code"}</div>
              <div className="text-[11px] text-white/20 max-w-[320px] truncate">{content}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                {selectedTemplate && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#E52324]/8 border border-[#E52324]/15">
                    <LayoutTemplate className="w-3 h-3 text-[#E52324]" strokeWidth={2} />
                    <span className="text-[9px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                      {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                    </span>
                  </div>
                )}
                {frameId !== "none" && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border" style={{
                    backgroundColor: `${FRAME_OPTIONS.find(f => f.id === frameId)?.borderColor}10`,
                    borderColor: `${FRAME_OPTIONS.find(f => f.id === frameId)?.borderColor}25`,
                  }}>
                    <Sparkles className="w-3 h-3" style={{ color: FRAME_OPTIONS.find(f => f.id === frameId)?.borderColor }} strokeWidth={2} />
                    <span className="text-[9px] uppercase tracking-wider" style={{ fontWeight: 700, color: FRAME_OPTIONS.find(f => f.id === frameId)?.borderColor }}>
                      {FRAME_OPTIONS.find(f => f.id === frameId)?.label} Frame
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Download buttons */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-8">
              <button
                onClick={() => handleDownload("png")}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[13px] text-white uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
                style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 8px 32px ${R}30` }}
              >
                <Download className="w-4 h-4" strokeWidth={2.2} />
                Download QR
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload("svg")}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/50 uppercase tracking-wider hover:bg-white/[0.07] hover:text-white/70 transition-all cursor-pointer"
                  style={{ fontWeight: 700 }}
                >
                  <FileCode className="w-4 h-4" strokeWidth={1.8} />
                  SVG
                </button>
                <button
                  onClick={() => handleDownload("png")}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/50 uppercase tracking-wider hover:bg-white/[0.07] hover:text-white/70 transition-all cursor-pointer"
                  style={{ fontWeight: 700 }}
                >
                  <FileImage className="w-4 h-4" strokeWidth={1.8} />
                  PNG
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/50 uppercase tracking-wider hover:bg-white/[0.07] hover:text-white/70 transition-all cursor-pointer"
                  style={{ fontWeight: 700 }}
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.8} />
                  Share
                </button>
              </div>
            </div>

            {/* Specs */}
            <div className="relative z-10 flex flex-col items-center gap-3 mt-6 w-full max-w-[340px]">
              {/* Scan Reliability Score */}
              {(() => {
                const logoImpact = showLogo ? 10 : 0;
                const contrastOk = fg !== bg;
                const score = contrastOk ? Math.max(60, 98 - logoImpact - (frameId !== "none" ? 3 : 0)) : 45;
                const color = score >= 90 ? "#10B981" : score >= 70 ? "#FFB800" : "#FF6B6B";
                return (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.03] mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] text-white/30 uppercase tracking-wider" style={{ fontWeight: 600 }}>Scan Reliability</span>
                        <span className="text-[11px]" style={{ fontWeight: 800, color }}>{score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="flex items-center gap-6 text-center">
              {[
                { l: `${exportSize}×${exportSize}`, d: "Resolution" },
                { l: "300 DPI", d: "Print Ready" },
                { l: "All Devices", d: "Scannable" },
              ].map(i => (
                <div key={i.l}>
                  <div className="text-[10px] text-white/25" style={{ fontWeight: 700 }}>{i.l}</div>
                  <div className="text-[8px] text-white/12">{i.d}</div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════ RIGHT — CUSTOMIZER PANEL ═══════════ */}
        <div className="w-full lg:w-[50%] xl:w-[52%] bg-[#0F1420] lg:border-l border-white/[0.04] overflow-y-auto">
          <div className="max-w-[640px] mx-auto px-6 py-8 space-y-5">

            {/* ─── WORKFLOW MODE TABS ─── */}
            <div className="flex gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              {([
                { id: "single" as WorkflowMode, label: "Single Code", icon: QrCode },
                { id: "templates" as WorkflowMode, label: "Templates", icon: LayoutTemplate },
                { id: "bulk" as WorkflowMode, label: "Bulk Generate", icon: Layers },
              ]).map((tab) => {
                const Icon = tab.icon;
                const isActive = workflowMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setWorkflowMode(tab.id)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] transition-all duration-200 cursor-pointer ${
                      isActive ? "text-white" : "text-white/30 hover:text-white/50"
                    }`}
                    style={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="workflow-tab"
                        className="absolute inset-0 rounded-xl bg-[#E52324]/8 border border-[#E52324]/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="relative z-10 w-3.5 h-3.5" strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ═══════════════════════════════════════
               SINGLE CODE — Progressive Disclosure
               ═══════════════════════════════════════ */}
            <AnimatePresence mode="wait">
              {workflowMode === "single" && (
                <motion.div
                  key="single"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* ═══ ESSENTIAL SECTION ═══ */}
                  <div className="rounded-2xl border border-white/[0.05] bg-[#111827] overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#E52324]/8 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-[#E52324]" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-[14px] text-white" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                          Quick Setup
                        </h3>
                        <p className="text-[10px] text-white/20">Essential settings to generate your QR code</p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4 space-y-4">
                      {/* URL Input (required) */}
                      <div>
                        <Label required>Destination URL</Label>
                        <div className="relative">
                          <input
                            type="text"
                            value={content}
                            onChange={(e) => {
                              setContent(e.target.value);
                              if (touched.content) validateField("content", e.target.value);
                            }}
                            onBlur={() => handleBlur("content", content)}
                            placeholder={QR_TYPES.find(t => t.id === qrType)?.placeholder}
                            className={`w-full h-[44px] px-4 pr-10 rounded-xl bg-white/[0.03] border text-[13px] text-white placeholder:text-white/15 outline-none transition-all ${
                              errors.content && touched.content
                                ? "border-red-500/50 focus:border-red-500/70 focus:ring-1 focus:ring-red-500/20"
                                : "border-white/[0.06] focus:border-[#E52324]/30 focus:ring-1 focus:ring-[#E52324]/10"
                            }`}
                          />
                          <button onClick={handleCopy} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#E52324] transition-colors cursor-pointer">
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {/* Error message */}
                        <AnimatePresence>
                          {errors.content && touched.content && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-1.5 mt-1.5 text-red-400"
                            >
                              <AlertCircle className="w-3 h-3 shrink-0" strokeWidth={2} />
                              <span className="text-[10px]" style={{ fontWeight: 500 }}>{errors.content}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Code Name */}
                      <div>
                        <Label>QR Code Name</Label>
                        <div className="relative">
                          <input
                            type="text"
                            value={codeName}
                            onChange={(e) => setCodeName(e.target.value.slice(0, 50))}
                            placeholder="e.g. Summer Festival Promo"
                            className="w-full h-[44px] px-4 pr-14 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[13px] text-white placeholder:text-white/15 outline-none focus:border-[#E52324]/30 focus:ring-1 focus:ring-[#E52324]/10 transition-all"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/15" style={{ fontWeight: 500 }}>
                            {codeName.length}/50
                          </span>
                        </div>
                      </div>

                      {/* Template Quick-Pick */}
                      <div>
                        <Label>Quick Start Template</Label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {TEMPLATES.slice(0, 4).map((tmpl, tIdx) => {
                            const isActive = selectedTemplate === tmpl.id;
                            return (
                              <button
                                key={tmpl.id}
                                onClick={() => applyTemplate(tmpl)}
                                className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                                  isActive
                                    ? "bg-[#E52324]/8 border-[#E52324]/25"
                                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.10]"
                                }`}
                              >
                                {/* Mini QR preview with branded frame */}
                                <div className="w-8 h-8 rounded-md overflow-hidden border border-white/[0.06]">
                                  {(() => {
                                    const qsCycleFrames: FrameId[] = ["ring-red", "ring-cyan", "badge-vip", "badge-gold", "badge-purple"];
                                    const qsFrameId = qsCycleFrames[tIdx % qsCycleFrames.length];
                                    const qsFrame = FRAME_OPTIONS.find(f => f.id === qsFrameId)!;
                                    const qsData = encodeData(tmpl.defaultUrl);
                                    const { paths, totalSize } = getQRInnerPaths(qsData.modules, qsData.size, tmpl.fg, "#FFF", tmpl.pattern, tmpl.corner, false, 2);
                                    const qsCfg: BrandedFrameConfig = { frameId: qsFrameId, ctaText: qsFrame.defaultCta, watermarkText: "INSTAPASS", borderColor: qsFrame.borderColor, accentColor: qsFrame.accentColor };
                                    return <div dangerouslySetInnerHTML={{ __html: renderBrandedFrame(paths, 40, totalSize, qsCfg, "#FFF") }} className="w-full h-full" />;
                                  })()}
                                </div>
                                <span className={`text-[7px] uppercase tracking-wider text-center leading-tight ${
                                  isActive ? "text-[#E52324]" : "text-white/25"
                                }`} style={{ fontWeight: 700 }}>
                                  {tmpl.name}
                                </span>
                                {isActive && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E52324] flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setWorkflowMode("templates")}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] text-white/25 hover:text-[#E52324] transition-colors cursor-pointer"
                          style={{ fontWeight: 600 }}
                        >
                          Browse all templates <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Size Selection */}
                      <div>
                        <Label>Export Size</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {SIZE_PRESETS.map((size) => {
                            const isActive = sizePreset === size.id;
                            return (
                              <button
                                key={size.id}
                                onClick={() => setSizePreset(size.id)}
                                className={`flex flex-col items-center gap-1 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                                  isActive
                                    ? "bg-[#E52324]/8 border-[#E52324]/25"
                                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.10]"
                                }`}
                              >
                                <span className={`text-[13px] ${isActive ? "text-white" : "text-white/40"}`} style={{ fontWeight: 700 }}>
                                  {size.label}
                                </span>
                                <span className={`text-[9px] ${isActive ? "text-[#E52324]" : "text-white/15"}`} style={{ fontWeight: 500 }}>
                                  {size.px}px &bull; {size.desc}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Generate / Export Button */}
                      <button
                        onClick={() => handleDownload("png")}
                        className="w-full flex items-center justify-center gap-2.5 h-[48px] rounded-2xl text-[13px] text-white uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer"
                        style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 8px 32px ${R}25` }}
                      >
                        <Download className="w-4 h-4" strokeWidth={2.2} />
                        Generate & Export
                      </button>
                    </div>
                  </div>

                  {/* ═══ "MORE OPTIONS" — Progressive Disclosure Trigger ═══ */}
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      showAdvanced
                        ? "bg-[#E52324]/5 border-[#E52324]/20 text-[#E52324]"
                        : "bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/[0.10]"
                    }`}
                    style={{ fontWeight: 700 }}
                  >
                    <Sparkles className="w-4 h-4" strokeWidth={1.8} />
                    <span className="text-[12px] uppercase tracking-wider">
                      {showAdvanced ? "Hide Advanced Options" : "More Options"}
                    </span>
                    <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4" strokeWidth={2} />
                    </motion.div>
                  </button>

                  {/* ═══ ADVANCED SECTION (Expandable) ═══ */}
                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden space-y-4"
                      >
                        {/* ─── BRANDED FRAME ─── */}
                        <Card
                          title="Branded Frame"
                          icon={<ImageIcon className="w-4 h-4" strokeWidth={2} />}
                          defaultOpen
                          badge="New"
                        >
                          <Label>Frame Style</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                            {FRAME_OPTIONS.map((frame) => {
                              const isActive = frameId === frame.id;
                              // Generate mini preview
                              const previewData = encodeData("https://instapass.ai");
                              let miniSvg: string;
                              if (frame.id === "none") {
                                miniSvg = renderQRSvg(previewData.modules, previewData.size, { fg, bg, pattern, corner, showLogo: false }, 60, 1);
                              } else {
                                const { paths, totalSize } = getQRInnerPaths(previewData.modules, previewData.size, fg, "#FFFFFF", pattern, corner, false, 1);
                                miniSvg = renderBrandedFrame(paths, 60, totalSize, {
                                  frameId: frame.id,
                                  ctaText: "",
                                  watermarkText: "",
                                  borderColor: frame.borderColor,
                                  accentColor: frame.accentColor,
                                }, "#FFFFFF");
                              }
                              return (
                                <button
                                  key={frame.id}
                                  onClick={() => {
                                    setFrameId(frame.id);
                                    if (frame.id !== "none") {
                                      setCtaText(frame.defaultCta);
                                    } else {
                                      setCtaText("");
                                    }
                                  }}
                                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive
                                      ? "bg-[#E52324]/8 border-[#E52324]/25"
                                      : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.10]"
                                  }`}
                                >
                                  <div className="w-[48px] h-[48px] rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: miniSvg }} />
                                  <span className={`text-[8px] uppercase tracking-wider text-center leading-tight ${isActive ? "text-[#E52324]" : "text-white/25"}`} style={{ fontWeight: 700 }}>
                                    {frame.label}
                                  </span>
                                  {frame.category !== "none" && (
                                    <span className={`text-[6px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                      frame.category === "circular" ? "bg-cyan-500/10 text-cyan-400" : "bg-purple-500/10 text-purple-400"
                                    }`} style={{ fontWeight: 600 }}>
                                      {frame.category}
                                    </span>
                                  )}
                                  {isActive && frame.id !== "none" && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E52324] flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* CTA Ring / Header Text */}
                          {frameId !== "none" && (
                            <>
                              <Label>CTA Text</Label>
                              <input
                                type="text"
                                value={ctaText}
                                onChange={(e) => setCtaText(e.target.value.toUpperCase().slice(0, 40))}
                                placeholder="e.g. SCAN TO UNLOCK EXCLUSIVE CONTENT"
                                className="w-full h-[40px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] text-white placeholder:text-white/15 outline-none focus:border-[#E52324]/30 focus:ring-1 focus:ring-[#E52324]/10 transition-all mb-1 uppercase tracking-wider"
                                style={{ fontWeight: 600 }}
                              />
                              <div className="text-[9px] text-white/15 text-right mb-4">{ctaText.length}/40</div>

                              <Label>Watermark Text</Label>
                              <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value.toUpperCase().slice(0, 20))}
                                placeholder="INSTAPASS"
                                className="w-full h-[40px] px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[12px] text-white placeholder:text-white/15 outline-none focus:border-[#E52324]/30 focus:ring-1 focus:ring-[#E52324]/10 transition-all mb-1 uppercase tracking-wider"
                                style={{ fontWeight: 600 }}
                              />
                              <div className="text-[9px] text-white/15 text-right mb-4">{watermarkText.length}/20</div>

                              {/* Quick CTA presets */}
                              <Label>Quick CTAs</Label>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  "SCAN TO UNLOCK EXCLUSIVE CONTENT",
                                  "SCAN FOR EVENT ACCESS",
                                  "VIP ENTRY",
                                  "SCAN TO SHOP",
                                  "SCAN TO EXPLORE",
                                  "GET YOUR TICKETS",
                                  "SCAN HERE",
                                ].map((preset) => (
                                  <button
                                    key={preset}
                                    onClick={() => setCtaText(preset)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[8px] uppercase tracking-wider border transition-all cursor-pointer ${
                                      ctaText === preset
                                        ? "bg-[#E52324]/10 border-[#E52324]/25 text-[#E52324]"
                                        : "bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40"
                                    }`}
                                    style={{ fontWeight: 700 }}
                                  >
                                    {preset}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </Card>

                        {/* ─── QR Type ─── */}
                        <Card
                          title="QR Code Type"
                          icon={<QrCode className="w-4 h-4" strokeWidth={2} />}
                          defaultOpen
                        >
                          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                            {QR_TYPES.map((type) => {
                              const Icon = TYPE_ICONS[type.id];
                              const isActive = qrType === type.id;
                              return (
                                <button
                                  key={type.id}
                                  onClick={() => setQrType(type.id)}
                                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive
                                      ? "bg-[#E52324]/8 border-[#E52324]/25 text-[#E52324]"
                                      : "bg-white/[0.02] border-white/[0.04] text-white/30 hover:text-white/50 hover:border-white/[0.08]"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                                  <span className="text-[8px] uppercase tracking-wider leading-none" style={{ fontWeight: 700 }}>{type.label.split(" ")[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </Card>

                        {/* ─── Style & Colors ─── */}
                        <Card
                          title="Style & Colors"
                          icon={<Sparkles className="w-4 h-4" strokeWidth={2} />}
                          defaultOpen
                        >
                          {/* Color Presets */}
                          <Label>Color Presets</Label>
                          <div className="grid grid-cols-6 gap-2 mb-5">
                            {STYLE_PRESETS.map((preset) => {
                              const isActive = fg === preset.fg && bg === preset.bg;
                              return (
                                <button
                                  key={preset.id}
                                  onClick={() => { setFg(preset.fg); setBg(preset.bg); }}
                                  className={`relative p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive ? "border-[#E52324]/40 bg-[#E52324]/5" : "border-white/[0.04] bg-white/[0.02] hover:border-white/[0.10]"
                                  }`}
                                >
                                  <div className="w-full aspect-square rounded-lg overflow-hidden border border-white/[0.06]" style={{ background: preset.bg }}>
                                    <div className="w-full h-1/2" />
                                    <div className="w-full h-1/2" style={{ background: preset.fg }} />
                                  </div>
                                  <span className={`block text-[7px] uppercase tracking-wider mt-1.5 text-center ${isActive ? "text-[#E52324]" : "text-white/20"}`} style={{ fontWeight: 700 }}>
                                    {preset.label}
                                  </span>
                                  {isActive && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E52324] flex items-center justify-center">
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Colors */}
                          <Label>Custom Colors</Label>
                          <div className="flex gap-3 mb-5">
                            <ColorPicker label="Foreground" value={fg} onChange={setFg} />
                            <ColorPicker label="Background" value={bg} onChange={setBg} />
                          </div>

                          {/* Dot Style */}
                          <Label>Dot Style</Label>
                          <div className="grid grid-cols-5 gap-2 mb-5">
                            {PATTERNS.map((p) => {
                              const isActive = pattern === p.id;
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => setPattern(p.id)}
                                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive
                                      ? "bg-[#E52324]/8 border-[#E52324]/25 text-[#E52324]"
                                      : "bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40 hover:border-white/[0.08]"
                                  }`}
                                >
                                  <PatternIcon pattern={p.id} color={isActive ? R : "rgba(255,255,255,0.2)"} />
                                  <span className="text-[8px] uppercase tracking-wider" style={{ fontWeight: 700 }}>{p.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Eye Pattern */}
                          <Label>Eye Pattern</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {CORNERS.map((c) => {
                              const isActive = corner === c.id;
                              return (
                                <button
                                  key={c.id}
                                  onClick={() => setCorner(c.id)}
                                  className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive
                                      ? "bg-[#E52324]/8 border-[#E52324]/25 text-[#E52324]"
                                      : "bg-white/[0.02] border-white/[0.04] text-white/25 hover:text-white/40 hover:border-white/[0.08]"
                                  }`}
                                >
                                  <CornerIcon corner={c.id} color={isActive ? R : "rgba(255,255,255,0.2)"} />
                                  <span className="text-[8px] uppercase tracking-wider" style={{ fontWeight: 700 }}>{c.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </Card>

                        {/* ─── Branding ─── */}
                        <Card
                          title="Branding"
                          icon={<ImageIcon className="w-4 h-4" strokeWidth={2} />}
                          defaultOpen={false}
                        >
                          <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${showLogo ? "bg-[#E52324]/10" : "bg-white/[0.03]"}`}>
                                <QrCode className={`w-4 h-4 ${showLogo ? "text-[#E52324]" : "text-white/20"}`} strokeWidth={1.8} />
                              </div>
                              <div>
                                <div className="text-[13px] text-white/70" style={{ fontWeight: 600 }}>Add InstaPass Logo</div>
                                <div className="text-[10px] text-white/25">Centered brand watermark</div>
                              </div>
                            </div>
                            <Toggle active={showLogo} onClick={() => setShowLogo(!showLogo)} />
                          </div>
                          <button className="w-full flex items-center justify-center gap-2.5 h-[48px] rounded-xl border border-dashed border-white/[0.08] text-white/20 hover:text-white/40 hover:border-white/[0.15] hover:bg-white/[0.02] transition-all cursor-pointer">
                            <Upload className="w-4 h-4" strokeWidth={1.8} />
                            <span className="text-[12px]" style={{ fontWeight: 600 }}>Upload Custom Logo</span>
                          </button>
                          <p className="text-[10px] text-white/15 mt-2 text-center">SVG, PNG up to 2MB. Recommended: 200x200px</p>
                        </Card>

                        {/* ─── Advanced Settings ─── */}
                        <Card
                          title="Advanced Settings"
                          icon={<Zap className="w-4 h-4" strokeWidth={2} />}
                          defaultOpen={false}
                          badge="Pro"
                        >
                          {/* Link Type */}
                          <Label>Link Type</Label>
                          <div className="grid grid-cols-2 gap-2 mb-5">
                            {([
                              { id: "dynamic" as const, label: "Dynamic", desc: "Editable anytime", icon: Unlock },
                              { id: "static" as const, label: "Static", desc: "Permanent link", icon: Lock },
                            ]).map((opt) => {
                              const Icon = opt.icon;
                              const isActive = linkType === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => setLinkType(opt.id)}
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isActive
                                      ? "bg-[#E52324]/5 border-[#E52324]/25"
                                      : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                                  }`}
                                >
                                  <Icon className={`w-4 h-4 ${isActive ? "text-[#E52324]" : "text-white/20"}`} strokeWidth={1.8} />
                                  <div className="text-left">
                                    <div className={`text-[12px] ${isActive ? "text-white" : "text-white/40"}`} style={{ fontWeight: 600 }}>{opt.label}</div>
                                    <div className="text-[9px] text-white/15">{opt.desc}</div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* UTM */}
                          <Label>UTM Parameters</Label>
                          <div className="space-y-2 mb-5">
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <div className="text-[9px] text-white/15 mb-1 uppercase tracking-wider" style={{ fontWeight: 600 }}>Source</div>
                                <input
                                  value={utmSource} onChange={(e) => setUtmSource(e.target.value)}
                                  placeholder="e.g. qr_code"
                                  className="w-full h-[36px] px-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white placeholder:text-white/12 outline-none focus:border-[#E52324]/20 transition-all"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-[9px] text-white/15 mb-1 uppercase tracking-wider" style={{ fontWeight: 600 }}>Medium</div>
                                <input
                                  value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)}
                                  placeholder="e.g. print"
                                  className="w-full h-[36px] px-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white placeholder:text-white/12 outline-none focus:border-[#E52324]/20 transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] text-white/15 mb-1 uppercase tracking-wider" style={{ fontWeight: 600 }}>Campaign</div>
                              <input
                                value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)}
                                placeholder="e.g. summer_festival_2026"
                                className="w-full h-[36px] px-3 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[11px] text-white placeholder:text-white/12 outline-none focus:border-[#E52324]/20 transition-all"
                              />
                            </div>
                          </div>

                          {/* Scan Analytics Toggle */}
                          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] mb-3">
                            <div className="flex items-center gap-3">
                              <BarChart3 className="w-4 h-4 text-[#E52324]" strokeWidth={1.8} />
                              <div>
                                <div className="text-[12px] text-white/60" style={{ fontWeight: 600 }}>Scan Analytics</div>
                                <div className="text-[9px] text-white/20">Track scans, devices & locations</div>
                              </div>
                            </div>
                            <Toggle active={linkType === "dynamic"} onClick={() => setLinkType(linkType === "dynamic" ? "static" : "dynamic")} />
                          </div>

                          {/* Expiration */}
                          <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                              <Clock className={`w-4 h-4 ${expiration ? "text-[#E52324]" : "text-white/20"}`} strokeWidth={1.8} />
                              <div>
                                <div className="text-[12px] text-white/60" style={{ fontWeight: 600 }}>Access Expiration</div>
                                <div className="text-[9px] text-white/20">Auto-disable after set date</div>
                              </div>
                            </div>
                            <Toggle active={expiration} onClick={() => setExpiration(!expiration)} />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reset */}
                  <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-all cursor-pointer" style={{ fontWeight: 600 }}>
                    <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
                    Reset All Settings
                  </button>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════
                 TEMPLATE LIBRARY
                 ═══════════════════════════════════════ */}
              {workflowMode === "templates" && (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[16px] text-white" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                        Template Library
                      </h3>
                      <p className="text-[11px] text-white/25 mt-0.5">Quick-start designs for common use cases</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                      <Info className="w-3 h-3 text-white/20" strokeWidth={1.8} />
                      <span className="text-[9px] text-white/25" style={{ fontWeight: 500 }}>{TEMPLATES.length} templates</span>
                    </div>
                  </div>

                  {/* Category filter */}
                  <div className="flex gap-1.5 flex-wrap">
                    {TEMPLATE_CATEGORIES.map((cat) => {
                      const isActive = templateCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setTemplateCategory(cat.id)}
                          className={`px-3.5 py-2 rounded-xl text-[11px] border transition-all duration-150 cursor-pointer ${
                            isActive
                              ? "bg-[#E52324]/8 border-[#E52324]/25 text-[#E52324]"
                              : "bg-white/[0.02] border-white/[0.04] text-white/30 hover:text-white/50"
                          }`}
                          style={{ fontWeight: isActive ? 700 : 500 }}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Template Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredTemplates.map((tmpl, ftIdx) => {
                      const isActive = selectedTemplate === tmpl.id;
                      const data = encodeData(tmpl.defaultUrl);
                      const ftCycleFrames: FrameId[] = ["ring-red", "ring-cyan", "badge-vip", "badge-gold", "badge-purple"];
                      const ftFrameId = ftCycleFrames[ftIdx % ftCycleFrames.length];
                      const ftFrame = FRAME_OPTIONS.find(f => f.id === ftFrameId)!;
                      const { paths: ftPaths, totalSize: ftTotalSize } = getQRInnerPaths(data.modules, data.size, tmpl.fg, "#FFF", tmpl.pattern, tmpl.corner, false, 2);
                      const ftCfg: BrandedFrameConfig = { frameId: ftFrameId, ctaText: ftFrame.defaultCta, watermarkText: "INSTAPASS", borderColor: ftFrame.borderColor, accentColor: ftFrame.accentColor };
                      const svg = renderBrandedFrame(ftPaths, 100, ftTotalSize, ftCfg, "#FFF");
                      return (
                        <motion.button
                          key={tmpl.id}
                          onClick={() => applyTemplate(tmpl)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "bg-[#E52324]/5 border-[#E52324]/25"
                              : "bg-[#111827] border-white/[0.04] hover:border-white/[0.10]"
                          }`}
                          style={{
                            boxShadow: isActive ? `0 0 20px ${R}10` : "none",
                          }}
                        >
                          <div className="flex gap-3.5">
                            {/* Mini QR */}
                            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 border border-white/[0.08]"
                              dangerouslySetInnerHTML={{ __html: svg }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[13px] text-white truncate" style={{ fontWeight: 700 }}>
                                  {tmpl.name}
                                </h4>
                                <span className={`shrink-0 text-[7px] px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                                  tmpl.category === "retail" ? "bg-purple-500/10 text-purple-400" :
                                  tmpl.category === "events" ? "bg-[#E52324]/10 text-[#E52324]" :
                                  "bg-blue-500/10 text-blue-400"
                                }`} style={{ fontWeight: 700 }}>
                                  {tmpl.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/25 leading-relaxed line-clamp-2">{tmpl.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1">
                                  <div className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ background: tmpl.fg }} />
                                  <span className="text-[8px] text-white/15 uppercase" style={{ fontWeight: 600 }}>{tmpl.pattern}</span>
                                </div>
                                <span className="text-[8px] text-white/10">&bull;</span>
                                <span className="text-[8px] text-white/15 uppercase" style={{ fontWeight: 600 }}>
                                  {tmpl.linkType}
                                </span>
                              </div>
                            </div>
                          </div>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#E52324] flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════
                 BULK GENERATION
                 ═══════════════════════════════════════ */}
              {workflowMode === "bulk" && (
                <motion.div
                  key="bulk"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  {/* Header */}
                  <div>
                    <h3 className="text-[16px] text-white" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                      Bulk Generate
                    </h3>
                    <p className="text-[11px] text-white/25 mt-0.5">Generate up to 500 QR codes from a CSV or XLSX file</p>
                  </div>

                  {/* Progress Steps */}
                  <div className="flex items-center gap-0">
                    {["Upload CSV", "Configure", "Export"].map((step, i) => {
                      const stepNum = i + 1;
                      const isActive = bulkStep === stepNum;
                      const isComplete = bulkStep > stepNum;
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0 transition-all ${
                              isComplete ? "bg-emerald-500 text-white" :
                              isActive ? "bg-[#E52324] text-white" :
                              "bg-white/[0.04] text-white/20"
                            }`} style={{ fontWeight: 700 }}>
                              {isComplete ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : stepNum}
                            </div>
                            <span className={`text-[10px] uppercase tracking-wider ${
                              isActive ? "text-white" : isComplete ? "text-emerald-400" : "text-white/20"
                            }`} style={{ fontWeight: 600 }}>
                              {step}
                            </span>
                          </div>
                          {i < 2 && (
                            <div className={`flex-shrink-0 w-8 h-px mx-1 ${
                              isComplete ? "bg-emerald-500/40" : "bg-white/[0.06]"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step Content */}
                  <div className="rounded-2xl border border-white/[0.05] bg-[#111827] p-5">
                    {bulkStep === 1 && (
                      <div className="space-y-4">
                        <div
                          className="flex flex-col items-center justify-center py-10 rounded-2xl border-2 border-dashed border-white/[0.08] hover:border-[#E52324]/20 hover:bg-white/[0.01] transition-all cursor-pointer"
                          onClick={() => {
                            setBulkFile("campaign_urls.csv");
                            setBulkStep(2);
                          }}
                        >
                          <Upload className="w-8 h-8 text-white/15 mb-3" strokeWidth={1.5} />
                          <p className="text-[13px] text-white/50 mb-1" style={{ fontWeight: 600 }}>
                            Drag & drop your file here
                          </p>
                          <p className="text-[10px] text-white/20">
                            or click to browse &bull; CSV, XLSX accepted
                          </p>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <Info className="w-3.5 h-3.5 text-white/15 shrink-0" strokeWidth={1.8} />
                          <p className="text-[10px] text-white/20">
                            Your CSV should have columns for: <span className="text-white/35" style={{ fontWeight: 600 }}>URL</span>, <span className="text-white/35" style={{ fontWeight: 600 }}>Name</span> (optional), <span className="text-white/35" style={{ fontWeight: 600 }}>Category</span> (optional)
                          </p>
                        </div>
                      </div>
                    )}

                    {bulkStep === 2 && (
                      <div className="space-y-4">
                        {/* File indicator */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-400" strokeWidth={1.8} />
                          <div className="flex-1">
                            <p className="text-[12px] text-white/70" style={{ fontWeight: 600 }}>{bulkFile}</p>
                            <p className="text-[9px] text-emerald-400">150 rows detected &bull; 3 columns mapped</p>
                          </div>
                          <button onClick={() => { setBulkFile(null); setBulkStep(1); }} className="text-white/20 hover:text-white/50 cursor-pointer">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Column mapping preview */}
                        <div>
                          <Label>Column Mapping</Label>
                          <div className="space-y-1.5">
                            {[
                              { from: "Column A", to: "URL", mapped: true },
                              { from: "Column B", to: "Name", mapped: true },
                              { from: "Column C", to: "Category", mapped: true },
                            ].map((col) => (
                              <div key={col.from} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <GripVertical className="w-3.5 h-3.5 text-white/10" strokeWidth={1.8} />
                                <span className="text-[11px] text-white/30 flex-1" style={{ fontWeight: 500 }}>{col.from}</span>
                                <ArrowRight className="w-3 h-3 text-white/10" />
                                <span className="text-[11px] text-white/60 flex-1" style={{ fontWeight: 600 }}>{col.to}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Apply template to batch */}
                        <div>
                          <Label>Apply Template to Batch</Label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {TEMPLATES.slice(0, 4).map((tmpl) => (
                              <button
                                key={tmpl.id}
                                onClick={() => setSelectedTemplate(tmpl.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all cursor-pointer ${
                                  selectedTemplate === tmpl.id
                                    ? "bg-[#E52324]/8 border-[#E52324]/25"
                                    : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                                }`}
                              >
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: tmpl.fg }} />
                                <span className="text-[7px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                                  {tmpl.name.split(" ")[0]}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Preview first 3 */}
                        <div>
                          <Label>Preview (first 3 codes)</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3].map((i) => {
                              const bulkFrames: FrameId[] = ["ring-red", "ring-cyan", "badge-vip"];
                              const bfId = bulkFrames[i - 1];
                              const bFrame = FRAME_OPTIONS.find(f => f.id === bfId)!;
                              const data = encodeData(`https://example.com/${i}`);
                              const quiet = 2;
                              const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, R, "#FFF", pattern, corner, false, quiet);
                              const bCfg: BrandedFrameConfig = { frameId: bfId, ctaText: bFrame.defaultCta, watermarkText: "INSTAPASS", borderColor: bFrame.borderColor, accentColor: bFrame.accentColor };
                              const svg = renderBrandedFrame(paths, 60, totalSize, bCfg, "#FFF");
                              return (
                                <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-white/[0.06]"
                                  dangerouslySetInnerHTML={{ __html: svg }}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Process button */}
                        <button
                          onClick={simulateBulkProcess}
                          disabled={bulkProcessing}
                          className="w-full flex items-center justify-center gap-2.5 h-[48px] rounded-2xl text-[13px] text-white uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                          style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)`, boxShadow: `0 8px 32px ${R}25` }}
                        >
                          {bulkProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              Processing {bulkProgress} of 150
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" strokeWidth={2.2} />
                              Generate 150 QR Codes
                            </>
                          )}
                        </button>

                        {bulkProcessing && (
                          <div className="space-y-1.5">
                            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: `linear-gradient(90deg, ${R}, #FF4444)` }}
                                animate={{ width: `${bulkProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-[10px] text-white/20 text-center">
                              Processing {bulkProgress} of 150 &bull; {Math.max(0, 150 - Math.round(bulkProgress * 1.5))} remaining
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {bulkStep === 3 && (
                      <div className="text-center py-6 space-y-4">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto"
                        >
                          <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={1.8} />
                        </motion.div>
                        <div>
                          <h4 className="text-[16px] text-white mb-1" style={{ fontWeight: 700 }}>Batch Complete!</h4>
                          <p className="text-[11px] text-white/25">150 QR codes generated successfully. 0 errors.</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <button
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[12px] text-white uppercase tracking-wider transition-all hover:brightness-110 cursor-pointer"
                            style={{ fontWeight: 800, background: `linear-gradient(135deg, ${R}, #C41E1E)` }}
                          >
                            <Download className="w-4 h-4" />
                            Download ZIP
                          </button>
                          <button
                            onClick={() => { setBulkStep(1); setBulkFile(null); setBulkProgress(0); }}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-[12px] text-white/50 uppercase tracking-wider hover:bg-white/[0.07] transition-all cursor-pointer"
                            style={{ fontWeight: 700 }}
                          >
                            <RotateCcw className="w-4 h-4" strokeWidth={1.8} />
                            New Batch
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ═══════════ ANALYTICS & HISTORY SECTION ═══════════ */}
      <div className="bg-[#0B0F19] border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[20px] text-white tracking-tight" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>Analytics & History</h2>
              <p className="text-[12px] text-white/25 mt-1">Track performance across all your QR codes</p>
            </div>
            <a href="/qr-studio/analytics" className="flex items-center gap-1.5 text-[11px] text-[#E52324] hover:text-[#FF4444] transition-colors" style={{ fontWeight: 700 }}>
              View Full Analytics <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Scans", value: "14,716", change: "+18.4%", icon: ScanLine },
              { label: "Active Codes", value: "24", change: "+3 this week", icon: QrCode },
              { label: "Conversion Rate", value: "32.1%", change: "+5.2%", icon: TrendingUp },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="p-5 rounded-2xl bg-[#111827] border border-white/[0.04]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E52324]/8 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#E52324]" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-400/8" style={{ fontWeight: 700 }}>{kpi.change}</span>
                  </div>
                  <div className="text-[28px] text-white" style={{ fontWeight: 800 }}>{kpi.value}</div>
                  <div className="text-[10px] text-white/20 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>{kpi.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Scan Activity Chart */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-[#111827] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] text-white" style={{ fontWeight: 700 }}>Scans This Week</h3>
                <BarChart3 className="w-4 h-4 text-white/15" strokeWidth={1.8} />
              </div>
              <div className="flex items-end gap-1.5 h-[120px]">
                {SCAN_DATA.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full rounded-t-md transition-all" style={{
                      height: `${(d.scans / maxScans) * 100}px`,
                      background: `linear-gradient(to top, ${R}, #FF4444)`,
                      opacity: 0.4 + (d.scans / maxScans) * 0.6,
                    }} />
                    <span className="text-[8px] text-white/20" style={{ fontWeight: 600 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] text-white" style={{ fontWeight: 700 }}>Devices</h3>
                <Smartphone className="w-4 h-4 text-white/15" strokeWidth={1.8} />
              </div>
              <div className="space-y-3">
                {DEVICE_DATA.map((d) => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-white/40" style={{ fontWeight: 500 }}>{d.name}</span>
                      <span className="text-[11px] text-white/60" style={{ fontWeight: 700 }}>{d.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Locations */}
            <div className="p-6 rounded-2xl bg-[#111827] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[13px] text-white" style={{ fontWeight: 700 }}>Top Locations</h3>
                <MapPin className="w-4 h-4 text-white/15" strokeWidth={1.8} />
              </div>
              <div className="space-y-3">
                {GEO_DATA.map((loc, i) => (
                  <div key={loc.city} className="flex items-center gap-3">
                    <span className="text-[10px] text-white/10 w-3" style={{ fontWeight: 700 }}>{i + 1}</span>
                    <span className="text-[11px] text-white/40 flex-1" style={{ fontWeight: 500 }}>{loc.city}</span>
                    <span className="text-[12px] text-white/60" style={{ fontWeight: 700 }}>{loc.scans.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR History */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[13px] text-white" style={{ fontWeight: 700 }}>Recent QR Codes</h3>
              <a href="/qr-studio/library" className="text-[11px] text-[#E52324] hover:text-[#FF4444] transition-colors" style={{ fontWeight: 600 }}>View All &rarr;</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {HISTORY.map((code, idx) => {
                const data = encodeData(code.id === "1" ? "https://instapass.ai/summer26" : `https://instapass.ai/${code.id}`);
                const cycleFrames: FrameId[] = ["ring-red", "ring-cyan", "badge-vip", "badge-gold", "badge-purple"];
                const historyFrameId = cycleFrames[idx % cycleFrames.length];
                const historyFrame = FRAME_OPTIONS.find(f => f.id === historyFrameId)!;
                const quiet = 2;
                const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, code.fg, "#FFFFFF", "instapass", "bullseye", false, quiet);
                const frameCfg: BrandedFrameConfig = {
                  frameId: historyFrameId,
                  ctaText: historyFrame.defaultCta,
                  watermarkText: "INSTAPASS",
                  borderColor: historyFrame.borderColor,
                  accentColor: historyFrame.accentColor,
                };
                const svg = renderBrandedFrame(paths, 100, totalSize, frameCfg, "#FFFFFF");
                return (
                  <div key={code.id} className="group p-3 rounded-xl bg-[#111827] border border-white/[0.04] hover:border-[#E52324]/10 transition-all cursor-pointer">
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2" dangerouslySetInnerHTML={{ __html: svg }} />
                    <div className="text-[11px] text-white truncate" style={{ fontWeight: 600 }}>{code.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-white/15">{code.created}</span>
                      <span className="text-[10px] text-[#E52324]" style={{ fontWeight: 700 }}>{code.scans.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function Card({ title, icon, defaultOpen = true, badge, children }: {
  title: string; icon: React.ReactNode; defaultOpen?: boolean; badge?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#111827] overflow-hidden transition-all">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.01] transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E52324]/8 flex items-center justify-center text-[#E52324]">{icon}</div>
          <span className="text-[14px] text-white" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{title}</span>
          {badge && (
            <span className="text-[8px] px-2 py-0.5 rounded-md bg-[#E52324]/8 text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>{badge}</span>
          )}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-white/20" strokeWidth={2} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex items-center gap-1 text-[9px] text-white/25 uppercase tracking-[0.12em] mb-2" style={{ fontWeight: 700 }}>
      {children}
      {required && <span className="text-[#E52324]">*</span>}
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-10 h-[22px] rounded-full relative transition-colors duration-200 cursor-pointer ${active ? "bg-[#E52324]" : "bg-white/10"}`}>
      <motion.div
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ left: active ? 22 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1">
      <div className="text-[9px] text-white/15 mb-1.5 uppercase tracking-wider" style={{ fontWeight: 600 }}>{label}</div>
      <div className="flex items-center gap-2 h-[40px] px-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent shrink-0" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 bg-transparent text-[11px] text-white/50 outline-none uppercase" style={{ fontWeight: 600 }} />
      </div>
    </div>
  );
}

function PatternIcon({ pattern, color }: { pattern: PatternId; color: string }) {
  const s = 22;
  switch (pattern) {
    case "dots":
      return <svg width={s} height={s} viewBox="0 0 22 22">{[3,11,19].map(x => [3,11,19].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={color} />))}</svg>;
    case "rounded":
      return <svg width={s} height={s} viewBox="0 0 22 22">{[1,9,17].map(x => [1,9,17].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="2" fill={color} />))}</svg>;
    case "diamond":
      return <svg width={s} height={s} viewBox="0 0 22 22">{[[4,11],[11,4],[18,11],[11,18]].map(([cx,cy]) => <polygon key={`${cx}-${cy}`} points={`${cx},${cy!-3} ${cx!+3},${cy} ${cx},${cy!+3} ${cx!-3},${cy}`} fill={color} />)}</svg>;
    case "square":
      return <svg width={s} height={s} viewBox="0 0 22 22">{[1,9,17].map(x => [1,9,17].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill={color} />))}</svg>;
    default:
      return <svg width={s} height={s} viewBox="0 0 22 22">{[1,9,17].map(x => [1,9,17].map(y => <g key={`${x}-${y}`}><rect x={x} y={y} width="5" height="5" rx="1.5" fill={color} /><rect x={x+1.5} y={y+1.5} width="2" height="2" rx="0.5" fill="#111827" /></g>))}</svg>;
  }
}

function CornerIcon({ corner, color }: { corner: CornerId; color: string }) {
  const bg = "#111827";
  switch (corner) {
    case "bullseye":
      return <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="11" fill={color} /><circle cx="13" cy="13" r="7.5" fill={bg} /><circle cx="13" cy="13" r="4.5" fill={color} /></svg>;
    case "rounded":
      return <svg width="26" height="26" viewBox="0 0 26 26"><rect x="2" y="2" width="22" height="22" rx="6" fill={color} /><rect x="5.5" y="5.5" width="15" height="15" rx="4" fill={bg} /><rect x="9" y="9" width="8" height="8" rx="2.5" fill={color} /></svg>;
    default:
      return <svg width="26" height="26" viewBox="0 0 26 26"><rect x="2" y="2" width="22" height="22" fill={color} /><rect x="5.5" y="5.5" width="15" height="15" fill={bg} /><rect x="9" y="9" width="8" height="8" fill={color} /></svg>;
  }
}
