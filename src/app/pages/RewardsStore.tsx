import { useState } from 'react';
import { Link } from 'react-router';
import {
  Zap, Star, Crown, Gift, Ticket, Percent, ShoppingBag, Clock,
  ChevronRight, Lock, Check, Sparkles, TrendingUp, ArrowRight,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

const GOLD = '#D4A84B';

interface Reward {
  id: string; name: string; description: string; cost: number;
  category: 'discount' | 'merch' | 'access' | 'experience';
  image: string; icon: typeof Gift; badge?: string; badgeColor?: string;
  tier?: string;
}

const REWARDS: Reward[] = [
  { id: 'r1', name: '10% Off Any Ticket', description: 'Apply to your next ticket purchase', cost: 2000, category: 'discount', image: '', icon: Percent, badge: 'Popular', badgeColor: '#E52324' },
  { id: 'r2', name: '20% Off VIP Tickets', description: 'Exclusive VIP discount code', cost: 5000, category: 'discount', image: '', icon: Percent, tier: 'Gold' },
  { id: 'r3', name: '$25 Credit', description: 'Applied to your next purchase', cost: 3500, category: 'discount', image: '', icon: Gift, badge: 'Best Value', badgeColor: '#10B981' },
  { id: 'r4', name: 'InstaPass Hoodie', description: 'Premium branded streetwear', cost: 8000, category: 'merch', image: 'https://images.unsplash.com/photo-1622989221072-81f80d4fd4c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbWVyY2hhbmRpc2UlMjBob29kaWUlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc3NDU3NDIxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', icon: ShoppingBag },
  { id: 'r5', name: 'Backstage Pass Upgrade', description: 'Get backstage access at your next event', cost: 15000, category: 'access', image: 'https://images.unsplash.com/photo-1768264260627-2ddba41f8ef6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWSVAlMjBiYWNrc3RhZ2UlMjBwYXNzJTIwY29uY2VydHxlbnwxfHx8fDE3NzQ1NzQyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', icon: Sparkles, tier: 'Platinum', badge: 'Exclusive', badgeColor: '#8B5CF6' },
  { id: 'r6', name: 'Early Access Pass', description: '48-hour early access to tickets', cost: 4000, category: 'access', image: '', icon: Clock, tier: 'Silver' },
  { id: 'r7', name: 'Front Row Experience', description: 'Priority seating at select events', cost: 12000, category: 'experience', image: 'https://images.unsplash.com/photo-1759244566500-50388e42fef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwZnJvbnQlMjByb3clMjBjcm93ZHxlbnwxfHx8fDE3NzQ1NzQyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', icon: Star, badge: 'Limited', badgeColor: '#F59E0B' },
  { id: 'r8', name: 'Free Drink Voucher', description: '2 complimentary drinks at VIP bars', cost: 1500, category: 'experience', image: '', icon: Gift },
  { id: 'r9', name: 'InstaPass Cap', description: 'Limited edition snapback cap', cost: 5000, category: 'merch', image: '', icon: ShoppingBag },
  { id: 'r10', name: 'Meet & Greet Entry', description: 'Chance to meet artists at select events', cost: 20000, category: 'experience', image: '', icon: Crown, tier: 'Platinum', badge: 'Ultra Rare', badgeColor: GOLD },
  { id: 'r11', name: 'Free Ticket Raffle', description: 'Enter a raffle for free event tickets', cost: 500, category: 'access', image: '', icon: Ticket, badge: 'New', badgeColor: '#3B82F6' },
  { id: 'r12', name: '$50 Credit', description: 'Applied to any purchase on InstaPass', cost: 6500, category: 'discount', image: '', icon: Gift },
];

const CATEGORIES = [
  { id: 'all', label: 'All Rewards' },
  { id: 'discount', label: 'Discounts' },
  { id: 'merch', label: 'Merch' },
  { id: 'access', label: 'Access' },
  { id: 'experience', label: 'Experiences' },
];

const USER_POINTS = 12850;
const USER_TIER = 'Gold';
const TIER_RANK = { 'Bronze': 0, 'Silver': 1, 'Gold': 2, 'Platinum': 3 } as Record<string, number>;

export function RewardsStore() {
  const [filter, setFilter] = useState('all');
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const filtered = filter === 'all' ? REWARDS : REWARDS.filter(r => r.category === filter);

  const canAfford = (cost: number) => USER_POINTS >= cost;
  const canAccess = (tier?: string) => !tier || TIER_RANK[USER_TIER] >= (TIER_RANK[tier] ?? 0);

  const handleRedeem = (id: string) => {
    setRedeemed(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A84B] to-[#8B7335] flex items-center justify-center">
                <Gift className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Rewards Store
              </h1>
            </div>
            <p className="text-white/40 text-sm">Redeem your InstaPoints for exclusive rewards, discounts, and experiences</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A84B]/10 to-transparent border border-[#D4A84B]/20">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4A84B]" />
                <div>
                  <div className="text-[9px] text-[#D4A84B] uppercase tracking-wider" style={{ fontWeight: 700 }}>Your Balance</div>
                  <div className="text-white text-lg" style={{ fontWeight: 900 }}>{USER_POINTS.toLocaleString()} <span className="text-[11px] text-[#D4A84B]">pts</span></div>
                </div>
              </div>
            </div>
            <Link to="/instapoints" className="px-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-[12px] text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5" style={{ fontWeight: 600 }}>
              <Crown className="w-4 h-4 text-[#D4A84B]" /> Gold Tier <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className="px-4 py-2 rounded-xl text-[12px] uppercase tracking-wider shrink-0 transition-all"
              style={{
                background: filter === cat.id ? `${GOLD}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filter === cat.id ? `${GOLD}30` : 'rgba(255,255,255,0.06)'}`,
                color: filter === cat.id ? GOLD : 'rgba(255,255,255,0.35)',
                fontWeight: 700,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Rewards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((reward, idx) => {
            const affordable = canAfford(reward.cost);
            const accessible = canAccess(reward.tier);
            const isRedeemed = redeemed.includes(reward.id);
            const Icon = reward.icon;

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-2xl border overflow-hidden group"
                style={{
                  background: isRedeemed ? '#111827' : '#111827',
                  borderColor: isRedeemed ? '#10B98130' : 'rgba(255,255,255,0.06)',
                }}
              >
                {/* Image or Icon Header */}
                {reward.image ? (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={reward.image} alt={reward.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
                    {reward.badge && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] text-white uppercase tracking-wider" style={{ background: reward.badgeColor, fontWeight: 800 }}>
                        {reward.badge}
                      </div>
                    )}
                    {!accessible && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm">
                          <Lock className="w-4 h-4 text-white/50" />
                          <span className="text-[11px] text-white/60" style={{ fontWeight: 700 }}>{reward.tier} Required</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 pt-5 flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}12`, border: `1px solid ${GOLD}20` }}>
                      <Icon className="w-6 h-6" style={{ color: GOLD }} />
                    </div>
                    <div className="flex items-center gap-2">
                      {reward.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[8px] text-white uppercase tracking-wider" style={{ background: reward.badgeColor, fontWeight: 800 }}>
                          {reward.badge}
                        </span>
                      )}
                      {reward.tier && !accessible && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] text-white/40 uppercase tracking-wider bg-white/5" style={{ fontWeight: 700 }}>
                          <Lock className="w-2.5 h-2.5" /> {reward.tier}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-white text-[14px] uppercase tracking-tight mb-1" style={{ fontWeight: 900 }}>{reward.name}</h3>
                  <p className="text-white/30 text-[11px] mb-4" style={{ fontWeight: 500 }}>{reward.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#D4A84B]" />
                      <span className="text-[14px]" style={{ color: affordable ? GOLD : 'rgba(255,255,255,0.25)', fontWeight: 800 }}>
                        {reward.cost.toLocaleString()} pts
                      </span>
                    </div>

                    {isRedeemed ? (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider" style={{ fontWeight: 800 }}>
                        <Check className="w-3 h-3" /> Redeemed
                      </span>
                    ) : accessible && affordable ? (
                      <button
                        onClick={() => handleRedeem(reward.id)}
                        className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-[10px] uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                        style={{ fontWeight: 800 }}
                      >
                        Redeem
                      </button>
                    ) : !accessible ? (
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/25 text-[10px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        Locked
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/25 text-[10px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        {(reward.cost - USER_POINTS).toLocaleString()} pts needed
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Earn More CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl bg-gradient-to-r from-[#D4A84B]/8 to-[#E52324]/8 border border-[#D4A84B]/15 p-8 text-center"
        >
          <TrendingUp className="w-8 h-8 text-[#D4A84B] mx-auto mb-3" />
          <h3 className="text-white text-xl font-black uppercase tracking-tight mb-2">Need More Points?</h3>
          <p className="text-white/30 text-sm mb-5 max-w-md mx-auto">
            Attend events, complete challenges, and invite friends to earn InstaPoints faster
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/instapoints"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A84B] text-black text-sm hover:bg-[#F5D98A] transition-all"
              style={{ fontWeight: 800 }}
            >
              <Zap className="w-4 h-4" /> View Challenges
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 transition-all"
              style={{ fontWeight: 800 }}
            >
              <Ticket className="w-4 h-4" /> Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
