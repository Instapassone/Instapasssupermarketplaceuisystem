import { useState, useEffect, useCallback, useRef } from "react";
import instapassLogo from "@/imports/D50BDFD6-0957-4C5A-80DB-EFED2AA647F4.png";
import { motion, AnimatePresence } from "motion/react";
import { Toaster, toast } from "sonner";
import QrScanner from "qr-scanner";
import { QRCodeSVG } from "qrcode.react";
import {
  Check, X, AlertTriangle, Search, Camera, Settings,
  Shield, Clock, User, Trash2, Wifi, WifiOff,
  ChevronDown, Activity, Lock, Zap, RefreshCw, ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanStatus    = "valid" | "duplicate" | "invalid";
type AppTab        = "route" | "validation" | "history";
type CameraStatus  = "idle" | "requesting" | "active" | "result" | "error";
type CameraError   = "permission" | "no_camera" | "unknown" | null;

interface AppEvent {
  id: string;
  name: string;
  venue: string;
  date: string;
  capacity: number;
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  section: string;
  seat: string;
  tier: "GA" | "VIP" | "Premium" | "Backstage" | "Artist" | "Staff";
  orderNum: string;
}

interface ScanEntry {
  entryId: string;
  ticket: Ticket | null;
  status: ScanStatus;
  scannedAt: Date;
  gate: string;
  reason?: string;
  fromCamera?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EVENTS: AppEvent[] = [
  { id: "evt_demo_01", name: "The Weeknd – After Hours Tour", venue: "Madison Square Garden", date: "Sat Jun 7 · 8 PM",  capacity: 530 },
  { id: "evt_demo_02", name: "Dave Chappelle – Block Party",  venue: "Radio City Music Hall",  date: "Fri Jun 6 · 9 PM",  capacity: 310 },
  { id: "evt_demo_03", name: "Coachella – Main Stage Day 3",  venue: "Empire Polo Club",        date: "Sun Apr 21 · 6 PM", capacity: 880 },
];

const TICKETS: Ticket[] = [
  { id: "TKT-8472-XK9", name: "Marcus Williams",  email: "marcus.w@gmail.com",  ticketType: "VIP Floor",         section: "VIP-A",    seat: "F2",  tier: "VIP",       orderNum: "ORD-291847" },
  { id: "TKT-3891-MN2", name: "Sofia Chen",        email: "sofia.c@icloud.com",  ticketType: "General Admission", section: "GA-3",     seat: "GA",  tier: "GA",        orderNum: "ORD-384021" },
  { id: "TKT-5521-PQ7", name: "Jordan Reed",       email: "j.reed@outlook.com",  ticketType: "VIP Floor",         section: "VIP-B",    seat: "B11", tier: "VIP",       orderNum: "ORD-119034" },
  { id: "TKT-7743-RR4", name: "Priya Nair",        email: "priya.n@gmail.com",   ticketType: "Premium Seated",    section: "PREM-102", seat: "R4",  tier: "Premium",   orderNum: "ORD-500281" },
  { id: "TKT-2219-AA1", name: "Ethan Brooks",      email: "ethan.b@gmail.com",   ticketType: "General Admission", section: "GA-7",     seat: "GA",  tier: "GA",        orderNum: "ORD-673910" },
  { id: "TKT-6634-BB8", name: "Zoe Martinez",      email: "zoe.m@yahoo.com",     ticketType: "Backstage Pass",    section: "BST",      seat: "–",   tier: "Backstage", orderNum: "ORD-002918" },
  { id: "TKT-9901-CC3", name: "Aiden Park",        email: "a.park@gmail.com",    ticketType: "VIP Floor",         section: "VIP-C",    seat: "C3",  tier: "VIP",       orderNum: "ORD-748302" },
  { id: "TKT-4477-DD5", name: "Isabella Turner",   email: "i.turner@gmail.com",  ticketType: "General Admission", section: "GA-11",    seat: "GA",  tier: "GA",        orderNum: "ORD-830047" },
  { id: "TKT-1123-EE7", name: "Liam Okafor",       email: "l.okafor@gmail.com",  ticketType: "Premium Seated",    section: "PREM-204", seat: "P7",  tier: "Premium",   orderNum: "ORD-291003" },
  { id: "TKT-7760-FF2", name: "Camille Dubois",    email: "c.dubois@gmail.com",  ticketType: "VIP Floor",         section: "VIP-A",    seat: "A9",  tier: "VIP",       orderNum: "ORD-571829" },
];

const GATES = ["Gate A", "Gate B", "Gate C", "Gate D", "VIP Entrance", "Staff Entry"];

const INVALID_REASONS = [
  "Wrong event — ticket not valid for this show",
  "Ticket has been refunded and is no longer active",
  "QR code data is corrupted or tampered",
  "Ticket not found in system",
];

const OVERRIDE_REASONS = [
  "Valid guest — ticket update pending",
  "Known duplicate — same party entry",
  "System error — re-scan approved",
  "Guest list addition",
  "VIP exception granted",
  "Media / Press access",
];

const MODES = [
  { id: "GA",        label: "General Admission", color: "#3B82F6" },
  { id: "VIP",       label: "VIP",               color: "#8B5CF6" },
  { id: "Artist",    label: "Artist",             color: "#F97316" },
  { id: "Staff",     label: "Staff",              color: "#64748B" },
  { id: "Media",     label: "Media",              color: "#06B6D4" },
  { id: "Backstage", label: "Backstage",          color: "#F43F5E" },
];

const TEST_QRS = [
  { value: "VALID_TICKET_001",   label: "Valid Entry",     status: "valid"     as ScanStatus, color: "#22c55e" },
  { value: "USED_TICKET_001",    label: "Already Used",    status: "duplicate" as ScanStatus, color: "#facc15" },
  { value: "INVALID_TICKET_001", label: "Invalid Ticket",  status: "invalid"   as ScanStatus, color: "#ef4444" },
];

// ─── Audio ────────────────────────────────────────────────────────────────────

function playOsc(freq: number, delay: number, dur: number, type: OscillatorType = "sine", vol = 0.2) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = type;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + delay + dur + 0.05);
  } catch { /* graceful */ }
}

