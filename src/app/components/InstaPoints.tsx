import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Trophy, Target, Award, Clock, ChevronRight, Flame, Zap,
  Star, Crown, Shield, Lock, Unlock, MapPin, Music, Calendar,
  TrendingUp, Gift, Users, Ticket, CheckCircle2, Circle,
  Sparkles, ArrowRight, BarChart3, Heart, PartyPopper,
} from "lucide-react";
import { Link } from "react-router";
import { InstaPassLogo } from "./InstaPassLogo";

/* ═══════════════════════════════════════════════════════════════
   INSTAPOINTS — PROFILE-DRIVEN GAMIFICATION SYSTEM
   ═══════════════════════════════════════════════════════════════ */

const GOLD = "#D4A84B";
const GOLD_LIGHT = "#F5D98A";
const GOLD_DIM = "#8B7335";
const RED = "#E52324";
const CHARCOAL = "#111113";
const CARD_BG = "#18181B";
const CARD_BORDER = "rgba(255,255,255,0.06)";

/* ─── Tab definitions ─── */
type TabId = "profile" | "tiers" | "challenges" | "achievements" | "activity";
const TABS: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "tiers", label: "Tiers", icon: Crown },
  { id: "challenges", label: "Challenges", icon: Target },
  { id: "achievements", label: "Badges", icon: Award },
  { id: "activity", label: "Activity", icon: Clock },
];

/* ─── Tier data ─── */
interface TierInfo {
  id: string; name: string; subtitle: string; xpRequired: number;
  color: string; gradient: string; icon: typeof Shield;
  perks: string[];
}

const TIERS: TierInfo[] = [
  {
    id: "bronze", name: "Bronze", subtitle: "Explorer", xpRequired: 0,
    color: "#CD7F32", gradient: "from-[#CD7F32] to-[#8B5A2B]", icon: Shield,
    perks: ["Basic access to events", "Earn 1x points on purchases", "Standard support"],
  },
  {
    id: "silver", name: "Silver", subtitle: "Insider", xpRequired: 2500,
    color: "#C0C0C0", gradient: "from-[#C0C0C0] to-[#808080]", icon: Shield,
    perks: ["Early ticket access (24h)", "Earn 1.5x points", "Priority email support", "Exclusive newsletter"],
  },
  {
    id: "gold", name: "Gold", subtitle: "VIP", xpRequired: 7500,
    color: GOLD, gradient: "from-[#D4A84B] to-[#8B7335]", icon: Crown,
    perks: ["48h early access", "Earn 2x points", "10% ticket discounts", "VIP lounge access", "Priority support"],
  },
  {
    id: "platinum", name: "Platinum", subtitle: "Elite", xpRequired: 20000,
    color: "#E5E4E2", gradient: "from-[#E5E4E2] to-[#9C9C9C]", icon: Sparkles,
    perks: ["72h early access", "Earn 3x points", "20% discounts", "Backstage access", "Dedicated concierge", "Exclusive drops"],
  },
];

/* ─── Challenge data ─── */
interface Challenge {
  id: string; title: string; description: string;
  reward: number; rewardType: "xp" | "points";
  progress: number; total: number; icon: typeof Flame;
  category: "attendance" | "social" | "exploration";
  deadline: string;
}

const CHALLENGES: Challenge[] = [
  { id: "c1", title: "Weekend Warrior", description: "Attend 2 events this week", reward: 300, rewardType: "xp", progress: 1, total: 2, icon: Calendar, category: "attendance", deadline: "3 days left" },
  { id: "c2", title: "Squad Goals", description: "Invite 3 friends to an event", reward: 500, rewardType: "points", progress: 1, total: 3, icon: Users, category: "social", deadline: "5 days left" },
  { id: "c3", title: "Explorer", description: "Check into a new venue", reward: 200, rewardType: "xp", progress: 0, total: 1, icon: MapPin, category: "exploration", deadline: "This week" },
  { id: "c4", title: "Festival Season", description: "Attend 5 events this month", reward: 1000, rewardType: "xp", progress: 3, total: 5, icon: PartyPopper, category: "attendance", deadline: "18 days left" },
  { id: "c5", title: "Social Butterfly", description: "Share 2 events on social media", reward: 250, rewardType: "points", progress: 0, total: 2, icon: Heart, category: "social", deadline: "This week" },
  { id: "c6", title: "Genre Hopper", description: "Attend events in 3 different genres", reward: 750, rewardType: "xp", progress: 2, total: 3, icon: Music, category: "exploration", deadline: "This month" },
];

