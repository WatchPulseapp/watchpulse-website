'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import { Smartphone, Sparkles } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DownloadSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 bg-gradient-to-br from-background-elevated via-background-dark to-background-elevated overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          {...fadeInUp}
        >
          {/* Icon */}
          <motion.div
            className="inline-block mb-6 p-4 bg-gradient-hero rounded-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <GradientText>{t('download.title')}</GradientText>
          </h2>

          {/* Subheading */}
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            {t('download.subtitle')}
          </p>

          {/* CTA Button */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Button variant="disabled" size="lg" disabled>
              <Smartphone className="w-5 h-5" />
              {t('download.cta')}
            </Button>

            <p className="text-sm text-text-muted mt-4">
              {t('download.note')}
            </p>
          </motion.div>

          {/* Features highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: '🎬', text: t('download.feature1') },
              { icon: '🤖', text: t('download.feature2') },
              { icon: '🎨', text: t('download.feature3') },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-sm text-text-secondary">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
