'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Gift, ArrowRight } from 'lucide-react';

export default function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Daha önce gösterildi mi kontrol et
    const shown = localStorage.getItem('exitPopupShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && !isOpen) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Mobile: back button veya scroll up
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hızlı yukarı scroll = çıkış niyeti
      if (lastScrollY - currentScrollY > 100 && currentScrollY < 200 && !hasShown && !isOpen) {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('exitPopupShown', 'true');
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShown, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit_popup' })
      });

      const data = await response.json();
      if (data.success) {
        setStatus('success');
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="bg-gradient-to-br from-background-card to-background-dark rounded-2xl border border-brand-primary/30 p-6 shadow-2xl shadow-brand-primary/20">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Wait! Don&apos;t Miss Out!
                </h2>

                <p className="text-text-secondary mb-6">
                  Join <span className="text-brand-primary font-semibold">10,000+</span> movie lovers
                  and get early access to WatchPulse + exclusive recommendations!
                </p>

                {status === 'success' ? (
                  <div className="flex items-center justify-center gap-2 text-green-400 py-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">You&apos;re in! Check your email.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-background-dark border-2 border-brand-primary/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {status === 'loading' ? (
                        'Joining...'
                      ) : (
                        <>
                          Get Early Access
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <p className="text-xs text-text-muted mt-4">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
