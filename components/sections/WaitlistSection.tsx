'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Container from '../layout/Container';
import GradientText from '../ui/GradientText';
import { Mail, Sparkles, Check } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WaitlistSection() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
            className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 leading-relaxed"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {t('waitlist.subtitle')}
          </motion.p>

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
