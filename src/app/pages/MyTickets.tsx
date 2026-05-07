import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, MapPin, Download, Share2, QrCode, Ticket, Search, Filter } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { mockEvents } from '../data/mockData';
import { motion } from 'motion/react';

type Tab = 'upcoming' | 'past' | 'transferred';

export function MyTickets() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [search, setSearch] = useState('');

  const upcomingTickets = [
    { ...mockEvents[0], orderNumber: 'IP-1740584231', quantity: 2, tier: 'VIP Package', ticketIds: ['TKT-001-A', 'TKT-001-B'] },
    { ...mockEvents[5], orderNumber: 'IP-1740584890', quantity: 1, tier: 'General Admission', ticketIds: ['TKT-002-A'] },
    { ...mockEvents[7], orderNumber: 'IP-1740585100', quantity: 3, tier: 'General Admission', ticketIds: ['TKT-003-A', 'TKT-003-B', 'TKT-003-C'] },
  ];

  const pastTickets = [
    { ...mockEvents[4], orderNumber: 'IP-1738584231', quantity: 2, tier: 'General Admission', ticketIds: ['TKT-P01-A', 'TKT-P01-B'] },
  ];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingTickets.length },
    { id: 'past', label: 'Past', count: pastTickets.length },
    { id: 'transferred', label: 'Transferred', count: 0 },
  ];

  const currentTickets = activeTab === 'upcoming' ? upcomingTickets : activeTab === 'past' ? pastTickets : [];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">My Tickets</h1>
            <p className="text-white/40 text-sm mt-1">{currentTickets.length} ticket{currentTickets.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/30"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#111827] p-1.5 rounded-xl border border-[#1F2937] w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Ticket Cards */}
        <div className="space-y-4">
          {currentTickets.length > 0 ? currentTickets.map((ticket, idx) => (
            <motion.div
              key={ticket.orderNumber}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden hover:border-[#374151] transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="aspect-video md:aspect-auto overflow-hidden">
                  <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
                </div>
                <div className="col-span-2 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${ticket.badgeColor} mb-2`}>
                        {ticket.badge}
                      </span>
                      <Link to={`/event/${ticket.id}`}>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white hover:text-red-500 transition-colors">
                          {ticket.title}
                        </h3>
                      </Link>
                      <div className="space-y-1.5 mt-2">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <Calendar className="w-3.5 h-3.5 text-red-500" /> {ticket.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <MapPin className="w-3.5 h-3.5 text-red-500" /> {ticket.venue}, {ticket.city}
                        </div>
                      </div>
                    </div>
                    {/* QR */}
                    <div className="hidden sm:flex flex-col items-center gap-2">
                      <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-[#0F172A]" />
                      </div>
                      <div className="text-[9px] text-white/30 font-mono">{ticket.ticketIds[0]}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
                    <span><strong className="text-white/60">Tier:</strong> {ticket.tier}</span>
                    <span><strong className="text-white/60">Qty:</strong> {ticket.quantity}</span>
                    <span><strong className="text-white/60">Order:</strong> {ticket.orderNumber}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[#1F2937]">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-black uppercase hover:bg-red-700 transition-colors">
                      <Ticket className="w-3.5 h-3.5" /> View Tickets
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F2937] text-white/60 text-xs font-black uppercase hover:bg-white/10 transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1F2937] text-white/60 text-xs font-black uppercase hover:bg-white/10 transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> Transfer
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-[#111827] rounded-2xl border border-[#1F2937]">
              <Ticket className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No {activeTab} tickets</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
