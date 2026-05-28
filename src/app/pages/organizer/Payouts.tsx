import { useState } from 'react';
import {
  Download, DollarSign, CreditCard, Building2, Wallet,
  Plus, CheckCircle2, Clock, AlertCircle, ChevronRight,
  X, Zap, TrendingUp,
} from 'lucide-react';
import { OrganizerSidebar } from '../../components/OrganizerSidebar';
import { motion, AnimatePresence } from 'motion/react';

/* ═══════════════════════════════════════════════════════════════
   PAYOUTS — Organizer Payment Management
   Withdrawal requests, payment methods, payout history
   ═══════════════════════════════════════════════════════════════ */

interface PaymentMethod {
  id: string;
  type: 'bank' | 'paypal' | 'stripe' | 'wise';
  name: string;
  details: string;
  isDefault: boolean;
  icon: typeof Building2;
}

interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  method: string;
  transactionId?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'bank',
    name: 'Bank Account',
    details: 'Chase Bank •••• 4892',
    isDefault: true,
    icon: Building2,
  },
  {
    id: '2',
    type: 'paypal',
    name: 'PayPal',
    details: 'john@instapass.com',
    isDefault: false,
    icon: Wallet,
  },
];

const payouts: PayoutRecord[] = [
  { id: '1', date: 'Feb 20, 2026', amount: 45200, status: 'completed', method: 'Chase Bank •••• 4892', transactionId: 'TXN-892401' },
  { id: '2', date: 'Feb 13, 2026', amount: 32800, status: 'completed', method: 'Chase Bank •••• 4892', transactionId: 'TXN-891823' },
  { id: '3', date: 'Feb 6, 2026', amount: 28400, status: 'completed', method: 'Chase Bank •••• 4892', transactionId: 'TXN-891204' },
  { id: '4', date: 'Feb 3, 2026', amount: 15600, status: 'processing', method: 'Chase Bank •••• 4892' },
];

