import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import {
  CreditCard, Lock, Shield, ChevronLeft, Smartphone, Apple,
  User, Mail, Phone, MapPin, Check, AlertTriangle, Zap, Star,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { mockEvents } from '../data/mockData';
import { motion } from 'motion/react';

export function Checkout() {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [usePoints, setUsePoints] = useState(false);

  const userPoints = 12850;
  const pointsValue = 15; // $15 worth of points available to redeem

  const event = mockEvents.find((e) => e.id === eventId);
  const { quantities = {}, totalPrice = 0, subtotal = 0, serviceFee = 0, facilityFee = 0 } = location.state || {};
  const finalTotal = totalPrice || subtotal * 1.1;

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    cardNumber: '', expiry: '', cvc: '', zip: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleComplete = () => {
    setProcessing(true);
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          orderNumber: `IP-${Date.now()}`,
          eventTitle: event?.title || 'Event',
          totalPrice: finalTotal,
          event,
        },
      });
    }, 1500);
  };

  if (!event) {
    return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">Event not found</div>;
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-[#0F172A] border border-[#1F2937] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 transition-all";

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Forms */}
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">Checkout</h1>

            {/* Express Pay */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white/60 mb-4">Express Checkout</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black border border-[#1F2937] text-white text-sm font-black hover:bg-white/5 transition-colors">
                  <Apple className="w-5 h-5" /> Apple Pay
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black border border-[#1F2937] text-white text-sm font-black hover:bg-white/5 transition-colors">
                  <Smartphone className="w-5 h-5" /> Google Pay
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-px bg-[#1F2937]" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">or pay with card</span>
                <div className="flex-1 h-px bg-[#1F2937]" />
              </div>
            </div>

            {/* ── InstaPoints Redemption ── */}
            <div className={`rounded-2xl border p-6 transition-all ${usePoints ? 'bg-[#D4A84B]/5 border-[#D4A84B]/25' : 'bg-[#111827] border-[#1F2937]'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D4A84B]" /> Pay with InstaPoints
                </h3>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D4A84B]/10 border border-[#D4A84B]/20">
                  <Star className="w-3 h-3 text-[#D4A84B]" />
                  <span className="text-[11px] text-[#D4A84B]" style={{ fontWeight: 700 }}>{userPoints.toLocaleString()} pts</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A: Full Price */}
                <button
                  onClick={() => setUsePoints(false)}
                  className={`p-4 rounded-xl border text-left transition-all ${!usePoints ? 'border-red-600/50 bg-red-600/5' : 'border-[#1F2937] bg-[#0F172A] hover:border-[#374151]'}`}
                >
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>Option A</div>
                  <div className="text-white text-lg" style={{ fontWeight: 900 }}>${finalTotal.toFixed(2)}</div>
                  <div className="text-[11px] text-white/30 mt-1">Full price • Earn +{Math.round(finalTotal)} pts</div>
                  {!usePoints && <div className="flex items-center gap-1 mt-2 text-[10px] text-red-400" style={{ fontWeight: 700 }}><Check className="w-3 h-3" /> Selected</div>}
                </button>
                {/* Option B: Points + Cash */}
                <button
                  onClick={() => setUsePoints(true)}
                  className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${usePoints ? 'border-[#D4A84B]/50 bg-[#D4A84B]/5' : 'border-[#1F2937] bg-[#0F172A] hover:border-[#374151]'}`}
                >
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#D4A84B] text-black text-[8px] uppercase tracking-wider rounded-bl-lg" style={{ fontWeight: 800 }}>Save ${pointsValue}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>Option B</div>
                  <div className="text-white text-lg" style={{ fontWeight: 900 }}>${(finalTotal - pointsValue).toFixed(2)} <span className="text-[12px] text-[#D4A84B]">+ 1,000 pts</span></div>
                  <div className="text-[11px] text-white/30 mt-1">Use points to save</div>
                  {usePoints && <div className="flex items-center gap-1 mt-2 text-[10px] text-[#D4A84B]" style={{ fontWeight: 700 }}><Check className="w-3 h-3" /> Selected</div>}
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">First Name</label>
                  <input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="John" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Last Name</label>
                  <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Doe" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="john@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(555) 123-4567" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-red-500" /> Payment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Card Number</label>
                  <input value={form.cardNumber} onChange={e => update('cardNumber', e.target.value)} placeholder="4242 4242 4242 4242" className={inputClass} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Expiry</label>
                    <input value={form.expiry} onChange={e => update('expiry', e.target.value)} placeholder="MM/YY" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">CVC</label>
                    <input value={form.cvc} onChange={e => update('cvc', e.target.value)} placeholder="123" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">ZIP Code</label>
                    <input value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="90001" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order */}
            <button
              onClick={handleComplete}
              disabled={processing}
              className="w-full py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-wider text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Place Order — ${finalTotal.toFixed(2)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-white/30">
              <Shield className="w-3.5 h-3.5" />
              Secured with 256-bit SSL encryption
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="text-[10px] text-red-500 font-black uppercase tracking-wider mb-2">{event.date}</div>
                <h3 className="text-white font-black uppercase tracking-tight mb-3">{event.title}</h3>
                <div className="flex items-center gap-1.5 text-white/40 text-xs mb-6">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.venue}, {event.city}
                </div>

                <div className="space-y-3 border-t border-[#1F2937] pt-4">
                  <div className="flex justify-between text-sm text-white/50"><span>Subtotal</span><span>${(subtotal || finalTotal / 1.1).toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-white/50"><span>Service Fee</span><span>${(serviceFee || finalTotal * 0.08).toFixed(2)}</span></div>
                  {facilityFee > 0 && <div className="flex justify-between text-sm text-white/50"><span>Facility Fee</span><span>${facilityFee.toFixed(2)}</span></div>}
                </div>

                <div className="flex justify-between text-white font-black text-lg pt-4 mt-4 border-t border-[#1F2937]">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <div className="mt-6 space-y-2">
                  {['Tickets delivered instantly', 'Refund if event is postponed or cancelled', '24/7 customer support'].map(txt => (
                    <div key={txt} className="flex items-center gap-2 text-[11px] text-white/40">
                      <Check className="w-3 h-3 text-green-500" /> {txt}
                    </div>
                  ))}
                </div>

                {/* Sales Policy Notice */}
                <div className="mt-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-black text-amber-500 uppercase tracking-wider mb-1">Sales Policy</div>
                      <p className="text-[11px] text-white/40 leading-relaxed">
                        All sales are final. No refunds or exchanges unless the event is officially postponed or cancelled by the organizer. In that case, a full refund will be issued automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}