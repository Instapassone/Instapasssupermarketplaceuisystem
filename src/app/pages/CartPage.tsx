import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Trash2, Minus, Plus, Tag, ShoppingCart, ArrowRight, Shield, Zap, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { mockEvents } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  eventId: string;
  tierName: string;
  price: number;
  quantity: number;
}

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([
    { eventId: '1', tierName: 'VIP Package', price: 299, quantity: 2 },
    { eventId: '5', tierName: 'General Admission', price: 79, quantity: 1 },
  ]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const updateQty = (idx: number, delta: number) => {
    setItems(prev => prev.map((item, i) =>
      i === idx ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) } : item
    ));
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const serviceFee = subtotal * 0.08;
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = subtotal - discount + serviceFee;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'INSTAPASS10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F172A]">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#111827] border border-[#1F2937] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-white/20" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-3">Your Cart is Empty</h1>
          <p className="text-white/40 text-sm mb-8">Browse amazing events and add tickets to your cart</p>
          <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-wider text-sm hover:bg-red-700 transition-colors">
            Browse Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Your Cart</h1>
        <p className="text-white/40 text-sm mb-8">{totalQty} ticket{totalQty > 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => {
                const event = mockEvents.find(e => e.id === item.eventId);
                if (!event) return null;
                return (
                  <motion.div
                    key={`${item.eventId}-${item.tierName}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-[#111827] rounded-2xl border border-[#1F2937] overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-40 h-32 sm:h-auto shrink-0">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link to={`/event/${event.id}`} className="text-white font-black text-sm uppercase tracking-tight hover:text-red-500 transition-colors">{event.title}</Link>
                            <div className="text-white/40 text-xs mt-1">{event.date} · {event.venue}</div>
                            <div className="text-red-500 text-[11px] font-black uppercase tracking-wider mt-1">{item.tierName}</div>
                          </div>
                          <button onClick={() => removeItem(idx)} className="text-white/30 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQty(idx, -1)} className="w-8 h-8 rounded-lg bg-[#1F2937] text-white/60 hover:bg-white/10 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="w-8 text-center text-white font-black">{item.quantity}</span>
                            <button onClick={() => updateQty(idx, 1)} className="w-8 h-8 rounded-lg bg-[#1F2937] text-white/60 hover:bg-white/10 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                          <div className="text-white font-black text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Promo Code */}
            <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/60">Have a promo code?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                  placeholder="Enter code (try INSTAPASS10)"
                  className="flex-1 px-4 py-3 rounded-xl bg-[#0F172A] border border-[#1F2937] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
                <button onClick={applyPromo} className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-black uppercase hover:bg-red-700 transition-colors">Apply</button>
              </div>
              {promoApplied && <div className="text-green-500 text-xs mt-2 font-black">10% discount applied!</div>}
              {promoError && <div className="text-red-500 text-xs mt-2">{promoError}</div>}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="sticky top-20 bg-[#111827] rounded-2xl border border-[#1F2937] p-6">
              <h3 className="text-lg font-black uppercase tracking-tight text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm text-white/50"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {promoApplied && <div className="flex justify-between text-sm text-green-500"><span>Promo Discount</span><span>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm text-white/50"><span>Service Fee</span><span>${serviceFee.toFixed(2)}</span></div>
              </div>
              <div className="flex justify-between text-white font-black text-lg pt-4 border-t border-[#1F2937]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout/1', { state: { totalPrice: total, subtotal, serviceFee, quantities: {} } })}
                className="w-full mt-6 py-4 rounded-xl bg-red-600 text-white font-black uppercase tracking-wider text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 space-y-2">
                {[
                  { icon: Shield, text: '100% Money-Back Guarantee' },
                  { icon: Zap, text: 'Instant Ticket Delivery' },
                  { icon: Clock, text: 'Secure 10-Minute Hold' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-xs text-white/40">
                    <Icon className="w-3.5 h-3.5 text-red-500" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
