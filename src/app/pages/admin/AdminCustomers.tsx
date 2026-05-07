import { AdminSidebar } from '../../components/AdminSidebar';
import { Bell, Search, Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const customers = [
  { id: 1, name: 'Damone Bush', email: 'damonerbush@yahoo.com', phone: '(209) 149-1853', role: 'Admin', events: 12, spent: 2480, date: '2025-02-05', color: '#E52324' },
  { id: 2, name: 'Naida Khan', email: 'nardkh973@gmail.com', phone: '(219) 348-2103', role: 'Organizer', events: 8, spent: 1240, date: '2025-03-06', color: '#3B82F6' },
  { id: 3, name: 'Franco Reyes', email: 'franco@brightway.org', phone: '(218) 428-9390', role: 'Organizer', events: 5, spent: 890, date: '2025-03-08', color: '#8B5CF6' },
  { id: 4, name: 'Jonathan Gray', email: 'johng19@gmail.com', phone: '(424) 201-0391', role: 'Buyer', events: 0, spent: 3200, date: '2025-03-23', color: '#10B981' },
  { id: 5, name: 'Marie Ann Basa', email: 'mbasa30@gmail.com', phone: '(415) 709-2054', role: 'Buyer', events: 0, spent: 560, date: '2025-06-18', color: '#F59E0B' },
  { id: 6, name: 'Robert Ortiz', email: 'urtiz74@aol.com', phone: '(165) 324-8094', role: 'Buyer', events: 0, spent: 1800, date: '2025-06-01', color: '#06B6D4' },
  { id: 7, name: 'Stephan Jones', email: 'stephenj@gmail.com', phone: '(510) 229-1000', role: 'Organizer', events: 15, spent: 0, date: '2025-09-22', color: '#EC4899' },
  { id: 8, name: 'Malik Bell', email: 'malikbel87@gmail.com', phone: '(770) 218-1810', role: 'Buyer', events: 0, spent: 920, date: '2025-06-02', color: '#6366F1' },
  { id: 9, name: 'Miguel Garcia', email: 'griguel001@gmail.com', phone: '(203) 294-7303', role: 'Buyer', events: 0, spent: 440, date: '2025-06-13', color: '#F97316' },
  { id: 10, name: 'Jessica Estrada', email: 'jessica.e12@gmail.com', phone: '(209) 000-1871', role: 'Buyer', events: 0, spent: 2100, date: '2025-01-04', color: '#F472B6' },
];

const roleColor: Record<string, string> = {
  Admin: 'bg-red-500/15 text-red-400',
  Organizer: 'bg-blue-500/15 text-blue-400',
  Buyer: 'bg-emerald-500/15 text-emerald-400',
};

export function AdminCustomers() {
  const [roleFilter, setRoleFilter] = useState('All');
  const filtered = roleFilter === 'All' ? customers : customers.filter(c => c.role === roleFilter);

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
            {['All', 'Admin', 'Organizer', 'Buyer'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                  roleFilter === r
                    ? 'bg-[#E52324]/15 text-[#E52324] border border-[#E52324]/20'
                    : 'text-white/30 hover:text-white/50 border border-transparent hover:bg-white/[0.03]'
                }`}
                style={{ fontWeight: 600 }}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="bg-[#0B1120] border border-[#1a1f30] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a1f30]">
                    {['#', 'User', 'Phone', 'Role', 'Events', 'Total Spent', 'Joined', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[9px] text-white/20 uppercase tracking-[0.15em]" style={{ fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => (
                    <tr key={c.id} className="border-b border-[#1a1f30]/30 hover:bg-white/[0.015] transition-colors">
                      <td className="px-5 py-3.5 text-[11px] text-white/20">{idx + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] text-white shrink-0" style={{ fontWeight: 700, background: c.color }}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[12px] text-white/80" style={{ fontWeight: 600 }}>{c.name}</div>
                            <div className="text-[10px] text-white/25">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-white/30">{c.phone}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${roleColor[c.role]}`} style={{ fontWeight: 600 }}>
                          {c.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-white/40 text-center">{c.events}</td>
                      <td className="px-5 py-3.5 text-[12px] text-white/60" style={{ fontWeight: 600 }}>{c.spent > 0 ? `$${c.spent.toLocaleString()}` : '—'}</td>
                      <td className="px-5 py-3.5 text-[11px] text-white/25">{c.date}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-[10px] text-white/30 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] transition-all" style={{ fontWeight: 500 }}>
                          View
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