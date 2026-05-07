import { useState, useRef } from 'react';
import { Link } from 'react-router';
import {
  Upload, Calendar, MapPin, PlusCircle, Ticket,
  Globe, Check, Zap, ArrowRight, ArrowLeft,
  Image as ImageIcon, Eye, Sparkles, Trash2, Copy,
  Tag, Users, Info,
  Settings2, Share2, Save, Send, X, Type,
  AlignLeft, Music, Trophy, Drama, Laugh, Gamepad2,
  Building2, PartyPopper, Palette,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';

/* ═══════════════════════════════════════════════════════════════
   CREATE EVENT — Premium 5-Step Wizard with Live Preview
   Inspired by Eventbrite + Tixr UX, reengineered for InstaPass
   ═══════════════════════════════════════════════════════════════ */

const STEPS = [
  { id: 'basics', label: 'Basic Info', icon: Type, desc: 'Name, category & description' },
  { id: 'datetime', label: 'Date & Venue', icon: Calendar, desc: 'When and where' },
  { id: 'tickets', label: 'Tickets', icon: Ticket, desc: 'Pricing & tiers' },
  { id: 'media', label: 'Media', icon: ImageIcon, desc: 'Images & branding' },
  { id: 'publish', label: 'Publish', icon: Send, desc: 'Review & go live' },
];

const CATEGORIES = [
  { id: 'concerts', label: 'Concerts', icon: Music, color: '#E52324' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: '#3B82F6' },
  { id: 'theater', label: 'Theater', icon: Drama, color: '#A855F7' },
  { id: 'comedy', label: 'Comedy', icon: Laugh, color: '#F59E0B' },
  { id: 'festivals', label: 'Festivals', icon: PartyPopper, color: '#EC4899' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#06B6D4' },
  { id: 'conference', label: 'Conference', icon: Building2, color: '#10B981' },
  { id: 'art', label: 'Art & Culture', icon: Palette, color: '#F97316' },
];

interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  type: 'paid' | 'free' | 'donation';
  salesStart: string;
  salesEnd: string;
  minPerOrder: number;
  maxPerOrder: number;
}

const DEFAULT_TIER: TicketTier = {
  id: '', name: 'General Admission', price: 0, quantity: 100,
  description: '', type: 'paid', salesStart: '', salesEnd: '',
  minPerOrder: 1, maxPerOrder: 10,
};

let tierIdCounter = 0;
function newTierId() { return `tier-${++tierIdCounter}-${Date.now()}`; }

export function CreateEvent() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── Form state ──
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  const [tiers, setTiers] = useState<TicketTier[]>([
    { ...DEFAULT_TIER, id: newTierId(), name: 'General Admission', price: 49, quantity: 500 },
    { ...DEFAULT_TIER, id: newTierId(), name: 'VIP', price: 149, quantity: 100, description: 'Front row access, complimentary drinks, VIP lounge' },
  ]);

  const [coverImage, setCoverImage] = useState('');
  const [eventVisibility, setEventVisibility] = useState<'public' | 'private' | 'unlisted'>('public');

  // ── Helpers ──
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const addTier = () => {
    setTiers([...tiers, { ...DEFAULT_TIER, id: newTierId(), name: `Tier ${tiers.length + 1}`, price: 0 }]);
  };

  const updateTier = (id: string, updates: Partial<TicketTier>) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTier = (id: string) => {
    if (tiers.length > 1) setTiers(tiers.filter(t => t.id !== id));
  };

  const duplicateTier = (id: string) => {
    const tier = tiers.find(t => t.id === id);
    if (tier) {
      const newTier = { ...tier, id: newTierId(), name: `${tier.name} (Copy)` };
      setTiers([...tiers, newTier]);
    }
  };

  const canAdvance = () => {
    if (step === 0) return eventName.trim().length > 0 && category;
    if (step === 1) return eventDate && (isOnline || venue.trim().length > 0);
    if (step === 2) return tiers.length > 0;
    return true;
  };

  const goNext = () => { if (step < STEPS.length - 1 && canAdvance()) setStep(step + 1); };
  const goBack = () => { if (step > 0) setStep(step - 1); };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const totalCapacity = tiers.reduce((s, t) => s + t.quantity, 0);
  const priceRange = tiers.length > 0
    ? tiers.every(t => t.type === 'free')
      ? 'Free'
      : tiers.some(t => t.type === 'free')
        ? `Free – $${Math.max(...tiers.filter(t => t.type === 'paid').map(t => t.price))}`
        : `$${Math.min(...tiers.map(t => t.price))} – $${Math.max(...tiers.map(t => t.price))}`
    : '$0';

  const selectedCategory = CATEGORIES.find(c => c.id === category);

  // ── Input component ──
  const FormInput = ({ label, required, ...props }: any) => (
    <div className="w-full">
      {label && (
        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-2" style={{ fontWeight: 700 }}>
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all"
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px] flex flex-col h-screen">

        {/* ═══ TOP HEADER BAR ═══ */}
        <header className="shrink-0 h-[64px] border-b border-[#1E293B]/60 bg-[#060D1B]/95 backdrop-blur-lg flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-[16px] text-white" style={{ fontWeight: 700 }}>
              {eventName || 'Untitled Event'}
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
              Draft
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] transition-all ${showPreview ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-white/40 hover:text-white/60 border border-transparent hover:bg-white/5'}`}
              style={{ fontWeight: 600 }}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent transition-all"
              style={{ fontWeight: 600 }}
            >
              <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => setStep(STEPS.length - 1)}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-colors shadow-lg shadow-[#E52324]/20"
              style={{ fontWeight: 700, letterSpacing: '0.04em' }}
            >
              <Send className="w-3.5 h-3.5" /> Publish
            </button>
          </div>
        </header>

        {/* ═══ STEP PROGRESS BAR ═══ */}
        <div className="shrink-0 border-b border-[#1E293B]/40 bg-[#0A1628]/60">
          <div className="flex items-center px-6 py-0">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isComplete = i < step;
              return (
                <button
                  key={s.id}
                  onClick={() => (isComplete || i <= step + 1) && setStep(i)}
                  className="flex-1 group relative"
                >
                  <div className={`flex items-center gap-3 px-4 py-4 transition-all ${isActive ? '' : 'opacity-50 hover:opacity-80'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isComplete ? 'bg-emerald-500/15 text-emerald-400' :
                      isActive ? 'bg-blue-500/15 text-blue-400' :
                      'bg-white/5 text-white/30'
                    }`}>
                      {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className={`text-[12px] ${isActive ? 'text-white' : 'text-white/50'}`} style={{ fontWeight: 700 }}>
                        {s.label}
                      </div>
                      <div className="text-[10px] text-white/25">{s.desc}</div>
                    </div>
                  </div>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="stepIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-blue-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══ MAIN CONTENT AREA ═══ */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── Left: Form Panel ── */}
          <div ref={contentRef} className={`flex-1 overflow-y-auto ${showPreview ? '' : ''}`}>
            <div className="p-8 lg:p-10 max-w-[800px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* ──────────────────────────────────────────
                      STEP 0: BASIC INFO
                      ────────────────────────────────────────── */}
                  {step === 0 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-[24px] text-white mb-1" style={{ fontWeight: 800 }}>
                          Let's start with the basics
                        </h2>
                        <p className="text-[14px] text-white/35">
                          Give your event a name and tell people what it's about.
                        </p>
                      </div>

                      {/* Event Name */}
                      <div>
                        <FormInput
                          label="Event Name"
                          required
                          placeholder="e.g. Summer Music Festival 2026"
                          value={eventName}
                          onChange={(e: any) => setEventName(e.target.value)}
                          maxLength={100}
                        />
                        <div className="flex justify-end mt-1.5">
                          <span className={`text-[10px] ${eventName.length > 80 ? 'text-amber-400' : 'text-white/20'}`}>
                            {eventName.length}/100
                          </span>
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-3" style={{ fontWeight: 700 }}>
                          Category <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {CATEGORIES.map(cat => {
                            const CatIcon = cat.icon;
                            const selected = category === cat.id;
                            return (
                              <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                  selected
                                    ? 'border-blue-500/40 bg-blue-500/[0.08]'
                                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10]'
                                }`}
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: `${cat.color}15` }}
                                >
                                  <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                                </div>
                                <span className={`text-[11px] ${selected ? 'text-white' : 'text-white/50'}`} style={{ fontWeight: 600 }}>
                                  {cat.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-2" style={{ fontWeight: 700 }}>
                          <AlignLeft className="w-3 h-3" /> Description
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Tell attendees what makes this event special..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all resize-none"
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-2" style={{ fontWeight: 700 }}>
                          <Tag className="w-3 h-3" /> Tags
                          <span className="text-white/20 normal-case tracking-normal ml-1">(optional, up to 8)</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-[12px]" style={{ fontWeight: 600 }}>
                              #{tag}
                              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-white transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add a tag..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-all"
                          />
                          <button
                            onClick={addTag}
                            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/[0.08] text-white/50 text-[12px] hover:bg-white/10 transition-all"
                            style={{ fontWeight: 600 }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────
                      STEP 1: DATE & VENUE
                      ────────────────────────────────────────── */}
                  {step === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-[24px] text-white mb-1" style={{ fontWeight: 800 }}>
                          When and where
                        </h2>
                        <p className="text-[14px] text-white/35">
                          Set the date, time, and location for your event.
                        </p>
                      </div>

                      {/* Date & Time */}
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-5">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Date & Time</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <FormInput
                            label="Event Date"
                            required
                            type="date"
                            value={eventDate}
                            onChange={(e: any) => setEventDate(e.target.value)}
                          />
                          <FormInput
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e: any) => setStartTime(e.target.value)}
                          />
                          <FormInput
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e: any) => setEndTime(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Online / In-Person Toggle */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => setIsOnline(false)}
                          className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-xl border transition-all ${
                            !isOnline ? 'border-blue-500/40 bg-blue-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          <MapPin className={`w-5 h-5 ${!isOnline ? 'text-blue-400' : 'text-white/30'}`} />
                          <div className="text-left">
                            <div className={`text-[13px] ${!isOnline ? 'text-white' : 'text-white/50'}`} style={{ fontWeight: 700 }}>In-Person</div>
                            <div className="text-[11px] text-white/25">Physical venue</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setIsOnline(true)}
                          className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-xl border transition-all ${
                            isOnline ? 'border-blue-500/40 bg-blue-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                        >
                          <Globe className={`w-5 h-5 ${isOnline ? 'text-blue-400' : 'text-white/30'}`} />
                          <div className="text-left">
                            <div className={`text-[13px] ${isOnline ? 'text-white' : 'text-white/50'}`} style={{ fontWeight: 700 }}>Online</div>
                            <div className="text-[11px] text-white/25">Virtual event</div>
                          </div>
                        </button>
                      </div>

                      {/* Venue Details */}
                      {!isOnline ? (
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center gap-2 mb-5">
                            <Building2 className="w-4 h-4 text-blue-400" />
                            <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Venue Details</span>
                          </div>
                          <div className="space-y-4">
                            <FormInput
                              label="Venue Name"
                              required
                              placeholder="e.g. Madison Square Garden"
                              value={venue}
                              onChange={(e: any) => setVenue(e.target.value)}
                            />
                            <FormInput
                              label="Street Address"
                              placeholder="123 Main Street"
                              value={address}
                              onChange={(e: any) => setAddress(e.target.value)}
                            />
                            <div className="grid grid-cols-3 gap-4">
                              <FormInput
                                label="City"
                                placeholder="New York"
                                value={city}
                                onChange={(e: any) => setCity(e.target.value)}
                              />
                              <FormInput
                                label="State"
                                placeholder="NY"
                                value={stateRegion}
                                onChange={(e: any) => setStateRegion(e.target.value)}
                              />
                              <FormInput
                                label="ZIP"
                                placeholder="10001"
                                value={zipCode}
                                onChange={(e: any) => setZipCode(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Map Placeholder */}
                          <div className="mt-5 h-[160px] rounded-xl bg-[#0B1220] border border-[#1F2937] flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="w-8 h-8 text-white/10 mx-auto mb-2" />
                              <span className="text-[11px] text-white/20">Map preview will appear here</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center gap-2 mb-5">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Online Event</span>
                          </div>
                          <FormInput
                            label="Streaming URL"
                            placeholder="https://zoom.us/j/..."
                          />
                          <p className="text-[11px] text-white/20 mt-2">
                            This link will be shared with ticket holders after purchase.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ──────────────────────────────────────────
                      STEP 2: TICKETS
                      ────────────────────────────────────────── */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-[24px] text-white mb-1" style={{ fontWeight: 800 }}>
                            Ticket Tiers
                          </h2>
                          <p className="text-[14px] text-white/35">
                            Set up pricing, quantity, and tier details.
                          </p>
                        </div>
                        <button
                          onClick={addTier}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-[12px] border border-blue-500/20 hover:bg-blue-500/15 transition-all"
                          style={{ fontWeight: 700 }}
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Add Tier
                        </button>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>Total Capacity</div>
                          <div className="text-[20px] text-white" style={{ fontWeight: 800 }}>{totalCapacity.toLocaleString()}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>Price Range</div>
                          <div className="text-[20px] text-white" style={{ fontWeight: 800 }}>{priceRange}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>Tiers</div>
                          <div className="text-[20px] text-white" style={{ fontWeight: 800 }}>{tiers.length}</div>
                        </div>
                      </div>

                      {/* Tier Cards */}
                      <div className="space-y-4">
                        {tiers.map((tier, idx) => (
                          <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.10] transition-all group"
                          >
                            {/* Tier header */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-8 rounded-full bg-blue-500" />
                                <div>
                                  <input
                                    value={tier.name}
                                    onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                                    className="bg-transparent text-[16px] text-white focus:outline-none border-b border-transparent focus:border-blue-500/40 transition-all"
                                    style={{ fontWeight: 700 }}
                                    placeholder="Tier Name"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => duplicateTier(tier.id)}
                                  className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                                  title="Duplicate"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeTier(tier.id)}
                                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Type selector */}
                            <div className="flex gap-2 mb-5">
                              {(['paid', 'free', 'donation'] as const).map(t => (
                                <button
                                  key={t}
                                  onClick={() => updateTier(tier.id, { type: t, price: t === 'free' ? 0 : tier.price })}
                                  className={`px-3.5 py-1.5 rounded-lg text-[11px] border transition-all ${
                                    tier.type === t
                                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                      : 'text-white/30 border-white/[0.06] hover:text-white/50 hover:bg-white/[0.03]'
                                  }`}
                                  style={{ fontWeight: 700, textTransform: 'capitalize' }}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>

                            {/* Price & Quantity */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 block" style={{ fontWeight: 700 }}>Price</label>
                                {tier.type === 'free' ? (
                                  <div className="w-full px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[14px] flex items-center gap-2" style={{ fontWeight: 700 }}>
                                    <Check className="w-4 h-4" />
                                    FREE
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px]">$</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={tier.price}
                                      onChange={(e) => updateTier(tier.id, { price: Number(e.target.value) })}
                                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                    />
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 block" style={{ fontWeight: 700 }}>Quantity Available</label>
                                <input
                                  type="number"
                                  min={1}
                                  value={tier.quantity}
                                  onChange={(e) => updateTier(tier.id, { quantity: Number(e.target.value) })}
                                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 block" style={{ fontWeight: 700 }}>Tier Description</label>
                              <input
                                value={tier.description}
                                onChange={(e) => updateTier(tier.id, { description: e.target.value })}
                                placeholder="What's included? e.g. Front row access, complimentary drinks..."
                                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                              />
                            </div>

                            {/* Per-order limits */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 block" style={{ fontWeight: 700 }}>Min Per Order</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={10}
                                  value={tier.minPerOrder}
                                  onChange={(e) => updateTier(tier.id, { minPerOrder: Number(e.target.value) })}
                                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5 block" style={{ fontWeight: 700 }}>Max Per Order</label>
                                <input
                                  type="number"
                                  min={1}
                                  max={50}
                                  value={tier.maxPerOrder}
                                  onChange={(e) => updateTier(tier.id, { maxPerOrder: Number(e.target.value) })}
                                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Add Tier Button (bottom) */}
                      <button
                        onClick={addTier}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-white/[0.08] text-white/30 text-[13px] hover:border-blue-500/30 hover:text-blue-400 hover:bg-blue-500/[0.03] transition-all"
                        style={{ fontWeight: 600 }}
                      >
                        <PlusCircle className="w-4 h-4" /> Add Another Ticket Tier
                      </button>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────
                      STEP 3: MEDIA
                      ────────────────────────────────────────── */}
                  {step === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-[24px] text-white mb-1" style={{ fontWeight: 800 }}>
                          Event Media
                        </h2>
                        <p className="text-[14px] text-white/35">
                          Add a cover image and gallery to make your event stand out.
                        </p>
                      </div>

                      {/* Cover Image */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-3" style={{ fontWeight: 700 }}>
                          Cover Image <span className="text-red-400">*</span>
                        </label>
                        {coverImage ? (
                          <div className="relative rounded-2xl overflow-hidden group">
                            <img src={coverImage} alt="Cover" className="w-full aspect-[21/9] object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                              <button
                                onClick={() => setCoverImage('')}
                                className="px-4 py-2 rounded-xl bg-red-500/80 text-white text-[12px] hover:bg-red-500 transition-all"
                                style={{ fontWeight: 700 }}
                              >
                                <Trash2 className="w-3.5 h-3.5 inline mr-1.5" /> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCoverImage('https://images.unsplash.com/photo-1760092189903-dce3e898dacf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBjcm93ZCUyMGV2ZW50fGVufDF8fHx8MTc3MjA5ODQwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')}
                            className="w-full aspect-[21/9] rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.01] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-all">
                              <Upload className="w-7 h-7 text-white/20 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-[13px] text-white/40" style={{ fontWeight: 600 }}>Click to upload cover image</p>
                              <p className="text-[11px] text-white/20 mt-0.5">Recommended: 2160×924px · PNG or JPG · Max 10MB</p>
                            </div>
                          </button>
                        )}
                      </div>

                      {/* Event Visibility */}
                      <div>
                        <label className="flex items-center gap-1 text-[11px] uppercase tracking-[0.08em] text-white/40 mb-3" style={{ fontWeight: 700 }}>
                          <Eye className="w-3 h-3" /> Visibility
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {([
                            { id: 'public', label: 'Public', desc: 'Visible on marketplace', icon: Globe },
                            { id: 'unlisted', label: 'Unlisted', desc: 'Link only', icon: Share2 },
                            { id: 'private', label: 'Private', desc: 'Invite only', icon: Users },
                          ] as const).map(v => {
                            const VIcon = v.icon;
                            const sel = eventVisibility === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => setEventVisibility(v.id)}
                                className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-all ${
                                  sel ? 'border-blue-500/40 bg-blue-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                                }`}
                              >
                                <VIcon className={`w-4 h-4 ${sel ? 'text-blue-400' : 'text-white/30'}`} />
                                <div className="text-left">
                                  <div className={`text-[12px] ${sel ? 'text-white' : 'text-white/50'}`} style={{ fontWeight: 700 }}>{v.label}</div>
                                  <div className="text-[10px] text-white/20">{v.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Additional Settings */}
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-5">
                          <Settings2 className="w-4 h-4 text-blue-400" />
                          <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Additional Settings</span>
                        </div>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer">
                            <div>
                              <div className="text-[13px] text-white" style={{ fontWeight: 600 }}>Allow refunds</div>
                              <div className="text-[11px] text-white/25">Attendees can request refunds up to 48h before</div>
                            </div>
                            <div className="w-10 h-6 rounded-full bg-blue-500/30 relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-blue-400" />
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer">
                            <div>
                              <div className="text-[13px] text-white" style={{ fontWeight: 600 }}>Show remaining tickets</div>
                              <div className="text-[11px] text-white/25">Display scarcity indicator on event page</div>
                            </div>
                            <div className="w-10 h-6 rounded-full bg-blue-500/30 relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-blue-400" />
                            </div>
                          </label>
                          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-all cursor-pointer">
                            <div>
                              <div className="text-[13px] text-white" style={{ fontWeight: 600 }}>Age restriction</div>
                              <div className="text-[11px] text-white/25">Require age verification at check-in</div>
                            </div>
                            <div className="w-10 h-6 rounded-full bg-white/10 relative cursor-pointer">
                              <div className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white/30" />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────
                      STEP 4: REVIEW & PUBLISH
                      ────────────────────────────────────────── */}
                  {step === 4 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-[24px] text-white mb-1" style={{ fontWeight: 800 }}>
                          Review & Publish
                        </h2>
                        <p className="text-[14px] text-white/35">
                          Everything looks good? Let's go live.
                        </p>
                      </div>

                      {/* Summary Cards */}
                      <div className="space-y-4">
                        {/* Event Info */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Type className="w-4 h-4 text-blue-400" />
                              <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Event Info</span>
                            </div>
                            <button onClick={() => setStep(0)} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors" style={{ fontWeight: 600 }}>
                              Edit
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Event Name</div>
                              <div className="text-[15px] text-white" style={{ fontWeight: 700 }}>{eventName || 'Not set'}</div>
                            </div>
                            <div className="flex gap-8">
                              <div>
                                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Category</div>
                                <div className="text-[13px] text-white/70">{selectedCategory?.label || 'Not set'}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Visibility</div>
                                <div className="text-[13px] text-white/70 capitalize">{eventVisibility}</div>
                              </div>
                            </div>
                            {description && (
                              <div>
                                <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Description</div>
                                <div className="text-[13px] text-white/50 line-clamp-2">{description}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date & Venue */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Date & Venue</span>
                            </div>
                            <button onClick={() => setStep(1)} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors" style={{ fontWeight: 600 }}>
                              Edit
                            </button>
                          </div>
                          <div className="flex gap-8">
                            <div>
                              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Date</div>
                              <div className="text-[13px] text-white/70">{eventDate || 'Not set'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Time</div>
                              <div className="text-[13px] text-white/70">{startTime || 'Not set'}{endTime ? ` – ${endTime}` : ''}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5" style={{ fontWeight: 700 }}>Venue</div>
                              <div className="text-[13px] text-white/70">{isOnline ? 'Online Event' : (venue || 'Not set')}</div>
                            </div>
                          </div>
                        </div>

                        {/* Tickets Summary */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Ticket className="w-4 h-4 text-blue-400" />
                              <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Tickets ({tiers.length} tiers)</span>
                            </div>
                            <button onClick={() => setStep(2)} className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors" style={{ fontWeight: 600 }}>
                              Edit
                            </button>
                          </div>
                          <div className="space-y-2">
                            {tiers.map(tier => (
                              <div key={tier.id} className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                  <div className="w-1.5 h-6 rounded-full bg-blue-500" />
                                  <div>
                                    <span className="text-[13px] text-white" style={{ fontWeight: 600 }}>{tier.name}</span>
                                    <span className="text-[11px] text-white/25 ml-3">× {tier.quantity}</span>
                                  </div>
                                </div>
                                <span className="text-[14px] text-white" style={{ fontWeight: 700 }}>
                                  {tier.type === 'free' ? 'Free' : `$${tier.price}`}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                            <span className="text-[12px] text-white/40" style={{ fontWeight: 600 }}>Total Capacity</span>
                            <span className="text-[16px] text-white" style={{ fontWeight: 800 }}>{totalCapacity.toLocaleString()} tickets</span>
                          </div>
                        </div>
                      </div>

                      {/* Publish Button */}
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#E52324]/10 to-[#E52324]/5 border border-[#E52324]/20">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#E52324]/15 flex items-center justify-center shrink-0">
                            <Sparkles className="w-6 h-6 text-[#E52324]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[16px] text-white mb-1" style={{ fontWeight: 700 }}>Ready to go live?</h3>
                            <p className="text-[13px] text-white/40 mb-4">
                              Your event will be published to the InstaPass marketplace and visible to millions of fans. You can edit details anytime from your dashboard.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#E52324] text-white text-[14px] hover:bg-[#c91f20] transition-colors shadow-lg shadow-[#E52324]/25"
                                style={{ fontWeight: 800, letterSpacing: '0.04em' }}
                              >
                                <Send className="w-4 h-4" /> Publish Event
                              </button>
                              <button
                                onClick={handleSaveDraft}
                                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 text-[13px] hover:bg-white/5 transition-all"
                                style={{ fontWeight: 600 }}
                              >
                                <Save className="w-4 h-4" /> Save as Draft
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* ── Navigation Buttons ── */}
              {step < 4 && (
                <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/[0.06]">
                  <button
                    onClick={goBack}
                    disabled={step === 0}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] text-white/40 hover:text-white/70 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canAdvance()}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-500 text-white text-[13px] hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                    style={{ fontWeight: 700, letterSpacing: '0.03em' }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Live Preview Panel ── */}
          <AnimatePresence>
            {showPreview && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="shrink-0 border-l border-[#1E293B]/60 bg-[#0A1220] overflow-y-auto overflow-x-hidden"
              >
                <div className="p-6">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-[12px] text-white/50" style={{ fontWeight: 700 }}>LIVE PREVIEW</span>
                    </div>
                    <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Preview Card */}
                  <div className="rounded-2xl overflow-hidden bg-[#111827] border border-[#1F2937] shadow-2xl">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/9] bg-[#0B1220]">
                      {coverImage ? (
                        <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                      {selectedCategory && (
                        <span
                          className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] text-white uppercase tracking-wider"
                          style={{ fontWeight: 800, backgroundColor: selectedCategory.color }}
                        >
                          {selectedCategory.label}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-[16px] text-white leading-tight mb-2" style={{ fontWeight: 800 }}>
                        {eventName || 'Your Event Name'}
                      </h3>

                      {eventDate && (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-1.5">
                          <Calendar className="w-3 h-3 text-[#E52324]" />
                          <span>{eventDate}{startTime ? ` · ${startTime}` : ''}</span>
                        </div>
                      )}

                      {(venue || isOnline) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-3">
                          <MapPin className="w-3 h-3 text-[#E52324]" />
                          <span>{isOnline ? 'Online Event' : venue}{city ? `, ${city}` : ''}</span>
                        </div>
                      )}

                      {description && (
                        <p className="text-[11px] text-white/30 leading-relaxed mb-4 line-clamp-3">
                          {description}
                        </p>
                      )}

                      {/* Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-white/30" style={{ fontWeight: 600 }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ticket Preview */}
                      {tiers.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {tiers.slice(0, 3).map(tier => (
                            <div key={tier.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                              <div>
                                <div className="text-[11px] text-white" style={{ fontWeight: 600 }}>{tier.name}</div>
                                {tier.description && <div className="text-[9px] text-white/25 mt-0.5 line-clamp-1">{tier.description}</div>}
                              </div>
                              <span className="text-[13px] text-white" style={{ fontWeight: 800 }}>
                                {tier.type === 'free' ? 'Free' : `$${tier.price}`}
                              </span>
                            </div>
                          ))}
                          {tiers.length > 3 && (
                            <div className="text-[10px] text-white/20 text-center py-1">+{tiers.length - 3} more tiers</div>
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <button className="w-full py-3 rounded-xl bg-[#E52324] text-white text-[12px] hover:bg-[#c91f20] transition-colors" style={{ fontWeight: 800, letterSpacing: '0.05em' }}>
                        Get Tickets — {priceRange}
                      </button>

                      {/* Trust badges */}
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <span className="flex items-center gap-1 text-[9px] text-white/20">
                          <Check className="w-2.5 h-2.5 text-emerald-500" /> 100% Guaranteed
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-white/20">
                          <Zap className="w-2.5 h-2.5 text-amber-500" /> Instant Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* How it looks info */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-white/30 leading-relaxed">
                        This is a preview of how your event will appear on the InstaPass marketplace. Final design may vary.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