/* ─── Badge data ─── */
interface Badge {
  id: string; name: string; description: string;
  icon: typeof Star; color: string; unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedDate?: string;
}

const BADGES: Badge[] = [
  { id: "b1", name: "First Event", description: "Attended your first event", icon: Ticket, color: "#10B981", unlocked: true, rarity: "common", unlockedDate: "Jan 15" },
  { id: "b2", name: "VIP Attendee", description: "Purchased a VIP ticket", icon: Crown, color: GOLD, unlocked: true, rarity: "rare", unlockedDate: "Feb 2" },
  { id: "b3", name: "Weekend Warrior", description: "Attended 3 events in one weekend", icon: Flame, color: "#F97316", unlocked: true, rarity: "epic", unlockedDate: "Feb 18" },
  { id: "b4", name: "Sold Out Attendee", description: "Attended a sold-out event", icon: Star, color: RED, unlocked: true, rarity: "rare", unlockedDate: "Mar 5" },
  { id: "b5", name: "Social Maven", description: "Referred 10 friends", icon: Users, color: "#8B5CF6", unlocked: true, rarity: "epic", unlockedDate: "Mar 12" },
  { id: "b6", name: "Early Bird", description: "Purchased tickets within 1 hour of release", icon: Zap, color: "#3B82F6", unlocked: true, rarity: "common", unlockedDate: "Mar 20" },
  { id: "b7", name: "Platinum Legend", description: "Reach Platinum tier", icon: Sparkles, color: "#E5E4E2", unlocked: false, rarity: "legendary" },
  { id: "b8", name: "Century Club", description: "Attend 100 events", icon: Trophy, color: GOLD, unlocked: false, rarity: "legendary" },
  { id: "b9", name: "Genre Master", description: "Attend events in 10 genres", icon: Music, color: "#EC4899", unlocked: false, rarity: "epic" },
  { id: "b10", name: "City Champion", description: "Top 10% in your city", icon: MapPin, color: "#06B6D4", unlocked: false, rarity: "legendary" },
  { id: "b11", name: "Streak King", description: "Maintain a 10-week streak", icon: Flame, color: "#F59E0B", unlocked: false, rarity: "epic" },
  { id: "b12", name: "Collector", description: "Unlock 20 badges", icon: Award, color: "#A78BFA", unlocked: false, rarity: "rare" },
];

/* ─── Activity data ─── */
interface Activity {
  id: string; type: "purchase" | "checkin" | "points" | "achievement" | "tier";
  title: string; subtitle: string; timestamp: string;
  points?: number; icon: typeof Ticket; color: string;
}

