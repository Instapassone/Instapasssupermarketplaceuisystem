import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ScanLine, CheckCircle2, XCircle, AlertCircle, Camera, Search,
  Clock, Ticket, TrendingUp, Zap, User, Mail, Hash, ChevronLeft,
  ChevronRight, Share, Menu, Home,
} from 'lucide-react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { organizerEvents } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import jsQR from 'jsqr';

// Detect if on mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024;
};

/* ═══════════════════════════════════════════════════════════════
   QR SCANNER MVP — InstaPass Organizer Portal
   Real-time ticket validation with WebRTC + jsQR
   Sprint: June 1-7, 2026
   ═══════════════════════════════════════════════════════════════ */

interface ScanResult {
  id: string;
  ticketId: string;
  timestamp: Date;
  eventId: string;
  eventName: string;
  status: 'valid' | 'invalid' | 'duplicate';
  attendeeName?: string;
  attendeeEmail?: string;
  ticketType?: string;
  reason?: string;
}

interface ScanStats {
  total: number;
  valid: number;
  invalid: number;
  duplicate: number;
  scansPerMinute: number;
}

const SCAN_HISTORY_KEY = 'instapass_scan_history';
const SCANNED_TICKETS_KEY = 'instapass_scanned_tickets';

export function QRScanner() {
  // Camera & Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [mobileView, setMobileView] = useState(isMobile());

  // Scan Results & History
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scannedTickets, setScannedTickets] = useState<Set<string>>(new Set());

  // Mobile UI State
  const [activeTab, setActiveTab] = useState<'entry' | 'validation' | 'history'>('validation');
  const [showMobileLookup, setShowMobileLookup] = useState(false);

  // Manual Lookup State
  const [showManualLookup, setShowManualLookup] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [manualResults, setManualResults] = useState<any[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanStartTimeRef = useRef<Date>(new Date());

  // Load scan history from sessionStorage
  useEffect(() => {
    try {
      const savedHistory = sessionStorage.getItem(SCAN_HISTORY_KEY);
      const savedTickets = sessionStorage.getItem(SCANNED_TICKETS_KEY);

      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setScanHistory(parsed.map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) })));
      }

      if (savedTickets) {
        setScannedTickets(new Set(JSON.parse(savedTickets)));
      }

      scanStartTimeRef.current = new Date();
    } catch (err) {
      console.error('Failed to load scan history:', err);
    }
  }, []);

  // Persist scan history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(scanHistory.slice(0, 50)));
      sessionStorage.setItem(SCANNED_TICKETS_KEY, JSON.stringify([...scannedTickets]));
    } catch (err) {
      console.error('Failed to save scan history:', err);
    }
  }, [scanHistory, scannedTickets]);

  // Calculate statistics
  const stats: ScanStats = {
    total: scanHistory.length,
    valid: scanHistory.filter(s => s.status === 'valid').length,
    invalid: scanHistory.filter(s => s.status === 'invalid').length,
    duplicate: scanHistory.filter(s => s.status === 'duplicate').length,
    scansPerMinute: scanHistory.length > 0
      ? (scanHistory.length / ((new Date().getTime() - scanStartTimeRef.current.getTime()) / 60000)) || 0
      : 0,
  };

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'error') => {
    try {
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        if (type === 'success') {
          navigator.vibrate(50);
        } else if (type === 'warning') {
          navigator.vibrate([50, 50, 50]);
        } else {
          navigator.vibrate(200);
        }
      }
    } catch (err) {
      // Vibration API not supported or blocked in iframe
    }
  }, []);

  // Audio feedback
  const triggerAudio = useCallback((type: 'success' | 'error') => {
    try {
      if (!window.AudioContext && !(window as any).webkitAudioContext) {
        return;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'success') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } else {
        oscillator.frequency.value = 300;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      }

      setTimeout(() => {
        audioContext.close().catch(() => {});
      }, 300);
    } catch (err) {
      // Audio API not supported
    }
  }, []);

  // Validate ticket (mock API call)
  const validateTicket = useCallback(async (ticketId: string): Promise<ScanResult> => {
    await new Promise(resolve => setTimeout(resolve, 150));

    let eventId = selectedEvent;
    let attendeeName = 'Guest';
    let attendeeEmail = '';
    let ticketType = 'GA';
    let actualTicketId = ticketId;

    if (ticketId.startsWith('instapass://')) {
      const parts = ticketId.replace('instapass://ticket/', '').split('/');
      [eventId, actualTicketId, attendeeName, attendeeEmail, ticketType] = parts;
    }

    const event = organizerEvents.find(e => e.id === eventId);
    const eventName = event?.name || 'Unknown Event';

    if (scannedTickets.has(actualTicketId)) {
      return {
        id: `scan-${Date.now()}`,
        ticketId: actualTicketId,
        timestamp: new Date(),
        eventId: eventId || 'unknown',
        eventName,
        status: 'duplicate',
        attendeeName,
        attendeeEmail,
        ticketType,
        reason: 'Ticket already scanned',
      };
    }

    const isValid = event !== undefined;

    return {
      id: `scan-${Date.now()}`,
      ticketId: actualTicketId,
      timestamp: new Date(),
      eventId: eventId || 'unknown',
      eventName,
      status: isValid ? 'valid' : 'invalid',
      attendeeName,
      attendeeEmail,
      ticketType,
      reason: isValid ? undefined : 'Invalid event or ticket',
    };
  }, [selectedEvent, scannedTickets]);

  // Process QR scan result
  const processScan = useCallback(async (data: string) => {
    try {
      const result = await validateTicket(data);

      setScanHistory(prev => [result, ...prev].slice(0, 50));

      if (result.status === 'valid') {
        setScannedTickets(prev => new Set([...prev, result.ticketId]));
      }

      setCurrentScan(result);

      if (result.status === 'valid') {
        triggerHaptic('success');
        triggerAudio('success');
      } else if (result.status === 'duplicate') {
        triggerHaptic('warning');
        triggerAudio('error');
      } else {
        triggerHaptic('error');
        triggerAudio('error');
      }

      setTimeout(() => setCurrentScan(null), 3000);
    } catch (err) {
      console.error('Validation error:', err);
      setCameraError('Validation failed. Please try manual lookup.');
    }
  }, [validateTicket, triggerHaptic, triggerAudio]);

  // QR detection loop
  const detectQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(detectQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      processScan(code.data);

      const { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } = code.location;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(topLeftCorner.x, topLeftCorner.y);
      ctx.lineTo(topRightCorner.x, topRightCorner.y);
      ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y);
      ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
      ctx.closePath();
      ctx.stroke();
    }

    animationFrameRef.current = requestAnimationFrame(detectQRCode);
  }, [processScan]);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setIsScanning(true);
      setDemoMode(false);

      animationFrameRef.current = requestAnimationFrame(detectQRCode);
    } catch (err: any) {
      console.error('Camera error:', err);
      const isPermissionError = err.name === 'NotAllowedError' || err.name === 'NotFoundError';
      setCameraError(
        isPermissionError
          ? 'Camera access is restricted in this environment. Use Demo Mode for testing.'
          : 'Unable to access camera. Please check device permissions.'
      );
      setIsScanning(false);
      if (isPermissionError) {
        setDemoMode(true);
      }
    }
  }, [detectQRCode]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Demo mode - Generate test scan
  const generateDemoScan = useCallback(() => {
    const demoTickets = [
      { name: 'Sarah Johnson', email: 'sarah@test.com', type: 'VIP', eventId: organizerEvents[0]?.id || '1' },
      { name: 'Michael Chen', email: 'michael@test.com', type: 'GA', eventId: organizerEvents[0]?.id || '1' },
      { name: 'Emma Davis', email: 'emma@test.com', type: 'VIP', eventId: organizerEvents[1]?.id || '2' },
      { name: 'James Wilson', email: 'james@test.com', type: 'GA', eventId: organizerEvents[1]?.id || '2' },
      { name: 'Olivia Brown', email: 'olivia@test.com', type: 'Premium', eventId: organizerEvents[2]?.id || '3' },
    ];

    const ticket = demoTickets[Math.floor(Math.random() * demoTickets.length)];
    const ticketId = `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const qrData = `instapass://ticket/${ticket.eventId}/${ticketId}/${ticket.name}/${ticket.email}/${ticket.type}`;

    processScan(qrData);
  }, [processScan]);

  // Manual lookup
  const handleManualLookup = useCallback(async () => {
    if (!manualQuery.trim()) return;

    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResults = [
      {
        ticketId: 'TKT-12345',
        eventName: organizerEvents[0]?.name || 'Event',
        attendeeName: 'John Doe',
        attendeeEmail: 'john@example.com',
        ticketType: 'VIP',
        status: 'valid',
      },
    ].filter(
      r =>
        r.attendeeName.toLowerCase().includes(manualQuery.toLowerCase()) ||
        r.attendeeEmail.toLowerCase().includes(manualQuery.toLowerCase()) ||
        r.ticketId.toLowerCase().includes(manualQuery.toLowerCase())
    );

    setManualResults(mockResults);
  }, [manualQuery]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setMobileView(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile Scanner UI
  if (mobileView) {
    return (
      <div className="min-h-screen bg-black" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Menu className="w-4 h-4 text-white" />
              </button>
              <div className="text-[11px]">
                <div className="text-white/90" style={{ fontWeight: 700 }}>Event ID</div>
                <div className="text-white/40">evt_demo_01</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isScanning && (
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[11px]"
                  style={{ fontWeight: 700 }}
                >
                  Stop Camera
                </button>
              )}
              <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <Share className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="px-4 pb-2 flex gap-2">
            {[
              { id: 'entry', label: 'Entry Route' },
              { id: 'validation', label: 'Live Validation' },
              { id: 'history', label: 'Session History' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-3 py-2 rounded-lg text-[11px] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-white/40'
                }`}
                style={{ fontWeight: 600 }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera View with Corner Markers */}
        <div className="relative h-screen w-full pt-[120px]">
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
              playsInline
              muted
            />

            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full ${!isScanning ? 'hidden' : ''}`}
            />

            {/* Corner Frame Markers */}
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[280px] h-[280px]">
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-red-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-red-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-red-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-red-500 rounded-br-xl" />
                </div>
              </div>
            )}

            {/* Ready to Scan Overlay */}
            {isScanning && !currentScan && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 px-6 py-3 rounded-full backdrop-blur-md">
                  <div className="text-white text-[13px] tracking-wide" style={{ fontWeight: 700 }}>
                    READY TO SCAN
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder when not scanning */}
            {!isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 text-[13px]" style={{ fontWeight: 600 }}>
                    Camera Inactive
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px]"
                    style={{ fontWeight: 700 }}
                  >
                    Start Scanning
                  </button>
                </div>
              </div>
            )}

            {/* Current Scan Result Overlay */}
            <AnimatePresence>
              {currentScan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                >
                  <div className="text-center p-6">
                    {currentScan.status === 'valid' && (
                      <>
                        <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
                        <div className="text-emerald-400 text-[22px] mb-2" style={{ fontWeight: 800 }}>
                          ✓ VALID ENTRY
                        </div>
                      </>
                    )}
                    {currentScan.status === 'invalid' && (
                      <>
                        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
                        <div className="text-red-400 text-[22px] mb-2" style={{ fontWeight: 800 }}>
                          ✗ DENIED
                        </div>
                      </>
                    )}
                    {currentScan.status === 'duplicate' && (
                      <>
                        <AlertCircle className="w-20 h-20 text-amber-400 mx-auto mb-4" />
                        <div className="text-amber-400 text-[22px] mb-2" style={{ fontWeight: 800 }}>
                          ⚠ DUPLICATE SCAN
                        </div>
                      </>
                    )}
                    <div className="text-white text-[15px] mb-1" style={{ fontWeight: 600 }}>
                      {currentScan.attendeeName}
                    </div>
                    <div className="text-white/40 text-[12px]">{currentScan.eventName}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#0D0D0D] rounded-t-2xl border-t border-white/10 max-h-[45vh] overflow-hidden">
            {/* Manual Lookup Section */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[12px] text-white" style={{ fontWeight: 700 }}>Manual Lookup</div>
                <div className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[9px] uppercase" style={{ fontWeight: 700 }}>
                  Offline
                </div>
                <div className="ml-auto px-2 py-0.5 rounded bg-white/5 text-white/40 text-[9px] uppercase" style={{ fontWeight: 600 }}>
                  Fallback
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name, email, or ticket ID..."
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[12px] placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                />
                <button
                  onClick={handleManualLookup}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-[12px]"
                  style={{ fontWeight: 700 }}
                >
                  Search
                </button>
              </div>
            </div>

            {demoMode && (
              <div className="px-4 py-3 border-b border-white/5">
                <button
                  onClick={generateDemoScan}
                  className="w-full py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px]"
                  style={{ fontWeight: 600 }}
                >
                  Test QR Codes → Scan for Harry Potter Event
                </button>
              </div>
            )}

            {/* Awaiting Scan Status */}
            {!currentScan && scanHistory.length === 0 && (
              <div className="px-4 py-6 text-center">
                <div className="text-[11px] text-white/20 uppercase tracking-widest mb-3" style={{ fontWeight: 700 }}>
                  AWAITING SCAN
                </div>
                <div className="space-y-2 text-left">
                  {['ATTENDEES', 'EVENT', 'TICKET', 'SCAN TIME'].map((label) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-[10px] text-white/30 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                        {label}
                      </span>
                      <span className="text-[11px] text-white/10">—</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Scan Details */}
            {scanHistory.length > 0 && (
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    Scan History
                  </div>
                  <div className="text-[11px] text-white/20">ALL</div>
                </div>
                <div className="space-y-2">
                  {scanHistory.slice(0, 3).map((scan) => (
                    <div key={scan.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          scan.status === 'valid'
                            ? 'bg-emerald-500/10'
                            : scan.status === 'duplicate'
                            ? 'bg-amber-500/10'
                            : 'bg-red-500/10'
                        }`}
                      >
                        {scan.status === 'valid' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {scan.status === 'duplicate' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                        {scan.status === 'invalid' && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-white truncate" style={{ fontWeight: 600 }}>
                          {scan.attendeeName}
                        </div>
                        <div className="text-[10px] text-white/30">{scan.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-white/40" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop Scanner UI - Simplified matching screenshots
  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        <div className="border-b border-[#1E293B]/60 bg-[#060D1B] sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[13px]">
              <Home className="w-4 h-4 text-white/40" />
              <span className="text-white/40">/</span>
              <span className="text-white/60">User Dashboard</span>
              <span className="text-white/40">/</span>
              <span className="text-white">Scanner</span>
            </div>

            {/* Stop Button */}
            {isScanning && (
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-lg bg-[#E52324] text-white text-[13px] hover:bg-[#c91f20] transition-colors"
                style={{ fontWeight: 700 }}
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-[32px] text-white mb-2" style={{ fontWeight: 800 }}>QR Scanner</h1>
            <p className="text-white/40 text-[14px]">
              {demoMode
                ? 'Demo mode active - Use the test button to simulate scans'
                : 'Scan QR codes to validate tickets in real-time'
              }
            </p>
          </div>

          {/* Scanner View */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-black border-2 border-[#1E293B]/60">
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${!isScanning ? 'hidden' : ''}`}
                playsInline
                muted
              />

              <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full ${!isScanning ? 'hidden' : ''}`}
              />

              {/* Corner Markers when scanning */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[70%] h-[70%]">
                    <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-red-500 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-red-500 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-red-500 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-red-500 rounded-br-xl" />
                  </div>
                </div>
              )}

              {/* Placeholder when not scanning */}
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <Camera className="w-20 h-20 text-white/10 mb-6" />
                  <p className="text-white/30 text-[15px] mb-6" style={{ fontWeight: 600 }}>
                    Camera Not Active
                  </p>
                  <button
                    onClick={demoMode ? generateDemoScan : startCamera}
                    className="px-8 py-3 rounded-xl bg-[#E52324] text-white text-[14px] hover:bg-[#c91f20] transition-colors"
                    style={{ fontWeight: 700 }}
                  >
                    {demoMode ? 'Test QR Scan' : 'Start Scanner'}
                  </button>
                </div>
              )}

              {/* Scan Result Overlay */}
              <AnimatePresence>
                {currentScan && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                  >
                    <div className="text-center p-8">
                      {currentScan.status === 'valid' && (
                        <>
                          <CheckCircle2 className="w-24 h-24 text-emerald-400 mx-auto mb-4" />
                          <div className="text-emerald-400 text-[24px] mb-2" style={{ fontWeight: 800 }}>
                            ✓ VALID ENTRY
                          </div>
                        </>
                      )}
                      {currentScan.status === 'invalid' && (
                        <>
                          <XCircle className="w-24 h-24 text-red-400 mx-auto mb-4" />
                          <div className="text-red-400 text-[24px] mb-2" style={{ fontWeight: 800 }}>
                            ✗ DENIED
                          </div>
                        </>
                      )}
                      {currentScan.status === 'duplicate' && (
                        <>
                          <AlertCircle className="w-24 h-24 text-amber-400 mx-auto mb-4" />
                          <div className="text-amber-400 text-[24px] mb-2" style={{ fontWeight: 800 }}>
                            ⚠ DUPLICATE
                          </div>
                        </>
                      )}
                      <div className="text-white text-[16px] mb-1" style={{ fontWeight: 600 }}>
                        {currentScan.attendeeName}
                      </div>
                      <div className="text-white/40 text-[13px]">{currentScan.eventName}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Manual Lookup Section */}
          <div className="p-6 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Manual Lookup</h3>
              {!isScanning && (
                <span className="px-2 py-0.5 rounded bg-white/5 text-white/30 text-[10px] uppercase" style={{ fontWeight: 600 }}>
                  Offline Fallback
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search by name, email, or ticket ID..."
                value={manualQuery}
                onChange={(e) => setManualQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualLookup()}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/30 outline-none focus:border-[#E52324]/50 transition-colors"
              />
              <button
                onClick={handleManualLookup}
                className="px-8 py-3 rounded-xl bg-[#E52324] text-white text-[14px] hover:bg-[#c91f20] transition-colors"
                style={{ fontWeight: 700 }}
              >
                Search
              </button>
            </div>

            {/* Manual Lookup Results */}
            {manualResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {manualResults.map((result, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <div className="text-white text-[14px] mb-1" style={{ fontWeight: 600 }}>
                      {result.attendeeName}
                    </div>
                    <div className="text-white/30 text-[12px]">
                      {result.ticketId} • {result.ticketType} • {result.eventName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
