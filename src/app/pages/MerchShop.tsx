import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  ShoppingBag, ExternalLink, Star, Truck, Shield, RotateCcw,
  ArrowRight, Heart, Loader2, AlertCircle, RefreshCw,
  Music, Paintbrush, Sparkles, Flame, ChevronRight,
  Store, Link2, DollarSign, Zap, QrCode, Nfc, Radio,
  CreditCard, BarChart3, Rocket, CheckCircle2, ShoppingCart,
  Package, Tag, TrendingUp,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

/* ═══════════════════════════════════════════════════════
   THE OFFICIAL INSTAPASS MERCH MARKETPLACE
   
   Seller Marketplace landing + live Shopify collection browse.
   Promotes promoters, creators, and event organizers
   to sell merchandise on InstaPass.

   Shopify public JSON API:
     /collections.json             → all collections
     /collections/{handle}/products.json → products per collection
   ═══════════════════════════════════════════════════════ */

const SHOPIFY_URL = 'https://instapass.store';

/* ─── Collection branding config ─── */
interface CollectionBrand {
  handle: string;
  name: string;
  tagline: string;
  accent: string;
  accentBg: string;
  icon: typeof ShoppingBag;
  gradient: string;
}

const COLLECTION_BRANDS: Record<string, CollectionBrand> = {
  'instapass-merch': {
    handle: 'instapass-merch',
    name: 'InstaPass Merch',
    tagline: 'Official InstaPass branded gear',
    accent: '#E52324',
    accentBg: 'rgba(229,35,36,0.1)',
    icon: Flame,
    gradient: 'from-red-500/10 via-transparent to-transparent',
  },
  'la-fresh': {
    handle: 'la-fresh',
    name: 'LA Fresh',
    tagline: 'Fresh fits for the culture',
    accent: '#22C55E',
    accentBg: 'rgba(34,197,94,0.1)',
    icon: Sparkles,
    gradient: 'from-emerald-500/10 via-transparent to-transparent',
  },
  'anotha-level': {
    handle: 'anotha-level',
    name: 'Anotha Level',
    tagline: 'Artist collection — elevate your style',
    accent: '#A855F7',
    accentBg: 'rgba(168,85,247,0.1)',
    icon: Music,
    gradient: 'from-purple-500/10 via-transparent to-transparent',
  },
  'creative-control': {
    handle: 'creative-control',
    name: 'Creative Control',
    tagline: 'Design-forward streetwear',
    accent: '#3B82F6',
    accentBg: 'rgba(59,130,246,0.1)',
    icon: Paintbrush,
    gradient: 'from-blue-500/10 via-transparent to-transparent',
  },
};

/* ─── Fallback handle matching ─── */
function matchCollectionBrand(title: string, handle: string): CollectionBrand | null {
  const lower = (title + ' ' + handle).toLowerCase();
  if (lower.includes('la fresh') || lower.includes('la-fresh') || lower.includes('lafresh'))
    return COLLECTION_BRANDS['la-fresh'];
  if (lower.includes('anotha') || lower.includes('another-level') || lower.includes('anotha-level') || lower.includes('artist'))
    return COLLECTION_BRANDS['anotha-level'];
  if (lower.includes('creative control') || lower.includes('creative-control'))
    return COLLECTION_BRANDS['creative-control'];
  if (lower.includes('instapass') || lower.includes('insta-pass') || lower.includes('insta pass'))
    return COLLECTION_BRANDS['instapass-merch'];
  return null;
}

/* ─── Shopify JSON Types ─── */
interface ShopifyImage { id: number; src: string; alt: string | null; }
interface ShopifyVariant { id: number; title: string; price: string; compare_at_price: string | null; available: boolean; }
interface ShopifyProduct { id: number; title: string; handle: string; body_html: string; vendor: string; product_type: string; tags: string[]; images: ShopifyImage[]; variants: ShopifyVariant[]; }
interface ShopifyCollection { id: number; handle: string; title: string; body_html: string; image: { src: string } | null; }

/* ─── Normalized types ─── */
interface MerchProduct {
  id: string; name: string; handle: string; price: number; compareAt: number | null;
  image: string; images: string[]; badge: string | null; badgeColor: string;
  description: string; variantCount: number; available: boolean; shopifyUrl: string; vendor: string;
}

