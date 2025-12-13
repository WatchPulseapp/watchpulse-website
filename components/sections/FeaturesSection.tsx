'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import FeatureCard from '../ui/FeatureCard';
import GradientText from '../ui/GradientText';
import { FEATURES } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesSection() {
  const { t } = useLanguage();

  const featureKeys = ['trending', 'search', 'mood', 'collections', 'actors', 'language', 'themes', 'reminders'];

  return (
    <section className="relative py-24 bg-background-dark">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            {t('features.title')}{' '}
            <GradientText>
              {t('features.titleHighlight')}
            </GradientText>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
      </Container>
    </section>
  );
}
