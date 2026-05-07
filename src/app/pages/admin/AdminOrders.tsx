import { AdminSidebar } from '../../components/AdminSidebar';
import { Bell, Search, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const orders = [
  { id: '#ORD-6502b', event: 'Lakers vs Celtics', buyer: 'Alex Rivera', email: 'alex@instapass.ai', status: 'Completed', qty: 2, amount: 432.56, method: 'Visa •••• 4242', date: '2026-02-24' },
  { id: '#ORD-494c9', event: 'Kendrick Lamar Tour', buyer: 'Maria Santos', email: 'maria@gmail.com', status: 'Pending', qty: 1, amount: 125.34, method: 'Apple Pay', date: '2026-02-23' },
  { id: '#ORD-49fe5', event: 'Comedy Night Live', buyer: 'James Kim', email: 'jamesk@yahoo.com', status: 'Completed', qty: 3, amount: 78.00, method: 'Visa •••• 1881', date: '2026-02-22' },
  { id: '#ORD-69b38', event: 'Art Basel 2026', buyer: 'Tina Lopez', email: 'tina.l@outlook.com', status: 'Refunded', qty: 1, amount: 250.00, method: 'Mastercard •••• 9012', date: '2026-02-20' },
  { id: '#ORD-488dc', event: 'UFC 305', buyer: 'Robert Ortiz', email: 'urtiz74@aol.com', status: 'Pending', qty: 2, amount: 533.78, method: 'Google Pay', date: '2026-02-19' },
  { id: '#ORD-77ab2', event: 'Beyoncé Renaissance', buyer: 'Naida Khan', email: 'nardkh973@gmail.com', status: 'Completed', qty: 4, amount: 892.00, method: 'Visa •••• 5567', date: '2026-02-18' },
  { id: '#ORD-33cd1', event: 'Food Truck Festival', buyer: 'Franco Reyes', email: 'franco@brightway.org', status: 'Completed', qty: 2, amount: 60.00, method: 'PayPal', date: '2026-02-17' },
];

const statusColor: Record<string, string> = {
  Completed: 'bg-emerald-500/15 text-emerald-400',
  Pending: 'bg-amber-500/15 text-amber-400',
  Refunded: 'bg-red-500/15 text-red-400',
};

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState('All');
  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#060A14]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <AdminSidebar />
      <div className="ml-[200px]">
        <header className="h-[56px] bg-[#0B1120] border-b border-[#1a2744] flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-white text-[16px] uppercase tracking-wider" style={{ fontWeight: 700 }}>Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/60">Damone Bush</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </div>
        </header>

        <div className="p-8">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-4 h-4 text-white/20" strokeWidth={1.8} />
            {['All', 'Completed', 'Pending', 'Refunded'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                  statusFilter === s
                    ? 'bg-[#E52324]/15 text-[#E52324] border border-[#E52324]/20'
                    : 'text-white/30 hover:text-white/50 border border-transparent hover:bg-white/[0.03]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="bg-[#0B1120] border border-[#1a1f30] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1f30]">
                    {['Order ID', 'Event', 'Buyer', 'Status', 'Qty', 'Amount', 'Payment', 'Date', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[9px] text-white/20 uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id} className="border-b border-[#1a1f30]/30 hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-3.5 text-[12px] text-blue-400" style={{ fontWeight: 600 }}>{o.id}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/60 max-w-[160px] truncate">{o.event}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-[12px] text-white/70" style={{ fontWeight: 500 }}>{o.buyer}</div>
                        <div className="text-[10px] text-white/25">{o.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${statusColor[o.status]}`} style={{ fontWeight: 600 }}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-white/40 text-center">{o.qty}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/80" style={{ fontWeight: 600 }}>${o.amount.toFixed(2)}</td>
                      <td className="px-5 py-3.5 text-[10px] text-white/30">{o.method}</td>
                      <td className="px-5 py-3.5 text-[11px] text-white/25">{o.date}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-[10px] text-white/30 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] transition-all" style={{ fontWeight: 500 }}>
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}