interface MerchCollection {
  id: string; handle: string; title: string; description: string; image: string;
  brand: CollectionBrand; products: MerchProduct[]; shopifyUrl: string;
}

/* ─── Transform ─── */
function normalizeProduct(p: ShopifyProduct): MerchProduct {
  const minPrice = Math.min(...p.variants.map((v) => parseFloat(v.price)));
  const compareAtPrices = p.variants.map((v) => (v.compare_at_price ? parseFloat(v.compare_at_price) : 0)).filter((v) => v > 0);
  const compareAt = compareAtPrices.length > 0 ? Math.max(...compareAtPrices) : null;
  const anyAvailable = p.variants.some((v) => v.available);

  let badge: string | null = null;
  let badgeColor = '';
  if (!anyAvailable) { badge = 'Sold Out'; badgeColor = '#6B7280'; }
  else if (compareAt && compareAt > minPrice) { badge = 'Sale'; badgeColor = '#F59E0B'; }
  else if (p.tags.some((t) => t.toLowerCase().includes('bestseller'))) { badge = 'Best Seller'; badgeColor = '#E52324'; }
  else if (p.tags.some((t) => t.toLowerCase() === 'new')) { badge = 'New'; badgeColor = '#22C55E'; }
  else if (p.tags.some((t) => t.toLowerCase() === 'limited')) { badge = 'Limited'; badgeColor = '#3B82F6'; }

  return {
    id: String(p.id), name: p.title, handle: p.handle, price: minPrice, compareAt,
    image: p.images[0]?.src || '', images: p.images.map((img) => img.src),
    badge, badgeColor,
    description: p.body_html?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
    variantCount: p.variants.filter((v) => v.title !== 'Default Title').length,
    available: anyAvailable, shopifyUrl: `${SHOPIFY_URL}/products/${p.handle}`, vendor: p.vendor,
  };
}

const DEFAULT_BRAND: CollectionBrand = {
  handle: 'other', name: 'Other', tagline: 'More merch', accent: '#E52324',
  accentBg: 'rgba(229,35,36,0.1)', icon: ShoppingBag, gradient: 'from-red-500/10 via-transparent to-transparent',
};

/* ─── Products to hide from the marketplace ─── */
const HIDDEN_PRODUCTS = ['ladies t shirt', 'ladies t-shirt', 'ladies tshirt'];

/* ═══════════════════════════════════════════════════════
   3-STEP EXPLAINER DATA
   ═══════════════════════════════════════════════════════ */
const steps = [
  { icon: Link2, title: 'Connect Shopify', desc: 'Sync your existing store instantly. Products, inventory, and prices stay in sync automatically.', step: '01' },
  { icon: Tag, title: 'Attach to Your Event', desc: 'Sell directly from your event page. Merch appears alongside tickets for seamless upsells.', step: '02' },
  { icon: TrendingUp, title: 'Earn More Revenue', desc: 'Increase per-attendee spend automatically with bundled offers and smart recommendations.', step: '03' },
];

/* ═══════════════════════════════════════════════════════
   SELLER VALUE BULLETS
   ═══════════════════════════════════════════════════════ */
const sellerFeatures = [
  { icon: CreditCard, label: 'Integrated checkout' },
  { icon: Shield, label: 'Secure payouts' },
  { icon: QrCode, label: 'QR code activation' },
  { icon: Nfc, label: 'NFC merch support (future-ready)' },
  { icon: Radio, label: 'TapPlay music integration' },
];

/* ═══════════════════════════════════════════════════════
   TRUST STRIP DATA
   ═══════════════════════════════════════════════════════ */
