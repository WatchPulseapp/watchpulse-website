'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Sparkles } from 'lucide-react';

interface HeroFeatureProps {
  badgeKey: string;
  titleKey: string;
  descriptionKey: string;
  points: string[];
  image: string;
  imageAlt: string;
  reversed?: boolean;
  index: number;
}

function HeroFeature({ badgeKey, titleKey, descriptionKey, points, image, imageAlt, reversed = false, index }: HeroFeatureProps) {
  const { t, language } = useLanguage();

  return (
    <motion.div
      className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-16`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      {/* Phone Mockup */}
      <div className="flex-1 flex justify-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: reversed ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-12 bg-brand-primary/15 rounded-full blur-[60px] animate-glow-pulse" />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
          >
            <div className="relative rounded-[2.5rem] p-[3px] shadow-2xl shadow-black/50"
              style={{ background: 'linear-gradient(180deg, #666 0%, #333 50%, #666 100%)' }}
            >
              <div className="relative aspect-[9/19.5] w-[240px] sm:w-[260px] md:w-[280px] rounded-[2.35rem] overflow-hidden">
                <Image
                  src={`/images/screenshots/${language}/${image}`}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="280px"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="flex-1 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: reversed ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Title */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            {t(titleKey)}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
            {t(descriptionKey)}
          </p>

          {/* Bullet Points */}
          <ul className="space-y-3">
            {points.map((pointKey, i) => (
              <li key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-brand-primary" />
                </div>
                <span className="text-text-secondary text-sm md:text-base">{t(pointKey)}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

const heroFeatures = [
  {
    badgeKey: 'heroFeatures.moodpulse.badge',
    titleKey: 'heroFeatures.moodpulse.title',
    descriptionKey: 'heroFeatures.moodpulse.description',
    points: [
      'heroFeatures.moodpulse.point1',
      'heroFeatures.moodpulse.point2',
      'heroFeatures.moodpulse.point3',
    ],
    image: 'moodpulse.jpg',
    imageAlt: 'WatchPulse MoodPulse',
    reversed: false,
  },
  {
    badgeKey: 'heroFeatures.recommend.badge',
    titleKey: 'heroFeatures.recommend.title',
    descriptionKey: 'heroFeatures.recommend.description',
    points: [
      'heroFeatures.recommend.point1',
    ],
    image: 'recommend.jpg',
    imageAlt: 'WatchPulse Recommend',
    reversed: true,
  },
  {
    badgeKey: 'heroFeatures.whereToWatch.badge',
    titleKey: 'heroFeatures.whereToWatch.title',
    descriptionKey: 'heroFeatures.whereToWatch.description',
    points: [
      'heroFeatures.whereToWatch.point1',
      'heroFeatures.whereToWatch.point2',
      'heroFeatures.whereToWatch.point3',
    ],
    image: 'personalized.jpg',
    imageAlt: 'WatchPulse Where to Watch',
    reversed: false,
  },
  {
    badgeKey: 'heroFeatures.forYou.badge',
    titleKey: 'heroFeatures.forYou.title',
    descriptionKey: 'heroFeatures.forYou.description',
    points: [
      'heroFeatures.forYou.point1',
      'heroFeatures.forYou.point2',
      'heroFeatures.forYou.point3',
    ],
    image: 'tracking.jpg',
    imageAlt: 'WatchPulse For You',
    reversed: true,
  },
];

export default function HeroFeatures() {
  const { t } = useLanguage();

  return (
    <section id="hero-features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[80px]" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t('heroFeatures.sectionTitle')}
            <span className="text-gradient">{t('heroFeatures.sectionTitleHighlight')}</span>
          </h2>
        </motion.div>

        {/* Features */}
        <div className="space-y-24 md:space-y-32">
          {heroFeatures.map((feature, index) => (
            <HeroFeature key={feature.image} {...feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
