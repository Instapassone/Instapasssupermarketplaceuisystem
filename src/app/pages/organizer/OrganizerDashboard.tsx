import {
  TrendingUp, TrendingDown, DollarSign, Ticket, Users, Calendar,
  MoreVertical, ArrowUpRight, ArrowRight, Eye, Clock, Zap, ChevronRight,
  BarChart3,
} from 'lucide-react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { organizerEvents } from '../../data/mockData';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

/* ═══════════════════════════════════════════════════════════════
   ORGANIZER DASHBOARD — Premium SaaS Analytics
   Blue accent (#3B82F6) throughout, deep navy bg
   ═══════════════════════════════════════════════════════════════ */

const revenueData = [
  { month: 'Jan', revenue: 12450, tickets: 180 },
  { month: 'Feb', revenue: 18200, tickets: 245 },
  { month: 'Mar', revenue: 31600, tickets: 420 },
  { month: 'Apr', revenue: 24800, tickets: 310 },
  { month: 'May', revenue: 38500, tickets: 495 },
  { month: 'Jun', revenue: 45200, tickets: 580 },
  { month: 'Jul', revenue: 52100, tickets: 670 },
  { month: 'Aug', revenue: 47300, tickets: 610 },
];

const dailySales = [
  { day: 'Mon', sales: 2400 }, { day: 'Tue', sales: 3200 },
  { day: 'Wed', sales: 4100 }, { day: 'Thu', sales: 3800 },
  { day: 'Fri', sales: 5200 }, { day: 'Sat', sales: 6800 },
  { day: 'Sun', sales: 5400 },
];

const trafficSources = [
  { name: 'Direct', value: 42, color: '#3B82F6' },
  { name: 'Social', value: 28, color: '#8B5CF6' },
  { name: 'Search', value: 18, color: '#06B6D4' },
  { name: 'Referral', value: 12, color: '#F59E0B' },
];

const recentOrders = [
  { id: 'ORD-8291', buyer: 'Sarah M.', event: 'Neon Nights Festival', tickets: 2, total: 178, time: '2m ago' },
  { id: 'ORD-8290', buyer: 'James K.', event: 'Lakers vs Celtics', tickets: 4, total: 580, time: '8m ago' },
  { id: 'ORD-8289', buyer: 'Alex R.', event: 'Neon Nights Festival', tickets: 1, total: 89, time: '14m ago' },
  { id: 'ORD-8288', buyer: 'Maria L.', event: 'EDC Las Vegas 2026', tickets: 2, total: 698, time: '22m ago' },
  { id: 'ORD-8287', buyer: 'Chris P.', event: 'Lakers vs Celtics', tickets: 3, total: 435, time: '31m ago' },
];

