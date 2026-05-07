/* ═══════════════════════════════════════════════════════════════
   MINIMAL QR CODE ENGINE  (no external libs)
   Supports byte-mode encoding, ECC level M, versions 1-10
   ═══════════════════════════════════════════════════════════════ */

// Galois Field GF(256) tables
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x = x << 1;
    if (x & 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function rsGenPoly(nsym: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < nsym; i++) {
    const ng = new Uint8Array(g.length + 1);
    for (let j = 0; j < g.length; j++) {
      ng[j] ^= g[j];
      ng[j + 1] ^= gfMul(g[j], GF_EXP[i]);
    }
    g = ng;
  }
  return g;
}

function rsEncode(data: Uint8Array, nsym: number): Uint8Array {
  const gen = rsGenPoly(nsym);
  const out = new Uint8Array(data.length + nsym);
  out.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = out[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        out[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return out.slice(data.length);
}

// QR version capacity table for byte mode, ECC level M
const VERSION_TABLE: { ver: number; size: number; dataCw: number; ecCw: number; ecBlocks: [number, number][] }[] = [
  { ver: 1, size: 21, dataCw: 16, ecCw: 10, ecBlocks: [[1, 16]] },
  { ver: 2, size: 25, dataCw: 28, ecCw: 16, ecBlocks: [[1, 28]] },
  { ver: 3, size: 29, dataCw: 44, ecCw: 26, ecBlocks: [[1, 44]] },
  { ver: 4, size: 33, dataCw: 64, ecCw: 18, ecBlocks: [[2, 32]] },
  { ver: 5, size: 37, dataCw: 86, ecCw: 24, ecBlocks: [[2, 43]] },
  { ver: 6, size: 41, dataCw: 108, ecCw: 16, ecBlocks: [[4, 27]] },
  { ver: 7, size: 45, dataCw: 124, ecCw: 18, ecBlocks: [[4, 31]] },
  { ver: 8, size: 49, dataCw: 152, ecCw: 20, ecBlocks: [[2, 38], [2, 39]] },
  { ver: 9, size: 53, dataCw: 180, ecCw: 24, ecBlocks: [[3, 36], [2, 37]] },
  { ver: 10, size: 57, dataCw: 213, ecCw: 28, ecBlocks: [[4, 40], [1, 41]] },
];

// Alignment pattern positions per version
const ALIGN_POS: Record<number, number[]> = {
  2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34],
  7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 52],
};

function pickVersion(byteLen: number) {
  for (const v of VERSION_TABLE) {
    const lenBits = v.ver >= 10 ? 16 : 8;
    const available = v.dataCw * 8 - 4 - lenBits;
    if (byteLen * 8 <= available) return v;
  }
  return VERSION_TABLE[VERSION_TABLE.length - 1];
}

export function encodeData(text: string): { modules: boolean[][]; size: number } {
  const bytes = new TextEncoder().encode(text);
  const vInfo = pickVersion(bytes.length);
  const { size, dataCw, ecCw, ecBlocks, ver } = vInfo;

  const bits: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  pushBits(0b0100, 4);
  const lenBits = ver >= 10 ? 16 : 8;
  pushBits(bytes.length, lenBits);
  for (const b of bytes) pushBits(b, 8);

  const totalBits = dataCw * 8;
  const termLen = Math.min(4, totalBits - bits.length);
  pushBits(0, termLen);

  while (bits.length % 8 !== 0) bits.push(0);

  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < totalBits) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataArr = new Uint8Array(dataCw);
  for (let i = 0; i < dataCw; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | (bits[i * 8 + b] || 0);
    dataArr[i] = byte;
  }

  // ecCw is the number of EC codewords PER block, not total
  const ecPerBlock = ecCw;
  const dataBlocks: Uint8Array[] = [];
  const ecBlocksArr: Uint8Array[] = [];
  let offset = 0;
  for (const [count, blockSize] of ecBlocks) {
    for (let i = 0; i < count; i++) {
      const block = dataArr.slice(offset, offset + blockSize);
      dataBlocks.push(block);
      ecBlocksArr.push(rsEncode(block, ecPerBlock));
      offset += blockSize;
    }
  }

  const interleaved: number[] = [];
  const maxDataLen = Math.max(...dataBlocks.map(b => b.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) interleaved.push(block[i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (const block of ecBlocksArr) {
      if (i < block.length) interleaved.push(block[i]);
    }
  }

  const modules: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  const reserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const setMod = (r: number, c: number, val: boolean, res = true) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      modules[r][c] = val;
      if (res) reserved[r][c] = true;
    }
  };

  const drawFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const inInner = r >= 1 && r <= 5 && c >= 1 && c <= 5;
        const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const dark = inCore || (inOuter && !inInner);
        setMod(row + r, col + c, dark);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i++) {
    setMod(6, i, i % 2 === 0);
    setMod(i, 6, i % 2 === 0);
  }

  if (ALIGN_POS[ver]) {
    const positions = ALIGN_POS[ver];
    for (const row of positions) {
      for (const col of positions) {
        if (reserved[row]?.[col]) continue;
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            const dark = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
            setMod(row + r, col + c, dark);
          }
        }
      }
    }
  }

  setMod(size - 8, 8, true);

  for (let i = 0; i < 8; i++) {
    if (!reserved[8][i]) { reserved[8][i] = true; modules[8][i] = false; }
    if (!reserved[8][size - 1 - i]) { reserved[8][size - 1 - i] = true; modules[8][size - 1 - i] = false; }
    if (!reserved[i][8]) { reserved[i][8] = true; modules[i][8] = false; }
    if (!reserved[size - 1 - i][8]) { reserved[size - 1 - i][8] = true; modules[size - 1 - i][8] = false; }
  }
  if (!reserved[8][8]) { reserved[8][8] = true; modules[8][8] = false; }

  const dataBits: number[] = [];
  for (const byte of interleaved) {
    for (let b = 7; b >= 0; b--) dataBits.push((byte >> b) & 1);
  }
  const remainderBits = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0][ver - 1] || 0;
  for (let i = 0; i < remainderBits; i++) dataBits.push(0);

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col = 5;
    const rows = upward ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);
    for (const row of rows) {
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (c < 0 || c >= size) continue;
        if (reserved[row][c]) continue;
        modules[row][c] = bitIdx < dataBits.length ? dataBits[bitIdx++] === 1 : false;
      }
    }
    upward = !upward;
  }

  const mask = (r: number, c: number) => (r + c) % 2 === 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c]) {
        modules[r][c] = (modules[r][c] as boolean) !== mask(r, c);
      }
    }
  }

  const formatBits = 0b101010000010010;
  const FORMAT_POS_H = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  const FORMAT_POS_V = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
    [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    const bit = ((formatBits >> (14 - i)) & 1) === 1;
    const [r1, c1] = FORMAT_POS_H[i];
    const [r2, c2] = FORMAT_POS_V[i];
    modules[r1][c1] = bit;
    modules[r2][c2] = bit;
  }

  return { modules: modules.map(row => row.map(v => v === true)), size };
}

