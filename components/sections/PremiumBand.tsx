'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;
const FEATURES = ['f1', 'f2', 'f3', 'f4', 'f5'] as const;

export default function PremiumBand() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-24">
      <Container>
        <motion.div
          className="gradient-border relative overflow-hidden p-8 md:p-12"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: easeOut }}
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-[100px]" aria-hidden="true" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:items-center">
            <div className="flex-1">
              <p className="eyebrow mb-3 !text-brand-gold">{t('premium.eyebrow')}</p>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">{t('premium.title')}</h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-4 max-w-md">{t('premium.desc')}</p>
              <p className="text-sm text-text-muted">{t('premium.note')}</p>
            </div>

            <ul className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f}
                  className="flex items-center gap-3 text-text-primary/90"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: easeOut }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15">
                    <Check className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
                  </span>
                  {t(`premium.${f}`)}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
