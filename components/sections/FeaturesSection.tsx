'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import FeatureCard from '../ui/FeatureCard';
import GradientText from '../ui/GradientText';
import ShareButtons from '../ui/ShareButtons';
import { FEATURES } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const featureKeys = ['trending', 'search', 'mood', 'collections', 'actors', 'language', 'themes', 'reminders'];

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-background-dark">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 px-4 sm:px-0"
          {...fadeInUp}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            {t('features.title')}{' '}
            <GradientText>
              {t('features.titleHighlight')}
            </GradientText>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          {...staggerContainer}
        >
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={t(`features.${featureKeys[index]}.title`)}
              description={t(`features.${featureKeys[index]}.description`)}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* Viral CTA */}
        <motion.div
          className="mt-12 sm:mt-16 max-w-2xl mx-auto px-4 sm:px-0"
          {...fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-brand-primary/10 via-brand-accent/5 to-brand-primary/10 border border-brand-primary/20">
            <div className="text-center mb-6">
              <p className="text-base sm:text-lg text-text-primary font-semibold mb-2">
                {t('viral.featuresTitle')}
              </p>
              <p className="text-sm sm:text-base text-text-secondary">
                {t('viral.featuresSubtitle')}
              </p>
            </div>
            <div className="flex justify-center">
              <ShareButtons compact />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
