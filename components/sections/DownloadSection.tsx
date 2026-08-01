'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import StoreButtons from '../ui/StoreButtons';
import PulseLine from '../ui/PulseLine';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function DownloadSection() {
  const { t } = useLanguage();

  return (
    <section id="download" className="relative overflow-hidden py-24 md:py-32 scroll-mt-16">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-brand-primary/15 via-background-deep to-background-deep" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10">
        <PulseLine className="mb-10" />

        <Container className="text-center">
          <motion.h2
            className="font-display text-5xl sm:text-6xl md:text-7xl text-gradient-pulse mb-5"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            {t('download.title')}
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          >
            {t('download.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
          >
            <StoreButtons size="lg" className="justify-center" source="home-download" />
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