const sfx = {
  valid:     () => { playOsc(880, 0, 0.1); playOsc(1320, 0.09, 0.18, "sine", 0.18); },
  duplicate: () => { playOsc(480, 0, 0.1, "square", 0.14); playOsc(480, 0.22, 0.1, "square", 0.12); },
  invalid:   () => { playOsc(220, 0, 0.12, "sawtooth", 0.13); playOsc(160, 0.1, 0.28, "sawtooth", 0.1); },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt      = (d: Date) => d.toLocaleString("en-US", { month:"short", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
const fmtShort = (d: Date) => d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
const initials = (name: string) => name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

// ─── Status Config ────────────────────────────────────────────────────────────

const SC = {
  valid:     { label:"ENTRY APPROVED",      color:"#22c55e", bg:"bg-green-500/10",  border:"border-green-500/20",  text:"text-green-400",  dot:"bg-green-400",  glow:"0 0 30px rgba(34,197,94,0.4)"   },
  duplicate: { label:"TICKET ALREADY USED", color:"#facc15", bg:"bg-yellow-500/10", border:"border-yellow-500/20", text:"text-yellow-400", dot:"bg-yellow-400", glow:"0 0 30px rgba(250,204,21,0.4)"  },
  invalid:   { label:"INVALID TICKET",      color:"#ef4444", bg:"bg-red-500/10",    border:"border-red-500/20",    text:"text-red-400",    dot:"bg-red-400",    glow:"0 0 30px rgba(239,68,68,0.4)"   },
};

// ─── Mock Validation ──────────────────────────────────────────────────────────

let ticketRoundRobin = 0;

async function mockValidate(qrData: string, event: AppEvent, gate: string): Promise<ScanEntry> {
  // Simulate ~120ms network latency
  await new Promise(r => setTimeout(r, 80 + Math.random() * 100));

  const up = qrData.toUpperCase().trim();
  let status: ScanStatus;
  let ticket: Ticket | null = null;
  let reason: string | undefined;

  // First try exact ticket ID match
  const exactMatch = TICKETS.find(t => t.id === qrData || t.orderNum === qrData);
  if (exactMatch) {
    return { entryId: `qr_${Date.now()}`, ticket: exactMatch, status: "valid", scannedAt: new Date(), gate, fromCamera: true };
  }

  // Keyword-based mock routing (for test QR codes)
  if (up.includes("VALID") && !up.includes("INVALID")) {
    status = "valid";
    ticket = TICKETS[ticketRoundRobin % TICKETS.length];
    ticketRoundRobin++;
  } else if (up.includes("USED") || up.includes("DUPLICATE") || up.includes("ALREADY")) {
    status = "duplicate";
    ticket = TICKETS[ticketRoundRobin % TICKETS.length];
    ticketRoundRobin++;
  } else if (up.includes("INVALID") || up.includes("FAKE") || up.includes("REFUND")) {
    status = "invalid";
    reason = INVALID_REASONS[Math.floor(Math.random() * INVALID_REASONS.length)];
  } else {
    // Unknown QR — treat as invalid
    status = "invalid";
    reason = "QR code not recognized in system for event " + event.id;
  }

  return {
    entryId: `qr_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
    ticket,
    status,
    scannedAt: new Date(),
    gate,
    reason,
    fromCamera: true,
  };
}

// ─── Corner Frame Overlay ─────────────────────────────────────────────────────

function CornerFrame({ active }: { active: boolean }) {
  const color = active ? "#ef4444" : "#334155";
  const glow  = active ? `0 0 12px ${color}cc` : "none";
  const size  = 220;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {(["tl","tr","bl","br"] as const).map(pos => {
        const isB = pos.startsWith("b"), isR = pos.endsWith("r");
        return (
          <div key={pos} className="absolute"
            style={{ top:isB?"auto":0, bottom:isB?0:"auto", left:isR?"auto":0, right:isR?0:"auto" }}>
            <div style={{ position:"absolute", top:isB?"auto":0, bottom:isB?0:"auto", left:isR?"auto":0, right:isR?0:"auto", width:30, height:3, borderRadius:9, backgroundColor:color, boxShadow:glow, transition:"all 0.4s" }} />
            <div style={{ position:"absolute", top:isB?"auto":0, bottom:isB?0:"auto", left:isR?"auto":0, right:isR?0:"auto", width:3, height:30, borderRadius:9, backgroundColor:color, boxShadow:glow, transition:"all 0.4s" }} />
          </div>
        );
      })}
      {active && (
        <motion.div
          style={{ position:"absolute", left:0, right:0, top:0, height:2, background:"linear-gradient(to right,transparent,#ef444440 20%,#ef4444 50%,#ef444440 80%,transparent)", boxShadow:"0 0 14px #ef4444,0 0 28px #ef444460" }}
          animate={{ y:[8,210] }}
          transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut", repeatType:"reverse" }}
        />
      )}
    </div>
  );
}

// ─── QR Scanner View ─────────────────────────────────────────────────────────

function QRScannerView({
  onScanResult, event, gate,
}: {
  onScanResult: (e: ScanEntry) => void;
  event: AppEvent;
  gate: string;
}) {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const scannerRef    = useRef<QrScanner | null>(null);
  const processingRef = useRef(false);
  const wakeLockRef   = useRef<{ release: () => void } | null>(null);

  const [camStatus,    setCamStatus]    = useState<CameraStatus>("idle");
  const [camError,     setCamError]     = useState<CameraError>(null);
  const [scanResult,   setScanResult]   = useState<ScanEntry | null>(null);
  const [hasFlash,     setHasFlash]     = useState(false);
  const [flashOn,      setFlashOn]      = useState(false);
  const [cameras,      setCameras]      = useState<QrScanner.Camera[]>([]);
  const [facingMode,   setFacingMode]   = useState<"environment"|"user">("environment");
  const [hasCamSupport,setHasCamSupport]= useState<boolean | null>(null);
  const [processing,   setProcessing]   = useState(false);

  // Check camera availability once on mount
  useEffect(() => {
    QrScanner.hasCamera()
      .then(has => setHasCamSupport(has))
      .catch(() => setHasCamSupport(false));
    return () => {
      scannerRef.current?.destroy();
      wakeLockRef.current?.release();
    };
  }, []);

  const handleQRData = useCallback(async (data: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);

    scannerRef.current?.pause(true);

    const entry = await mockValidate(data, event, gate);

    sfx[entry.status]();
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(entry.status === "valid" ? [60] : entry.status === "duplicate" ? [60, 80, 60] : [100, 60, 100]);
    }

    setScanResult(entry);
    setCamStatus("result");
    setProcessing(false);
    onScanResult(entry);

    const delay = entry.status === "valid" ? 1800 : 2600;
    setTimeout(() => {
      if (scannerRef.current) {
        scannerRef.current.start().catch(() => {});
      }
      setCamStatus("active");
      setScanResult(null);
      processingRef.current = false;
    }, delay);
  }, [event, gate, onScanResult]);

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCamStatus("requesting");
    setCamError(null);

    try {
      const scanner = new QrScanner(
        videoRef.current,
        (result: QrScanner.ScanResult) => handleQRData(result.data),
        {
          preferredCamera:         "environment",
          highlightScanRegion:     false, // we draw our own overlay
          highlightCodeOutline:    false,
          maxScansPerSecond:       10,
          returnDetailedScanResult: true,
        }
      );
      scannerRef.current = scanner;

      // Populate camera list
      QrScanner.listCameras(true)
        .then(list => setCameras(list))
        .catch(() => {});

      await scanner.start();
      setCamStatus("active");

      scanner.hasFlash()
        .then(f => setHasFlash(f))
        .catch(() => {});

      // Screen wake lock (prevent sleep while scanning)
      try {
        if ("wakeLock" in navigator) {
          const wl = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<{ release: () => void }> } }).wakeLock.request("screen");
          wakeLockRef.current = wl;
        }
      } catch { /* not supported on all platforms */ }

    } catch (err) {
      scannerRef.current?.destroy();
      scannerRef.current = null;
      const name = (err as Error).name ?? "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") setCamError("permission");
      else if (name === "NotFoundError" || name === "DevicesNotFoundError") setCamError("no_camera");
      else setCamError("unknown");
      setCamStatus("error");
    }
  }, [handleQRData]);

  const stopCamera = useCallback(() => {
    scannerRef.current?.destroy();
    scannerRef.current = null;
    processingRef.current = false;
    wakeLockRef.current?.release();
    wakeLockRef.current = null;
    setCamStatus("idle");
    setScanResult(null);
    setFlashOn(false);
    setProcessing(false);
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!scannerRef.current || !hasFlash) return;
    try {
      await scannerRef.current.toggleFlash();
      setFlashOn(v => !v);
    } catch { /* not supported */ }
  }, [hasFlash]);

  const flipCamera = useCallback(async () => {
    if (!scannerRef.current || cameras.length < 2) return;
    try {
      const next: "environment" | "user" = facingMode === "environment" ? "user" : "environment";
      await scannerRef.current.setCamera(next);
      setFacingMode(next);
    } catch { /* ignore */ }
  }, [cameras, facingMode]);

  const isLive = camStatus === "active" || camStatus === "result";
  const c = scanResult ? SC[scanResult.status] : null;

  return (
    <div className="relative flex-1 bg-black overflow-hidden" style={{ minHeight: 280 }}>
      {/* ── Live video feed ────────────────────────────────────── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        style={{ opacity: isLive ? 1 : 0, transition: "opacity 0.3s" }}
      />

      {/* ── Idle state ─────────────────────────────────────────── */}
      {camStatus === "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#070707]">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage:"linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
          <motion.img src={instapassLogo} alt="" className="object-contain select-none pointer-events-none"
            style={{ height:64, width:"auto", opacity:0.18 }}
            animate={{ opacity:[0.18,0.12,0.18] }} transition={{ duration:3, repeat:Infinity }} />
          {hasCamSupport === false ? (
            <div className="text-center px-6">
              <Camera className="w-7 h-7 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm font-semibold">No Camera Detected</p>
              <p className="text-slate-600 text-xs mt-1">Camera unavailable on this device.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="text-center">
                <p className="text-slate-300 text-sm font-semibold">Camera ready</p>
                <p className="text-slate-600 text-xs mt-0.5">Tap to begin scanning</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg"
                style={{ boxShadow:"0 0 24px rgba(239,68,68,0.4)" }}
              >
                <Camera className="w-4 h-4" /> Start Camera
              </motion.button>
            </div>
          )}
        </div>
      )}

      {/* ── Requesting / initializing ──────────────────────────── */}
      {camStatus === "requesting" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#070707]">
          <motion.div className="w-10 h-10 rounded-full border-2 border-white/15 border-t-red-500"
            animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease:"linear" }} />
          <div className="text-center">
            <p className="text-slate-300 text-sm font-semibold">Initializing camera…</p>
            <p className="text-slate-600 text-xs mt-0.5">Please allow camera access when prompted</p>
          </div>
        </div>
      )}

      {/* ── Error states ───────────────────────────────────────── */}
      {camStatus === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#070707] px-8 text-center">
          {camError === "permission" ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Camera Permission Required</p>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  InstaPass needs camera access to scan QR codes.<br />
                  Allow camera in browser settings, then try again.
                </p>
              </div>
            </>
          ) : camError === "no_camera" ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                <Camera className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">No Camera Found</p>
                <p className="text-slate-500 text-xs mt-1.5">Check that your device has a working camera.</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Camera Unavailable</p>
                <p className="text-slate-500 text-xs mt-1.5">
                  Could not access the camera. Try manual lookup or reload the page.
                </p>
              </div>
            </>
          )}
          <button onClick={startCamera}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors">
            Try Again
          </button>
        </div>
      )}

      {/* ── Processing flash ────────────────────────────────────── */}
      {processing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
          <motion.div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white"
            animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease:"linear" }} />
        </div>
      )}

      {/* ── Live scan overlay ──────────────────────────────────── */}
      {isLive && camStatus !== "result" && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background:"radial-gradient(ellipse 68% 68% at 50% 50%,transparent 38%,rgba(0,0,0,0.55) 100%)" }} />
          {/* Corner frame, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CornerFrame active={true} />
          </div>
          {/* "READY" pill */}
          <div className="absolute bottom-14 left-0 right-0 flex justify-center">
            <motion.div
              className="flex items-center gap-2 bg-black/65 backdrop-blur-sm border border-white/[0.1] rounded-full px-4 py-1.5"
              animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.6, repeat:Infinity }}
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-red-400"
                animate={{ scale:[1,1.6,1] }} transition={{ duration:1.6, repeat:Infinity }} />
              <span className="text-white text-[11px] font-semibold tracking-wide">READY TO SCAN</span>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Scan result fullscreen overlay ───────────────────────  */}
      <AnimatePresence>
        {camStatus === "result" && scanResult && c && (
          <motion.div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
            style={{ backgroundColor: `${c.color}16` }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.12 }}
          >
            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background:`radial-gradient(ellipse 130% 90% at 50% 20%,${c.color}28 0%,transparent 60%)` }} />

            {/* Icon ring */}
            <motion.div
              className="relative z-10 rounded-full flex items-center justify-center"
              style={{ width:128, height:128, backgroundColor:`${c.color}18`, boxShadow:`0 0 0 20px ${c.color}10,0 0 90px ${c.color}55` }}
              initial={{ scale:0, rotate:-15 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:"spring", stiffness:480, damping:22 }}
            >
              <div className="rounded-full flex items-center justify-center" style={{ width:80, height:80, backgroundColor:c.color }}>
                {scanResult.status === "valid"     && <Check         className="text-white" width={40} height={40} strokeWidth={3} />}
                {scanResult.status === "duplicate" && <AlertTriangle className="text-white" width={34} height={34} strokeWidth={2.5} />}
                {scanResult.status === "invalid"   && <X             className="text-white" width={40} height={40} strokeWidth={3} />}
              </div>
            </motion.div>

            {/* Big status word */}
            <motion.div
              className="relative z-10 font-black tracking-tighter text-center leading-none mt-5"
              style={{ fontSize:"clamp(64px,18vw,96px)", color:c.color, fontFamily:"var(--font-sans)" }}
              initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
              transition={{ type:"spring", stiffness:400, damping:22, delay:0.05 }}
            >
              {scanResult.status === "valid" ? "VALID" : scanResult.status === "duplicate" ? "USED" : "INVALID"}
            </motion.div>

            {/* Attendee card */}
            {scanResult.ticket && (
              <motion.div className="relative z-10 flex items-center gap-3 mt-5 px-5 py-3 rounded-2xl border max-w-xs w-full mx-4"
                style={{ backgroundColor:`${c.color}12`, borderColor:`${c.color}30` }}
                initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.14, type:"spring", stiffness:320, damping:28 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0"
                  style={{ backgroundColor:`${c.color}28`, color:c.color }}>
                  {initials(scanResult.ticket.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-bold text-base leading-tight truncate">{scanResult.ticket.name}</div>
                  <div className="text-white/50 text-xs mt-0.5 truncate">{scanResult.ticket.ticketType} · {scanResult.ticket.section}</div>
                </div>
              </motion.div>
            )}

            {/* Invalid reason */}
            {scanResult.reason && (
              <motion.p className="relative z-10 text-red-400/80 text-xs text-center mt-3 px-8 leading-relaxed max-w-xs"
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
                {scanResult.reason}
              </motion.p>
            )}

            {/* Auto-resume bar */}
            <motion.div className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: c.color }}
              initial={{ scaleX:1, transformOrigin:"left" }}
              animate={{ scaleX:0 }}
              transition={{ duration: scanResult.status === "valid" ? 1.8 : 2.6, ease:"linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Camera controls bar ────────────────────────────────── */}
      {isLive && (
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2.5"
          style={{ background:"linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 100%)" }}>
          {/* Flash + flip */}
          <div className="flex gap-2">
            {hasFlash && (
              <button onClick={toggleFlash}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  flashOn ? "bg-yellow-500/25 border-yellow-500/50" : "bg-black/50 border-white/15 backdrop-blur-sm"
                }`}>
                <Zap className={`w-4 h-4 ${flashOn ? "text-yellow-400" : "text-white/70"}`} />
              </button>
            )}
            {cameras.length > 1 && (
              <button onClick={flipCamera}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/15 bg-black/50 backdrop-blur-sm">
                <RefreshCw className="w-4 h-4 text-white/70" />
              </button>
            )}
          </div>
          {/* Stop */}
          <button onClick={stopCamera}
            className="px-4 py-1.5 bg-black/60 backdrop-blur-sm border border-white/15 rounded-xl text-white text-xs font-bold">
            Stop Camera
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Test QR Panel ────────────────────────────────────────────────────────────

function TestQRPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#0d0d0d]">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/[0.07] flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-white/40" />
          </div>
          <span className="text-slate-500 text-xs font-semibold">Test QR Codes</span>
          <span className="text-slate-700 text-[10px]">— scan these to test validation</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <p className="text-slate-700 text-[9px] mb-3 leading-relaxed">
                Display these QR codes on a second device or print them, then scan with the camera above to test the full validation flow.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {TEST_QRS.map(({ value, label, color }) => (
                  <div key={value} className="flex flex-col items-center gap-1.5">
                    <div className="p-2 rounded-xl border"
                      style={{ backgroundColor:"#fff", borderColor:`${color}30` }}>
                      <QRCodeSVG value={value} size={72} bgColor="#ffffff" fgColor="#000000" level="M" />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold" style={{ color }}>{label}</div>
                      <div className="text-[9px] font-mono text-slate-700 mt-0.5 break-all">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Manual Lookup Panel ──────────────────────────────────────────────────────

function ManualLookupPanel({ onApprove }: { onApprove: (t: Ticket) => void }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState<"name"|"email"|"id">("name");

  const results = query.length >= 2
    ? TICKETS.filter(t => {
        const q = query.toLowerCase();
        return field === "name"  ? t.name.toLowerCase().includes(q)
             : field === "email" ? t.email.toLowerCase().includes(q)
             : t.id.toLowerCase().includes(q);
      })
    : [];

  return (
    <div className="flex-shrink-0 border-t border-white/[0.06] bg-[#0d0d0d]">
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-white text-xs font-bold">Manual Lookup</span>
        <div className="flex gap-0.5">
          {(["name","email","id"] as const).map(f => (
            <button key={f} onClick={() => setField(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                field === f ? "bg-red-600 text-white" : "text-slate-600 hover:text-slate-300"
              }`}>
              {f === "id" ? "ID" : f === "name" ? "Name" : "Email"}
            </button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Name, email, or ticket ID"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-white text-xs placeholder:text-slate-700 focus:outline-none focus:border-red-600/40 transition-all" />
          </div>
          <button className="px-4 py-2 bg-white/[0.06] border border-white/[0.09] hover:bg-white/[0.09] text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0">
            Search
          </button>
        </div>
        {query.length > 0 && query.length < 2 && (
          <p className="text-slate-700 text-[10px] mt-1.5">Enter at least two characters.</p>
        )}
        {query.length >= 2 && results.length === 0 && (
          <p className="text-slate-600 text-[10px] mt-1.5">No matching tickets found.</p>
        )}
        {results.length > 0 && (
          <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
            {results.map(t => (
              <div key={t.id} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{t.name}</div>
                  <div className="text-slate-600 text-[10px] font-mono">{t.id}</div>
                </div>
                <span className="text-slate-500 text-[10px] hidden sm:block truncate max-w-[100px]">{t.ticketType}</span>
                <button onClick={() => { onApprove(t); setQuery(""); }}
                  className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded-md transition-colors flex-shrink-0">
                  Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Validation Result Panel ──────────────────────────────────────────────────

function ValidationResultPanel({ lastScan, onOverride }: {
  lastScan: ScanEntry | null;
  onOverride: (e: ScanEntry) => void;
}) {
  const c  = lastScan ? SC[lastScan.status] : null;
  const tk = lastScan?.ticket ?? null;

  const fields = [
    { label:"ATTENDEE",  val: tk?.name          ?? "—", mono:false },
    { label:"EVENT",     val: tk?.ticketType    ?? "—", mono:false },
    { label:"TICKET",    val: tk ? `${tk.section}${tk.seat !== "GA" && tk.seat !== "–" ? " · " + tk.seat : ""}` : "—", mono:true },
    { label:"SCAN TIME", val: lastScan ? fmt(lastScan.scannedAt) : "—", mono:true },
  ];

  return (
    <div className="px-4 pt-4 pb-3 space-y-3">
      {/* Status badge */}
      <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all ${
        c ? `${c.bg} ${c.border}` : "bg-white/[0.03] border-white/[0.06]"
      }`}>
        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${c ? c.bg : "bg-white/[0.06]"}`}>
          {!lastScan                      && <Activity       className="w-3.5 h-3.5 text-slate-600" />}
          {lastScan?.status === "valid"     && <Check         className="w-3.5 h-3.5 text-green-400"  strokeWidth={2.5} />}
          {lastScan?.status === "duplicate" && <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" strokeWidth={2.5} />}
          {lastScan?.status === "invalid"   && <X             className="w-3.5 h-3.5 text-red-400"    strokeWidth={2.5} />}
        </div>
        <span className={`text-xs font-bold tracking-widest uppercase flex-1 ${c ? c.text : "text-slate-600"}`}>
          {c ? c.label : "AWAITING SCAN"}
        </span>
        {lastScan && (
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${c?.dot}`} style={{ boxShadow:c?.glow }} />
        )}
      </div>

      {/* Field table */}
      <div className="border border-white/[0.06] rounded-xl overflow-hidden">
        {fields.map(({ label, val, mono }, i) => (
          <div key={label} className={`flex items-start gap-3 px-3 py-2.5 ${i > 0 ? "border-t border-white/[0.05]" : ""}`}>
            <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold w-20 flex-shrink-0 pt-0.5">{label}</span>
            <span className={`text-xs flex-1 break-all ${lastScan ? "text-white font-semibold" : "text-slate-700"} ${mono ? "font-mono text-[10px]" : ""}`}>{val}</span>
          </div>
        ))}
      </div>

      {tk && (
        <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/[0.05] rounded-lg">
          <span className="text-[9px] text-slate-600 uppercase tracking-widest">Ticket ID</span>
          <span className="text-[10px] font-mono text-slate-400">{tk.id}</span>
        </div>
      )}

      {lastScan?.reason && (
        <div className="px-3 py-2 bg-red-500/[0.06] border border-red-500/15 rounded-lg">
          <p className="text-red-400 text-[10px] leading-relaxed">{lastScan.reason}</p>
        </div>
      )}

      {lastScan?.status === "duplicate" && (
        <button onClick={() => onOverride(lastScan)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 text-xs font-bold hover:bg-yellow-500/15 transition-colors">
          <Shield className="w-3.5 h-3.5" /> Manager Override
        </button>
      )}
      {lastScan?.status === "invalid" && (
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors">
          <Search className="w-3.5 h-3.5" /> Manual Lookup
        </button>
      )}

      {tk && (
        <div className="flex justify-end">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ backgroundColor:`${SC[lastScan!.status].color}22`, color:SC[lastScan!.status].color, boxShadow:SC[lastScan!.status].glow }}>
            {initials(tk.name)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Scan History Panel ───────────────────────────────────────────────────────

function ScanHistoryPanel({ history, onClear }: { history: ScanEntry[]; onClear: () => void }) {
  const [filter, setFilter] = useState<"all"|ScanStatus>("all");
  const displayed = filter === "all" ? history : history.filter(e => e.status === filter);

  return (
    <div className="flex flex-col min-h-0 flex-1 border-t border-white/[0.06]">
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-xs font-bold">Scan History</span>
          <div className="flex gap-0.5">
            {(["all","valid","duplicate","invalid"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-colors ${
                  filter === f
                    ? f==="all" ? "bg-white/10 text-white" : f==="valid" ? "bg-green-500/15 text-green-400" : f==="duplicate" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"
                    : "text-slate-700 hover:text-slate-400"
                }`}>
                {f === "all" ? "All" : f === "valid" ? "✓" : f === "duplicate" ? "⚠" : "✕"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onClear}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-500 hover:text-white text-[10px] font-semibold transition-colors">
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <p className="text-slate-600 text-xs">
              {history.length === 0 ? "0 scans in this session" : "No scans match this filter"}
            </p>
          </div>
        ) : (
          <div className="px-3 pb-3 space-y-1">
            {displayed.map(entry => {
              const c = SC[entry.status];
              return (
                <motion.div key={entry.entryId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.04] transition-colors"
                  initial={{ opacity:0, y:-3 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.18 }}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    {entry.status === "valid"     && <Check         className={`w-2.5 h-2.5 ${c.text}`} strokeWidth={2.5} />}
                    {entry.status === "duplicate" && <AlertTriangle className={`w-2.5 h-2.5 ${c.text}`} strokeWidth={2.5} />}
                    {entry.status === "invalid"   && <X             className={`w-2.5 h-2.5 ${c.text}`} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-[11px] font-semibold leading-none truncate">{entry.ticket?.name ?? "Unknown"}</div>
                    <div className="text-slate-700 text-[9px] font-mono mt-0.5 truncate flex items-center gap-1">
                      {entry.ticket?.id ?? "—"}
                      {entry.fromCamera && <span className="text-slate-800">· 📷</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-[9px] font-bold uppercase ${c.text}`}>
                      {entry.status === "valid" ? "Valid" : entry.status === "duplicate" ? "Used" : "Inv."}
                    </div>
                    <div className="text-slate-700 text-[9px] font-mono">{fmtShort(entry.scannedAt)}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Header ───────────────────────────────────────────────────────────────

function AppHeader({ tab, onTabChange, isOnline, event, events, onEventChange }: {
  tab: AppTab; onTabChange: (t: AppTab) => void;
  isOnline: boolean;
  event: AppEvent; events: AppEvent[]; onEventChange: (e: AppEvent) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);

  const TABS: { id: AppTab; label: string }[] = [
    { id:"route",      label:"Entry Route"     },
    { id:"validation", label:"Live Validation" },
    { id:"history",    label:"Session History" },
  ];

  return (
    <header className="flex-shrink-0 bg-[#0d0d0d] border-b border-white/[0.07]">
      <div className="flex items-center justify-between px-5 h-12">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <img src={instapassLogo} alt="InstaPass" style={{ height:24, width:"auto", objectFit:"contain" }} />
          <span className="text-white font-bold text-sm tracking-tight hidden sm:block">InstaPass Scanner</span>
        </div>
        <nav className="flex items-center">
          {TABS.map(({ id, label }) => (
            <button key={id} onClick={() => onTabChange(id)}
              className={`relative px-4 py-2 text-xs font-semibold tracking-wide transition-colors ${
                tab === id ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}>
              {label}
              {tab === id && (
                <motion.div className="absolute bottom-0 left-3 right-3 h-px rounded-full bg-red-500"
                  layoutId="tabLine" transition={{ type:"spring", stiffness:500, damping:35 }} />
              )}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest border ${
            isOnline ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isOnline ? "ONLINE" : "OFFLINE"}</span>
          </div>
          <button className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Event ID bar */}
      <div className="flex items-center gap-3 px-5 py-2 border-t border-white/[0.04]">
        <span className="text-slate-600 text-[10px] font-bold tracking-widest uppercase flex-shrink-0">Event ID :</span>
        <div className="relative">
          <button onClick={() => setShowPicker(v => !v)}
            className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 hover:bg-white/[0.06] transition-colors">
            <span className="text-white text-xs font-mono">{event.id}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          <AnimatePresence>
            {showPicker && (
              <motion.div className="absolute top-full left-0 mt-1 w-80 bg-[#161616] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl z-50"
                initial={{ opacity:0, y:-6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-6, scale:0.97 }} transition={{ duration:0.12 }}>
                <div className="p-1.5">
                  {events.map(e => (
                    <button key={e.id} onClick={() => { onEventChange(e); setShowPicker(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] text-left transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.id === event.id ? "bg-red-500" : "bg-white/20"}`} />
                      <div>
                        <div className="text-white text-xs font-semibold">{e.name}</div>
                        <div className="text-slate-500 text-[10px] font-mono mt-0.5">{e.id} · {e.venue}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-colors">Set</button>
        <div className="ml-auto hidden md:flex items-center gap-3 text-[10px] text-slate-700 font-mono">
          <span>{event.venue}</span><span className="text-slate-800">·</span><span>{event.date}</span>
        </div>
      </div>
    </header>
  );
}

// ─── Entry Route Tab ──────────────────────────────────────────────────────────

function EntryRouteTab({ gate, onGateChange, event, operatorName, onOperatorChange }: {
  gate: string; onGateChange: (g: string) => void;
  event: AppEvent; operatorName: string; onOperatorChange: (n: string) => void;
}) {
  const [mode, setMode] = useState("GA");
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-3">Active Event</div>
          <div className="text-white font-bold text-base leading-tight">{event.name}</div>
          <div className="text-slate-400 text-sm mt-1">{event.venue} · {event.date}</div>
          <div className="mt-3 flex gap-6">
            <div><div className="text-slate-700 text-[9px] uppercase tracking-widest">Capacity</div><div className="text-white font-bold text-sm">{event.capacity.toLocaleString()}</div></div>
            <div><div className="text-slate-700 text-[9px] uppercase tracking-widest">Event ID</div><div className="text-slate-300 font-mono text-sm">{event.id}</div></div>
          </div>
        </div>
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-3">Gate Assignment</div>
          <div className="grid grid-cols-3 gap-2">
            {GATES.map(g => (
              <button key={g} onClick={() => onGateChange(g)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  gate === g ? "bg-red-600 border-red-600 text-white" : "bg-white/[0.04] border-white/[0.07] text-slate-400 hover:bg-white/[0.07]"
                }`}>{g}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-3">Access Level</div>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  mode === m.id ? "text-white" : "bg-white/[0.04] border-white/[0.07] text-slate-400 hover:bg-white/[0.07]"
                }`}
                style={mode === m.id ? { backgroundColor:`${m.color}20`, borderColor:`${m.color}40`, color:m.color } : {}}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[#111111] border border-white/[0.08] rounded-2xl p-5">
          <div className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-3">Operator</div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
            <input value={operatorName} onChange={e => onOperatorChange(e.target.value)} placeholder="Your name…"
              className="w-full bg-white/[0.04] border border-white/[0.09] rounded-xl pl-9 pr-3 py-3 text-white text-sm placeholder:text-slate-700 focus:outline-none focus:border-red-600/40 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Session History Tab ──────────────────────────────────────────────────────

function SessionHistoryTab({ history, onClear }: { history: ScanEntry[]; onClear: () => void }) {
  const [filter, setFilter] = useState<"all"|ScanStatus>("all");
  const displayed = filter === "all" ? history : history.filter(e => e.status === filter);
  const stats = { total:history.length, valid:history.filter(e=>e.status==="valid").length, duplicate:history.filter(e=>e.status==="duplicate").length, invalid:history.filter(e=>e.status==="invalid").length };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-shrink-0 flex items-center gap-5 px-6 py-3 border-b border-white/[0.06]">
        {[{label:"Total",val:stats.total,color:"text-white"},{label:"Valid",val:stats.valid,color:"text-green-400"},{label:"Used",val:stats.duplicate,color:"text-yellow-400"},{label:"Invalid",val:stats.invalid,color:"text-red-400"}].map(s => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold ${s.color}`}>{s.val}</span>
            <span className="text-slate-600 text-[10px] uppercase tracking-widest">{s.label}</span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex gap-1">
          {(["all","valid","duplicate","invalid"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                filter === f
                  ? f==="all" ? "bg-white/10 border-white/20 text-white" : f==="valid" ? "bg-green-500/15 border-green-500/25 text-green-400" : f==="duplicate" ? "bg-yellow-500/15 border-yellow-500/25 text-yellow-400" : "bg-red-500/15 border-red-500/25 text-red-400"
                  : "bg-white/[0.03] border-white/[0.07] text-slate-500"
              }`}>
              {f==="all" ? "All" : f==="valid" ? "✓ Valid" : f==="duplicate" ? "⚠ Used" : "✕ Invalid"}
            </button>
          ))}
        </div>
        <button onClick={onClear} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white text-[10px] font-semibold transition-colors">
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Clock className="w-8 h-8 text-slate-700" />
            <p className="text-slate-500 text-sm">{history.length === 0 ? "No scans in this session" : "No scans match this filter"}</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayed.map(entry => {
              const c = SC[entry.status];
              return (
                <div key={entry.entryId} className="flex items-center gap-4 px-4 py-3 bg-[#111111] border border-white/[0.06] rounded-xl">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                    {entry.status === "valid"     && <Check         className={`w-4 h-4 ${c.text}`} strokeWidth={2.5} />}
                    {entry.status === "duplicate" && <AlertTriangle className={`w-4 h-4 ${c.text}`} strokeWidth={2.5} />}
                    {entry.status === "invalid"   && <X             className={`w-4 h-4 ${c.text}`} strokeWidth={2.5} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold">{entry.ticket?.name ?? "Unknown Ticket"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{entry.ticket?.ticketType ?? "—"} · {entry.ticket?.section ?? "—"}</span>
                      {entry.fromCamera && <span className="text-[9px] text-slate-700 border border-white/[0.07] rounded px-1">📷 Camera</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-xs font-bold ${c.text}`}>{c.label}</div>
                    <div className="text-slate-600 text-[10px] font-mono mt-0.5">{fmt(entry.scannedAt)}</div>
                  </div>
                  <div className="text-slate-600 text-[10px] flex-shrink-0 hidden md:block">{entry.gate}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Manager Override Modal ───────────────────────────────────────────────────

function ManagerOverrideModal({ entry, onConfirm, onCancel }: {
  entry: ScanEntry; onConfirm: (reason: string) => void; onCancel: () => void;
}) {
  const [pin,    setPin]    = useState("");
  const [reason, setReason] = useState("");
  const [stage,  setStage]  = useState<"pin"|"reason">("pin");
  const [shake,  setShake]  = useState(false);

  const handleKey = (k: string) => {
    if (k === "del") { setPin(p => p.slice(0, -1)); return; }
    if (pin.length < 4) setPin(p => p + k);
  };
  const handleNext = () => {
    if (pin.length < 4) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    setStage("reason");
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <motion.div className="relative w-full max-w-sm bg-[#111111] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
        initial={{ scale:0.94, y:12 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:12 }}
        transition={{ type:"spring", stiffness:400, damping:28 }}>
        <div className="px-5 pt-5 pb-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2 mb-1"><Shield className="w-4 h-4 text-yellow-400" /><span className="text-white font-bold text-sm">Manager Override</span></div>
          <p className="text-slate-500 text-xs">Supervisor authorization required</p>
        </div>
        <div className="p-5">
          {stage === "pin" ? (
            <>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-4 text-center">Enter Supervisor PIN</p>
              <motion.div className="flex justify-center gap-3 mb-6"
                animate={shake ? { x:[-6,6,-4,4,-2,2,0] } : {}} transition={{ duration:0.4 }}>
                {Array.from({ length:4 }).map((_,i) => (
                  <div key={i} className="w-4 h-4 rounded-full border-2 transition-all"
                    style={{ backgroundColor:i<pin.length?"#ef4444":"transparent", borderColor:i<pin.length?"#ef4444":"#1e293b", boxShadow:i<pin.length?"0 0 8px #ef444480":"none" }} />
                ))}
              </motion.div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["1","2","3","4","5","6","7","8","9","","0","del"].map((k,i) => (
                  <button key={i} onClick={() => k && handleKey(k)} disabled={!k}
                    className={`h-12 rounded-xl font-bold transition-all ${!k?"invisible":k==="del"?"bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:bg-white/[0.08] text-xs":"bg-white/[0.05] border border-white/[0.08] text-white text-lg hover:bg-white/[0.09] active:scale-95"}`}>
                    {k === "del" ? "⌫" : k}
                  </button>
                ))}
              </div>
              <button onClick={handleNext} className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm transition-colors">
                Verify PIN
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mb-3">Select Override Reason</p>
              <div className="space-y-1.5 mb-4">
                {OVERRIDE_REASONS.map(r => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs border transition-all ${
                      reason === r ? "bg-yellow-500/15 border-yellow-500/30 text-yellow-300" : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:bg-white/[0.06]"
                    }`}>{r}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-slate-400 text-xs font-bold hover:bg-white/[0.05] transition-colors">Cancel</button>
                <button onClick={() => reason && onConfirm(reason)} disabled={!reason}
                  className="flex-1 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold transition-colors">
                  Approve Entry
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab,            setTab]            = useState<AppTab>("validation");
  const [event,          setEvent]          = useState<AppEvent>(EVENTS[0]);
  const [history,        setHistory]        = useState<ScanEntry[]>([]);
  const [lastScan,       setLastScan]       = useState<ScanEntry | null>(null);
  const [gate,           setGate]           = useState("Gate A");
  const [operatorName,   setOperatorName]   = useState("");
  const [isOnline,       setIsOnline]       = useState(() => navigator.onLine);
  const [overrideTarget, setOverrideTarget] = useState<ScanEntry | null>(null);

  useEffect(() => {
    const up = () => setIsOnline(true), down = () => setIsOnline(false);
    window.addEventListener("online", up); window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  const handleScanResult = useCallback((entry: ScanEntry) => {
    sfx[entry.status]();
    setHistory(prev => [entry, ...prev]);
    setLastScan(entry);

    const fn = entry.status === "valid" ? toast.success : entry.status === "duplicate" ? toast.warning : toast.error;
    fn(entry.ticket?.name ?? "Unknown ticket", {
      description: entry.status === "valid"
        ? `${entry.ticket?.ticketType} · ${entry.ticket?.section} — Entry Approved`
        : entry.status === "duplicate" ? "Ticket already admitted"
        : entry.reason ?? "Invalid ticket",
      duration: 2000,
    });
  }, []);

  const handleApprove = useCallback((ticket: Ticket) => {
    const entry: ScanEntry = { entryId:`manual_${Date.now()}`, ticket, status:"valid", scannedAt:new Date(), gate:"Manual" };
    sfx.valid();
    setHistory(prev => [entry, ...prev]);
    setLastScan(entry);
    toast.success(ticket.name, { description:"Manually approved — entry granted", duration:2500 });
  }, []);

  const handleOverrideConfirm = useCallback((reason: string) => {
    if (!overrideTarget?.ticket) return;
    const entry: ScanEntry = { entryId:`override_${Date.now()}`, ticket:overrideTarget.ticket, status:"valid", scannedAt:new Date(), gate:gate+" (Override)" };
    sfx.valid();
    setHistory(prev => [entry, ...prev]);
    setLastScan(entry);
    setOverrideTarget(null);
    toast.success(overrideTarget.ticket.name, { description:`Manager override — ${reason}`, duration:3000 });
  }, [overrideTarget, gate]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0a] overflow-hidden"
      style={{ fontFamily:"var(--font-sans,'Plus Jakarta Sans',sans-serif)" }}>

      <Toaster position="top-right" toastOptions={{
        style:{ background:"#161616", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontFamily:"inherit", fontSize:"12px" },
        classNames:{ title:"font-semibold" },
      }} />

      <AppHeader tab={tab} onTabChange={setTab} isOnline={isOnline} event={event} events={EVENTS} onEventChange={setEvent} />

      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">

          {tab === "route" && (
            <motion.div key="route" className="flex-1 overflow-hidden flex flex-col"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>
              <EntryRouteTab gate={gate} onGateChange={setGate} event={event} operatorName={operatorName} onOperatorChange={setOperatorName} />
            </motion.div>
          )}

          {tab === "validation" && (
            <motion.div key="validation" className="flex-1 overflow-hidden flex flex-col md:flex-row"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>

              {/* Left col: camera + lookup + test QRs */}
              <div className="flex flex-col md:flex-1 md:border-r border-white/[0.06] overflow-hidden">
                {/* Camera takes all remaining flex space */}
                <QRScannerView
                  onScanResult={handleScanResult}
                  event={event}
                  gate={gate}
                />
                <ManualLookupPanel onApprove={handleApprove} />
                <TestQRPanel />
              </div>

              {/* Right col: result + history */}
              <div className="flex flex-col md:w-80 lg:w-96 overflow-hidden border-t md:border-t-0 border-white/[0.06]">
                <div className="flex-shrink-0 border-b border-white/[0.06]">
                  <AnimatePresence mode="wait">
                    <motion.div key={lastScan?.entryId ?? "empty"}
                      initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }} transition={{ duration:0.2 }}>
                      <ValidationResultPanel lastScan={lastScan} onOverride={e => setOverrideTarget(e)} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ScanHistoryPanel history={history} onClear={() => setHistory([])} />
              </div>

            </motion.div>
          )}

          {tab === "history" && (
            <motion.div key="history" className="flex-1 overflow-hidden flex flex-col"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.15 }}>
              <SessionHistoryTab history={history} onClear={() => setHistory([])} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <AnimatePresence>
        {overrideTarget && (
          <ManagerOverrideModal entry={overrideTarget} onConfirm={handleOverrideConfirm} onCancel={() => setOverrideTarget(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
