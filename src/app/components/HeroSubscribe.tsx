import { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function HeroSubscribe() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" strokeWidth={2} />
            <span className="text-sm text-emerald-300" style={{ fontWeight: 600 }}>
              You're in! We'll send you the best deals and drops.
            </span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-2.5"
          >
            <p className="text-[12px] text-white/30 uppercase tracking-wider" style={{ fontWeight: 700 }}>
              Get exclusive drops & pre-sale access
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" strokeWidth={1.8} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#E52324]/25 focus:border-[#E52324]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
                style={{ fontWeight: 700 }}
              >
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <p className="text-[10px] text-white/15">
              No spam, ever. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
