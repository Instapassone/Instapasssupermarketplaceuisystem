import { useRef, useEffect, useCallback } from 'react';

/**
 * LipSyncBot — High-fidelity 3D-style feminine android head.
 * InstaPass brand red (#E52324) and white metallic with multi-source lighting,
 * ambient occlusion, rim light, Fresnel glow, environment reflections,
 * and real-time viseme lip-sync.
 */

interface FreqBands { amplitude: number; low: number; mid: number; high: number; }

function getFreqBands(a: AnalyserNode | null): FreqBands {
  if (!a) return { amplitude: 0, low: 0, mid: 0, high: 0 };
  const d = new Uint8Array(a.frequencyBinCount);
  a.getByteFrequencyData(d);
  let lS = 0, mS = 0, hS = 0, tS = 0;
  for (let i = 1; i < Math.min(35, d.length); i++) {
    const v = d[i] / 255; tS += v;
    if (i < 3) lS += v; else if (i < 12) mS += v; else hS += v;
  }
  const c = Math.min(35, d.length) - 1;
  const bt = lS + mS + hS || 1;
  return { amplitude: Math.min(1, (tS / c) * 3.5), low: lS / bt, mid: mS / bt, high: hS / bt };
}

interface MS { width: number; height: number; roundness: number; lipCurl: number; }
function getVS(b: FreqBands): MS {
  if (b.amplitude < 0.05) return { width: 0.38, height: 0.02, roundness: 0.3, lipCurl: 0.15 };
  const o = Math.pow(b.amplitude, 0.7);
  return {
    width: Math.max(0.15, Math.min(1, 0.3 + b.mid * 0.5 + b.high * 0.15 - b.low * 0.1)),
    height: Math.max(0.02, Math.min(1, o * (0.5 + b.low * 0.4 + b.mid * 0.3))),
    roundness: Math.max(0, Math.min(1, b.low * 0.9 + b.mid * 0.2 + b.high * 0.1)),
    lipCurl: Math.max(-0.5, Math.min(0.5, b.mid * 0.3 - b.high * 0.2)),
  };
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

interface Props {
  speaking: boolean;
  width?: number;
  height?: number;
  getAnalyser: () => AnalyserNode | null;
  className?: string;
}

export function LipSyncBot({ speaking, width = 180, height = 180, getAnalyser, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const shapeRef = useRef<MS>({ width: 0.38, height: 0.02, roundness: 0.3, lipCurl: 0.15 });
  const blinkRef = useRef({ next: 2 + Math.random() * 3, phase: 0, dur: 0.15 });
  const tiltRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    timeRef.current += 0.016;
    const T = timeRef.current;

    const bands = speaking ? getFreqBands(getAnalyser()) : { amplitude: 0, low: 0, mid: 0, high: 0 };
    const target = getVS(bands);
    const s = shapeRef.current;
    const sp = (k: keyof MS) => target[k] > s[k] ? 0.35 : 0.12;
    s.width = lerp(s.width, target.width, sp('width'));
    s.height = lerp(s.height, target.height, sp('height'));
    s.roundness = lerp(s.roundness, target.roundness, 0.2);
    s.lipCurl = lerp(s.lipCurl, target.lipCurl, 0.2);

    // Blink
    const bl = blinkRef.current;
    bl.next -= 0.016;
    if (bl.next <= 0) { bl.phase = bl.dur; bl.next = 2.5 + Math.random() * 4; }
    if (bl.phase > 0) bl.phase -= 0.016;
    const ba = bl.phase > 0 ? 1 - bl.phase / bl.dur : 0;
    const eyeOpen = bl.phase > 0 ? (ba < 0.5 ? 1 - ba * 2 : (ba - 0.5) * 2) : 1;

    // Tilt
    const tt = speaking ? Math.sin(T * 0.6) * 0.022 + Math.sin(T * 1.1) * 0.008 : Math.sin(T * 0.25) * 0.006;
    tiltRef.current = lerp(tiltRef.current, tt, 0.06);

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    const cx = width / 2, cy = height / 2 + 6;
    ctx.translate(cx, cy);
    ctx.rotate(tiltRef.current);
    ctx.translate(-cx, -cy);
    ctx.translate(0, Math.sin(T * 1.0) * 0.6);

    const S = Math.min(width, height) / 180;
    const hx = cx, hy = cy - 4 * S;
    const hw = 48 * S, hh = 58 * S;

    // ─── helper: radialGrad shortcut ───
    const rg = (x: number, y: number, r1: number, r2: number, stops: [number, string][]) => {
      const g = ctx.createRadialGradient(x, y, r1, x, y, r2);
      for (const [s, c] of stops) g.addColorStop(s, c);
      return g;
    };
    const lg = (x1: number, y1: number, x2: number, y2: number, stops: [number, string][]) => {
      const g = ctx.createLinearGradient(x1, y1, x2, y2);
      for (const [s, c] of stops) g.addColorStop(s, c);
      return g;
    };

    // ═══════════════════════════════════════════════════════════
    // AMBIENT ATMOSPHERE — InstaPass red glow
    // ═══════════════════════════════════════════════════════════
    ctx.fillStyle = rg(hx, hy, hw * 0.2, hw * 3, [
      [0, `rgba(229,35,36,${speaking ? 0.07 + bands.amplitude * 0.06 : 0.025})`],
      [0.4, `rgba(180,20,25,${speaking ? 0.03 : 0.01})`],
      [1, 'transparent'],
    ]);
    ctx.fillRect(0, 0, width, height);

    // ═══════════════════════════════════════════════════════════
    // NECK — 3D cylindrical with strong form shadow
    // ═══════════════════════════════════════════════════════════
    const nT = hy + hh * 0.7, nW = hw * 0.34, nH = 30 * S;

    // Neck shadow on ground
    ctx.fillStyle = rg(hx, nT + nH, 0, nW * 2, [
      [0, 'rgba(0,0,0,0.2)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - nW * 3, nT + nH - 5 * S, nW * 6, 12 * S);

    // Main neck — cylindrical gradient (white/silver metallic)
    ctx.beginPath();
    ctx.moveTo(hx - nW, nT);
    ctx.lineTo(hx - nW * 0.85, nT + nH);
    ctx.lineTo(hx + nW * 0.85, nT + nH);
    ctx.lineTo(hx + nW, nT);
    ctx.closePath();
    ctx.fillStyle = lg(hx - nW, nT, hx + nW, nT, [
      [0, '#2a1a1a'], [0.2, '#4a3535'], [0.45, '#6a5555'],
      [0.55, '#5a4545'], [0.8, '#3a2525'], [1, '#1e1010'],
    ]);
    ctx.fill();

    // Neck highlight — center vertical specular
    ctx.fillStyle = rg(hx + nW * 0.05, nT + nH * 0.3, 0, nW * 0.5, [
      [0, 'rgba(255,220,220,0.12)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - nW, nT, nW * 2, nH);

    // Neck segments
    for (let i = 0; i < 5; i++) {
      const ny = nT + 4 * S + i * (nH - 6 * S) / 5;
      ctx.beginPath();
      ctx.moveTo(hx - nW * 0.9, ny);
      ctx.lineTo(hx + nW * 0.9, ny);
      ctx.strokeStyle = `rgba(229,35,36,${speaking ? 0.1 + bands.amplitude * 0.08 : 0.04})`;
      ctx.lineWidth = 0.5 * S;
      ctx.stroke();
      // AO shadow below each ring
      ctx.beginPath();
      ctx.moveTo(hx - nW * 0.85, ny + 1);
      ctx.lineTo(hx + nW * 0.85, ny + 1);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1 * S;
      ctx.stroke();
    }

    // Neck side cables
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(hx + side * nW * 0.8, nT + 2);
      ctx.bezierCurveTo(
        hx + side * nW * 1.7, nT + nH * 0.25,
        hx + side * nW * 1.8, nT + nH * 0.7,
        hx + side * nW * 1.35, nT + nH
      );
      // Cable with 3D round shading
      ctx.strokeStyle = '#1a0e0e';
      ctx.lineWidth = 3.5 * S;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.strokeStyle = 'rgba(200,140,140,0.08)';
      ctx.lineWidth = 1.2 * S;
      ctx.stroke();

      // Cable junction dots with glow
      ctx.beginPath();
      ctx.arc(hx + side * nW * 1.5, nT + nH * 0.5, 2.5 * S, 0, Math.PI * 2);
      ctx.fillStyle = speaking ? `rgba(229,35,36,${0.4 + bands.amplitude * 0.4})` : 'rgba(229,35,36,0.1)';
      ctx.fill();
      if (speaking) {
        ctx.fillStyle = `rgba(229,35,36,${0.05 + bands.amplitude * 0.06})`;
        ctx.beginPath();
        ctx.arc(hx + side * nW * 1.5, nT + nH * 0.5, 6 * S, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // HEAD — 3D sphere-like with multi-light shading
    // ═══════════════════════════════════════════════════════════
    const drawHead = () => {
      ctx.beginPath();
      ctx.moveTo(hx, hy - hh);
      ctx.bezierCurveTo(hx + hw * 1.06, hy - hh * 0.95, hx + hw * 1.08, hy - hh * 0.1, hx + hw * 0.8, hy + hh * 0.3);
      ctx.bezierCurveTo(hx + hw * 0.62, hy + hh * 0.58, hx + hw * 0.32, hy + hh * 0.85, hx, hy + hh);
      ctx.bezierCurveTo(hx - hw * 0.32, hy + hh * 0.85, hx - hw * 0.62, hy + hh * 0.58, hx - hw * 0.8, hy + hh * 0.3);
      ctx.bezierCurveTo(hx - hw * 1.08, hy - hh * 0.1, hx - hw * 1.06, hy - hh * 0.95, hx, hy - hh);
      ctx.closePath();
    };

    // ── Layer 1: Base white/pearl metallic ──
    drawHead();
    ctx.fillStyle = rg(hx - hw * 0.15, hy - hh * 0.2, hw * 0.1, hh * 1.2, [
      [0, '#e8e0e0'], [0.2, '#d5cccc'], [0.45, '#c0b5b5'],
      [0.7, '#a89e9e'], [1, '#8a7e7e'],
    ]);
    ctx.fill();

    // ── Layer 2: Form shadow (right side, dark) ──
    drawHead();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = lg(hx + hw * 0.1, hy, hx + hw * 1.1, hy + hh * 0.3, [
      [0, 'transparent'], [0.4, 'rgba(0,0,0,0.08)'],
      [0.7, 'rgba(0,0,0,0.2)'], [1, 'rgba(0,0,0,0.35)'],
    ]);
    ctx.fillRect(0, 0, width, height);

    // ── Layer 3: Key light specular (top-left, big, soft) ──
    const keyX = hx - hw * 0.38, keyY = hy - hh * 0.5;
    ctx.fillStyle = rg(keyX, keyY, 0, hw * 0.9, [
      [0, 'rgba(255,255,255,0.35)'],
      [0.15, 'rgba(255,240,240,0.2)'],
      [0.35, 'rgba(255,220,220,0.08)'],
      [0.6, 'rgba(200,180,180,0.03)'],
      [1, 'transparent'],
    ]);
    ctx.fillRect(0, 0, width, height);

    // ── Layer 4: Fill light specular (right, softer, cooler) ──
    ctx.fillStyle = rg(hx + hw * 0.55, hy - hh * 0.1, 0, hw * 0.6, [
      [0, 'rgba(255,230,230,0.1)'],
      [0.3, 'rgba(220,200,200,0.04)'],
      [1, 'transparent'],
    ]);
    ctx.fillRect(0, 0, width, height);

    // ── Layer 5: Under-chin shadow (ambient occlusion) ──
    ctx.fillStyle = rg(hx, hy + hh * 0.7, 0, hw * 0.6, [
      [0, 'rgba(0,0,0,0.2)'], [0.5, 'rgba(0,0,0,0.06)'], [1, 'transparent'],
    ]);
    ctx.fillRect(0, 0, width, height);

    // ── Layer 6: Forehead specular band (environment reflection) ──
    const envY = hy - hh * 0.65;
    ctx.fillStyle = lg(hx - hw * 0.8, envY - 4 * S, hx + hw * 0.8, envY + 8 * S, [
      [0, 'transparent'], [0.2, 'rgba(255,240,240,0.06)'],
      [0.5, 'rgba(255,255,255,0.12)'], [0.8, 'rgba(255,240,240,0.04)'],
      [1, 'transparent'],
    ]);
    ctx.fillRect(hx - hw, envY - 5 * S, hw * 2, 14 * S);

    // ── Layer 7: Cheek specular patches ──
    for (const side of [-1, 1]) {
      const chX = hx + side * hw * 0.5, chY = hy + hh * 0.15;
      ctx.fillStyle = rg(chX, chY, 0, hw * 0.28, [
        [0, `rgba(255,240,240,${side === -1 ? 0.1 : 0.05})`],
        [1, 'transparent'],
      ]);
      ctx.fillRect(chX - hw * 0.4, chY - hw * 0.4, hw * 0.8, hw * 0.8);
    }

    // ── Layer 8: Nose bridge specular ──
    ctx.fillStyle = rg(hx + 1 * S, hy + hh * 0.12, 0, hw * 0.12, [
      [0, 'rgba(255,255,255,0.18)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - hw * 0.15, hy, hw * 0.3, hh * 0.35);

    ctx.restore(); // end head clip

    // ── RIM LIGHT (back edge glow — Fresnel effect) — InstaPass red ──
    drawHead();
    ctx.save();
    ctx.clip();

    // Right rim — strong red
    ctx.fillStyle = lg(hx + hw * 0.65, hy, hx + hw * 1.15, hy, [
      [0, 'transparent'],
      [0.5, `rgba(229,35,36,${speaking ? 0.06 + bands.amplitude * 0.06 : 0.03})`],
      [0.8, `rgba(255,80,80,${speaking ? 0.12 + bands.amplitude * 0.1 : 0.05})`],
      [1, `rgba(255,120,120,${speaking ? 0.2 + bands.amplitude * 0.15 : 0.08})`],
    ]);
    ctx.fillRect(0, 0, width, height);

    // Left rim — softer red
    ctx.fillStyle = lg(hx - hw * 0.75, hy, hx - hw * 1.15, hy, [
      [0, 'transparent'],
      [0.6, `rgba(229,35,36,${speaking ? 0.03 + bands.amplitude * 0.03 : 0.015})`],
      [1, `rgba(255,80,80,${speaking ? 0.08 + bands.amplitude * 0.06 : 0.03})`],
    ]);
    ctx.fillRect(0, 0, width, height);

    // Top rim
    ctx.fillStyle = lg(hx, hy - hh * 0.7, hx, hy - hh * 1.05, [
      [0, 'transparent'],
      [0.5, `rgba(229,35,36,${speaking ? 0.04 : 0.02})`],
      [1, `rgba(255,80,80,${speaking ? 0.1 : 0.04})`],
    ]);
    ctx.fillRect(0, 0, width, height);

    ctx.restore();

    // ── PANEL SEAM LINES (with AO shadow) ──
    const drawSeam = (x1: number, y1: number, x2: number, y2: number, cpx?: number, cpy?: number) => {
      // Dark seam
      ctx.beginPath();
      if (cpx !== undefined && cpy !== undefined) {
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
      } else {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = 'rgba(80,40,40,0.5)';
      ctx.lineWidth = 0.9 * S;
      ctx.stroke();
      // AO shadow beside seam
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2.5 * S;
      ctx.stroke();
      // Bright edge catch on seam
      ctx.strokeStyle = 'rgba(255,220,220,0.06)';
      ctx.lineWidth = 0.4 * S;
      ctx.stroke();
    };

    // Center crown seam
    drawSeam(hx, hy - hh, hx, hy - hh * 0.28);
    // Forehead horizontal
    drawSeam(hx - hw * 0.7, hy - hh * 0.28, hx + hw * 0.7, hy - hh * 0.28, hx, hy - hh * 0.23);
    // Temple seams
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(hx + side * hw * 0.7, hy - hh * 0.28);
      ctx.bezierCurveTo(hx + side * hw * 0.86, hy - hh * 0.08, hx + side * hw * 0.88, hy + hh * 0.12, hx + side * hw * 0.75, hy + hh * 0.35);
      ctx.strokeStyle = 'rgba(80,40,40,0.45)';
      ctx.lineWidth = 0.8 * S;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2.2 * S;
      ctx.stroke();
    }
    // Jaw seam
    drawSeam(hx - hw * 0.6, hy + hh * 0.45, hx + hw * 0.6, hy + hh * 0.45, hx, hy + hh * 0.52);
    // Chin center
    drawSeam(hx, hy + hh * 0.52, hx, hy + hh * 0.78);

    // ── RIVETS with 3D depth ──
    const rivets = [
      [hx - hw * 0.55, hy - hh * 0.33], [hx + hw * 0.55, hy - hh * 0.33],
      [hx - hw * 0.76, hy + hh * 0.06], [hx + hw * 0.76, hy + hh * 0.06],
      [hx - hw * 0.45, hy + hh * 0.5], [hx + hw * 0.45, hy + hh * 0.5],
      [hx, hy - hh * 0.3],
    ];
    for (const [rx, ry] of rivets) {
      // Shadow
      ctx.beginPath();
      ctx.arc(rx, ry + 0.5 * S, 1.8 * S, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.arc(rx, ry, 1.5 * S, 0, Math.PI * 2);
      ctx.fillStyle = rg(rx - 0.5 * S, ry - 0.5 * S, 0, 1.5 * S, [
        [0, 'rgba(255,200,200,0.4)'], [0.5, 'rgba(180,120,120,0.3)'], [1, 'rgba(100,50,50,0.5)'],
      ]);
      ctx.fill();
      // Highlight dot
      ctx.beginPath();
      ctx.arc(rx - 0.4 * S, ry - 0.4 * S, 0.5 * S, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fill();
    }

    // ── CIRCUIT TRACES (left temple) — InstaPass red ──
    const tX = hx - hw * 0.73, tY = hy - hh * 0.12;
    ctx.strokeStyle = `rgba(229,35,36,${speaking ? 0.18 + bands.amplitude * 0.15 : 0.06})`;
    ctx.lineWidth = 0.5 * S;
    ctx.beginPath();
    ctx.moveTo(tX - 6 * S, tY); ctx.lineTo(tX + 2 * S, tY);
    ctx.lineTo(tX + 4 * S, tY - 3 * S); ctx.lineTo(tX + 8 * S, tY - 3 * S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tX, tY); ctx.lineTo(tX, tY + 5 * S); ctx.lineTo(tX + 3 * S, tY + 7 * S);
    ctx.stroke();
    for (const n of [[tX - 6 * S, tY], [tX + 8 * S, tY - 3 * S], [tX + 3 * S, tY + 7 * S]] as const) {
      ctx.beginPath();
      ctx.arc(n[0], n[1], 1 * S, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(229,35,36,${speaking ? 0.3 + bands.amplitude * 0.4 : 0.08})`;
      ctx.fill();
    }

    // ═══════════════════════════════════════════════════════════
    // MECHANICAL EARS — 3D with shadow and highlight
    // ═══════════════════════════════════════════════════════════
    for (const side of [-1, 1]) {
      const eX = hx + side * (hw * 0.92), eY = hy + hh * 0.05;

      // Ear shadow behind
      ctx.beginPath();
      ctx.ellipse(eX + side * 5 * S, eY + 2 * S, 7 * S, 10 * S, side * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fill();

      // Ear recess
      ctx.beginPath();
      ctx.ellipse(eX + side * 3 * S, eY, 6 * S, 9 * S, side * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#1a0a0a';
      ctx.fill();

      // Ear shell — 3D C-shape (red metallic)
      ctx.beginPath();
      ctx.arc(eX + side * 4 * S, eY, 10 * S, -Math.PI * 0.6 * side + Math.PI * 0.5, Math.PI * 0.6 * side + Math.PI * 0.5, side > 0);
      ctx.strokeStyle = lg(eX, eY - 10 * S, eX + side * 8 * S, eY + 10 * S, [
        [0, '#8a2020'], [0.4, '#6a1818'], [1, '#3a0e0e'],
      ]);
      ctx.lineWidth = 4 * S;
      ctx.stroke();
      // Edge highlight
      ctx.strokeStyle = 'rgba(255,200,200,0.08)';
      ctx.lineWidth = 1 * S;
      ctx.stroke();

      // Inner ear ring detail
      ctx.beginPath();
      ctx.ellipse(eX + side * 3 * S, eY, 4 * S, 6 * S, side * 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(229,35,36,${speaking ? 0.12 + bands.amplitude * 0.1 : 0.05})`;
      ctx.lineWidth = 0.5 * S;
      ctx.stroke();

      // Ear screw with 3D
      ctx.beginPath();
      ctx.arc(eX + side * 7 * S, eY - 7 * S, 1.5 * S, 0, Math.PI * 2);
      ctx.fillStyle = rg(eX + side * 6.5 * S, eY - 7.5 * S, 0, 1.5 * S, [
        [0, 'rgba(255,200,200,0.3)'], [1, 'rgba(120,50,50,0.4)'],
      ]);
      ctx.fill();
    }

    // ═══════════════════════════════════════════════════════════
    // EYEBROWS — 3D raised panel with shadow underneath
    // ═══════════════════════════════════════════════════════════
    const browY = hy - hh * 0.06;
    for (const side of [-1, 1]) {
      const bx = hx + side * hw * 0.4, bw = hw * 0.32;

      // Brow shadow underneath
      ctx.beginPath();
      ctx.moveTo(bx - side * bw, browY + 5 * S);
      ctx.quadraticCurveTo(bx + side * bw * 0.15, browY - 1 * S, bx + side * bw * 0.75, browY + 3 * S);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 3 * S;
      ctx.stroke();

      // Main brow (dark charcoal)
      ctx.beginPath();
      ctx.moveTo(bx - side * bw, browY + 3 * S);
      ctx.quadraticCurveTo(bx + side * bw * 0.15, browY - 4 * S, bx + side * bw * 0.75, browY + 1 * S);
      ctx.strokeStyle = '#3a2020';
      ctx.lineWidth = 2.8 * S;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Brow top-edge highlight
      ctx.beginPath();
      ctx.moveTo(bx - side * bw * 0.9, browY + 2 * S);
      ctx.quadraticCurveTo(bx + side * bw * 0.1, browY - 5 * S, bx + side * bw * 0.7, browY + 0.5 * S);
      ctx.strokeStyle = 'rgba(255,220,220,0.1)';
      ctx.lineWidth = 0.6 * S;
      ctx.stroke();
    }

    // ═══════════════════════════════════════════════════════════
    // EYES — glowing InstaPass red with deep 3D sockets
    // ═══════════════════════════════════════════════════════════
    const eyeY = hy + hh * 0.08;
    const eyeSp = hw * 0.42, eyeW = hw * 0.26, eyeH = hh * 0.12 * eyeOpen;

    for (const side of [-1, 1]) {
      const ex = hx + side * eyeSp;

      // Deep socket AO — multi-layer
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, eyeW * 1.4, hh * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 1 * S, eyeW * 1.25, hh * 0.17, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20,8,8,0.5)';
      ctx.fill();

      if (eyeH > 0.5) {
        // Eye glow — multi-layer bloom (red)
        for (const [r, a] of [[3.5, 0.03], [2.2, 0.06], [1.5, 0.1]] as const) {
          ctx.fillStyle = rg(ex, eyeY, 0, eyeW * r, [
            [0, `rgba(229,35,36,${speaking ? a + bands.amplitude * a : a * 0.4})`],
            [1, 'transparent'],
          ]);
          ctx.beginPath();
          ctx.arc(ex, eyeY, eyeW * r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Eye shape
        const drawEye = () => {
          ctx.beginPath();
          ctx.moveTo(ex - eyeW * 1.05, eyeY);
          ctx.bezierCurveTo(ex - eyeW * 0.5, eyeY - eyeH * 1.5, ex + eyeW * 0.5, eyeY - eyeH * 1.5, ex + eyeW * 1.1, eyeY - 1);
          ctx.bezierCurveTo(ex + eyeW * 0.5, eyeY + eyeH * 0.95, ex - eyeW * 0.5, eyeY + eyeH * 0.95, ex - eyeW * 1.05, eyeY);
          ctx.closePath();
        };

        // Eyeball base
        drawEye();
        ctx.fillStyle = '#1a0808';
        ctx.fill();

        // Iris — 3D sphere-like with multiple rings (red)
        drawEye();
        ctx.save();
        ctx.clip();

        // Outer iris
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, eyeW * 0.85, eyeH * 0.9, 0, 0, Math.PI * 2);
        ctx.fillStyle = rg(ex - eyeW * 0.1, eyeY - eyeH * 0.1, 0, eyeW * 0.85, [
          [0, speaking ? '#ffcccc' : '#ff9999'],
          [0.15, '#ff5555'],
          [0.3, '#e52324'],
          [0.5, '#b81c1c'],
          [0.75, '#7a1212'],
          [1, '#4a0a0a'],
        ]);
        ctx.fill();

        // Iris detail rings
        for (const [r, a] of [[0.75, 0.15], [0.6, 0.12], [0.45, 0.1]] as const) {
          ctx.beginPath();
          ctx.ellipse(ex, eyeY, eyeW * r, eyeH * (r + 0.05), 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(229,35,36,${a})`;
          ctx.lineWidth = 0.3 * S;
          ctx.stroke();
        }

        // Iris radial spokes
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(ex + Math.cos(angle) * eyeW * 0.3, eyeY + Math.sin(angle) * eyeH * 0.45);
          ctx.lineTo(ex + Math.cos(angle) * eyeW * 0.8, eyeY + Math.sin(angle) * eyeH * 0.85);
          ctx.strokeStyle = 'rgba(229,35,36,0.06)';
          ctx.lineWidth = 0.3 * S;
          ctx.stroke();
        }

        // Pupil with depth
        ctx.beginPath();
        ctx.ellipse(ex, eyeY, eyeW * 0.22, eyeH * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = rg(ex, eyeY, 0, eyeW * 0.22, [
          [0, '#0a0202'], [0.7, '#1a0808'], [1, '#2a1010'],
        ]);
        ctx.fill();

        ctx.restore();

        // Specular highlights on eye — crisp white
        ctx.beginPath();
        ctx.ellipse(ex - eyeW * 0.22, eyeY - eyeH * 0.32, eyeW * 0.12, eyeH * 0.14, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex + eyeW * 0.2, eyeY + eyeH * 0.12, eyeW * 0.05, eyeH * 0.05, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,240,240,0.45)';
        ctx.fill();

        // Upper eyelid — thick with 3D shadow cast
        ctx.beginPath();
        ctx.moveTo(ex - eyeW * 1.12, eyeY + 1);
        ctx.bezierCurveTo(ex - eyeW * 0.5, eyeY - eyeH * 1.7, ex + eyeW * 0.5, eyeY - eyeH * 1.7, ex + eyeW * 1.18, eyeY - 1.5);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 3.5 * S;
        ctx.stroke();
        ctx.strokeStyle = '#2a1212';
        ctx.lineWidth = 2 * S;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Lid edge catch light
        ctx.strokeStyle = 'rgba(255,220,220,0.08)';
        ctx.lineWidth = 0.5 * S;
        ctx.stroke();

        // Lower lid
        ctx.beginPath();
        ctx.moveTo(ex - eyeW * 0.85, eyeY + eyeH * 0.7);
        ctx.bezierCurveTo(ex - eyeW * 0.3, eyeY + eyeH * 1.1, ex + eyeW * 0.3, eyeY + eyeH * 1.0, ex + eyeW * 0.9, eyeY + 1);
        ctx.strokeStyle = 'rgba(60,25,25,0.35)';
        ctx.lineWidth = 0.8 * S;
        ctx.stroke();

      } else {
        // Closed eye — with residual glow
        ctx.beginPath();
        ctx.moveTo(ex - eyeW * 1.1, eyeY);
        ctx.quadraticCurveTo(ex, eyeY - 1.5, ex + eyeW * 1.15, eyeY);
        ctx.strokeStyle = '#2a1212';
        ctx.lineWidth = 2 * S;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.strokeStyle = `rgba(229,35,36,0.12)`;
        ctx.lineWidth = 0.5 * S;
        ctx.stroke();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // NOSE — 3D sculpted with shadow planes
    // ═══════════════════════════════════════════════════════════
    const noseY = hy + hh * 0.28;

    // Nose shadow — right side
    ctx.beginPath();
    ctx.moveTo(hx + 1.5 * S, hy + hh * 0.1);
    ctx.bezierCurveTo(hx + 3 * S, hy + hh * 0.18, hx + 4 * S, noseY - 3 * S, hx + 3 * S, noseY + 3 * S);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 3 * S;
    ctx.stroke();

    // Nose bridge left edge
    ctx.beginPath();
    ctx.moveTo(hx - 0.5 * S, hy + hh * 0.08);
    ctx.bezierCurveTo(hx, hy + hh * 0.18, hx + 1 * S, noseY - 4 * S, hx, noseY + 1 * S);
    ctx.strokeStyle = 'rgba(60,30,30,0.2)';
    ctx.lineWidth = 0.8 * S;
    ctx.stroke();

    // Nose tip — rounded with highlight
    ctx.beginPath();
    ctx.moveTo(hx - 4 * S, noseY + 1 * S);
    ctx.quadraticCurveTo(hx, noseY + 5 * S, hx + 4 * S, noseY + 1 * S);
    ctx.strokeStyle = 'rgba(60,30,30,0.2)';
    ctx.lineWidth = 0.8 * S;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Nose tip specular
    ctx.fillStyle = rg(hx - 0.5 * S, noseY, 0, 3.5 * S, [
      [0, 'rgba(255,255,255,0.18)'], [0.5, 'rgba(255,220,220,0.06)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - 5 * S, noseY - 4 * S, 10 * S, 10 * S);

    // Nostrils with AO
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(hx + side * 3 * S, noseY + 3 * S, 1.5 * S, 1 * S, side * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(10,3,3,0.35)';
      ctx.fill();
    }

    // ═══════════════════════════════════════════════════════════
    // MOUTH — 3D sculpted lips with rim light
    // ═══════════════════════════════════════════════════════════
    const mY = hy + hh * 0.52;
    const mW = hw * 0.42 * s.width + hw * 0.08;
    const mH = hh * 0.35 * s.height;
    const uC = -mH * (0.3 + s.roundness * 0.7);
    const cpO = mW * (0.3 + s.roundness * 0.3);
    const lC = mH * (0.8 + s.roundness * 0.5) + s.lipCurl * mH * 0.3;

    const drawMouth = () => {
      ctx.beginPath();
      ctx.moveTo(hx - mW, mY);
      ctx.bezierCurveTo(hx - cpO * 0.8, mY + uC * 1.1, hx - mW * 0.15, mY + uC * 0.65, hx, mY + uC * 0.8);
      ctx.bezierCurveTo(hx + mW * 0.15, mY + uC * 0.65, hx + cpO * 0.8, mY + uC * 1.1, hx + mW, mY);
      ctx.bezierCurveTo(hx + cpO * 1.05, mY + lC * 1.15, hx - cpO * 1.05, mY + lC * 1.15, hx - mW, mY);
      ctx.closePath();
    };

    // Mouth shadow underneath
    ctx.save();
    ctx.translate(0, 2 * S);
    drawMouth();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();
    ctx.restore();

    // Mouth glow when speaking (red)
    if (speaking && s.height > 0.05) {
      ctx.fillStyle = rg(hx, mY, 0, mW * 2.5, [
        [0, `rgba(229,35,36,${0.04 + bands.amplitude * 0.06})`], [1, 'transparent'],
      ]);
      ctx.beginPath(); ctx.arc(hx, mY, mW * 2.5, 0, Math.PI * 2); ctx.fill();
    }

    // Mouth interior
    if (s.height > 0.04) {
      drawMouth();
      ctx.fillStyle = lg(hx, mY + uC, hx, mY + lC, [
        [0, '#1a0808'], [0.5, '#0e0404'], [1, '#1a0808'],
      ]);
      ctx.fill();
      if (s.height > 0.3 && bands.mid > 0.3) {
        ctx.beginPath();
        ctx.ellipse(hx, mY + lC * 0.45, mW * 0.3, mH * 0.18, 0, 0, Math.PI);
        ctx.fillStyle = '#4a1a1a';
        ctx.fill();
      }
      if (s.height > 0.1 && s.height < 0.5 && bands.high > 0.3) {
        ctx.beginPath();
        ctx.rect(hx - mW * 0.45, mY + uC * 0.25, mW * 0.9, Math.min(mH * 0.15, 2.5 * S));
        ctx.fillStyle = 'rgba(255,230,230,0.3)';
        ctx.fill();
      }
    }

    // Lip surface — 3D metallic InstaPass red
    drawMouth();
    ctx.fillStyle = lg(hx - mW, mY + uC, hx + mW * 0.3, mY + lC, [
      [0, `rgba(180,25,28,${s.height > 0.04 ? 0.5 : 0.75})`],
      [0.3, `rgba(229,35,36,${s.height > 0.04 ? 0.4 : 0.65})`],
      [0.6, `rgba(160,22,25,${s.height > 0.04 ? 0.35 : 0.7})`],
      [1, `rgba(120,18,20,${s.height > 0.04 ? 0.5 : 0.8})`],
    ]);
    ctx.fill();

    // Lip specular highlight — white key light catch
    drawMouth();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = rg(hx - mW * 0.2, mY + lC * 0.35, 0, mW * 0.6, [
      [0, 'rgba(255,220,220,0.15)'], [0.5, 'rgba(255,180,180,0.05)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - mW * 1.5, mY - mH * 2, mW * 3, mH * 4);
    // Upper lip cupid's bow highlight
    ctx.fillStyle = rg(hx, mY + uC * 0.7, 0, mW * 0.25, [
      [0, 'rgba(255,255,255,0.12)'], [1, 'transparent'],
    ]);
    ctx.fillRect(hx - mW * 0.3, mY + uC * 1.5, mW * 0.6, Math.abs(uC) * 2);
    ctx.restore();

    // Lip outline
    drawMouth();
    ctx.strokeStyle = speaking
      ? `rgba(229,35,36,${0.12 + bands.amplitude * 0.15})`
      : 'rgba(100,40,40,0.25)';
    ctx.lineWidth = 0.8 * S;
    ctx.stroke();

    // Lip seam when closed
    if (s.height < 0.06) {
      ctx.beginPath();
      ctx.moveTo(hx - mW, mY);
      ctx.quadraticCurveTo(hx, mY - 0.5, hx + mW, mY);
      ctx.strokeStyle = 'rgba(60,20,20,0.35)';
      ctx.lineWidth = 0.6 * S;
      ctx.stroke();
    }

    // ═══════════════════════════════════════════════════════════
    // FINAL HEAD OUTLINE — with speaking bloom
    // ═══════════════════════════════════════════════════════════
    drawHead();
    ctx.strokeStyle = 'rgba(120,80,80,0.12)';
    ctx.lineWidth = 0.7 * S;
    ctx.stroke();

    if (speaking && bands.amplitude > 0.1) {
      drawHead();
      ctx.shadowColor = '#E52324';
      ctx.shadowBlur = 8 * S * bands.amplitude;
      ctx.strokeStyle = `rgba(229,35,36,${0.04 + bands.amplitude * 0.06})`;
      ctx.lineWidth = 1.5 * S;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(draw);
  }, [speaking, width, height, getAnalyser]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  return <canvas ref={canvasRef} className={className} style={{ width, height, display: 'block' }} />;
}
