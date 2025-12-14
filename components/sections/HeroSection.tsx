'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import { Smartphone } from 'lucide-react';
import { fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16 sm:pt-20 md:pt-24">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-primary/20 via-background-dark to-background-dark" />

      {/* Animated particles/dots (optional decorative elements) */}
      <div className="absolute top-20 right-10 sm:right-20 w-48 sm:w-72 h-48 sm:h-72 bg-brand-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-10 sm:left-20 w-64 sm:w-96 h-64 sm:h-96 bg-brand-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left px-4 sm:px-0"
            {...slideInLeft}
          >
            {/* Main Heading */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight sm:leading-relaxed"
              style={{ lineHeight: '1.2' }}
              {...fadeInUp}
            >
              <GradientText className="block pb-2 sm:pb-3">
                {t('hero.title1')}
              </GradientText>
              <GradientText className="block pb-2 sm:pb-3">
                {t('hero.title2')}
              </GradientText>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button variant="disabled" size="lg" disabled>
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('hero.cta')}
              </Button>
            </motion.div>

            {/* Additional info */}
            <motion.p
              className="text-xs sm:text-sm text-text-muted mt-3 sm:mt-4"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              {t('hero.launching')}
            </motion.p>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            {...slideInRight}
          >
            {/* Phone mockup placeholder */}
            <motion.div
              className="relative w-full max-w-[280px] sm:max-w-sm"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-20" />

              {/* Phone frame */}
              <div className="relative bg-gradient-to-br from-background-card to-background-elevated rounded-[2.5rem] sm:rounded-[3rem] p-3 sm:p-4 shadow-2xl border border-brand-primary/20">
                {/* Screen */}
                <div className="relative bg-[#1a1d24] rounded-[2rem] sm:rounded-[2.5rem] aspect-[9/19.5] overflow-hidden flex items-center justify-center">
                  {/* App Logo - Centered */}
                  <motion.div
                    className="flex flex-col items-center gap-4 sm:gap-6"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {/* Rounded Logo like Google Play */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-hero blur-2xl opacity-40 rounded-full" />
                      <Image
                        src="/logo.png"
                        alt="WatchPulse Logo"
                        width={120}
                        height={120}
                        className="rounded-[24px] sm:rounded-[28px] shadow-2xl relative w-20 h-20 sm:w-[120px] sm:h-[120px]"
                        priority
                        quality={95}
                      />
                    </div>

                    {/* App Name */}
                    <div className="text-center">
                      <p className="text-white text-lg sm:text-xl font-bold">
                        WatchPulse
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
