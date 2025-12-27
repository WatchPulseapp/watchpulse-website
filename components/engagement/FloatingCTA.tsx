'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronUp } from 'lucide-react';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // %30 scroll sonrası göster
      setIsVisible(scrollY > windowHeight * 0.3);

      // %100 scroll sonrası "scroll to top" göster
      setShowScrollTop(scrollY > windowHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
        >
          {/* Scroll to top button */}
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-background-card border border-brand-primary/30 flex items-center justify-center text-brand-primary hover:bg-brand-primary/20 transition-colors shadow-lg"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}

          {/* Main CTA button */}
          <motion.button
            onClick={scrollToWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            <span>Join Waitlist</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
