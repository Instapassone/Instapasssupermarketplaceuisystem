/* ═══════════════════════════════════════════════════════════════
   BRAND LOGO SVG ICONS  (24×24 viewBox, inline SVG content)
   Each entry is raw SVG markup to be placed inside a <g> scaled
   into the QR code's center logo area by the engine.
   ═══════════════════════════════════════════════════════════════ */

export const BRAND_LOGOS: Record<string, string> = {
  /* ── Apple — apple silhouette ── */
  apple: `<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000"/>`,

  /* ── McDonald's — golden arches ── */
  mcdonalds: `<path d="M2 20V6.5c0-2 1.2-3.5 2.7-3.5S7 4 7.4 5.8L12 18 16.6 5.8C17 4 18.1 3 19.3 3S22 4.5 22 6.5V20h-3V10l-4 10h-6L5 10v10H2z" fill="#FFC72C"/>`,

  /* ── Starbucks — simplified siren circle ── */
  starbucks: `<circle cx="12" cy="12" r="11" fill="#00704A"/><circle cx="12" cy="12" r="8.5" fill="none" stroke="#fff" stroke-width="0.8"/><path d="M12 4.5c-.8 0-1.5 1.5-1.5 3.5 0 1.2.3 2.3.8 3l.7 1.5.7-1.5c.5-.7.8-1.8.8-3 0-2-.7-3.5-1.5-3.5z" fill="#fff"/><path d="M8.5 13c.3-.5 1-1 1.5-1l1 2.5-1 2c-.5 0-1.5-.8-1.8-1.5L8.5 13z" fill="#fff"/><path d="M15.5 13c-.3-.5-1-1-1.5-1l-1 2.5 1 2c.5 0 1.5-.8 1.8-1.5l-.3-2z" fill="#fff"/><path d="M10 17.5c.5.5 1.2.8 2 .8s1.5-.3 2-.8l-.5-1H10.5l-.5 1z" fill="#fff"/>`,

  /* ── TikTok — musical note shape ── */
  tiktok: `<path d="M16.6 5.82s.51.49 1.86.49V9.5c-1.27 0-2.4-.45-3.1-.95V15a5.5 5.5 0 1 1-4.76-5.45v3.26a2.25 2.25 0 1 0 1.51 2.12V3h3.24c.15 1.27.86 2.38 1.85 2.82h-.6z" fill="#00F2EA"/><path d="M16.6 5.82s.51.49 1.86.49V9.5c-1.27 0-2.4-.45-3.1-.95V15a5.5 5.5 0 1 1-4.76-5.45v3.26a2.25 2.25 0 1 0 1.51 2.12V3h3.24" fill="none" stroke="#FF0050" stroke-width="0.5"/>`,

  /* ── YouTube — play button ── */
  youtube: `<rect x="1" y="5" width="22" height="14" rx="4" fill="#FF0000"/><polygon points="10,8.5 16,12 10,15.5" fill="#fff"/>`,

  /* ── Burger King — flame-grilled circle ── */
  burgerking: `<circle cx="12" cy="12" r="10" fill="#D62300"/><rect x="6" y="9" width="12" height="2.5" rx="1.2" fill="#F5EBDC"/><rect x="6" y="12.5" width="12" height="2.5" rx="1.2" fill="#F5A623"/><path d="M7 8c0-2.5 2-4 5-4s5 1.5 5 4" fill="none" stroke="#F5EBDC" stroke-width="2" stroke-linecap="round"/><path d="M6 16c0 2 2.5 3.5 6 3.5s6-1.5 6-3.5" fill="none" stroke="#F5EBDC" stroke-width="2" stroke-linecap="round"/>`,

  /* ── Nike — swoosh ── */
  nike: `<path d="M3.5 13.5c2-1 5-3.5 8.5-3.5 2.5 0 4 1 4 1L21 7c0 0-2.5-2.5-7-2.5C9 4.5 4 9 2 11.5l1.5 2z" fill="#111"/>`,

  /* ── Spotify — sound waves ── */
  spotify: `<circle cx="12" cy="12" r="11" fill="#1DB954"/><path d="M7 15.5c3-1.2 7-1.2 10 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M6 12.5c3.8-1.5 8.2-1.5 12 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><path d="M5 9.5c4.5-1.8 9.5-1.8 14 0" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>`,

  /* ── DHL — express logotype ── */
  dhl: `<rect x="1" y="7" width="22" height="10" rx="2" fill="#D40511"/><rect x="2" y="9" width="20" height="6" rx="1" fill="#FFCC00"/><text x="12" y="14.5" text-anchor="middle" fill="#D40511" font-size="7" font-weight="900" font-family="system-ui,sans-serif">DHL</text>`,

  /* ── Coca-Cola — script-style ── */
  cocacola: `<circle cx="12" cy="12" r="11" fill="#F40009"/><text x="12" y="13.5" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="700" font-family="Georgia,serif" font-style="italic">Coca</text><text x="12" y="18" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="700" font-family="Georgia,serif" font-style="italic">Cola</text>`,

  /* ── Netflix — N ribbon ── */
  netflix: `<rect x="3" y="2" width="18" height="20" rx="2" fill="#141414"/><path d="M7 4v16l5-8 5 8V4" fill="none" stroke="#E50914" stroke-width="3" stroke-linejoin="round"/><rect x="7" y="4" width="3" height="16" fill="#E50914"/><rect x="14" y="4" width="3" height="16" fill="#E50914"/><polygon points="7,4 10,4 17,20 14,20" fill="#E50914"/>`,

  /* ── Amazon — smile arrow ── */
  amazon: `<rect x="2" y="4" width="20" height="16" rx="3" fill="#232F3E"/><text x="12" y="14" text-anchor="middle" fill="#fff" font-size="8" font-weight="900" font-family="system-ui,sans-serif">a</text><path d="M7 16c2 1.5 5 2.2 9 1" fill="none" stroke="#FF9900" stroke-width="1.8" stroke-linecap="round"/><path d="M15 15l1 2 1.5-1" fill="none" stroke="#FF9900" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,

  /* ── Amex — blue box ── */
  amex: `<rect x="1" y="4" width="22" height="16" rx="3" fill="#006FCF"/><text x="12" y="14.5" text-anchor="middle" fill="#fff" font-size="5" font-weight="900" font-family="system-ui,sans-serif" letter-spacing="1">AMEX</text>`,

  /* ── InstaPass — IP shield ── */
  instapass: `<rect x="2" y="2" width="20" height="20" rx="5" fill="#E52324"/><text x="12" y="15.5" text-anchor="middle" fill="#fff" font-size="11" font-weight="900" font-family="system-ui,sans-serif">IP</text>`,
};