const ACTIVITIES: Activity[] = [
  { id: "a1", type: "checkin", title: "Checked in", subtitle: "Rolling Loud LA 2026", timestamp: "2 hours ago", points: 150, icon: MapPin, color: "#10B981" },
  { id: "a2", type: "points", title: "Points earned", subtitle: "VIP ticket purchase bonus", timestamp: "3 hours ago", points: 500, icon: Zap, color: GOLD },
  { id: "a3", type: "purchase", title: "Ticket purchased", subtitle: "Rolling Loud LA 2026 — VIP", timestamp: "Yesterday", icon: Ticket, color: RED },
  { id: "a4", type: "achievement", title: "Badge unlocked", subtitle: "Early Bird — purchased within 1 hour", timestamp: "Yesterday", points: 200, icon: Award, color: "#3B82F6" },
  { id: "a5", type: "checkin", title: "Checked in", subtitle: "HARD Summer Festival", timestamp: "3 days ago", points: 150, icon: MapPin, color: "#10B981" },
  { id: "a6", type: "tier", title: "Tier upgraded", subtitle: "Silver → Gold — Welcome to VIP!", timestamp: "1 week ago", points: 1000, icon: Crown, color: GOLD },
  { id: "a7", type: "purchase", title: "Ticket purchased", subtitle: "HARD Summer Festival — GA+", timestamp: "1 week ago", icon: Ticket, color: RED },
  { id: "a8", type: "points", title: "Referral bonus", subtitle: "Friend joined via your link", timestamp: "2 weeks ago", points: 300, icon: Users, color: "#8B5CF6" },
  { id: "a9", type: "checkin", title: "Checked in", subtitle: "Day N Vegas 2026", timestamp: "3 weeks ago", points: 150, icon: MapPin, color: "#10B981" },
  { id: "a10", type: "achievement", title: "Badge unlocked", subtitle: "Social Maven — Referred 10 friends", timestamp: "3 weeks ago", points: 500, icon: Award, color: "#8B5CF6" },
];

/* ─── User Profile ─── */
const USER = {
  name: "Marcus Johnson",
  username: "@marcusj",
  avatar: "https://images.unsplash.com/photo-1626913630350-e9580b32fe16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGNvbmNlcnQlMjBmZXN0aXZhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDU3MzMwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  tier: "gold" as const,
  xp: 9420,
  points: 12850,
  eventsAttended: 34,
  favoriteGenre: "Hip-Hop",
  attendanceScore: 94,
  streak: 7,
  cityRank: "Top 8%",
  city: "Los Angeles",
  memberSince: "Sep 2024",
};

