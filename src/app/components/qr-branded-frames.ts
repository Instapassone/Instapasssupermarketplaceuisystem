/* ═══════════════════════════════════════════════════════════════
   INSTAPASS BRANDED QR FRAME RENDERER
   Wraps a core QR SVG in premium branded frames with:
   - CTA ring text (curved around QR)
   - Watermark / footer branding
   - Frame treatments (circle, badge, gradient)
   - Glow / accent effects
   ═══════════════════════════════════════════════════════════════ */

export type FrameId =
  | "none"
  | "ring-red"
  | "ring-cyan"
  | "ring-gradient"
  | "badge-vip"
  | "badge-gold"
  | "badge-purple";

export interface FrameOption {
  id: FrameId;
  label: string;
  description: string;
  category: "none" | "circular" | "badge";
  borderColor: string;
  accentColor: string;
  bgColor: string;
  defaultCta: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "none",
    label: "No Frame",
    description: "Raw QR code only",
    category: "none",
    borderColor: "transparent",
    accentColor: "#E52324",
    bgColor: "transparent",
    defaultCta: "",
  },
  {
    id: "ring-red",
    label: "Red Ring",
    description: "Circular frame with CTA ring text",
    category: "circular",
    borderColor: "#E52324",
    accentColor: "#FF4444",
    bgColor: "#1A0505",
    defaultCta: "SCAN TO UNLOCK EXCLUSIVE CONTENT",
  },
  {
    id: "ring-cyan",
    label: "Cyan Ring",
    description: "Event access circular frame",
    category: "circular",
    borderColor: "#00D9FF",
    accentColor: "#00FFD1",
    bgColor: "#051A1F",
    defaultCta: "SCAN FOR EVENT ACCESS",
  },
  {
    id: "ring-gradient",
    label: "Gradient Ring",
    description: "Multi-color gradient ring",
    category: "circular",
    borderColor: "#8B5CF6",
    accentColor: "#EC4899",
    bgColor: "#0F0520",
    defaultCta: "SCAN TO EXPLORE",
  },
  {
    id: "badge-vip",
    label: "VIP Badge",
    description: "Premium VIP entry badge",
    category: "badge",
    borderColor: "#8B5CF6",
    accentColor: "#C084FC",
    bgColor: "#1A1035",
    defaultCta: "VIP ENTRY",
  },
  {
    id: "badge-gold",
    label: "Gold Badge",
    description: "Premium gold shopping badge",
    category: "badge",
    borderColor: "#D4A017",
    accentColor: "#FFD700",
    bgColor: "#1A1507",
    defaultCta: "SCAN TO SHOP",
  },
  {
    id: "badge-purple",
    label: "Purple Badge",
    description: "Content unlock badge",
    category: "badge",
    borderColor: "#6D28D9",
    accentColor: "#A78BFA",
    bgColor: "#120D25",
    defaultCta: "SCAN TO UNLOCK CONTENT",
  },
];

export interface BrandedFrameConfig {
  frameId: FrameId;
  ctaText: string;
  watermarkText: string;
  borderColor: string;
  accentColor: string;
}

/**
 * Wraps raw QR SVG paths in a branded frame
 */
export function renderBrandedFrame(
  /** The inner QR SVG content (paths only, no <svg> wrapper) */
  qrInnerSvg: string,
  /** Total canvas size */
  canvasSize: number,
  /** The inner QR code size (will be scaled down to fit in frame) */
  qrSize: number,
  config: BrandedFrameConfig,
  qrBg: string,
): string {
  const { frameId, ctaText, watermarkText, borderColor, accentColor } = config;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const uid = Math.random().toString(36).slice(2, 8);

  if (frameId === "none") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasSize} ${canvasSize}" width="100%" height="100%">
      ${qrInnerSvg}
    </svg>`;
  }

  const frame = FRAME_OPTIONS.find((f) => f.id === frameId)!;
  const frameBg = frame.bgColor;

  if (frame.category === "circular") {
    return renderCircularFrame(qrInnerSvg, canvasSize, qrSize, cx, cy, uid, {
      borderColor,
      accentColor,
      frameBg,
      ctaText,
      watermarkText,
      qrBg,
    });
  }

  if (frame.category === "badge") {
    return renderBadgeFrame(qrInnerSvg, canvasSize, qrSize, cx, cy, uid, {
      borderColor,
      accentColor,
      frameBg,
      ctaText,
      watermarkText,
      qrBg,
      frameId,
    });
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasSize} ${canvasSize}" width="100%" height="100%">
    ${qrInnerSvg}
  </svg>`;
}

