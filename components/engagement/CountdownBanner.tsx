'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles, Rocket } from 'lucide-react';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Lansman tarihi - 30 gün sonra (ilk ziyaretten itibaren)
    const getLaunchDate = () => {
      const stored = localStorage.getItem('launchDate');
      if (stored) {
        return new Date(stored);
      }
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 30);
      localStorage.setItem('launchDate', launchDate.toISOString());
      return launchDate;
    };

    const launchDate = getLaunchDate();

    const updateCountdown = () => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // SSR için placeholder
  if (!mounted) {
    return (
      <div className="w-full bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent">
        <div className="max-w-7xl mx-auto px-4 py-3" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          {/* Icon & Text */}
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 animate-pulse" />
            <span className="text-sm sm:text-base font-semibold">
              App Launch Countdown
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono">
            <div className="flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1.5">
              <span className="font-bold text-lg">{timeLeft.days}</span>
              <span className="text-xs opacity-80">days</span>
            </div>
            <span className="text-xl font-light">:</span>
            <div className="flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1.5">
              <span className="font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs opacity-80">hrs</span>
            </div>
            <span className="text-xl font-light">:</span>
            <div className="flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1.5">
              <span className="font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs opacity-80">min</span>
            </div>
            <span className="text-xl font-light hidden sm:inline">:</span>
            <div className="hidden sm:flex items-center gap-1 bg-white/20 rounded-lg px-3 py-1.5">
              <span className="font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs opacity-80">sec</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            onClick={scrollToWaitlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-full text-sm font-bold hover:bg-white/90 transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Early Access</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
