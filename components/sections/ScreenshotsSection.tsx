'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import GradientText from '../ui/GradientText';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScreenshotsSection() {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const TOTAL_SCREENSHOTS = 6;

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOTAL_SCREENSHOTS);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative py-24 bg-background-dark">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <GradientText>{t('screenshots.title')}</GradientText>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('screenshots.subtitle')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Phone mockup with screenshot */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-20" />

              {/* Phone frame */}
              <div className="relative bg-gradient-to-br from-background-card to-background-elevated rounded-[3rem] p-4 shadow-2xl border border-brand-primary/20">
                {/* Screen with animated content */}
                <div className="relative bg-black rounded-[2.5rem] aspect-[9/19.5] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${language}-${currentIndex}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={`/images/screenshots/${language}/${currentIndex + 1}.jpg`}
                        alt={`WatchPulse Screenshot ${currentIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority={currentIndex === 0}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: TOTAL_SCREENSHOTS }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-brand-primary w-8'
                    : 'bg-text-muted w-2 hover:bg-brand-accent'
                )}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>

          {/* Screenshot Info */}
          <motion.div
            className="text-center mt-6"
            key={`info-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-text-muted">
              {t('screenshots.count').replace('{current}', String(currentIndex + 1)).replace('{total}', String(TOTAL_SCREENSHOTS))}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
