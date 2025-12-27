'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Sparkles } from 'lucide-react';

export default function CountdownBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Lansman tarihi - 30 gün sonra
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

    // Banner'ı daha önce kapatmış mı kontrol et
    const dismissed = sessionStorage.getItem('countdownDismissed');
    if (dismissed) {
      setIsVisible(false);
    }

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('countdownDismissed', 'true');
  };

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-brand-primary via-purple-600 to-brand-accent text-white"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden sm:flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Launch in:</span>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2 text-sm font-mono">
            <div className="bg-white/20 rounded px-2 py-0.5">
              <span className="font-bold">{timeLeft.days}</span>
              <span className="text-xs ml-1">d</span>
            </div>
            <span>:</span>
            <div className="bg-white/20 rounded px-2 py-0.5">
              <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-xs ml-1">h</span>
            </div>
            <span>:</span>
            <div className="bg-white/20 rounded px-2 py-0.5">
              <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-xs ml-1">m</span>
            </div>
            <span className="hidden sm:inline">:</span>
            <div className="hidden sm:block bg-white/20 rounded px-2 py-0.5">
              <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-xs ml-1">s</span>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToWaitlist}
          className="flex items-center gap-1 px-3 py-1 bg-white text-purple-600 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Get Early Access</span>
          <span className="sm:hidden">Join</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
