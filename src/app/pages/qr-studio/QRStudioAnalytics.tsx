import { QRStudioSidebar } from '../../components/QRStudioSidebar';
import { Bell, Smartphone, Monitor, Tablet, MapPin, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const scanData = [
  { id: 'mon', day: 'Mon', scans: 42, name: 'Mon' }, { id: 'tue', day: 'Tue', scans: 58, name: 'Tue' },
  { id: 'wed', day: 'Wed', scans: 35, name: 'Wed' }, { id: 'thu', day: 'Thu', scans: 71, name: 'Thu' },
  { id: 'fri', day: 'Fri', scans: 89, name: 'Fri' }, { id: 'sat', day: 'Sat', scans: 120, name: 'Sat' },
  { id: 'sun', day: 'Sun', scans: 95, name: 'Sun' },
];

const deviceData = [
  { id: 'iphone', name: 'iPhone', value: 45, color: '#E52324' },
  { id: 'android', name: 'Android', value: 38, color: '#FF4444' },
  { id: 'desktop', name: 'Desktop', value: 12, color: '#991B1B' },
  { id: 'tablet', name: 'Tablet', value: 5, color: '#FCA5A5' },
];

const topLocations = [
  { city: 'Los Angeles, CA', scans: 1240 },
  { city: 'New York, NY', scans: 980 },
  { city: 'Chicago, IL', scans: 620 },
  { city: 'Houston, TX', scans: 510 },
  { city: 'Atlanta, GA', scans: 430 },
];

const topCodes = [
  { name: 'Lakers Game Ticket', scans: 892, type: 'Event' },
  { name: 'InstaPass Homepage', scans: 654, type: 'URL' },
  { name: 'WiFi Guest Access', scans: 312, type: 'WiFi' },
  { name: 'Contact Card', scans: 198, type: 'vCard' },
];

export function QRStudioAnalytics() {
  return (
    <div className="min-h-screen bg-[#0B0F19]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <QRStudioSidebar />

      <div className="ml-[220px]">
        <header className="h-[56px] bg-[#0D1117]/80 backdrop-blur-xl border-b border-white/[0.03] flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-[14px] text-white/70 tracking-wide" style={{ fontWeight: 600 }}>Analytics</h1>
            <span className="text-[10px] text-white/10">|</span>
            <span className="text-[10px] text-[#E52324]/60" style={{ fontWeight: 600 }}>Last 7 days</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 transition-all">
              <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E52324] to-[#C41E1E] flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Scans', value: '2,056', change: '+18%', color: '#E52324' },
              { label: 'Unique Visitors', value: '1,432', change: '+12%', color: '#FF4444' },
              { label: 'Active QR Codes', value: '24', change: '+3', color: '#991B1B' },
              { label: 'Avg. Scans/Day', value: '293', change: '+8%', color: '#FCA5A5' },
            ].map((s) => (
              <div key={s.label} className="bg-[#111827] border border-white/[0.04] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                    <TrendingUp className="w-4 h-4" style={{ color: s.color }} strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] text-emerald-400" style={{ fontWeight: 600 }}>{s.change}</span>
                </div>
                <div className="text-[26px] text-white mb-0.5" style={{ fontWeight: 800 }}>{s.value}</div>
                <div className="text-[10px] text-white/25 uppercase tracking-widest" style={{ fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Scan Activity */}
            <div className="lg:col-span-2 bg-[#111827] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-[14px] text-white mb-5" style={{ fontWeight: 700 }}>Scan Activity</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scanData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(229,35,36,0.15)', borderRadius: 12, fontSize: 12, fontFamily: 'Outfit' }} labelStyle={{ color: '#fff' }} />
                  <Bar dataKey="scans" fill="#E52324" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Device Breakdown */}
            <div className="bg-[#111827] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-[14px] text-white mb-5" style={{ fontWeight: 700 }}>Device Type</h3>
              <div className="flex justify-center mb-4">
                <PieChart width={160} height={160}>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0} nameKey="name">
                    {deviceData.map((d, idx) => (
                      <Cell key={`cell-${idx}-${d.name}`} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2">
                {deviceData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-[11px] text-white/50">{d.name}</span>
                    </div>
                    <span className="text-[11px] text-white/70" style={{ fontWeight: 600 }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Locations */}
            <div className="bg-[#111827] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-[14px] text-white mb-4" style={{ fontWeight: 700 }}>Top Locations</h3>
              <div className="space-y-3">
                {topLocations.map((loc, i) => (
                  <div key={loc.city} className="flex items-center gap-3">
                    <span className="text-[10px] text-white/15 w-4" style={{ fontWeight: 700 }}>{i + 1}</span>
                    <MapPin className="w-3.5 h-3.5 text-[#E52324]/50 shrink-0" strokeWidth={1.8} />
                    <span className="text-[12px] text-white/60 flex-1" style={{ fontWeight: 500 }}>{loc.city}</span>
                    <span className="text-[12px] text-white/80" style={{ fontWeight: 600 }}>{loc.scans.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top QR Codes */}
            <div className="bg-[#111827] border border-white/[0.04] rounded-2xl p-6">
              <h3 className="text-[14px] text-white mb-4" style={{ fontWeight: 700 }}>Top QR Codes</h3>
              <div className="space-y-3">
                {topCodes.map((code, i) => (
                  <div key={code.name} className="flex items-center gap-3">
                    <span className="text-[10px] text-white/15 w-4" style={{ fontWeight: 700 }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-white/60 truncate" style={{ fontWeight: 500 }}>{code.name}</div>
                      <div className="text-[10px] text-[#E52324]/40">{code.type}</div>
                    </div>
                    <span className="text-[12px] text-white/80" style={{ fontWeight: 600 }}>{code.scans.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}