const RARITY_COLORS: Record<string, string> = {
  common: "#6B7280",
  rare: "#3B82F6",
  epic: "#8B5CF6",
  legendary: GOLD,
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export function InstaPoints() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const currentTier = TIERS.find(t => t.id === USER.tier)!;
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const tierProgress = nextTier
    ? ((USER.xp - currentTier.xpRequired) / (nextTier.xpRequired - currentTier.xpRequired)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#09090B]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-50 backdrop-blur-2xl bg-[#09090B]/80 border-b border-white/[0.04]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Back to Home Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <InstaPassLogo size="sm" />
          </Link>
          
          {/* Center: InstaPoints Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A84B] to-[#8B7335] flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="text-[15px] text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
              Insta<span style={{ color: GOLD }}>Points</span>
            </span>
          </div>
          
          {/* Right: Points Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-[#D4A84B]/10 border border-[#D4A84B]/20">
              <span className="text-[12px] text-[#D4A84B]" style={{ fontWeight: 700 }}>
                {USER.points.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="max-w-lg mx-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && <ProfileTab user={USER} currentTier={currentTier} nextTier={nextTier} tierProgress={tierProgress} />}
            {activeTab === "tiers" && <TiersTab currentTier={currentTier} nextTier={nextTier} tierProgress={tierProgress} userXp={USER.xp} />}
            {activeTab === "challenges" && <ChallengesTab />}
            {activeTab === "achievements" && <AchievementsTab />}
            {activeTab === "activity" && <ActivityTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Bottom Nav ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#09090B]/90 border-t border-white/[0.04]">
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors"
              >
                {active && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: GOLD }}
                  />
                )}
                <Icon className="w-5 h-5" style={{ color: active ? GOLD : "rgba(255,255,255,0.25)" }} />
                <span
                  className="text-[9px] uppercase tracking-widest"
                  style={{ color: active ? GOLD : "rgba(255,255,255,0.25)", fontWeight: active ? 700 : 500 }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1. PROFILE DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function ProfileTab({ user, currentTier, nextTier, tierProgress }: {
  user: typeof USER; currentTier: TierInfo; nextTier: TierInfo | undefined; tierProgress: number;
}) {
  return (
    <div className="px-4 pt-6 space-y-5">
      {/* ── Avatar + Name ── */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div
            className="w-24 h-24 rounded-full p-[3px]"
            style={{ background: `linear-gradient(135deg, ${currentTier.color}, ${GOLD_DIM})` }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover border-2 border-[#09090B]"
            />
          </div>
          {/* Tier badge overlay */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] uppercase tracking-wider border"
            style={{
              background: `linear-gradient(135deg, ${currentTier.color}20, ${currentTier.color}05)`,
              borderColor: `${currentTier.color}40`,
              color: currentTier.color,
              fontWeight: 800,
            }}
          >
            {currentTier.name}
          </div>
        </div>
        <h1 className="text-[22px] text-white mt-2" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          {user.name}
        </h1>
        <p className="text-[13px] text-white/30" style={{ fontWeight: 500 }}>{user.username}</p>
        <p className="text-[11px] text-white/15 mt-0.5">Member since {user.memberSince}</p>
      </div>

      {/* ── XP Progress Bar ── */}
      <div className="rounded-2xl p-4" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <currentTier.icon className="w-4 h-4" style={{ color: currentTier.color }} />
            <span className="text-[12px] text-white/60" style={{ fontWeight: 600 }}>{currentTier.name} {currentTier.subtitle}</span>
          </div>
          {nextTier && (
            <span className="text-[11px] text-white/25" style={{ fontWeight: 500 }}>
              {user.xp.toLocaleString()} / {nextTier.xpRequired.toLocaleString()} XP
            </span>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${currentTier.color}, ${GOLD_LIGHT})` }}
            initial={{ width: 0 }}
            animate={{ width: `${tierProgress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        {nextTier && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-white/20">{(nextTier.xpRequired - user.xp).toLocaleString()} XP to {nextTier.name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/15" />
          </div>
        )}
      </div>

      {/* ── Points Balance ── */}
      <div
        className="rounded-2xl p-5 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${GOLD}12, transparent)`,
          border: `1px solid ${GOLD}20`,
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A84B]/60 mb-1" style={{ fontWeight: 700 }}>Points Balance</p>
        <p className="text-[36px] text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900 }}>
          {user.points.toLocaleString()}
        </p>
        <p className="text-[11px] text-white/25 mt-0.5" style={{ fontWeight: 500 }}>InstaPoints available to redeem</p>
      </div>

      {/* ── Attendance & Streak ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={BarChart3} label="Attendance Score" value={`${user.attendanceScore}%`} color="#10B981" subtitle="Based on check-ins" />
        <StatCard icon={Flame} label="Current Streak" value={`${user.streak} weeks`} color="#F97316" subtitle="Keep it going!" />
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        <MiniStat icon={Calendar} label="Events" value={user.eventsAttended.toString()} />
        <MiniStat icon={Music} label="Top Genre" value={user.favoriteGenre} />
        <MiniStat icon={MapPin} label={user.city} value={user.cityRank} />
      </div>

      {/* ── Recent Activity Preview ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
        <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.04]">
          <span className="text-[12px] text-white/50 uppercase tracking-wider" style={{ fontWeight: 700 }}>Recent Activity</span>
          <span className="text-[10px] text-[#D4A84B]" style={{ fontWeight: 600 }}>View All →</span>
        </div>
        {ACTIVITIES.slice(0, 3).map((a) => (
          <ActivityRow key={a.id} activity={a} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, subtitle }: {
  icon: typeof Flame; label: string; value: string; color: string; subtitle: string;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <Icon className="w-5 h-5 mb-2" style={{ color }} />
      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5" style={{ fontWeight: 600 }}>{label}</p>
      <p className="text-[24px] text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>{value}</p>
      <p className="text-[9px] text-white/15 mt-0.5" style={{ fontWeight: 500 }}>{subtitle}</p>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Calendar; label: string; value: string }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
      <Icon className="w-4 h-4 mx-auto mb-1.5 text-white/20" />
      <p className="text-[14px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{value}</p>
      <p className="text-[8px] text-white/20 uppercase tracking-wider mt-0.5" style={{ fontWeight: 600 }}>{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. TIER PROGRESSION
   ═══════════════════════════════════════════════════════════════ */
function TiersTab({ currentTier, nextTier, tierProgress, userXp }: {
  currentTier: TierInfo; nextTier: TierInfo | undefined; tierProgress: number; userXp: number;
}) {
  const [expandedTier, setExpandedTier] = useState<string | null>(currentTier.id);
  const currentIdx = TIERS.indexOf(currentTier);

  return (
    <div className="px-4 pt-6 space-y-5">
      {/* ── Header ── */}
      <div className="text-center">
        <h2 className="text-[20px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          Tier Progression
        </h2>
        <p className="text-[12px] text-white/25 mt-1" style={{ fontWeight: 500 }}>
          Climb the ranks. Unlock exclusive perks.
        </p>
      </div>

      {/* ── Current Status Card ── */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentTier.color}10, transparent)`,
          border: `1px solid ${currentTier.color}25`,
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.04]"
          style={{ background: currentTier.color }}
        />
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${currentTier.color}15`, border: `1px solid ${currentTier.color}30` }}
          >
            <currentTier.icon className="w-6 h-6" style={{ color: currentTier.color }} />
          </div>
          <div>
            <p className="text-[16px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              {currentTier.name} <span className="text-white/40">— {currentTier.subtitle}</span>
            </p>
            <p className="text-[11px] text-white/25" style={{ fontWeight: 500 }}>
              {userXp.toLocaleString()} XP total
            </p>
          </div>
        </div>
        {nextTier && (
          <>
            <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${currentTier.color}, ${GOLD_LIGHT})`,
                  boxShadow: `0 0 20px ${currentTier.color}40`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${tierProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-white/25">{currentTier.name}</span>
              <span className="text-[10px]" style={{ color: `${nextTier.color}80`, fontWeight: 700 }}>
                {nextTier.name} — {(nextTier.xpRequired - userXp).toLocaleString()} XP away
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Tier Ladder ── */}
      <div className="space-y-3">
        {[...TIERS].reverse().map((tier, idx) => {
          const tierIdx = TIERS.indexOf(tier);
          const isCurrentOrPast = tierIdx <= currentIdx;
          const isCurrent = tier.id === currentTier.id;
          const isExpanded = expandedTier === tier.id;
          const isLocked = tierIdx > currentIdx;

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <button
                onClick={() => setExpandedTier(isExpanded ? null : tier.id)}
                className="w-full text-left"
              >
                <div
                  className="rounded-2xl p-4 transition-all duration-200"
                  style={{
                    background: isCurrent ? `${tier.color}08` : CARD_BG,
                    border: `1px solid ${isCurrent ? `${tier.color}30` : CARD_BORDER}`,
                    boxShadow: isCurrent ? `0 0 30px ${tier.color}08` : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: isCurrentOrPast ? `${tier.color}15` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${isCurrentOrPast ? `${tier.color}25` : "rgba(255,255,255,0.04)"}`,
                      }}
                    >
                      {isLocked ? (
                        <Lock className="w-4 h-4 text-white/15" />
                      ) : (
                        <tier.icon className="w-5 h-5" style={{ color: tier.color }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[14px]"
                          style={{ color: isCurrentOrPast ? "white" : "rgba(255,255,255,0.25)", fontWeight: 700 }}
                        >
                          {tier.name}
                        </span>
                        <span className="text-[10px] text-white/20" style={{ fontWeight: 500 }}>{tier.subtitle}</span>
                        {isCurrent && (
                          <span
                            className="text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ background: `${tier.color}20`, color: tier.color, fontWeight: 800 }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/15 mt-0.5">{tier.xpRequired.toLocaleString()} XP required</p>
                    </div>
                    <ChevronRight
                      className="w-4 h-4 text-white/15 transition-transform"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </div>

                  {/* Expanded perks */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
                          {tier.perks.map((perk, pi) => (
                            <div key={pi} className="flex items-center gap-2">
                              {isCurrentOrPast ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: tier.color }} />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-white/10 shrink-0" />
                              )}
                              <span
                                className="text-[11px]"
                                style={{ color: isCurrentOrPast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)", fontWeight: 500 }}
                              >
                                {perk}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. CHALLENGES
   ═══════════════════════════════════════════════════════════════ */
function ChallengesTab() {
  const [filter, setFilter] = useState<"all" | "attendance" | "social" | "exploration">("all");
  const filtered = filter === "all" ? CHALLENGES : CHALLENGES.filter(c => c.category === filter);

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="text-center">
        <h2 className="text-[20px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          Active Challenges
        </h2>
        <p className="text-[12px] text-white/25 mt-1" style={{ fontWeight: 500 }}>
          Complete challenges to earn XP & Points
        </p>
      </div>

      {/* ── Summary ── */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}15` }}>
          <p className="text-[18px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
            {CHALLENGES.length}
          </p>
          <p className="text-[9px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 600 }}>Active</p>
        </div>
        <div className="flex-1 rounded-xl p-3 text-center" style={{ background: `${RED}08`, border: `1px solid ${RED}15` }}>
          <p className="text-[18px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
            {CHALLENGES.reduce((a, c) => a + c.reward, 0).toLocaleString()}
          </p>
          <p className="text-[9px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 600 }}>Total Rewards</p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["all", "attendance", "social", "exploration"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider shrink-0 transition-all"
            style={{
              background: filter === f ? `${GOLD}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${filter === f ? `${GOLD}30` : "rgba(255,255,255,0.04)"}`,
              color: filter === f ? GOLD : "rgba(255,255,255,0.3)",
              fontWeight: 700,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Challenge Cards ── */}
      <div className="space-y-3">
        {filtered.map((challenge, idx) => {
          const pct = (challenge.progress / challenge.total) * 100;
          const isComplete = challenge.progress >= challenge.total;
          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl p-4"
              style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: isComplete ? "#10B98115" : `${RED}10`,
                    border: `1px solid ${isComplete ? "#10B98125" : `${RED}20`}`,
                  }}
                >
                  <challenge.icon className="w-5 h-5" style={{ color: isComplete ? "#10B981" : RED }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[13px] text-white" style={{ fontWeight: 700 }}>{challenge.title}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: challenge.rewardType === "xp" ? `${GOLD}12` : `${RED}12`,
                        color: challenge.rewardType === "xp" ? GOLD : RED,
                        fontWeight: 700,
                      }}
                    >
                      +{challenge.reward} {challenge.rewardType.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/25 mb-3" style={{ fontWeight: 500 }}>{challenge.description}</p>

                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: isComplete ? "#10B981" : `linear-gradient(90deg, ${RED}, ${GOLD})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.06 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/20" style={{ fontWeight: 500 }}>
                      {challenge.progress}/{challenge.total} completed
                    </span>
                    <span className="text-[9px] text-white/15" style={{ fontWeight: 500 }}>{challenge.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. ACHIEVEMENTS / BADGES
   ═══════════════════════════════════════════════════════════════ */
function AchievementsTab() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const filtered = filter === "all" ? BADGES : filter === "unlocked" ? BADGES.filter(b => b.unlocked) : BADGES.filter(b => !b.unlocked);
  const unlockedCount = BADGES.filter(b => b.unlocked).length;

  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="text-center">
        <h2 className="text-[20px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          Achievements
        </h2>
        <p className="text-[12px] text-white/25 mt-1" style={{ fontWeight: 500 }}>
          {unlockedCount} of {BADGES.length} badges unlocked
        </p>
      </div>

      {/* ── Progress ring ── */}
      <div className="flex justify-center">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke={GOLD}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - unlockedCount / BADGES.length) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
              {Math.round((unlockedCount / BADGES.length) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-2 justify-center">
        {(["all", "unlocked", "locked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider transition-all"
            style={{
              background: filter === f ? `${GOLD}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${filter === f ? `${GOLD}30` : "rgba(255,255,255,0.04)"}`,
              color: filter === f ? GOLD : "rgba(255,255,255,0.3)",
              fontWeight: 700,
            }}
          >
            {f === "all" ? "All" : f === "unlocked" ? `Unlocked (${unlockedCount})` : `Locked (${BADGES.length - unlockedCount})`}
          </button>
        ))}
      </div>

      {/* ── Badge Grid ── */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl p-3 flex flex-col items-center text-center relative overflow-hidden"
            style={{
              background: badge.unlocked ? CARD_BG : "rgba(255,255,255,0.01)",
              border: `1px solid ${badge.unlocked ? `${badge.color}20` : "rgba(255,255,255,0.03)"}`,
            }}
          >
            {badge.unlocked && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-8 opacity-[0.06] blur-xl"
                style={{ background: badge.color }}
              />
            )}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 relative"
              style={{
                background: badge.unlocked ? `${badge.color}12` : "rgba(255,255,255,0.02)",
                border: `1px solid ${badge.unlocked ? `${badge.color}25` : "rgba(255,255,255,0.04)"}`,
              }}
            >
              {badge.unlocked ? (
                <badge.icon className="w-6 h-6" style={{ color: badge.color }} />
              ) : (
                <Lock className="w-5 h-5 text-white/10" />
              )}
            </div>
            <p
              className="text-[10px] leading-tight mb-0.5"
              style={{ color: badge.unlocked ? "white" : "rgba(255,255,255,0.2)", fontWeight: 700 }}
            >
              {badge.name}
            </p>
            <p className="text-[8px] text-white/15 leading-tight mb-1.5" style={{ fontWeight: 500 }}>
              {badge.description}
            </p>
            <span
              className="text-[7px] px-1.5 py-0.5 rounded-full uppercase tracking-wider"
              style={{
                background: `${RARITY_COLORS[badge.rarity]}12`,
                color: badge.unlocked ? RARITY_COLORS[badge.rarity] : "rgba(255,255,255,0.12)",
                fontWeight: 700,
                border: `1px solid ${badge.unlocked ? `${RARITY_COLORS[badge.rarity]}20` : "rgba(255,255,255,0.03)"}`,
              }}
            >
              {badge.rarity}
            </span>
            {badge.unlockedDate && (
              <p className="text-[7px] text-white/10 mt-1">{badge.unlockedDate}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. ACTIVITY TIMELINE
   ═══════════════════════════════════════════════════════════════ */
function ActivityTab() {
  return (
    <div className="px-4 pt-6 space-y-5">
      <div className="text-center">
        <h2 className="text-[20px] text-white" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}>
          Activity Timeline
        </h2>
        <p className="text-[12px] text-white/25 mt-1" style={{ fontWeight: 500 }}>
          Your journey at a glance
        </p>
      </div>

      {/* ── Summary Strip ── */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <TrendingUp className="w-4 h-4" style={{ color: "#10B981" }} />
          <div>
            <p className="text-[12px] text-white" style={{ fontWeight: 700 }}>+2,850</p>
            <p className="text-[8px] text-white/20" style={{ fontWeight: 500 }}>Points this month</p>
          </div>
        </div>
        <div className="flex-1 rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
          <Calendar className="w-4 h-4" style={{ color: RED }} />
          <div>
            <p className="text-[12px] text-white" style={{ fontWeight: 700 }}>5 events</p>
            <p className="text-[8px] text-white/20" style={{ fontWeight: 500 }}>This month</p>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.04]" />

        <div className="space-y-1">
          {ACTIVITIES.map((activity, idx) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ActivityRow activity={activity} showTimeline />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Activity Row ─── */
function ActivityRow({ activity, showTimeline }: { activity: Activity; showTimeline?: boolean }) {
  const Icon = activity.icon;
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.01] transition-colors">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10"
        style={{
          background: `${activity.color}10`,
          border: `1px solid ${activity.color}20`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: activity.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-white" style={{ fontWeight: 600 }}>{activity.title}</p>
        <p className="text-[10px] text-white/20 truncate" style={{ fontWeight: 500 }}>{activity.subtitle}</p>
      </div>
      <div className="text-right shrink-0">
        {activity.points && (
          <p className="text-[11px]" style={{ color: GOLD, fontWeight: 700 }}>+{activity.points}</p>
        )}
        <p className="text-[9px] text-white/15">{activity.timestamp}</p>
      </div>
    </div>
  );
}