export function OrganizerDashboard() {
  const kpis = [
    {
      label: 'Total Revenue',
      value: '$237,750',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: '#3B82F6',
      sparkline: [12, 18, 24, 19, 28, 35, 42, 38],
    },
    {
      label: 'Tickets Sold',
      value: '1,589',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Ticket,
      color: '#8B5CF6',
      sparkline: [8, 12, 15, 11, 18, 22, 19, 25],
    },
    {
      label: 'Active Events',
      value: '3',
      change: '+1 this week',
      trend: 'up' as const,
      icon: Calendar,
      color: '#06B6D4',
      sparkline: [2, 2, 3, 3, 2, 3, 3, 3],
    },
    {
      label: 'Page Views',
      value: '24.8K',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Eye,
      color: '#F59E0B',
      sparkline: [14, 19, 22, 18, 28, 32, 26, 34],
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.[0]) {
      return (
        <div className="px-3 py-2 rounded-lg bg-[#111827] border border-[#1F2937] shadow-xl text-[11px]">
          <div className="text-white/40 mb-0.5">{label}</div>
          <div className="text-white" style={{ fontWeight: 700 }}>
            ${payload[0].value.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        {/* Header */}
        <div className="border-b border-[#1E293B]/60 bg-[#060D1B]">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h1 className="text-[22px] text-white" style={{ fontWeight: 800 }}>Dashboard</h1>
              <p className="text-white/30 text-[13px] mt-0.5">
                Welcome back! Here's your event performance overview.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[12px] text-white/40">
                <Clock className="w-3.5 h-3.5" />
                Last 30 days
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
              <Link
                to="/organizer/create-event"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-[12px] hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                style={{ fontWeight: 700 }}
              >
                <Zap className="w-3.5 h-3.5" /> New Event
              </Link>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* ═══ KPI CARDS ═══ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="relative p-5 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden group hover:border-[#1E293B] transition-all"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-15 group-hover:opacity-25 transition-opacity"
                    style={{ backgroundColor: kpi.color }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${kpi.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                      </div>
                      <div className="flex items-center gap-1 text-[11px]" style={{ fontWeight: 700 }}>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{kpi.change}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-white/35 mb-1" style={{ fontWeight: 600 }}>{kpi.label}</div>
                    <div className="text-[24px] text-white tracking-tight" style={{ fontWeight: 800 }}>{kpi.value}</div>

                    {/* Mini sparkline */}
                    <div className="flex items-end gap-[3px] mt-3 h-[24px]">
                      {kpi.sparkline.map((v, i) => {
                        const max = Math.max(...kpi.sparkline);
                        const h = (v / max) * 24;
                        return (
                          <div
                            key={i}
                            className="flex-1 rounded-sm transition-all"
                            style={{
                              height: h,
                              backgroundColor: i === kpi.sparkline.length - 1 ? kpi.color : `${kpi.color}30`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ═══ CHARTS ROW ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
            {/* Revenue Chart (2 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="xl:col-span-2 p-6 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Revenue Overview</h2>
                  <p className="text-[11px] text-white/25 mt-0.5">Monthly earnings from all events</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-white/30">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Revenue
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 11 }} />
                  <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Traffic Sources Pie */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="p-6 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60"
            >
              <h2 className="text-[16px] text-white mb-1" style={{ fontWeight: 700 }}>Traffic Sources</h2>
              <p className="text-[11px] text-white/25 mb-4">Where your visitors come from</p>

              <div className="flex justify-center mb-4">
                <PieChart width={160} height={160}>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {trafficSources.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>

              <div className="space-y-2.5">
                {trafficSources.map(s => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="text-[12px] text-white/50" style={{ fontWeight: 500 }}>{s.name}</span>
                    </div>
                    <span className="text-[12px] text-white" style={{ fontWeight: 700 }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ═══ SECOND ROW: Weekly Sales + Recent Orders ═══ */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Weekly Sales Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="p-6 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60"
            >
              <h2 className="text-[16px] text-white mb-1" style={{ fontWeight: 700 }}>This Week</h2>
              <p className="text-[11px] text-white/25 mb-4">Daily ticket sales</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="day" stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                  <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff30', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
              className="xl:col-span-2 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
                <div>
                  <h2 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Recent Orders</h2>
                  <p className="text-[11px] text-white/25 mt-0.5">Live feed of ticket purchases</p>
                </div>
                <Link to="/organizer/sales" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors" style={{ fontWeight: 600 }}>
                  View all →
                </Link>
              </div>
              <div>
                {recentOrders.map((order, idx) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-6 py-3.5 border-b border-[#1E293B]/20 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Ticket className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-white" style={{ fontWeight: 600 }}>{order.buyer}</span>
                          <span className="text-[10px] text-white/15">#{order.id}</span>
                        </div>
                        <div className="text-[11px] text-white/30">
                          {order.tickets}× {order.event}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] text-white" style={{ fontWeight: 700 }}>${order.total}</div>
                      <div className="text-[10px] text-white/20">{order.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ═══ EVENTS TABLE ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="mt-8 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
              <div>
                <h2 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Your Events</h2>
                <p className="text-[11px] text-white/25 mt-0.5">Manage and track your active events</p>
              </div>
              <Link to="/organizer/events" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors" style={{ fontWeight: 600 }}>
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E293B]/30">
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Event</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Date</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Status</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Sold</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Revenue</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {organizerEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#1E293B]/15 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-[13px] text-white" style={{ fontWeight: 600 }}>{event.name}</span>
                      </td>
                      <td className="px-6 py-4 text-[12px] text-white/35">
                        {event.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] ${
                            event.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                          style={{ fontWeight: 700 }}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>{event.sold}</td>
                      <td className="px-6 py-4 text-[13px] text-white" style={{ fontWeight: 600 }}>
                        ${event.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white/50">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}