/* ─── CIRCULAR FRAME ─── */
function renderCircularFrame(
  qrInnerSvg: string,
  size: number,
  qrSize: number,
  cx: number,
  cy: number,
  uid: string,
  opts: {
    borderColor: string;
    accentColor: string;
    frameBg: string;
    ctaText: string;
    watermarkText: string;
    qrBg: string;
  },
): string {
  // Shift ring up to leave room for watermark at bottom
  const hasWm = !!opts.watermarkText;
  const ringCy = hasWm ? cy - size * 0.045 : cy;
  const outerR = size * 0.38;
  const borderW = size * 0.028;
  const innerR = outerR - borderW * 2;
  const qrAreaR = innerR * 0.78;
  const textR = outerR - borderW * 0.5;

  // Tick marks around the outer ring
  const tickCount = 72;
  const ticks: string[] = [];
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2 - Math.PI / 2;
    const isMajor = i % 9 === 0;
    const r1 = innerR + borderW * 0.3;
    const r2 = innerR + borderW * (isMajor ? 1.4 : 0.9);
    const x1 = cx + Math.cos(angle) * r1;
    const y1 = ringCy + Math.sin(angle) * r1;
    const x2 = cx + Math.cos(angle) * r2;
    const y2 = ringCy + Math.sin(angle) * r2;
    ticks.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${opts.borderColor}" stroke-width="${isMajor ? 1.5 : 0.7}" opacity="${isMajor ? 0.8 : 0.3}"/>`,
    );
  }

  // Spark accents (small dots at cardinal points)
  const sparks: string[] = [];
  [0, 90, 180, 270].forEach((deg, i) => {
    const angle = (deg * Math.PI) / 180 - Math.PI / 2;
    const sr = outerR + size * 0.01;
    const sx = cx + Math.cos(angle) * sr;
    const sy = ringCy + Math.sin(angle) * sr;
    sparks.push(
      `<circle cx="${sx}" cy="${sy}" r="${size * 0.008}" fill="${opts.accentColor}" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.3;0.9" dur="${1.5 + i * 0.3}s" repeatCount="indefinite"/>
      </circle>`,
    );
  });

  // CTA ring text
  const ctaSvg = opts.ctaText
    ? `<defs>
        <path id="cta-${uid}" d="M ${cx},${ringCy} m -${textR},0 a ${textR},${textR} 0 1,1 ${textR * 2},0 a ${textR},${textR} 0 1,1 -${textR * 2},0"/>
      </defs>
      <text fill="${opts.borderColor}" font-size="${size * 0.028}" font-weight="900" font-family="'Outfit', 'Arial', sans-serif" letter-spacing="${size * 0.006}" opacity="0.95">
        <textPath href="#cta-${uid}" startOffset="5%" textLength="${textR * Math.PI * 1.5}">${opts.ctaText}</textPath>
      </text>`
    : "";

  // Watermark at bottom
  const wmY = ringCy + outerR + size * 0.1;
  const wmFontSize = size * 0.072;
  const wmLineW = size * 0.08;
  const wmLineY = wmY - wmFontSize * 0.25;
  const wmSvg = opts.watermarkText
    ? `<!-- Decorative lines flanking watermark -->
      <line x1="${cx - wmFontSize * opts.watermarkText.length * 0.28 - wmLineW - size * 0.02}" y1="${wmLineY}" x2="${cx - wmFontSize * opts.watermarkText.length * 0.28 - size * 0.01}" y2="${wmLineY}" stroke="${opts.borderColor}" stroke-width="2" opacity="0.4"/>
      <line x1="${cx + wmFontSize * opts.watermarkText.length * 0.28 + size * 0.01}" y1="${wmLineY}" x2="${cx + wmFontSize * opts.watermarkText.length * 0.28 + wmLineW + size * 0.02}" y2="${wmLineY}" stroke="${opts.borderColor}" stroke-width="2" opacity="0.4"/>
      <!-- Watermark glow -->
      <text x="${cx}" y="${wmY}" text-anchor="middle" fill="${opts.borderColor}" font-size="${wmFontSize}" font-weight="900" font-family="'Outfit', 'Arial Black', sans-serif" letter-spacing="${size * 0.012}" opacity="0.15" filter="url(#glow-${uid})">${opts.watermarkText}</text>
      <!-- Watermark text -->
      <text x="${cx}" y="${wmY}" text-anchor="middle" fill="${opts.borderColor}" font-size="${wmFontSize}" font-weight="900" font-family="'Outfit', 'Arial Black', sans-serif" letter-spacing="${size * 0.012}" opacity="1">${opts.watermarkText}</text>`
    : "";

  // Scale QR to fit inside circle
  const qrScale = (qrAreaR * 2) / qrSize;
  const qrOffset = cx - qrAreaR;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
    <defs>
      <radialGradient id="bg-${uid}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${opts.frameBg}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>
      <filter id="glow-${uid}">
        <feGaussianBlur stdDeviation="${size * 0.008}" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <clipPath id="qr-clip-${uid}">
        <circle cx="${cx}" cy="${ringCy}" r="${qrAreaR}"/>
      </clipPath>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" fill="url(#bg-${uid})"/>

    <!-- Outer glow ring -->
    <circle cx="${cx}" cy="${ringCy}" r="${outerR + borderW * 0.5}" fill="none" stroke="${opts.borderColor}" stroke-width="${borderW * 0.3}" opacity="0.15" filter="url(#glow-${uid})"/>

    <!-- Main border ring -->
    <circle cx="${cx}" cy="${ringCy}" r="${outerR}" fill="none" stroke="${opts.borderColor}" stroke-width="${borderW}" opacity="0.85"/>

    <!-- Inner ring -->
    <circle cx="${cx}" cy="${ringCy}" r="${innerR}" fill="none" stroke="${opts.borderColor}" stroke-width="${borderW * 0.3}" opacity="0.3"/>

    <!-- Tick marks -->
    ${ticks.join("\n    ")}

    <!-- Spark accents -->
    ${sparks.join("\n    ")}

    <!-- QR code white background circle -->
    <circle cx="${cx}" cy="${ringCy}" r="${qrAreaR + size * 0.005}" fill="${opts.qrBg}"/>

    <!-- QR Code (clipped to circle) -->
    <g clip-path="url(#qr-clip-${uid})">
      <g transform="translate(${cx - qrAreaR}, ${ringCy - qrAreaR}) scale(${qrScale})">
        ${qrInnerSvg}
      </g>
    </g>

    <!-- CTA Ring Text -->
    ${ctaSvg}

    <!-- Watermark -->
    ${wmSvg}
  </svg>`;
}

/* ─── BADGE (ROUNDED SQUARE) FRAME ─── */
function renderBadgeFrame(
  qrInnerSvg: string,
  size: number,
  qrSize: number,
  cx: number,
  cy: number,
  uid: string,
  opts: {
    borderColor: string;
    accentColor: string;
    frameBg: string;
    ctaText: string;
    watermarkText: string;
    qrBg: string;
    frameId: FrameId;
  },
): string {
  const padding = size * 0.06;
  const radius = size * 0.06;
  const borderW = size * 0.012;
  const headerH = size * 0.09;
  const footerH = size * 0.08;

  const frameX = padding;
  const frameY = padding;
  const frameW = size - padding * 2;
  const frameH = size - padding * 2;

  const qrPad = size * 0.04;
  const qrAreaX = frameX + qrPad;
  const qrAreaY = frameY + headerH + qrPad * 0.5;
  const qrAreaW = frameW - qrPad * 2;
  const qrAreaH = frameH - headerH - footerH - qrPad;

  const qrFit = Math.min(qrAreaW, qrAreaH);
  const qrScale = qrFit / qrSize;
  const qrOffX = qrAreaX + (qrAreaW - qrFit) / 2;
  const qrOffY = qrAreaY + (qrAreaH - qrFit) / 2;

  // Corner accent lines
  const cornerLen = size * 0.06;
  const corners = [
    // Top-left
    `<line x1="${frameX + radius}" y1="${frameY}" x2="${frameX + radius + cornerLen}" y2="${frameY}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    `<line x1="${frameX}" y1="${frameY + radius}" x2="${frameX}" y2="${frameY + radius + cornerLen}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    // Top-right
    `<line x1="${frameX + frameW - radius - cornerLen}" y1="${frameY}" x2="${frameX + frameW - radius}" y2="${frameY}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    `<line x1="${frameX + frameW}" y1="${frameY + radius}" x2="${frameX + frameW}" y2="${frameY + radius + cornerLen}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    // Bottom-left
    `<line x1="${frameX + radius}" y1="${frameY + frameH}" x2="${frameX + radius + cornerLen}" y2="${frameY + frameH}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    `<line x1="${frameX}" y1="${frameY + frameH - radius - cornerLen}" x2="${frameX}" y2="${frameY + frameH - radius}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    // Bottom-right
    `<line x1="${frameX + frameW - radius - cornerLen}" y1="${frameY + frameH}" x2="${frameX + frameW - radius}" y2="${frameY + frameH}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
    `<line x1="${frameX + frameW}" y1="${frameY + frameH - radius - cornerLen}" x2="${frameX + frameW}" y2="${frameY + frameH - radius}" stroke="${opts.accentColor}" stroke-width="2" opacity="0.6"/>`,
  ];

  // Side glow strips
  const glowStrips = `
    <rect x="${frameX - 2}" y="${cy - size * 0.1}" width="2" height="${size * 0.2}" rx="1" fill="${opts.accentColor}" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
    </rect>
    <rect x="${frameX + frameW}" y="${cy - size * 0.1}" width="2" height="${size * 0.2}" rx="1" fill="${opts.accentColor}" opacity="0.3">
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </rect>
  `;

  // CTA header text
  const ctaY = frameY + headerH * 0.65;
  const ctaSvg = opts.ctaText
    ? `<text x="${cx}" y="${ctaY}" text-anchor="middle" fill="${opts.accentColor}" font-size="${size * 0.032}" font-weight="900" font-family="'Outfit', 'Arial', sans-serif" letter-spacing="${size * 0.005}" opacity="0.95">${opts.ctaText}</text>`
    : "";

  // Divider line under header
  const dividerY = frameY + headerH;
  const divider = `<line x1="${frameX + qrPad}" y1="${dividerY}" x2="${frameX + frameW - qrPad}" y2="${dividerY}" stroke="${opts.borderColor}" stroke-width="0.5" opacity="0.3"/>`;

  // Footer with watermark and branding
  const footerY = frameY + frameH - footerH * 0.35;
  const footerDivY = frameY + frameH - footerH;
  const wmText = opts.watermarkText || "INSTAPASS";
  const badgeWmSize = size * 0.05;
  const footerSvg = `
    <line x1="${frameX + qrPad}" y1="${footerDivY}" x2="${frameX + frameW - qrPad}" y2="${footerDivY}" stroke="${opts.borderColor}" stroke-width="0.5" opacity="0.3"/>
    <!-- Decorative dashes flanking watermark -->
    <line x1="${frameX + qrPad}" y1="${footerY - badgeWmSize * 0.3}" x2="${cx - badgeWmSize * wmText.length * 0.32 - size * 0.01}" y2="${footerY - badgeWmSize * 0.3}" stroke="${opts.accentColor}" stroke-width="1.5" opacity="0.35"/>
    <line x1="${cx + badgeWmSize * wmText.length * 0.32 + size * 0.01}" y1="${footerY - badgeWmSize * 0.3}" x2="${frameX + frameW - qrPad}" y2="${footerY - badgeWmSize * 0.3}" stroke="${opts.accentColor}" stroke-width="1.5" opacity="0.35"/>
    <!-- Watermark glow -->
    <text x="${cx}" y="${footerY}" text-anchor="middle" fill="${opts.accentColor}" font-size="${badgeWmSize}" font-weight="900" font-family="'Outfit', 'Arial Black', sans-serif" letter-spacing="${size * 0.016}" opacity="0.15" filter="url(#badge-glow-${uid})">${wmText}</text>
    <!-- Watermark text -->
    <text x="${cx}" y="${footerY}" text-anchor="middle" fill="${opts.accentColor}" font-size="${badgeWmSize}" font-weight="900" font-family="'Outfit', 'Arial Black', sans-serif" letter-spacing="${size * 0.016}" opacity="0.95">${wmText}</text>
  `;

  // Badge-specific icon in header (optional lock icon for gold)
  let headerIcon = "";
  if (opts.frameId === "badge-gold") {
    const iconX = cx;
    const iconY = frameY + headerH * 0.4;
    const iconS = size * 0.025;
    headerIcon = `
      <rect x="${iconX - iconS}" y="${iconY - iconS * 0.5}" width="${iconS * 2}" height="${iconS * 1.5}" rx="${iconS * 0.2}" fill="none" stroke="${opts.accentColor}" stroke-width="1.5" opacity="0.7"/>
      <path d="M ${iconX - iconS * 0.6},${iconY - iconS * 0.5} L ${iconX - iconS * 0.6},${iconY - iconS * 1.2} A ${iconS * 0.6},${iconS * 0.6} 0 0,1 ${iconX + iconS * 0.6},${iconY - iconS * 1.2} L ${iconX + iconS * 0.6},${iconY - iconS * 0.5}" fill="none" stroke="${opts.accentColor}" stroke-width="1.5" opacity="0.7"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">
    <defs>
      <linearGradient id="badge-bg-${uid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${opts.frameBg}"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <linearGradient id="border-grad-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${opts.borderColor}"/>
        <stop offset="50%" stop-color="${opts.accentColor}"/>
        <stop offset="100%" stop-color="${opts.borderColor}"/>
      </linearGradient>
      <filter id="badge-glow-${uid}">
        <feGaussianBlur stdDeviation="${size * 0.012}" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" fill="url(#badge-bg-${uid})"/>

    <!-- Outer glow -->
    <rect x="${frameX - 2}" y="${frameY - 2}" width="${frameW + 4}" height="${frameH + 4}" rx="${radius + 2}" fill="none" stroke="${opts.borderColor}" stroke-width="${borderW * 0.5}" opacity="0.15" filter="url(#badge-glow-${uid})"/>

    <!-- Main frame -->
    <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" rx="${radius}" fill="${opts.frameBg}" stroke="url(#border-grad-${uid})" stroke-width="${borderW}"/>

    <!-- Corner accents -->
    ${corners.join("\n    ")}

    <!-- Side glow strips -->
    ${glowStrips}

    <!-- Header icon -->
    ${headerIcon}

    <!-- CTA Header -->
    ${ctaSvg}

    <!-- Header divider -->
    ${divider}

    <!-- QR code white background -->
    <rect x="${qrOffX - size * 0.005}" y="${qrOffY - size * 0.005}" width="${qrFit + size * 0.01}" height="${qrFit + size * 0.01}" rx="${size * 0.015}" fill="${opts.qrBg}"/>

    <!-- QR Code -->
    <g transform="translate(${qrOffX}, ${qrOffY}) scale(${qrScale})">
      ${qrInnerSvg}
    </g>

    <!-- Footer -->
    ${footerSvg}
  </svg>`;
}

/**
 * Generates just the inner QR path content (no <svg> wrapper)
 * for use with branded frames
 */
export function getQRInnerPaths(
  modules: boolean[][],
  qrSize: number,
  fg: string,
  bg: string,
  pattern: string,
  corner: string,
  showLogo: boolean,
  quiet: number,
): { paths: string; totalSize: number } {
  const total = qrSize + quiet * 2;
  const cellSize = 1; // Unit-scale, we'll transform later
  const paths: string[] = [];

  // Background
  paths.push(`<rect width="${total}" height="${total}" fill="${bg}"/>`);

  const isFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= qrSize - 7) || (r >= qrSize - 7 && c < 7);

  for (let r = 0; r < qrSize; r++) {
    for (let c = 0; c < qrSize; c++) {
      if (!modules[r][c]) continue;

      if (showLogo) {
        const center = qrSize / 2;
        const logoR = qrSize * 0.15;
        if (Math.abs(r - center) < logoR && Math.abs(c - center) < logoR) continue;
      }

      const x = c + quiet;
      const y = r + quiet;
      const s = cellSize;
      const gap = cellSize * 0.15;

      if (isFinder(r, c)) {
        switch (corner) {
          case "rounded":
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.3}" fill="${fg}"/>`);
            break;
          case "bullseye":
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.5}" fill="${fg}"/>`);
            break;
          default:
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fg}"/>`);
        }
      } else {
        switch (pattern) {
          case "dots":
            paths.push(`<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s * 0.4}" fill="${fg}"/>`);
            break;
          case "rounded":
            paths.push(`<rect x="${x + gap / 2}" y="${y + gap / 2}" width="${s - gap}" height="${s - gap}" rx="${s * 0.35}" fill="${fg}"/>`);
            break;
          case "diamond": {
            const dcx = x + s / 2, dcy = y + s / 2, d = s * 0.42;
            paths.push(`<polygon points="${dcx},${dcy - d} ${dcx + d},${dcy} ${dcx},${dcy + d} ${dcx - d},${dcy}" fill="${fg}"/>`);
            break;
          }
          case "instapass":
            paths.push(`<rect x="${x + gap * 0.3}" y="${y + gap * 0.3}" width="${s - gap * 0.6}" height="${s - gap * 0.6}" rx="${s * 0.2}" fill="${fg}" opacity="0.95"/>`);
            break;
          default:
            paths.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fg}"/>`);
        }
      }
    }
  }

  // Logo
  if (showLogo) {
    const lcx = total / 2;
    const lcy = total / 2;
    const lr = total * 0.12;
    const pad = lr * 0.35;
    const bgR = lr + pad;
    paths.push(`<rect x="${lcx - bgR}" y="${lcy - bgR}" width="${bgR * 2}" height="${bgR * 2}" rx="${bgR * 0.35}" fill="${bg}"/>`);
    const lc = "#E52324";
    const fs = lr * 0.75;
    paths.push(`<rect x="${lcx - lr}" y="${lcy - lr}" width="${lr * 2}" height="${lr * 2}" rx="${lr * 0.25}" fill="${lc}"/>`);
    paths.push(`<text x="${lcx}" y="${lcy + fs * 0.36}" text-anchor="middle" fill="white" font-size="${fs}" font-weight="900" font-family="system-ui, sans-serif">IP</text>`);
  }

  return { paths: paths.join("\n"), totalSize: total };
}