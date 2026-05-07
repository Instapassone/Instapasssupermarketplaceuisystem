import { AdminSidebar } from '../../components/AdminSidebar';
import { ChevronDown, Shield, Mail, Phone, MapPin } from 'lucide-react';

export function AdminProfile() {
  return (
    <div className="min-h-screen bg-[#070D1A]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <AdminSidebar />

      <div className="ml-[200px]">
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

        <div className="p-6 max-w-3xl">
          <h2 className="text-white text-[22px] mb-6" style={{ fontWeight: 800 }}>Admin Profile</h2>

          {/* Profile Card */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-6 mb-6">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center">
                <span className="text-[24px] text-white" style={{ fontWeight: 800 }}>DB</span>
              </div>
              <div>
                <h3 className="text-white text-[18px]" style={{ fontWeight: 700 }}>Damone Bush</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-[#E52324]" />
                  <span className="text-[11px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 600 }}>Platform Administrator</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/50">damonerbush@yahoo.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/50">(209) 149-1853</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-white/20" />
                <span className="text-[13px] text-white/50">Atlanta, GA</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-6">
            <h3 className="text-white text-[15px] mb-4" style={{ fontWeight: 700 }}>Account Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Full Name</label>
                <input defaultValue="Damone Bush" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none focus:border-[#E52324]/50 transition" />
              </div>
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Email</label>
                <input defaultValue="damonerbush@yahoo.com" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none focus:border-[#E52324]/50 transition" />
              </div>
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Phone</label>
                <input defaultValue="(209) 149-1853" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none focus:border-[#E52324]/50 transition" />
              </div>
              <div>
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Role</label>
                <input value="Administrator" disabled className="w-full bg-[#1a2744]/50 border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white/30 outline-none cursor-not-allowed" />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-[#E52324] text-white text-[12px] hover:bg-[#d11f20] transition" style={{ fontWeight: 600 }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
