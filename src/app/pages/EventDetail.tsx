import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Calendar, MapPin, Clock, Minus, Plus, Share2, Heart, ChevronDown, ChevronUp,
  QrCode, Shield, Zap, Users, Star, ExternalLink, Copy, Facebook, Twitter,
  Flame, TrendingUp, Crown,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Badge } from '../components/Badge';
import { mockEvents, ticketTypes, faqItems } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-black mb-4">Event Not Found</h2>
          <Link to="/events" className="text-red-500 hover:underline">Browse All Events</Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (ticketId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, Math.min(10, (prev[ticketId] || 0) + change)),
    }));
  };

  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const subtotal = ticketTypes.reduce((sum, t) => sum + (quantities[t.id] || 0) * t.price, 0);
  const serviceFee = subtotal * 0.08;
  const facilityFee = totalQuantity * 3.5;
  const totalPrice = subtotal + serviceFee + facilityFee;

  const soldPercent = event.totalTickets && event.soldTickets
    ? Math.round((event.soldTickets / event.totalTickets) * 100) : 0;

  const handleCheckout = () => {
    if (totalQuantity > 0) {
      navigate(`/checkout/${id}`, { state: { quantities, totalPrice, subtotal, serviceFee, facilityFee } });
    }
  };

  // Similar events
  const similar = mockEvents.filter(e => e.id !== id && e.category === event.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      {/* Hero Banner */}
      <div className="relative h-[350px] sm:h-[450px] overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2 mb-3">
              {event.badge && <Badge variant={soldPercent > 90 ? 'soldout' : 'trending'}>{event.badge}</Badge>}
              {soldPercent > 90 && <Badge variant="soldout">Almost Sold Out</Badge>}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-red-500" /> {event.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-red-500" /> {event.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-500" /> {event.venue}, {event.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm transition-all ${
                  saved ? 'bg-red-600/10 border-red-600/30 text-red-500' : 'border-[#1F2937] text-white/60 hover:bg-white/5'
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} /> {saved ? 'Saved' : 'Save'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShareOpen(!shareOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#1F2937] text-sm text-white/60 hover:bg-white/5 transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {shareOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-[#111827] border border-[#1F2937] rounded-xl shadow-xl p-2 z-20">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white"><Copy className="w-4 h-4" /> Copy Link</button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white"><Facebook className="w-4 h-4" /> Facebook</button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white"><Twitter className="w-4 h-4" /> Twitter</button>
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">About This Event</h2>
              <p className="text-white/60 text-sm leading-relaxed">{event.description}</p>
            </div>

            {/* Lineup */}
            {event.lineup && event.lineup.length > 0 && (
              <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">Lineup</h2>
                <div className="space-y-3">
                  {event.lineup.map((artist, i) => (
                    <div key={artist} className="flex items-center gap-4 p-3 rounded-xl bg-[#0F172A] border border-[#1F2937]">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${
                        i === 0 ? 'bg-red-600' : 'bg-[#1F2937]'
                      }`}>
                        {i === 0 ? <Star className="w-5 h-5" /> : (i + 1)}
                      </div>
                      <div>
                        <div className="text-white font-black text-sm uppercase tracking-tight">{artist}</div>
                        {i === 0 && <div className="text-red-500 text-[10px] font-black uppercase tracking-wider">Headliner</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-black">
                  {event.organizer?.avatar}
                </div>
                <div>
                  <div className="text-white font-black text-sm uppercase tracking-tight">{event.organizer?.name}</div>
                  <div className="text-white/40 text-xs">Verified Organizer</div>
                </div>
                <Link
                  to={`/organizer-profile/${event.organizer?.id}`}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1F2937] text-sm text-white/60 hover:bg-white/5 transition-all"
                >
                  View Profile <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">FAQ</h2>
              <div className="space-y-2">
                {faqItems.slice(0, 4).map((faq, i) => (
                  <div key={i} className="rounded-xl border border-[#1F2937] overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-sm text-white/80 hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-left font-black">{faq.q}</span>
                      {openFaq === i ? <ChevronUp className="w-4 h-4 shrink-0 text-white/40" /> : <ChevronDown className="w-4 h-4 shrink-0 text-white/40" />}
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-sm text-white/50 leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Events */}
            {similar.length > 0 && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-4">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similar.map(e => (
                    <Link key={e.id} to={`/event/${e.id}`}>
                      <div className="group rounded-xl overflow-hidden bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all">
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="p-3">
                          <div className="text-[10px] text-red-500 font-black uppercase tracking-wider">{e.date}</div>
                          <div className="text-white text-sm font-black uppercase tracking-tight mt-1 truncate group-hover:text-red-500 transition-colors">{e.title}</div>
                          <div className="text-white/40 text-xs mt-1">From ${e.price}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Ticket Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <div className="bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden">
                <div className="p-6 border-b border-[#1F2937]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Select Tickets</h3>
                    {soldPercent > 0 && (
                      <span className="text-[10px] text-white/40">{soldPercent}% sold</span>
                    )}
                  </div>

                  {/* Availability bar */}
                  <div className="h-1.5 rounded-full bg-[#1F2937] overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full transition-all ${soldPercent > 90 ? 'bg-orange-500' : 'bg-red-600'}`}
                      style={{ width: `${soldPercent}%` }}
                    />
                  </div>

                  {/* ── InstaPoints Gamification Layer ── */}
                  <div className="rounded-xl bg-gradient-to-br from-[#D4A84B]/8 to-transparent border border-[#D4A84B]/15 p-4 mb-2">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Zap className="w-3.5 h-3.5 text-[#D4A84B]" />
                      <span className="text-[10px] text-[#D4A84B] uppercase tracking-wider" style={{ fontWeight: 800 }}>InstaPoints Rewards</span>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-[#D4A84B]/10 flex items-center justify-center">
                            <Star className="w-3 h-3 text-[#D4A84B]" />
                          </div>
                          <span className="text-[11px] text-white/60" style={{ fontWeight: 500 }}>Points earned</span>
                        </div>
                        <span className="text-[12px] text-[#D4A84B]" style={{ fontWeight: 800 }}>+100 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-orange-500/10 flex items-center justify-center">
                            <Flame className="w-3 h-3 text-orange-400" />
                          </div>
                          <span className="text-[11px] text-white/60" style={{ fontWeight: 500 }}>Streak bonus</span>
                        </div>
                        <span className="text-[12px] text-orange-400" style={{ fontWeight: 800 }}>+50 pts</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="text-[11px] text-white/60" style={{ fontWeight: 500 }}>2X points tonight</span>
                        </div>
                        <span className="text-[12px] text-emerald-400" style={{ fontWeight: 800 }}>Active</span>
                      </div>
                    </div>
                    {/* Weekly progress */}
                    <div className="mt-3 pt-3 border-t border-[#D4A84B]/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-white/30" style={{ fontWeight: 600 }}>Weekend Warrior Challenge</span>
                        <span className="text-[10px] text-[#D4A84B]" style={{ fontWeight: 700 }}>2/3 events</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#1F2937] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#D4A84B] to-[#F5D98A]" style={{ width: '66%' }} />
                      </div>
                      <div className="text-[9px] text-white/20 mt-1" style={{ fontWeight: 500 }}>1 more event this week for +300 XP bonus</div>
                    </div>
                  </div>
                </div>

                {/* Ticket Tiers */}
                <div className="p-4 space-y-3">
                  {ticketTypes.map((ticket) => {
                    const qty = quantities[ticket.id] || 0;
                    const isSelected = selectedTier === ticket.id || qty > 0;
                    return (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTier(ticket.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-red-600/50 bg-red-600/5'
                            : 'border-[#1F2937] bg-[#0F172A] hover:border-[#374151]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-white font-black text-sm uppercase tracking-tight">{ticket.name}</div>
                            <div className="text-white/40 text-[11px] mt-0.5">{ticket.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-black text-lg">${ticket.price}</div>
                            <div className="text-white/30 text-[10px]">{ticket.available} left</div>
                          </div>
                        </div>

                        {ticket.available <= 15 && (
                          <div className="text-orange-500 text-[10px] font-black uppercase tracking-wider mb-2">
                            Only {ticket.available} remaining!
                          </div>
                        )}

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuantityChange(ticket.id, -1); }}
                            className="w-8 h-8 rounded-lg bg-[#1F2937] text-white/60 hover:bg-white/10 transition-colors flex items-center justify-center"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-white font-black text-sm">{qty}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuantityChange(ticket.id, 1); }}
                            className="w-8 h-8 rounded-lg bg-[#1F2937] text-white/60 hover:bg-white/10 transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Fees Breakdown */}
                {totalQuantity > 0 && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-[#1F2937] pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-white/50">
                        <span>Subtotal ({totalQuantity} ticket{totalQuantity > 1 ? 's' : ''})</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/50">
                        <span>Service Fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/50">
                        <span>Facility Fee</span>
                        <span>${facilityFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white font-black pt-2 border-t border-[#1F2937]">
                        <span>Total</span>
                        <span className="text-lg">${totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buy Button */}
                <div className="p-4 border-t border-[#1F2937]">
                  <button
                    onClick={handleCheckout}
                    disabled={totalQuantity === 0}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-wider text-sm transition-all ${
                      totalQuantity > 0
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                        : 'bg-[#1F2937] text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {totalQuantity > 0 ? `Buy ${totalQuantity} Ticket${totalQuantity > 1 ? 's' : ''} — $${totalPrice.toFixed(2)}` : 'Select Tickets'}
                  </button>
                </div>

                {/* QR Scan Placeholder */}
                <div className="p-4 border-t border-[#1F2937]">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-[#1F2937]">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <QrCode className="w-8 h-8 text-[#0F172A]" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-black uppercase tracking-wider">Scan to Buy</div>
                      <div className="text-white/40 text-[10px] mt-0.5">Point your camera at this QR code to purchase on mobile</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-4 space-y-3">
                {[
                  { icon: Shield, text: '100% Guaranteed Authentic' },
                  { icon: Zap, text: 'Instant Digital Delivery' },
                  { icon: Users, text: 'Secure Peer-to-Peer Transfer' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-white/50">
                    <Icon className="w-4 h-4 text-red-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      {totalQuantity > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1F2937] p-4 z-40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-black text-lg">${totalPrice.toFixed(2)}</div>
              <div className="text-white/40 text-xs">{totalQuantity} ticket{totalQuantity > 1 ? 's' : ''}</div>
            </div>
            <button
              onClick={handleCheckout}
              className="px-8 py-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-wider text-sm hover:bg-red-700 shadow-lg shadow-red-600/20"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}