'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Button from '../ui/Button';
import GradientText from '../ui/GradientText';
import ShareButtons from '../ui/ShareButtons';
import { Smartphone, Sparkles } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DownloadSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background-elevated via-background-dark to-background-elevated overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-5 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-brand-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-5 sm:right-10 w-56 sm:w-80 h-56 sm:h-80 bg-brand-accent/10 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center px-4 sm:px-0"
          {...fadeInUp}
        >
          {/* Icon */}
          <motion.div
            className="inline-block mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-hero rounded-xl sm:rounded-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <GradientText>{t('download.title')}</GradientText>
          </h2>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 max-w-2xl mx-auto">
            {t('download.subtitle')}
          </p>

          {/* CTA Button */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Button variant="disabled" size="lg" disabled>
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('download.cta')}
            </Button>

            <p className="text-xs sm:text-sm text-text-muted mt-3 sm:mt-4">
              {t('download.note')}
            </p>
          </motion.div>

          {/* Features highlights */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: '🎬', text: t('download.feature1') },
              { icon: '🤖', text: t('download.feature2') },
              { icon: '🎨', text: t('download.feature3') },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-2xl sm:text-3xl">{item.icon}</span>
                <span className="text-xs sm:text-sm text-text-secondary">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Share Buttons */}
          <motion.div
            className="mt-12 sm:mt-16 pt-8 border-t border-brand-primary/20"
            {...fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <div className="max-w-2xl mx-auto">
              <ShareButtons />
            </div>
          </motion.div>

          {/* Viral CTA */}
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20"
            {...fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm sm:text-base text-text-secondary text-center">
              {t('viral.downloadNote')}
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
