import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ShoppingBag, ExternalLink, Loader2, Sparkles, Music, Paintbrush, Flame } from 'lucide-react';

const SHOPIFY_URL = 'https://instapass.store';

/* ─── Collection brand colors ─── */
const COLLECTION_COLORS: Record<string, { accent: string; icon: typeof ShoppingBag }> = {
  'la-fresh': { accent: '#22C55E', icon: Sparkles },
  'anotha-level': { accent: '#A855F7', icon: Music },
  'creative-control': { accent: '#3B82F6', icon: Paintbrush },
  'instapass-merch': { accent: '#E52324', icon: Flame },
};

function matchColor(title: string, handle: string) {
  const lower = (title + ' ' + handle).toLowerCase();
  if (lower.includes('la fresh') || lower.includes('la-fresh')) return COLLECTION_COLORS['la-fresh'];
  if (lower.includes('anotha') || lower.includes('anotha-level')) return COLLECTION_COLORS['anotha-level'];
  if (lower.includes('creative control') || lower.includes('creative-control')) return COLLECTION_COLORS['creative-control'];
  if (lower.includes('instapass') || lower.includes('insta-pass')) return COLLECTION_COLORS['instapass-merch'];
  return { accent: '#E52324', icon: ShoppingBag };
}

interface PreviewCollection {
  name: string;
  image: string;
  productCount: number;
  accent: string;
  icon: typeof ShoppingBag;
}

export function ShopifyMerchPreview() {
  const [collections, setCollections] = useState<PreviewCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${SHOPIFY_URL}/collections.json`);
        if (!res.ok) throw new Error('fail');
        const data = await res.json();
        const items: PreviewCollection[] = [];
        for (const col of data.collections.slice(0, 4)) {
          const { accent, icon } = matchColor(col.title, col.handle);
          // Try to get first product image for the collection preview
          let image = col.image?.src || '';
          if (!image) {
            try {
              const prodRes = await fetch(`${SHOPIFY_URL}/collections/${col.handle}/products.json?limit=1`);
              if (prodRes.ok) {
                const prodData = await prodRes.json();
                image = prodData.products?.[0]?.images?.[0]?.src || '';
              }
            } catch { /* ignore */ }
          }
          items.push({
            name: col.title,
            image,
            productCount: 0, // We don't need exact count for preview
            accent,
            icon,
          });
        }
        setCollections(items);
      } catch {
        setCollections([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-r from-[#111] via-[#141414] to-[#111]"
      >
        <div className="h-[2px] w-full bg-gradient-to-r from-[#E52324] via-[#E52324]/40 to-[#E52324]" />
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Left */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-3">
              <ShoppingBag className="w-3 h-3 text-[#E52324]" />
              <span className="text-[9px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>4 Collections</span>
              {collections.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] text-emerald-400 uppercase tracking-wider" style={{ fontWeight: 700 }}>Live</span>
                </>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl text-white mb-2" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              The Official InstaPass{' '}<span className="text-[#E52324]">Merch Marketplace</span>
            </h3>
            <p className="text-white/40 text-sm mb-4 max-w-md">
              Turn your event into a store. Sell merch before, during, and after — powered by Shopify.
            </p>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Link
                to="/merch"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-all shadow-lg shadow-[#E52324]/20"
                style={{ fontWeight: 700 }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Browse Collections
              </Link>
              <a
                href={SHOPIFY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-[12px] hover:bg-white/[0.10] hover:text-white transition-all"
                style={{ fontWeight: 600 }}
              >
                Visit Shopify Store
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right - Collection preview cards */}
          <div className="flex gap-3 shrink-0">
            {loading ? (
              <div className="hidden md:flex items-center justify-center w-[384px] h-[168px]">
                <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
              </div>
            ) : collections.length > 0 ? (
              collections.slice(0, 3).map((col) => {
                const BrandIcon = col.icon;
                return (
                  <Link
                    key={col.name}
                    to="/merch"
                    className="hidden md:block w-[120px] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                  >
                    <div className="aspect-square overflow-hidden bg-[#0a0a0a] relative">
                      {col.image ? (
                        <img
                          src={col.image}
                          alt={col.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${col.accent}10, ${col.accent}05)` }}>
                          <BrandIcon className="w-8 h-8" style={{ color: col.accent + '30' }} />
                        </div>
                      )}
                      {/* Collection accent bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: col.accent }} />
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] text-white/70 truncate" style={{ fontWeight: 600 }}>{col.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.accent }} />
                        <span className="text-[8px] uppercase tracking-wider" style={{ color: col.accent, fontWeight: 700 }}>Collection</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              [
                { name: 'LA Fresh', accent: '#22C55E', icon: Sparkles },
                { name: 'Anotha Level', accent: '#A855F7', icon: Music },
                { name: 'Creative Control', accent: '#3B82F6', icon: Paintbrush },
              ].map((col) => {
                const BrandIcon = col.icon;
                return (
                  <Link
                    key={col.name}
                    to="/merch"
                    className="hidden md:block w-[120px] rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                  >
                    <div className="aspect-square overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${col.accent}10, ${col.accent}05)` }}>
                      <BrandIcon className="w-8 h-8 group-hover:scale-110 transition-transform" style={{ color: col.accent + '25' }} />
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] text-white/70 truncate" style={{ fontWeight: 600 }}>{col.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col.accent }} />
                        <span className="text-[8px] uppercase tracking-wider" style={{ color: col.accent, fontWeight: 700 }}>Collection</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}