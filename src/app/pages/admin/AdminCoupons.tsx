import { AdminSidebar } from '../../components/AdminSidebar';
import { ChevronDown, Plus, Trash2, Copy, Tag, Check } from 'lucide-react';
import { useState } from 'react';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  usageLimit: number;
  used: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

const initialCoupons: Coupon[] = [
  { id: 'c1', code: 'WELCOME20', type: 'percentage', value: 20, minOrder: 50, usageLimit: 1000, used: 342, startDate: '2026-01-01', endDate: '2026-06-30', active: true },
  { id: 'c2', code: 'SUMMER10', type: 'percentage', value: 10, minOrder: 25, usageLimit: 500, used: 89, startDate: '2026-06-01', endDate: '2026-08-31', active: true },
  { id: 'c3', code: 'VIP50OFF', type: 'fixed', value: 50, minOrder: 200, usageLimit: 100, used: 67, startDate: '2026-02-01', endDate: '2026-04-30', active: true },
  { id: 'c4', code: 'FLASH15', type: 'percentage', value: 15, minOrder: 0, usageLimit: 200, used: 200, startDate: '2026-01-15', endDate: '2026-01-20', active: false },
];

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070D1A]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
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

        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-5 h-5 text-[#E52324]" />
                <h2 className="text-white text-[22px]" style={{ fontWeight: 800 }}>Create CouponCode</h2>
              </div>
              <p className="text-white/30 text-[12px]">Create and manage discount codes for the marketplace.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52324] hover:bg-[#d11f20] text-white text-[12px] transition-all"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              New Coupon
            </button>
          </div>

          {/* Create Coupon Form */}
          {showForm && (
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-6 mb-6">
              <h3 className="text-white text-[14px] mb-4" style={{ fontWeight: 700 }}>New Coupon Code</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Coupon Code</label>
                  <input className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-[#E52324]/50 transition uppercase" placeholder="e.g. SAVE20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Discount Type</label>
                  <select className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Value</label>
                  <input type="number" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none" placeholder="20" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Min. Order ($)</label>
                  <input type="number" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none" placeholder="50" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Usage Limit</label>
                  <input type="number" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none" placeholder="1000" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Start Date</label>
                  <input type="date" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#E52324] text-white text-[12px] hover:bg-[#d11f20] transition" style={{ fontWeight: 600 }}>
                  Create Coupon
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#243354] text-white/40 text-[12px] hover:text-white/60 transition" style={{ fontWeight: 500 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Coupons Table */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2744]">
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Code</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Discount</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Min. Order</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Usage</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Dates</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Status</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className={`border-b border-[#1a2744]/50 hover:bg-[#1a2744]/30 transition-colors ${!coupon.active ? 'opacity-50' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-white tracking-wider" style={{ fontWeight: 700 }}>{coupon.code}</span>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="w-6 h-6 rounded flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"
                        >
                          {copied === coupon.code ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-emerald-400" style={{ fontWeight: 700 }}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-white/40">
                      {coupon.minOrder > 0 ? `$${coupon.minOrder}` : 'None'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-[#1a2744] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#E52324]"
                            style={{ width: `${Math.min((coupon.used / coupon.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/30">{coupon.used}/{coupon.usageLimit}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[10px] text-white/30">
                      {coupon.startDate} → {coupon.endDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        coupon.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/25'
                      }`} style={{ fontWeight: 600 }}>
                        {coupon.active ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        className="w-7 h-7 rounded flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
}