const trustItems = [
  { icon: Rocket, label: 'Free to Launch', desc: 'No upfront costs' },
  { icon: Shield, label: 'Secure Payments', desc: 'End-to-end encryption' },
  { icon: Store, label: 'Shopify Sync', desc: 'Real-time inventory' },
  { icon: BarChart3, label: 'Revenue Analytics', desc: 'Track every sale' },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export function MerchShop() {
  const [collections, setCollections] = useState<MerchCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string>('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({});
  const [showAllCollections, setShowAllCollections] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const marketplaceRef = useRef<HTMLDivElement | null>(null);

  /* ─── Fetch collections + products from Shopify ─── */
  const fetchCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const colRes = await fetch(`${SHOPIFY_URL}/collections.json`);
      if (!colRes.ok) throw new Error(`HTTP ${colRes.status}`);
      const colData = await colRes.json();
      const shopifyCollections = colData.collections as ShopifyCollection[];

      const collectionPromises = shopifyCollections.map(async (col) => {
        try {
          const prodRes = await fetch(`${SHOPIFY_URL}/collections/${col.handle}/products.json`);
          if (!prodRes.ok) return null;
          const prodData = await prodRes.json();
          const products = (prodData.products as ShopifyProduct[])
            .map(normalizeProduct)
            .filter((p) => !HIDDEN_PRODUCTS.some((h) => p.name.toLowerCase().includes(h)));
          if (products.length === 0) return null;

          const brand = matchCollectionBrand(col.title, col.handle) || {
            ...DEFAULT_BRAND, handle: col.handle, name: col.title,
            tagline: col.body_html?.replace(/<[^>]*>/g, '').slice(0, 100) || '',
          };

          return {
            id: String(col.id), handle: col.handle, title: col.title,
            description: col.body_html?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
            image: col.image?.src || products[0]?.image || '',
            brand, products, shopifyUrl: `${SHOPIFY_URL}/collections/${col.handle}`,
          } as MerchCollection;
        } catch { return null; }
      });

      const results = (await Promise.all(collectionPromises)).filter(Boolean) as MerchCollection[];

      // Deduplicate: merge collections that map to the same brand handle
      const mergedMap = new Map<string, MerchCollection>();
      for (const col of results) {
        const brandHandle = col.brand.handle;
        const existing = mergedMap.get(brandHandle);
        if (existing) {
          const existingIds = new Set(existing.products.map((p) => p.id));
          const newProducts = col.products.filter((p) => !existingIds.has(p.id));
          existing.products = [...existing.products, ...newProducts];
          if (!existing.image && col.image) existing.image = col.image;
        } else {
          mergedMap.set(brandHandle, { ...col });
        }
      }
      const merged = Array.from(mergedMap.values());

      const knownHandles = Object.keys(COLLECTION_BRANDS);
      merged.sort((a, b) => {
        const aIdx = knownHandles.indexOf(a.brand.handle);
        const bIdx = knownHandles.indexOf(b.brand.handle);
        const aKnown = aIdx !== -1;
        const bKnown = bIdx !== -1;
        if (aKnown && bKnown) return aIdx - bIdx;
        if (aKnown && !bKnown) return -1;
        if (!aKnown && bKnown) return 1;
        return a.title.localeCompare(b.title);
      });

      setCollections(merged);
    } catch (err) {
      console.error('Failed to fetch Shopify collections:', err);
      setError(
        'Unable to load collections from instapass.store. This may be due to browser security (CORS). ' +
        'Click "Visit Shopify Store" to browse products directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollections(); }, []);

  const totalProducts = collections.reduce((sum, c) => sum + c.products.length, 0);

  const scrollToCollection = (handle: string) => {
    setActiveCollection(handle);
    if (handle === 'all') {
      marketplaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const el = sectionRefs.current[handle];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* ══════════════════════════════════════════════
          SELLER MARKETPLACE HERO
         ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#E52324]/6 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-32 left-[15%] w-[400px] h-[400px] bg-[#E52324]/4 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-[20%] w-[350px] h-[350px] bg-[#1E3A5F]/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-8">
              <div className="w-2 h-2 rounded-full bg-[#E52324] animate-pulse" />
              <span className="text-[11px] text-[#E52324] uppercase tracking-[0.2em]" style={{ fontWeight: 700 }}>
                Sell on InstaPass
              </span>
              <span className="text-[11px] text-white/20">•</span>
              <span className="text-[11px] text-[#E52324] uppercase tracking-[0.2em]" style={{ fontWeight: 700 }}>
                Merch Enabled
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              Turn Your Event Into a{' '}
              <span className="relative">
                <span className="text-[#E52324]">Store</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E52324] via-[#E52324]/60 to-transparent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-white/45 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Sell merch before, during, and after your event.
              <br className="hidden sm:block" />
              Sync Shopify or launch directly on InstaPass.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/organizer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#E52324] text-white text-sm hover:bg-[#c91f20] transition-all shadow-[0_8px_32px_rgba(229,35,36,0.3)] hover:shadow-[0_12px_40px_rgba(229,35,36,0.4)] hover:-translate-y-0.5"
                style={{ fontWeight: 700 }}
              >
                <Store className="w-5 h-5" />
                Start Selling
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => marketplaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.10] text-white/70 text-sm hover:bg-white/[0.10] hover:text-white hover:border-white/[0.15] transition-all"
                style={{ fontWeight: 600 }}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                Browse Marketplace
              </button>
            </div>

            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-6 sm:gap-10 mt-14"
            >
              {[
                { value: '4', label: 'Collections' },
                { value: '50+', label: 'Products' },
                { value: '100%', label: 'Shopify Synced' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-white/25 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3-STEP EXPLAINER
         ══════════════════════════════════════════════ */}
      <section className="relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              How It Works
            </h2>
            <p className="text-white/35 text-sm max-w-lg mx-auto">
              From Shopify sync to selling at your event — three simple steps to launch your merch storefront.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Connector line */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 w-full h-px bg-gradient-to-r from-[#E52324]/20 via-[#E52324]/10 to-transparent z-0" />
                  )}

                  <div className="relative rounded-2xl bg-[#111]/80 backdrop-blur-sm border border-white/[0.06] p-8 hover:border-[#E52324]/20 transition-all duration-300 h-full">
                    {/* Step number */}
                    <div className="absolute top-6 right-6 text-[48px] text-white/[0.03]" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900 }}>
                      {step.step}
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-[#E52324]/10 border border-[#E52324]/15 flex items-center justify-center mb-5 group-hover:bg-[#E52324]/15 group-hover:border-[#E52324]/25 transition-all">
                      <StepIcon className="w-5 h-5 text-[#E52324]" strokeWidth={1.8} />
                    </div>

                    <h3 className="text-white text-lg mb-2" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                      {step.title}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SELLER VALUE SECTION — Split layout
         ══════════════════════════════════════════════ */}
      <section className="relative border-y border-white/[0.04]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E52324]/3 via-transparent to-[#1E3A5F]/3" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Event page mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111] shadow-2xl shadow-black/40">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[#0a0a0a] border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 mx-3 py-1.5 px-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <span className="text-[10px] text-white/25">instapass.io/event/summer-fest-2026</span>
                  </div>
                </div>

                {/* Mock event page */}
                <div className="p-5 sm:p-6">
                  {/* Event header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E52324] to-[#c91f20] flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>Summer Fest 2026</div>
                      <div className="text-white/25 text-[10px]">Jul 19 – Jul 20 · Los Angeles, CA</div>
                    </div>
                    <div className="ml-auto px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[9px] text-emerald-400 uppercase tracking-wider" style={{ fontWeight: 700 }}>On Sale</span>
                    </div>
                  </div>

                  {/* Ticket section */}
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-4">
                    <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>Tickets</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm" style={{ fontWeight: 600 }}>GA + Merch Bundle</div>
                        <div className="text-white/25 text-[10px]">Ticket + exclusive hoodie</div>
                      </div>
                      <div className="text-[#E52324] text-sm" style={{ fontWeight: 800 }}>$89.00</div>
                    </div>
                  </div>

                  {/* Merch carousel mockup */}
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[10px] text-white/30 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        Event Merch
                      </div>
                      <div className="text-[9px] text-[#E52324]" style={{ fontWeight: 600 }}>View All →</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['Hoodie', 'Tee', 'Cap'].map((item) => (
                        <div key={item} className="rounded-lg bg-white/[0.04] border border-white/[0.06] overflow-hidden">
                          <div className="aspect-square bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center">
                            <Package className="w-6 h-6 text-white/10" />
                          </div>
                          <div className="p-2">
                            <div className="text-[9px] text-white/50" style={{ fontWeight: 600 }}>{item}</div>
                            <div className="text-[9px] text-white/80" style={{ fontWeight: 700 }}>$39</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upsell bar */}
                  <div className="mt-4 rounded-xl bg-[#E52324]/8 border border-[#E52324]/15 p-3 flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-[#E52324] shrink-0" />
                    <div className="flex-1">
                      <div className="text-[10px] text-white/70" style={{ fontWeight: 600 }}>
                        Add a hoodie and <span className="text-emerald-400">save 15%</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-[#E52324] text-white text-[9px]" style={{ fontWeight: 700 }}>
                      Add
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating glow */}
              <div className="absolute -z-10 inset-0 bg-[#E52324]/5 rounded-3xl blur-[40px] scale-95" />
            </motion.div>

            {/* Right — Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-5">
                <span className="text-[10px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>
                  All-in-One Platform
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                Everything in One{' '}
                <span className="text-[#E52324]">Platform</span>
              </h2>
              <p className="text-white/40 text-sm mb-8 max-w-md leading-relaxed">
                Ticketing, merch, QR codes, and payments — all integrated into a single
                experience for your fans and attendees.
              </p>

              <div className="space-y-4 mb-10">
                {sellerFeatures.map((feat) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div key={feat.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <FeatIcon className="w-4.5 h-4.5 text-[#E52324]" strokeWidth={1.8} />
                      </div>
                      <div className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{feat.label}</div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/50 ml-auto shrink-0" />
                    </div>
                  );
                })}
              </div>

              <Link
                to="/organizer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#E52324] text-white text-sm hover:bg-[#c91f20] transition-all shadow-lg shadow-[#E52324]/20 hover:shadow-[#E52324]/30"
                style={{ fontWeight: 700 }}
              >
                <Store className="w-4 h-4" />
                Create Your Storefront
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRUST + SOCIAL PROOF STRIP
         ══════════════════════════════════════════════ */}
      <div className="border-b border-white/[0.06] bg-[#111]/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 py-5 px-4 sm:px-6">
                  <div className="w-10 h-10 rounded-xl bg-[#E52324]/10 border border-[#E52324]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#E52324]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="text-[12px] text-white" style={{ fontWeight: 700 }}>{item.label}</div>
                    <div className="text-[10px] text-white/30">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MARKETPLACE — Browse Collections
         ══════════════════════════════════════════════ */}
      <div ref={marketplaceRef} className="scroll-mt-16">
        {/* Marketplace header */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-5">
              <ShoppingBag className="w-3.5 h-3.5 text-[#E52324]" />
              <span className="text-[11px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>
                The Official InstaPass Merch Marketplace
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              Shop by <span className="text-[#E52324]">Collection</span>
            </h2>
            <p className="text-white/35 text-sm max-w-lg mx-auto">
              Exclusive InstaPass merchandise — live from{' '}
              <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="text-[#E52324] hover:underline">
                instapass.store
              </a>
            </p>

            {/* Collection brand pills */}
            {!loading && collections.length > 0 && (
              <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
                {collections.map((col) => {
                  const BrandIcon = col.brand.icon;
                  return (
                    <button
                      key={col.id}
                      onClick={() => scrollToCollection(col.handle)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[11px]"
                      style={{
                        fontWeight: 600,
                        backgroundColor: col.brand.accentBg,
                        borderColor: col.brand.accent + '33',
                        color: col.brand.accent,
                      }}
                    >
                      <BrandIcon className="w-3 h-3" />
                      {col.brand.name}
                      <span className="text-[9px] opacity-60">({col.products.length})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </section>

        {/* Sticky Collection Nav */}
        {!loading && !error && collections.length > 0 && (
          <div className="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/[0.06]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
                <button
                  onClick={() => scrollToCollection('all')}
                  className={`px-4 py-2 rounded-xl text-[12px] transition-all whitespace-nowrap ${
                    activeCollection === 'all'
                      ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/20'
                      : 'bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  style={{ fontWeight: activeCollection === 'all' ? 700 : 500 }}
                >
                  All Collections
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => scrollToCollection(col.handle)}
                    className={`px-4 py-2 rounded-xl text-[12px] transition-all whitespace-nowrap border ${
                      activeCollection === col.handle
                        ? 'text-white shadow-lg'
                        : 'bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08]'
                    }`}
                    style={{
                      fontWeight: activeCollection === col.handle ? 700 : 500,
                      ...(activeCollection === col.handle
                        ? { backgroundColor: col.brand.accent, borderColor: col.brand.accent, boxShadow: `0 4px 14px ${col.brand.accent}33` }
                        : {}),
                    }}
                  >
                    {col.brand.name}
                  </button>
                ))}
                <span className="text-[10px] text-white/20 ml-auto hidden sm:block whitespace-nowrap pl-4">
                  {totalProducts} products · {collections.length} collections
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-[#E52324] animate-spin" />
                <div className="absolute inset-0 w-8 h-8 rounded-full bg-[#E52324]/10 animate-ping" />
              </div>
              <div className="text-center">
                <div className="text-white text-sm mb-1" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  Loading Collections from instapass.store
                </div>
                <div className="text-white/30 text-[11px]">Fetching InstaPass Merch, LA Fresh, Anotha Level & Creative Control...</div>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && !loading && (
          <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="rounded-2xl bg-[#111] border border-white/[0.08] p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white text-lg mb-2" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                Couldn't Load Collections
              </h3>
              <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">{error}</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={fetchCollections}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-[12px] hover:bg-white/[0.10] transition-all"
                  style={{ fontWeight: 700 }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <a
                  href={SHOPIFY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-all shadow-lg shadow-[#E52324]/20"
                  style={{ fontWeight: 700 }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Visit Shopify Store
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Collection Sections */}
        {!loading && !error && collections.length > 0 && (
          <div className="space-y-0">
            {(showAllCollections ? collections : collections.slice(0, 3)).map((collection, colIdx) => {
              const BrandIcon = collection.brand.icon;
              const accent = collection.brand.accent;
              return (
                <section
                  key={collection.id}
                  ref={(el) => { sectionRefs.current[collection.handle] = el; }}
                  className="relative scroll-mt-16"
                >
                  {colIdx > 0 && (
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
                    </div>
                  )}

                  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-3"
                            style={{ backgroundColor: collection.brand.accentBg, borderColor: accent + '33' }}
                          >
                            <BrandIcon className="w-3 h-3" style={{ color: accent }} />
                            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ fontWeight: 700, color: accent }}>
                              Collection
                            </span>
                          </div>
                          <h2 className="text-2xl sm:text-3xl text-white mb-1" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                            {collection.brand.name}
                          </h2>
                          <p className="text-white/35 text-sm max-w-md">{collection.brand.tagline}</p>
                        </div>

                        <a
                          href={collection.shopifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] transition-all hover:bg-white/[0.04] group"
                          style={{ fontWeight: 600, color: accent, borderColor: accent + '33' }}
                        >
                          View on Shopify
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: accent + '15' }}>
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                          <span className="text-[9px] uppercase tracking-wider" style={{ fontWeight: 700, color: accent }}>Live</span>
                        </div>
                        <span className="text-[10px] text-white/20">
                          {collection.products.length} product{collection.products.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </motion.div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                      {collection.products.map((product, idx) => {
                        const imgIdx = activeImageIndex[product.id] || 0;
                        return (
                          <motion.a
                            key={product.id}
                            href={product.shopifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: idx * 0.04 }}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                            className="group relative bg-[#111] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all duration-300"
                            style={{ ...(hoveredProduct === product.id ? { borderColor: accent + '40' } : {}) }}
                          >
                            <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                              {product.image ? (
                                <img
                                  src={product.images[imgIdx] || product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-10 h-10 text-white/10" />
                                </div>
                              )}

                              {product.images.length > 1 && (
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {product.images.slice(0, 5).map((_, i) => (
                                    <button
                                      key={i}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveImageIndex((prev) => ({ ...prev, [product.id]: i }));
                                      }}
                                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-3' : 'bg-white/40'}`}
                                    />
                                  ))}
                                </div>
                              )}

                              {product.badge && (
                                <div
                                  className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] text-white uppercase tracking-wider"
                                  style={{ fontWeight: 800, backgroundColor: product.badgeColor }}
                                >
                                  {product.badge}
                                </div>
                              )}

                              <div
                                className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ fontWeight: 700, backgroundColor: accent + '20', color: accent, backdropFilter: 'blur(4px)' }}
                              >
                                {collection.brand.name}
                              </div>

                              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                                hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                              }`}>
                                <div
                                  className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border text-white text-[12px]"
                                  style={{ fontWeight: 700, backgroundColor: accent + '20', borderColor: accent + '40' }}
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  Shop on Shopify
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </div>
                              </div>

                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/50 hover:border-[#E52324]/30 transition-all opacity-0 group-hover:opacity-100"
                                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                              >
                                <Heart className="w-3.5 h-3.5" strokeWidth={2} />
                              </button>
                            </div>

                            <div className="p-4">
                              <h3 className="text-[13px] text-white mb-1.5 line-clamp-2" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
                                {product.name}
                              </h3>
                              {product.variantCount > 1 && (
                                <div className="text-[9px] text-white/20 mb-2">
                                  {product.variantCount} option{product.variantCount !== 1 ? 's' : ''} available
                                </div>
                              )}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[15px] ${product.available ? 'text-white' : 'text-white/30'}`} style={{ fontWeight: 800 }}>
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.compareAt && product.compareAt > product.price && (
                                  <>
                                    <span className="text-white/25 text-[11px] line-through">${product.compareAt.toFixed(2)}</span>
                                    <span className="text-[9px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded" style={{ fontWeight: 700 }}>
                                      SAVE ${(product.compareAt - product.price).toFixed(0)}
                                    </span>
                                  </>
                                )}
                              </div>
                              {!product.available && (
                                <div className="mt-2 text-[9px] text-white/20 uppercase tracking-wider" style={{ fontWeight: 700 }}>Out of Stock</div>
                              )}
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>

                    <div className="text-center mt-8">
                      <a
                        href={collection.shopifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm transition-all group hover:bg-white/[0.04]"
                        style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: accent, borderColor: accent + '30' }}
                      >
                        View All {collection.brand.name} on Shopify
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </section>
              );
            })}

            {/* See More Collections Button */}
            {collections.length > 3 && !showAllCollections && (
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
                {/* Fade overlay hint */}
                <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-[#0d0d0d] to-transparent pointer-events-none" />
                <div className="text-center">
                  <button
                    onClick={() => setShowAllCollections(true)}
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
                    style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}
                  >
                    <ShoppingBag className="w-5 h-5 text-[#E52324]" />
                    <span className="text-sm">
                      See {collections.length - 3} More Collection{collections.length - 3 !== 1 ? 's' : ''}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                  <p className="text-white/20 text-[11px] mt-3">
                    {collections.slice(3).map(c => c.brand.name).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Collapse button when expanded */}
            {collections.length > 3 && showAllCollections && (
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowAllCollections(false);
                      marketplaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 text-[12px] hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                    style={{ fontWeight: 600 }}
                  >
                    Show Less
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && collections.length === 0 && (
          <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white/15" />
              </div>
              <div className="text-center">
                <div className="text-white text-sm mb-1" style={{ fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>
                  No Collections Found
                </div>
                <div className="text-white/30 text-[11px] mb-4">The store may be updating. Visit directly to browse.</div>
                <a
                  href={SHOPIFY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-all"
                  style={{ fontWeight: 700 }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Visit instapass.store
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          SHOPIFY INTEGRATION INFO
         ══════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-r from-[#111] to-[#0d0d0d]">
          <div className="h-[2px] w-full bg-gradient-to-r from-[#96bf48] via-[#96bf48]/60 to-transparent" />
          <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#96bf48]/10 border border-[#96bf48]/20 mb-4">
                  <span className="text-[10px] text-[#96bf48] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    Powered by Shopify
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl text-white mb-3" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
                  Secure Checkout on{' '}
                  <span className="text-[#96bf48]">Shopify</span>
                </h2>
                <p className="text-white/40 text-sm mb-6 max-w-md">
                  All purchases are handled securely through our official Shopify store at{' '}
                  <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="text-[#96bf48] hover:underline">
                    instapass.store
                  </a>
                  . Collections and products sync live — images, prices, and availability update automatically.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={SHOPIFY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#96bf48] text-white text-[12px] hover:bg-[#7da03e] transition-all"
                    style={{ fontWeight: 700 }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Shop Now
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Live Collection Sync', desc: 'Products fetched per-collection from Shopify' },
                  { title: 'Multiple Payment', desc: 'Apple Pay, Google Pay, cards & more' },
                  { title: '4 Collections', desc: 'InstaPass, LA Fresh, Anotha Level & Creative Control' },
                  { title: 'Earn Points', desc: 'Earn Insta Points on every merch purchase' },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] text-white mb-1" style={{ fontWeight: 700 }}>{item.title}</div>
                    <div className="text-[10px] text-white/30">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}