/* ─── SVG Renderer ─── */
export interface QRStyle {
  bg: string;
  fg: string;
  pattern: 'square' | 'dots' | 'rounded' | 'diamond' | 'instapass';
  corner: 'bullseye' | 'rounded' | 'sharp';
  showLogo: boolean;
  customLogoUrl?: string; // data URL or object URL of uploaded image
}

export function renderQRSvg(
  modules: boolean[][],
  qrSize: number,
  style: QRStyle,
  svgSize = 300,
  quiet = 2,
  shape: 'square' | 'circle' = 'square',
  logoText?: string,
  logoColor?: string,
  logoSvgContent?: string,
): string {
  const total = qrSize + quiet * 2;
  const cellSize = svgSize / total;
  const paths: string[] = [];

  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= qrSize - 7) || (r >= qrSize - 7 && c < 7);

  for (let r = 0; r < qrSize; r++) {
    for (let c = 0; c < qrSize; c++) {
      if (!modules[r][c]) continue;

      if (style.showLogo) {
        const center = qrSize / 2;
        const logoR = qrSize * 0.15;
        if (Math.abs(r - center) < logoR && Math.abs(c - center) < logoR) continue;
      }

      const x = (c + quiet) * cellSize;
      const y = (r + quiet) * cellSize;
      const s = cellSize;
      const gap = cellSize * 0.15;

      if (isFinder(r, c)) {
        switch (style.corner) {
          case 'rounded':
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.3}" fill="${style.fg}"/>`);
            break;
          case 'bullseye':
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.5}" fill="${style.fg}"/>`);
            break;
          default:
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${style.fg}"/>`);
        }
      } else {
        switch (style.pattern) {
          case 'dots':
            paths.push(`<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.4}" fill="${style.fg}"/>`);
            break;
          case 'rounded':
            paths.push(`<rect x="${x + gap / 2}" y="${y + gap / 2}" width="${s - gap}" height="${s - gap}" rx="${s * 0.35}" fill="${style.fg}"/>`);
            break;
          case 'diamond': {
            const cx = x + s / 2, cy = y + s / 2, d = s * 0.42;
            paths.push(`<polygon points="${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}" fill="${style.fg}"/>`);
            break;
          }
          case 'instapass':
            paths.push(`<rect x="${x + gap * 0.3}" y="${y + gap * 0.3}" width="${s - gap * 0.6}" height="${s - gap * 0.6}" rx="${s * 0.2}" fill="${style.fg}" opacity="0.95"/>`);
            break;
          default:
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${style.fg}"/>`);
        }
      }
    }
  }

  let logoSvg = '';
  if (style.showLogo) {
    const cx = svgSize / 2;
    const cy = svgSize / 2;
    const lr = svgSize * 0.12;
    const pad = lr * 0.35;
    // White knockout background (larger)
    const bgR = lr + pad;
    logoSvg += `<rect x="${cx - bgR}" y="${cy - bgR}" width="${bgR * 2}" height="${bgR * 2}" rx="${bgR * 0.35}" fill="${style.bg}"/>`;

    if (logoSvgContent) {
      // Render SVG icon content scaled into the logo area
      const iconSize = lr * 2;
      logoSvg += `<g transform="translate(${cx - lr}, ${cy - lr}) scale(${iconSize / 24})">${logoSvgContent}</g>`;
    } else {
      // Fallback: colored square with text
      const lc = logoColor || '#E52324';
      const lt = logoText || 'IP';
      const fs = lt.length > 2 ? lr * 0.55 : lr * 0.75;
      logoSvg += `<rect x="${cx - lr}" y="${cy - lr}" width="${lr * 2}" height="${lr * 2}" rx="${lr * 0.25}" fill="${lc}"/>`;
      logoSvg += `<text x="${cx}" y="${cy + fs * 0.36}" text-anchor="middle" fill="white" font-size="${fs}" font-weight="900" font-family="system-ui, sans-serif">${lt}</text>`;
    }
  }

  const clipId = shape === 'circle' ? `clip-circle-${svgSize}-${Math.random().toString(36).slice(2, 8)}` : '';
  const clipDef = shape === 'circle'
    ? `<defs><clipPath id="${clipId}"><circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${svgSize / 2}"/></clipPath></defs>`
    : '';
  const groupOpen = shape === 'circle' ? `<g clip-path="url(#${clipId})">` : '';
  const groupClose = shape === 'circle' ? '</g>' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
    ${clipDef}
    ${groupOpen}
    <rect width="${svgSize}" height="${svgSize}" fill="${style.bg}"/>
    ${paths.join('\n    ')}
    ${logoSvg}
    ${groupClose}
  </svg>`;
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS + TYPES
   ═══════════════════════════════════════════════════════════════ */

export type QRTypeId = 'website' | 'vcard' | 'wifi' | 'email' | 'sms' | 'text' | 'event' | 'social';

export interface QRTypeOption {
  id: QRTypeId;
  label: string;
  placeholder: string;
}

export const QR_TYPES: QRTypeOption[] = [
  { id: 'website', label: 'Website', placeholder: 'https://example.com' },
  { id: 'vcard', label: 'Contact / vCard', placeholder: 'BEGIN:VCARD\\nFN:Jane Doe\\nTEL:+1234567890\\nEND:VCARD' },
  { id: 'wifi', label: 'WiFi', placeholder: 'WIFI:T:WPA;S:NetworkName;P:password;;' },
  { id: 'email', label: 'Email', placeholder: 'mailto:hello@example.com?subject=Hello' },
  { id: 'sms', label: 'SMS', placeholder: 'smsto:+1234567890:Your message here' },
  { id: 'text', label: 'Text', placeholder: 'Enter any text content...' },
  { id: 'event', label: 'Event', placeholder: 'BEGIN:VEVENT\\nSUMMARY:My Event\\nDTSTART:20260301T190000Z\\nEND:VEVENT' },
  { id: 'social', label: 'Social', placeholder: 'https://instagram.com/yourhandle' },
];

export interface StylePreset {
  id: string;
  label: string;
  bg: string;
  fg: string;
  preview: { bg: string; fg: string };
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'instapass', label: 'InstaPass', bg: '#0a0a0a', fg: '#E52324', preview: { bg: '#0a0a0a', fg: '#E52324' } },
  { id: 'classic', label: 'Classic', bg: '#ffffff', fg: '#000000', preview: { bg: '#ffffff', fg: '#000000' } },
  { id: 'dark', label: 'Dark', bg: '#111111', fg: '#ffffff', preview: { bg: '#111111', fg: '#ffffff' } },
  { id: 'inverted', label: 'Inverted', bg: '#000000', fg: '#E52324', preview: { bg: '#000000', fg: '#E52324' } },
  { id: 'slate', label: 'Slate', bg: '#1e293b', fg: '#94a3b8', preview: { bg: '#1e293b', fg: '#94a3b8' } },
  { id: 'gold', label: 'Gold', bg: '#1a1207', fg: '#d4a017', preview: { bg: '#1a1207', fg: '#d4a017' } },
];

export type PatternId = 'instapass' | 'dots' | 'rounded' | 'square' | 'diamond';
export type CornerId = 'bullseye' | 'rounded' | 'sharp';

export const PATTERNS: { id: PatternId; label: string }[] = [
  { id: 'instapass', label: 'InstaPass' },
  { id: 'dots', label: 'Dots' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'square', label: 'Square' },
  { id: 'diamond', label: 'Diamond' },
];

export const CORNERS: { id: CornerId; label: string }[] = [
  { id: 'bullseye', label: 'Bullseye' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'sharp', label: 'Sharp' },
];

export interface SmartCodeEntry {
  id: string;
  name: string;
  qrType: QRTypeId;
  content: string;
  style: QRStyle;
  scans: number;
  status: 'active' | 'paused';
  createdAt: string;
  svgMarkup: string;
}