export function Payouts() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]?.id);

  const availableBalance = 15600;
  const totalPaidOut = 106400;
  const pendingAmount = 15600;

  const handleWithdraw = () => {
    // Mock withdrawal logic
    console.log('Withdrawing:', withdrawAmount, 'to method:', selectedMethod);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen bg-[#060D1B]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <OrganizerSidebar />

      <div className="ml-[260px]">
        {/* Header */}
        <div className="border-b border-[#1E293B]/60 bg-[#060D1B]">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-[22px] text-white" style={{ fontWeight: 800 }}>Payouts</h1>
                  <p className="text-white/30 text-[13px] mt-0.5">
                    Manage earnings and payment methods
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={availableBalance === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: 700 }}
            >
              <Zap className="w-4 h-4" />
              Request Payout
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Available Balance', value: `$${availableBalance.toLocaleString()}`, icon: DollarSign, color: '#10B981', desc: 'Ready to withdraw' },
              { label: 'Total Paid Out', value: `$${totalPaidOut.toLocaleString()}`, icon: TrendingUp, color: '#3B82F6', desc: 'Lifetime earnings' },
              { label: 'Processing', value: `$${pendingAmount.toLocaleString()}`, icon: Clock, color: '#F59E0B', desc: '3-5 business days' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="relative p-5 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden group"
                >
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                    </div>
                    <div className="text-[11px] text-white/35 mb-1" style={{ fontWeight: 600 }}>{stat.label}</div>
                    <div className="text-[28px] text-white tracking-tight mb-1" style={{ fontWeight: 800 }}>{stat.value}</div>
                    <div className="text-[10px] text-white/20">{stat.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-8 rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
              <div>
                <h2 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Payment Methods</h2>
                <p className="text-[11px] text-white/25 mt-0.5">Add and manage where you receive payouts</p>
              </div>
              <button
                onClick={() => setShowAddMethodModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-[13px]"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-4 h-4" />
                Add Method
              </button>
            </div>

            <div className="p-6 space-y-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/40" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>{method.name}</span>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[9px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-white/30 text-[12px] mt-0.5">{method.details}</div>
                      </div>
                    </div>
                    <button className="text-white/20 hover:text-white/50 transition-colors text-[12px]" style={{ fontWeight: 600 }}>
                      Edit
                    </button>
                  </div>
                );
              })}

              {paymentMethods.length === 0 && (
                <div className="py-12 text-center">
                  <CreditCard className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-[13px]" style={{ fontWeight: 600 }}>No payment methods added</p>
                  <p className="text-white/15 text-[11px] mt-1">Add a payment method to receive payouts</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payout History */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
              <div>
                <h2 className="text-[16px] text-white" style={{ fontWeight: 700 }}>Payout History</h2>
                <p className="text-[11px] text-white/25 mt-0.5">Track all your withdrawals and transfers</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E293B]/30">
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Date</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Amount</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Method</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Status</th>
                    <th className="text-left px-6 py-3.5 text-[10px] text-white/25 uppercase tracking-wider" style={{ fontWeight: 700 }}>Transaction</th>
                    <th className="px-6 py-3.5"></th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr
                      key={payout.id}
                      className="border-b border-[#1E293B]/15 last:border-b-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-[13px] text-white/50">{payout.date}</td>
                      <td className="px-6 py-4 text-[14px] text-white" style={{ fontWeight: 700 }}>
                        ${payout.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-[12px] text-white/35">{payout.method}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {payout.status === 'completed' && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]" style={{ fontWeight: 600 }}>Completed</span>
                            </>
                          )}
                          {payout.status === 'processing' && (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-amber-400 text-[11px]" style={{ fontWeight: 600 }}>Processing</span>
                            </>
                          )}
                          {payout.status === 'pending' && (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-blue-400 text-[11px]" style={{ fontWeight: 600 }}>Pending</span>
                            </>
                          )}
                          {payout.status === 'failed' && (
                            <>
                              <X className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-red-400 text-[11px]" style={{ fontWeight: 600 }}>Failed</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-white/20 font-mono">{payout.transactionId || '—'}</td>
                      <td className="px-6 py-4">
                        {payout.status === 'completed' && (
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-white/50">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
                <h3 className="text-[18px] text-white" style={{ fontWeight: 700 }}>Request Payout</h3>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Available Balance */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[11px] text-emerald-400/60 mb-1" style={{ fontWeight: 600 }}>Available Balance</div>
                  <div className="text-[24px] text-emerald-400" style={{ fontWeight: 800 }}>
                    ${availableBalance.toLocaleString()}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[16px]" style={{ fontWeight: 600 }}>$</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      max={availableBalance}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[16px] placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-all"
                      style={{ fontWeight: 600 }}
                    />
                  </div>
                  <button
                    onClick={() => setWithdrawAmount(availableBalance.toString())}
                    className="text-emerald-400 text-[11px] mt-2 hover:underline"
                    style={{ fontWeight: 600 }}
                  >
                    Withdraw all
                  </button>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-[11px] text-white/40 uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                    Payment Method
                  </label>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            selectedMethod === method.id
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            selectedMethod === method.id ? 'bg-emerald-500/20' : 'bg-white/[0.04]'
                          }`}>
                            <Icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-emerald-400' : 'text-white/40'}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`text-[13px] ${selectedMethod === method.id ? 'text-emerald-400' : 'text-white'}`} style={{ fontWeight: 600 }}>
                              {method.name}
                            </div>
                            <div className="text-white/30 text-[11px]">{method.details}</div>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Processing Time Info */}
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div className="text-[11px] text-blue-400/80">
                      Funds typically arrive in 3-5 business days. You'll receive an email confirmation once processed.
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) > availableBalance}
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-[13px]"
                    style={{ fontWeight: 700 }}
                  >
                    Request ${parseFloat(withdrawAmount || '0').toLocaleString()}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Payment Method Modal */}
      <AnimatePresence>
        {showAddMethodModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#0A1628] border border-[#1E293B]/60 shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]/40">
                <h3 className="text-[18px] text-white" style={{ fontWeight: 700 }}>Add Payment Method</h3>
                <button
                  onClick={() => setShowAddMethodModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                {[
                  { type: 'bank', icon: Building2, name: 'Bank Account', desc: 'Direct deposit (3-5 days)' },
                  { type: 'paypal', icon: Wallet, name: 'PayPal', desc: 'Instant transfer' },
                  { type: 'stripe', icon: CreditCard, name: 'Stripe', desc: 'Debit card (1-2 days)' },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => {
                        setShowAddMethodModal(false);
                        // Would open specific form for this payment method
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] transition-all">
                        <Icon className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white text-[14px]" style={{ fontWeight: 600 }}>{option.name}</div>
                        <div className="text-white/30 text-[11px]">{option.desc}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
