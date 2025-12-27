'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Container from '../layout/Container';
import GradientText from '../ui/GradientText';
import { Mail, Sparkles, Check, Users, TrendingUp, Clock, Zap } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

// Animated counter component
function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function WaitlistSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  // Simulated waitlist stats
  const totalSpots = 10000;
  const currentSignups = 7847; // Simulated number
  const spotsLeft = totalSpots - currentSignups;
  const progressPercent = (currentSignups / totalSpots) * 100;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage(t('waitlist.invalidEmail'));
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(t('waitlist.success'));
        setEmail('');

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.message || t('waitlist.error'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('waitlist.error'));
    }
  };

  return (
    <section id="waitlist" className="relative py-16 sm:py-20 md:py-24 overflow-hidden scroll-mt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-brand-primary/5 to-background-dark" />
      <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-brand-accent/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center px-4 sm:px-6"
          {...fadeInUp}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-hero mb-6 sm:mb-8"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            {...fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <GradientText>
              {t('waitlist.title')}
            </GradientText>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 leading-relaxed"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {t('waitlist.subtitle')}
          </motion.p>

          {/* FOMO Stats Bar */}
          {mounted && (
            <motion.div
              className="bg-background-card/50 backdrop-blur-sm rounded-2xl border border-brand-primary/20 p-4 sm:p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-brand-primary mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white">
                    <AnimatedCounter target={currentSignups} />
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted">Joined</div>
                </div>
                <div className="text-center border-x border-brand-primary/20">
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                    {spotsLeft.toLocaleString()}
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted">Spots Left</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-green-400">
                    +127
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted">Today</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="flex justify-between text-xs text-text-muted mb-2">
                  <span>Early Access Progress</span>
                  <span>{progressPercent.toFixed(0)}% Full</span>
                </div>
                <div className="h-3 bg-background-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-primary via-purple-500 to-brand-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0</span>
                  <span className="text-brand-primary font-medium">Almost Full!</span>
                  <span>{totalSpots.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Urgency Message */}
          <motion.div
            className="flex items-center justify-center gap-2 text-yellow-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">
              Early access spots are limited - secure yours now!
            </span>
          </motion.div>

          {/* Email Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Email Input */}
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('waitlist.placeholder')}
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-background-card border-2 border-brand-primary/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                whileHover={{ scale: status === 'idle' || status === 'error' ? 1.02 : 1 }}
                whileTap={{ scale: status === 'idle' || status === 'error' ? 0.98 : 1 }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-hero text-white font-semibold hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('waitlist.submitting')}
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-5 h-5" />
                    {t('waitlist.joined')}
                  </>
                ) : (
                  t('waitlist.cta')
                )}
              </motion.button>
            </div>

            {/* Status Message */}
            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-sm sm:text-base ${
                  status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {message}
              </motion.p>
            )}
          </motion.form>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No spam, ever
            </div>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Unsubscribe anytime
            </div>
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            className="text-xs sm:text-sm text-text-muted mt-6 sm:mt-8"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            {t('waitlist.privacy')}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}
