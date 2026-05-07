import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { encodeData } from "./qr-engine";

/* ═══════════════════════════════════════════════════════════════
   PAC-MAN ANIMATED QR CODE
   Grid-based maze movement at authentic arcade speed.
   Pac-Man chomps once per tile, ghosts follow with spacing.
   ═══════════════════════════════════════════════════════════════ */

const PAC_YELLOW = "#FFD700";
const GHOST_RED = "#FF0000";
const GHOST_CYAN = "#00FFFF";
const GHOST_PINK = "#FFB8FF";
const GHOST_ORANGE = "#FFB852";
const QR_BG = "#0A0A2E";
const QR_FG = "#3B82F6";
const PELLET_COLOR = "#FFFDE0";

interface PacManQRProps {
  size?: number;
  className?: string;
}

export function PacManQR({ size = 320, className = "" }: PacManQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  const [qrModules] = useState(() => encodeData("https://instapass.ai/pacman"));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const { modules, size: qrSize } = qrModules;
    const quiet = 2;
    const total = qrSize + quiet * 2;
    const cell = size / total;

    const isFinder = (r: number, c: number) =>
      (r < 7 && c < 7) || (r < 7 && c >= qrSize - 7) || (r >= qrSize - 7 && c < 7);

    /* ─── Build a proper maze path (strictly H/V segments) ─── */
    // Waypoints in pixel coords — characters turn 90° at each one.
    // Path traces a loop through the QR corridors.
    const m = cell * (quiet + 1.5);               // inner margin
    const far = size - m;
    const midY1 = size * 0.30;                     // upper horizontal corridor
    const midY2 = size * 0.70;                     // lower horizontal corridor
    const midX1 = size * 0.28;                     // left vertical shortcut
    const midX2 = size * 0.72;                     // right vertical shortcut

    const waypoints: { x: number; y: number }[] = [
      // Top-left → right along top
      { x: m, y: m },
      { x: far, y: m },
      // Down right side to upper-mid
      { x: far, y: midY1 },
      // Left along upper corridor
      { x: midX2, y: midY1 },
      // Down to lower corridor
      { x: midX2, y: midY2 },
      // Right to far edge
      { x: far, y: midY2 },
      // Down right side to bottom
      { x: far, y: far },
      // Left along bottom
      { x: m, y: far },
      // Up left side to lower-mid
      { x: m, y: midY2 },
      // Right along lower corridor
      { x: midX1, y: midY2 },
      // Up to upper corridor
      { x: midX1, y: midY1 },
      // Left to far-left
      { x: m, y: midY1 },
      // Up to start
      { x: m, y: m },
    ];

    // Build a flat pixel-distance table for smooth movement
    interface Segment { x0: number; y0: number; x1: number; y1: number; len: number; cumLen: number; dir: number }
    const segments: Segment[] = [];
    let totalLen = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const a = waypoints[i], b = waypoints[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const dir = Math.atan2(dy, dx);
      segments.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, len, cumLen: totalLen, dir });
      totalLen += len;
    }

    // Given a distance along the path (mod totalLen), return position + direction
    function posAtDist(d: number): { x: number; y: number; dir: number } {
      d = ((d % totalLen) + totalLen) % totalLen;
      for (const seg of segments) {
        if (d <= seg.cumLen + seg.len) {
          const t = (d - seg.cumLen) / seg.len;
          return {
            x: seg.x0 + (seg.x1 - seg.x0) * t,
            y: seg.y0 + (seg.y1 - seg.y0) * t,
            dir: seg.dir,
          };
        }
      }
      const last = segments[segments.length - 1];
      return { x: last.x1, y: last.y1, dir: last.dir };
    }

    // Pre-place pellets along the path at regular tile intervals
    const pelletSpacing = cell * 2;
    const pelletCount = Math.floor(totalLen / pelletSpacing);
    const pelletDists: number[] = [];
    for (let i = 0; i < pelletCount; i++) pelletDists.push(i * pelletSpacing);
    // Every 12th pellet is a power pellet
    const centerArea = { xMin: size * 0.32, xMax: size * 0.68, yMin: size * 0.38, yMax: size * 0.62 };

    /* ─── Speeds (arcade-authentic) ─── */
    // Original Pac-Man: ~80 pixels/sec on a 224-wide screen.
    // Scale to our size: (80/224) * size ≈ 0.357 * size px/sec
    // That feels a bit fast for a small QR; let's use ~0.18 * size for a nice pace.
    const SPEED = size * 0.16; // pixels per second
    const GHOST_GAP = cell * 4; // pixel distance between ghosts

    const ghosts = [
      { color: GHOST_RED, gap: GHOST_GAP * 1 },
      { color: GHOST_CYAN, gap: GHOST_GAP * 2 },
      { color: GHOST_PINK, gap: GHOST_GAP * 3 },
      { color: GHOST_ORANGE, gap: GHOST_GAP * 4 },
    ];

    /* ─── Drawing helpers ─── */
    function drawPacMan(x: number, y: number, r: number, dir: number, dist: number) {
      // Mouth opens/closes once per tile (cell*2 distance)
      const chompCycle = (dist / (cell * 2)) * Math.PI * 2;
      const mouth = (Math.sin(chompCycle) + 1) / 2 * 0.85; // 0..0.85 radians

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(dir);

      ctx.beginPath();
      ctx.arc(0, 0, r, mouth * 0.52, Math.PI * 2 - mouth * 0.52);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = PAC_YELLOW;
      ctx.fill();

      // Eye
      ctx.beginPath();
      ctx.arc(r * 0.15, -r * 0.38, r * 0.11, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();

      ctx.restore();
    }

    function drawGhost(x: number, y: number, r: number, color: string, dist: number) {
      ctx.save();
      ctx.translate(x, y);

      // Body — dome top
      ctx.beginPath();
      ctx.arc(0, -r * 0.05, r, Math.PI, 0);

      // Wavy skirt — phase tied to distance traveled (wobble per tile)
      const segs = 3;
      const segW = (r * 2) / segs;
      const wavePhase = (dist / (cell * 1.5)) * Math.PI * 2;
      for (let i = 0; i < segs; i++) {
        const sx = -r + i * segW;
        const ex = sx + segW;
        const cy = r * 0.8 + Math.sin(wavePhase + i * Math.PI) * r * 0.12;
        ctx.quadraticCurveTo(sx + segW * 0.5, cy + r * 0.18, ex, r * 0.82);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // Eyes (look in movement direction — handled by caller context)
      const eR = r * 0.24;
      const eyeSp = r * 0.34;
      for (const ex of [-eyeSp, eyeSp]) {
        ctx.beginPath();
        ctx.arc(ex, -r * 0.18, eR, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex + eR * 0.2, -r * 0.13, eR * 0.52, 0, Math.PI * 2);
        ctx.fillStyle = "#2222AA";
        ctx.fill();
      }

      ctx.restore();
    }

    function drawQR() {
      ctx.fillStyle = QR_BG;
      ctx.fillRect(0, 0, size, size);

      for (let r = 0; r < qrSize; r++) {
        for (let c = 0; c < qrSize; c++) {
          if (!modules[r][c]) continue;

          const x = (c + quiet) * cell;
          const y = (r + quiet) * cell;

          // Skip center logo area
          const ctr = qrSize / 2;
          const logoR = qrSize * 0.18;
          if (Math.abs(r - ctr) < logoR && Math.abs(c - ctr) < logoR) continue;

          if (isFinder(r, c)) {
            const ir = r < 7 ? r : (r >= qrSize - 7 ? r - (qrSize - 7) : r);
            const ic = c < 7 ? c : (c >= qrSize - 7 ? c - (qrSize - 7) : c);
            const isEdge = ir === 0 || ir === 6 || ic === 0 || ic === 6;
            const isCenter = ir >= 2 && ir <= 4 && ic >= 2 && ic <= 4;
            ctx.fillStyle = isCenter ? "#00E5FF" : isEdge ? "#2563EB" : "#1E40AF";
            ctx.fillRect(x, y, cell, cell);
          } else {
            const dotR = cell * 0.32;
            const cx2 = x + cell / 2;
            const cy2 = y + cell / 2;

            // Subtle glow
            const glow = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, dotR * 2);
            glow.addColorStop(0, `${QR_FG}25`);
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.fillRect(cx2 - dotR * 2, cy2 - dotR * 2, dotR * 4, dotR * 4);

            ctx.beginPath();
            ctx.arc(cx2, cy2, dotR, 0, Math.PI * 2);
            ctx.fillStyle = QR_FG;
            ctx.fill();
          }
        }
      }
    }

    function drawPellets(pacDist: number) {
      for (let i = 0; i < pelletDists.length; i++) {
        const pd = pelletDists[i];
        const pos = posAtDist(pd);

        // Skip pellets in center area
        if (pos.x > centerArea.xMin && pos.x < centerArea.xMax &&
            pos.y > centerArea.yMin && pos.y < centerArea.yMax) continue;

        // Skip pellets that pac-man has already "eaten" (within a close range behind)
        // Pellets reappear once pac-man is far enough past (loop effect)
        const diff = ((pd - pacDist) % totalLen + totalLen) % totalLen;
        if (diff > totalLen - cell * 3 || diff < cell * 1.5) continue; // eaten zone

        const isPower = i % 12 === 0;
        const r = isPower ? cell * 0.38 : cell * 0.15;

        if (isPower) {
          // Pulsing power pellet
          const pulse = 0.85 + Math.sin(Date.now() / 300) * 0.15;
          const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 2.5);
          glow.addColorStop(0, `${PELLET_COLOR}50`);
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.fillRect(pos.x - r * 2.5, pos.y - r * 2.5, r * 5, r * 5);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r * pulse, 0, Math.PI * 2);
          ctx.fillStyle = PELLET_COLOR;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `${PELLET_COLOR}A0`;
          ctx.fill();
        }
      }
    }

    function drawCenterPanel(dist: number) {
      const cx = size / 2;
      const cy = size / 2;
      const w = size * 0.28;
      const h = size * 0.22;

      // Glow
      const glow = ctx.createRadialGradient(cx, cy, w * 0.3, cx, cy, w * 0.9);
      glow.addColorStop(0, "rgba(59,130,246,0.12)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - w, cy - h, w * 2, h * 2);

      // Panel
      const px = cx - w / 2, py = cy - h / 2;
      ctx.fillStyle = "#0A0A2E";
      ctx.strokeStyle = `rgba(59,130,246,${0.3 + Math.sin(dist / 80) * 0.08})`;
      ctx.lineWidth = 1.5;
      roundRect(ctx, px, py, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // "SCAN ME!" text
      ctx.fillStyle = "#fff";
      ctx.font = `900 ${size * 0.028}px "Courier New", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCAN ME!", cx, cy);
    }

    /* ─── Main loop ─── */
    let pacDist = 0;
    let lastTime = 0;

    function render(timestamp: number) {
      if (lastTime === 0) lastTime = timestamp;
      const dt = (timestamp - lastTime) / 1000; // seconds
      lastTime = timestamp;

      // Clamp dt to avoid jumps on tab-switch
      const clampedDt = Math.min(dt, 0.05);
      pacDist += SPEED * clampedDt;

      ctx.clearRect(0, 0, size, size);

      drawQR();
      drawPellets(pacDist);

      // Draw ghosts first (they're behind pac-man)
      for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i];
        const gDist = pacDist - g.gap;
        const gp = posAtDist(gDist);
        // Subtle glow
        const gGlow = ctx.createRadialGradient(gp.x, gp.y, 0, gp.x, gp.y, cell * 1.5);
        gGlow.addColorStop(0, `${g.color}12`);
        gGlow.addColorStop(1, "transparent");
        ctx.fillStyle = gGlow;
        ctx.fillRect(gp.x - cell * 1.5, gp.y - cell * 1.5, cell * 3, cell * 3);

        drawGhost(gp.x, gp.y, cell * 1.05, g.color, gDist);
      }

      // Pac-Man
      const pac = posAtDist(pacDist);
      const pacGlow = ctx.createRadialGradient(pac.x, pac.y, 0, pac.x, pac.y, cell * 2);
      pacGlow.addColorStop(0, `${PAC_YELLOW}20`);
      pacGlow.addColorStop(1, "transparent");
      ctx.fillStyle = pacGlow;
      ctx.fillRect(pac.x - cell * 2, pac.y - cell * 2, cell * 4, cell * 4);

      drawPacMan(pac.x, pac.y, cell * 1.2, pac.dir, pacDist);

      drawCenterPanel(pacDist);

      // Soft vignette
      const vig = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.72);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(5,5,30,0.35)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, size, size);

      frameRef.current = requestAnimationFrame(render);
    }

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [size, qrModules]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 0 120px rgba(59,130,246,0.08), 0 20px 60px rgba(0,0,0,0.5)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-2xl"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}