'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import StoreButtons from '../ui/StoreButtons';
import PulseLine from '../ui/PulseLine';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-0 md:pt-36">
      {/* Background glows */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/15 via-background-deep to-background-deep" />
        <div className="absolute top-1/4 right-[15%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[130px] animate-glow-pulse" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[110px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-8">
          {/* Left: copy */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            {/* Launch badge */}
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold text-brand-accent mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: easeOut }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
              </span>
              {t('hero.badge')}
            </motion.span>

            {/* Headline: the question everyone asks, set like a movie poster */}
            <motion.h1
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.95] mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: easeOut }}
            >
              <span className="block text-text-primary">{t('hero.title1')}</span>
              <span className="block text-gradient-pulse">{t('hero.title2')}</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7, ease: easeOut }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: easeOut }}
            >
              <StoreButtons className="justify-center lg:justify-start" />
              <p className="mt-4 text-sm text-text-muted">{t('hero.trust')}</p>
            </motion.div>
          </motion.div>

          {/* Right: phone + floating mood chips */}
          <div className="flex-1 flex items-center justify-center lg:justify-end pb-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: easeOut }}
            >
              <div className="absolute -inset-10 bg-brand-primary/20 rounded-full blur-3xl animate-glow-pulse" aria-hidden="true" />

              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="phone-mockup w-[240px] sm:w-[270px] md:w-[290px]">
                  <div className="phone-screen relative">
                    <Image
                      src={`/images/screenshots/${language}/home.jpg`}
                      alt="WatchPulse"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 240px, 290px"
                      quality={78}
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Signature: the pulse line draws across the fold */}
      <div className="relative z-10 -mt-2">
        <PulseLine delay={1.1} />
      </div>
    </section>
  );
}
