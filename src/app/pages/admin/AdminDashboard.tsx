import { Link } from 'react-router';
import { AdminSidebar } from '../../components/AdminSidebar';
import {
  Users, ShoppingCart, DollarSign, TrendingUp,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';

/* ─── Mock Data ─── */
const orderChartData = [
  { id: 1, month: 'Jan', orders: 0.2 }, { id: 2, month: 'Feb', orders: 0.1 },
  { id: 3, month: 'Mar', orders: 0.3 }, { id: 4, month: 'Apr', orders: 0.4 },
  { id: 5, month: 'May', orders: 0.5 }, { id: 6, month: 'Jun', orders: 0.3 },
  { id: 7, month: 'Jul', orders: 0.6 }, { id: 8, month: 'Aug', orders: 0.5 },
  { id: 9, month: 'Sep', orders: 0.8 }, { id: 10, month: 'Oct', orders: 0.9 },
  { id: 11, month: 'Nov', orders: 0.7 }, { id: 12, month: 'Dec', orders: 1.0 },
];

const paymentChartData = [
  { id: 1, month: 'Jan', amount: 0.1 }, { id: 2, month: 'Feb', amount: 0.2 },
  { id: 3, month: 'Mar', amount: 0.3 }, { id: 4, month: 'Apr', amount: 0.4 },
  { id: 5, month: 'May', amount: 0.5 }, { id: 6, month: 'Jun', amount: 0.6 },
  { id: 7, month: 'Jul', amount: 0.7 }, { id: 8, month: 'Aug', amount: 0.8 },
  { id: 9, month: 'Sep', amount: 0.9 }, { id: 10, month: 'Oct', amount: 0.8 },
  { id: 11, month: 'Nov', amount: 0.7 }, { id: 12, month: 'Dec', amount: 1.0 },
];

const newUsers = [
  { id: 1, name: 'Ubaid', email: 'ubaidwoleed1@test.com', phone: '03243132723', role: 'admin', date: '2025-01-22', color: '#E52324' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.chen@test.com', phone: '03243132724', role: 'admin', date: '2025-01-23', color: '#F59E0B' },
  { id: 3, name: 'Ubaid Woleed', email: 'ubaid.woleed1@gmail.com', phone: '03243132725', role: 'admin', date: '2025-01-27', color: '#3B82F6' },
  { id: 4, name: 'Muhammad Adil', email: 'm.adil060616@gmail.com', phone: '03133860553', role: 'admin', date: '2025-01-26', color: '#8B5CF6' },
  { id: 5, name: 'Gillean Alison', email: 'alisonumor793@gmail.com', phone: '9999999', role: 'vboth', date: '2025-01-13', color: '#10B981' },
];

const newOrders = [
  { id: '#6502b', type: 'TM_mobilename', status: 'Pending', tickets: 1, amount: 432.56, method: 'credit_card' },
  { id: '#494c9', type: 'TM_mobilename', status: 'Pending', tickets: 1, amount: 125.34, method: 'credit_card' },
  { id: '#49fe5', type: 'TM_mobilename', status: 'Pending', tickets: 1, amount: 18.68, method: 'credit_card' },
  { id: '#69b3', type: 'TM_mobilename', status: 'Pending', tickets: 1, amount: 6.95, method: 'credit_card' },
  { id: '#488dc', type: 'TM_mobilename', status: 'Pending', tickets: 1, amount: 33.78, method: 'credit_card' },
];

export function AdminDashboard() {
  return (
    <div className="relative min-h-screen bg-[#070D1A]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <AdminSidebar />

      <div className="ml-[200px]">
        {/* Top bar */}
        <header className="h-[56px] bg-[#0B1120] border-b border-[#1a2744] flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-white text-[16px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/60">Damone Bush</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Users */}
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[32px] text-white" style={{ fontWeight: 800 }}>21</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest" style={{ fontWeight: 700 }}>Users</div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400" style={{ fontWeight: 600 }}>
                  <TrendingUp className="w-3 h-3" />
                  9.5%
                </div>
              </div>
              <Link to="/admin/customers" className="text-[11px] text-blue-400 hover:underline" style={{ fontWeight: 600 }}>
                View All Users
              </Link>
            </div>

            {/* Orders */}
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[32px] text-white" style={{ fontWeight: 800 }}>5</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest" style={{ fontWeight: 700 }}>Orders</div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400" style={{ fontWeight: 600 }}>
                  <TrendingUp className="w-3 h-3" />
                  7.8%
                </div>
              </div>
              <Link to="/admin/orders" className="text-[11px] text-blue-400 hover:underline" style={{ fontWeight: 600 }}>
                View All Orders
              </Link>
            </div>

            {/* Total Sales Amount */}
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[32px] text-white" style={{ fontWeight: 800 }}>$184</div>
                  <div className="text-[11px] text-white/40 uppercase tracking-widest" style={{ fontWeight: 700 }}>Total Sales Amount</div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400" style={{ fontWeight: 600 }}>
                  <TrendingUp className="w-3 h-3" />
                  2.5%
                </div>
              </div>
              <Link to="/admin/orders" className="text-[11px] text-blue-400 hover:underline" style={{ fontWeight: 600 }}>
                View All Sales
              </Link>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Order Chart */}
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-[15px]" style={{ fontWeight: 700 }}>Order Chart</h3>
                <span className="text-[11px] text-white/40 px-3 py-1 rounded-lg bg-[#1a2744] border border-[#243354]">2026</span>
              </div>
              <div className="text-[10px] text-white/25 mb-2">Orders Chart Month Wise - 2026</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded bg-[#E52324]" />
                <span className="text-[10px] text-white/35">Total Order Count</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={orderChartData}>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} domain={[0, 1]} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #243354', borderRadius: 8, fontSize: 11, fontFamily: 'Outfit' }} labelStyle={{ color: '#fff' }} />
                  <Bar dataKey="orders" fill="#E52324" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Chart */}
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-[15px]" style={{ fontWeight: 700 }}>Payment Chart</h3>
                <span className="text-[11px] text-white/40 px-3 py-1 rounded-lg bg-[#1a2744] border border-[#243354]">2026</span>
              </div>
              <div className="text-[10px] text-white/25 mb-2">Orders Chart Month Wise</div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded bg-[#E52324]" />
                <span className="text-[10px] text-white/35">Total Amount</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={paymentChartData}>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10, fontFamily: 'Outfit' }} axisLine={false} tickLine={false} domain={[0, 1]} />
                  <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid #243354', borderRadius: 8, fontSize: 11, fontFamily: 'Outfit' }} labelStyle={{ color: '#fff' }} />
                  <Line type="monotone" dataKey="amount" stroke="#E52324" strokeWidth={2} dot={{ r: 3, fill: '#E52324' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New User Table */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl mb-6">
            <div className="px-5 py-4 border-b border-[#1a2744]">
              <h3 className="text-white text-[16px]" style={{ fontWeight: 700 }}>New User</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a2744]">
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>#</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Avatar/Name</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Email</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Mobile Number</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Role</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Created_at</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newUsers.map((user, idx) => (
                    <tr key={`${user.id}-${idx}`} className="border-b border-[#1a2744]/50 hover:bg-[#1a2744]/30 transition-colors">
                      <td className="px-5 py-3 text-[12px] text-white/40">{idx + 1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white" style={{ fontWeight: 700, background: user.color }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[12px] text-white" style={{ fontWeight: 600 }}>{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-white/40">{user.email}</td>
                      <td className="px-5 py-3 text-[11px] text-white/40">{user.phone}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
                        }`} style={{ fontWeight: 600 }}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-white/40">{user.date}</td>
                      <td className="px-5 py-3">
                        <button className="text-[10px] text-white/30 hover:text-white px-2.5 py-1 rounded border border-[#243354] hover:bg-[#1a2744] transition-all">
                          Options
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Order Table */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl">
            <div className="px-5 py-4 border-b border-[#1a2744]">
              <h3 className="text-white text-[16px]" style={{ fontWeight: 700 }}>New Order</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1a2744]">
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>OrderID</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Ticket Type</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Status</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Total Tickets</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Total Amount</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Payment Method</th>
                    <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#1a2744]/50 hover:bg-[#1a2744]/30 transition-colors">
                      <td className="px-5 py-3 text-[12px] text-blue-400" style={{ fontWeight: 600 }}>{order.id}</td>
                      <td className="px-5 py-3 text-[11px] text-white/40">{order.type}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/15 text-amber-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-white/40 text-center">{order.tickets}</td>
                      <td className="px-5 py-3 text-[12px] text-white" style={{ fontWeight: 600 }}>${order.amount.toFixed(2)}</td>
                      <td className="px-5 py-3 text-[11px] text-white/40">{order.method}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button className="text-[10px] text-blue-400 hover:underline" style={{ fontWeight: 500 }}>Details</button>
                          <button className="text-[10px] text-white px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 transition-colors" style={{ fontWeight: 600 }}>
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer logo */}
        <div className="px-8 py-6">
          <img src="" alt="" className="hidden" />
        </div>
      </div>
    </div>
  );
}