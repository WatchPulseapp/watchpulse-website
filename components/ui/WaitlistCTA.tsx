'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface WaitlistCTAProps {
  variant?: 'inline' | 'sticky';
  className?: string;
  language?: 'tr' | 'en';
}

export default function WaitlistCTA({ variant = 'inline', className = '', language = 'tr' }: WaitlistCTAProps) {
  const isEnglish = language === 'en';

  if (variant === 'sticky') {
    return (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${className}`}
      >
        <Link href="/#waitlist" scroll={true}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-hero rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] transition-all duration-300 border border-brand-primary/30"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            <div className="text-left">
              <div className="text-white font-bold text-xs sm:text-sm">
                {isEnglish ? 'Be Among the First!' : 'İlk Kullananlar Arasında Ol!'}
              </div>
              <div className="text-white/80 text-[10px] sm:text-xs hidden xs:block">
                {isEnglish ? 'Get notified at launch 🚀' : 'Launch\'tan haberdar ol 🚀'}
              </div>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  // Inline variant (for content)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-6 sm:p-8 md:p-10 bg-gradient-to-br from-brand-primary/10 via-background-card to-brand-accent/10 rounded-xl sm:rounded-2xl border border-brand-primary/20 text-center ${className}`}
    >
      {/* Icon */}
      <motion.div
        className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-hero mb-4 sm:mb-6"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </motion.div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-hero bg-clip-text text-transparent px-2">
        {isEnglish ? 'Be Among the First to Know! 🚀' : 'İlk Kullananlar Arasında Olun! 🚀'}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-2">
        {isEnglish
          ? 'Join our waitlist and be the first to know when WatchPulse launches. Get early access and exclusive benefits!'
          : 'WatchPulse çıktığında ilk haberdar olan siz olun! Mail adresinizi bırakın, uygulama yayına girdiğinde size haber verelim.'
        }
      </p>

      {/* CTA Button */}
      <Link href="/#waitlist" scroll={true}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-hero rounded-xl sm:rounded-2xl text-white font-bold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 text-sm sm:text-base"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          {isEnglish ? 'Join Waitlist' : 'Mail Adresimi Bırak'}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </Link>

      {/* Trust Badge */}
      <p className="text-[10px] sm:text-xs text-text-muted mt-3 sm:mt-4 px-2">
        {isEnglish ? '✨ No spam, just launch notifications' : '✨ Spam yok, sadece launch haberi'}
      </p>
    </motion.div>
  );
}
