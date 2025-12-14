'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [isFirstImageLoaded, setIsFirstImageLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const TOTAL_SCREENSHOTS = 6;

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Aggressively preload first image
  useEffect(() => {
    if (!isVisible) return;

    const firstImg = new window.Image();
    firstImg.src = `/images/screenshots/${language}/1.jpg`;
    firstImg.onload = () => {
      setLoadedImages(prev => new Set(prev).add(0));
      setIsFirstImageLoaded(true);
    };
  }, [isVisible, language]);

  // Preload remaining images after first loads
  useEffect(() => {
    if (!isFirstImageLoaded) return;

    // Preload images in order
    const preloadNext = async () => {
      for (let i = 1; i < TOTAL_SCREENSHOTS; i++) {
        const img = new window.Image();
        img.src = `/images/screenshots/${language}/${i + 1}.jpg`;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(i));
            resolve();
          };
          img.onerror = () => resolve();
        });
        // Small delay between preloads to not block main thread
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    preloadNext();
  }, [isFirstImageLoaded, language]);

  // Auto-play carousel - only when images are loaded
  useEffect(() => {
    if (isPaused || !isFirstImageLoaded) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % TOTAL_SCREENSHOTS;
        // Only advance if next image is loaded
        return loadedImages.has(nextIndex) ? nextIndex : prev;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isFirstImageLoaded, loadedImages]);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-20 md:py-24 bg-background-dark">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
          {...fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            <GradientText>{t('screenshots.title')}</GradientText>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
            {t('screenshots.subtitle')}
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto px-4 sm:px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Phone mockup with screenshot */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-sm">
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-hero blur-3xl opacity-20" />

              {/* Phone frame */}
              <div className="relative bg-gradient-to-br from-background-card to-background-elevated rounded-[2.5rem] sm:rounded-[3rem] p-3 sm:p-4 shadow-2xl border border-brand-primary/20">
                {/* Screen with animated content */}
                <div className="relative bg-black rounded-[2rem] sm:rounded-[2.5rem] aspect-[9/19.5] overflow-hidden">
                  {/* Skeleton/Placeholder - Always visible in background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-background-elevated via-background-card to-background-elevated">
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                    {/* App icon placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="flex flex-col items-center gap-4"
                        animate={{
                          opacity: isFirstImageLoaded ? 0 : [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Logo skeleton */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-brand-primary/30" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>

                        {/* Loading text */}
                        <div className="px-4 py-2 rounded-lg bg-brand-primary/10">
                          <p className="text-xs text-brand-primary/50 font-medium">
                            {isVisible ? 'Loading...' : 'Scroll to load'}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Actual Screenshots */}
                  <AnimatePresence mode="wait">
                    {loadedImages.has(currentIndex) && (
                      <motion.div
                        key={`${language}-${currentIndex}`}
                        className="absolute inset-0 z-10"
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Image
                          src={`/images/screenshots/${language}/${currentIndex + 1}.jpg`}
                          alt={`WatchPulse Screenshot ${currentIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 280px, 400px"
                          quality={90}
                          loading="eager"
                          priority={currentIndex === 0}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Loading indicator overlay */}
                  {!loadedImages.has(currentIndex) && isVisible && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        <p className="text-xs text-brand-primary font-medium">Loading image...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: TOTAL_SCREENSHOTS }).map((_, index) => (
              <button
                key={index}
                onClick={() => loadedImages.has(index) && setCurrentIndex(index)}
                disabled={!loadedImages.has(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-brand-primary w-6 sm:w-8'
                    : loadedImages.has(index)
                    ? 'bg-text-muted w-2 hover:bg-brand-accent cursor-pointer'
                    : 'bg-text-muted/30 w-2 cursor-not-allowed'
                )}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>

          {/* Screenshot Info */}
          <motion.div
            className="text-center mt-4 sm:mt-6"
            key={`info-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs sm:text-sm text-text-muted">
              {t('screenshots.count').replace('{current}', String(currentIndex + 1)).replace('{total}', String(TOTAL_SCREENSHOTS))}
            </p>
            {loadedImages.size < TOTAL_SCREENSHOTS && (
              <p className="text-xs text-brand-primary/50 mt-1">
                {loadedImages.size}/{TOTAL_SCREENSHOTS} loaded
              </p>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
