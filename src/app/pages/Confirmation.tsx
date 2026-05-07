import { useLocation, Link } from 'react-router';
import {
  CheckCircle, Download, Mail, Calendar, Share2, QrCode, ArrowRight,
  Ticket, MapPin, Clock, Smartphone, Copy, Zap, Star, Crown, Flame, TrendingUp,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export function Confirmation() {
  const location = useLocation();
  const { orderNumber, eventTitle, totalPrice, event } = location.state || {
    orderNumber: 'IP-123456789',
    eventTitle: 'Sample Event',
    totalPrice: 0,
    event: null,
  };

  const mockTickets = [
    { id: 'TKT-001-A', tier: 'General Admission', seat: 'GA Floor' },
    { id: 'TKT-001-B', tier: 'General Admission', seat: 'GA Floor' },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-3">
            Your Tickets Are Ready!
          </h1>
          <p className="text-white/40 text-sm">
            Order #{orderNumber} · Confirmation sent to your email
          </p>
        </motion.div>

        {/* Order Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6 mb-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Order Number</div>
              <div className="text-white font-black text-sm">{orderNumber}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Total Paid</div>
              <div className="text-green-500 font-black text-sm">
                ${typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Tickets</div>
              <div className="text-white font-black text-sm">{mockTickets.length}</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Status</div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-green-500/10 text-green-500 text-xs font-black">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Confirmed
              </div>
            </div>
          </div>
          {event && (
            <div className="mt-4 pt-4 border-t border-[#1F2937]">
              <div className="text-white font-black uppercase tracking-tight">{eventTitle}</div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.date}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.venue}, {event.city}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Ticket Cards */}
        <div className="space-y-4 mb-8">
          {mockTickets.map((ticket, idx) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* QR Code */}
                <div className="sm:w-40 flex items-center justify-center p-6 bg-white shrink-0">
                  <div className="text-center">
                    <QrCode className="w-20 h-20 text-[#0F172A] mx-auto" />
                    <div className="text-[9px] text-[#0F172A]/50 font-black uppercase tracking-wider mt-2">{ticket.id}</div>
                  </div>
                </div>
                {/* Ticket Info */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-red-500 font-black uppercase tracking-wider mb-1">Ticket {idx + 1} of {mockTickets.length}</div>
                      <div className="text-white font-black uppercase tracking-tight">{eventTitle}</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10">
                      <Ticket className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-green-500 font-black uppercase">Valid</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">Tier</div>
                      <div className="text-white/70">{ticket.tier}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">Section</div>
                      <div className="text-white/70">{ticket.seat}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">Ticket ID</div>
                      <div className="text-white/70 font-mono text-xs">{ticket.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase">Entry</div>
                      <div className="text-white/70">QR Code</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-[#1F2937]">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F2937] text-xs text-white/60 hover:bg-white/10 transition-colors">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1F2937] text-xs text-white/60 hover:bg-white/10 transition-colors">
                      <Smartphone className="w-3 h-3" /> Add to Wallet
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10"
        >
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white text-sm font-black hover:bg-white/5 transition-colors">
            <Calendar className="w-4 h-4 text-red-500" /> Add to Calendar
          </button>
          <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white text-sm font-black hover:bg-white/5 transition-colors">
            <Share2 className="w-4 h-4 text-red-500" /> Share Event
          </button>
          <Link
            to="/my-tickets"
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
          >
            Go to My Tickets <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── InstaPoints Reward Summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10 rounded-2xl border border-[#D4A84B]/20 bg-gradient-to-br from-[#D4A84B]/8 to-transparent p-6 relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.04]" style={{ background: '#D4A84B' }} />
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#D4A84B]/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#D4A84B]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#D4A84B]">InstaPoints Earned</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Points Earned</div>
              <div className="text-[#D4A84B] text-xl" style={{ fontWeight: 900 }}>+150</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Streak Bonus</div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-xl" style={{ fontWeight: 900 }}>+50</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">New Balance</div>
              <div className="text-white text-xl" style={{ fontWeight: 900 }}>13,050</div>
            </div>
            <div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">XP Gained</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xl" style={{ fontWeight: 900 }}>+200</span>
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="rounded-xl bg-[#0F172A]/60 border border-[#D4A84B]/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4A84B]" />
                <span className="text-[11px] text-white/50" style={{ fontWeight: 600 }}>Gold Tier — VIP</span>
              </div>
              <span className="text-[10px] text-[#D4A84B]" style={{ fontWeight: 700 }}>9,620 / 20,000 XP</span>
            </div>
            <div className="h-2.5 rounded-full bg-[#1F2937] overflow-hidden mb-2">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4A84B, #F5D98A)', boxShadow: '0 0 12px #D4A84B40' }}
                initial={{ width: 0 }}
                animate={{ width: '48%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/20">10,380 XP to Platinum</span>
              <span className="text-[9px] text-[#D4A84B]" style={{ fontWeight: 700 }}>You're 48% there!</span>
            </div>
          </div>
        </motion.div>

        {/* Help */}
        <div className="text-center">
          <p className="text-xs text-white/30 mb-2">Need help with your order?</p>
          <a href="#" className="text-red-500 text-sm hover:underline">Contact Support →</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}