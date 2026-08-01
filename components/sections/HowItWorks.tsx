'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';

const easeOut = [0.22, 1, 0.36, 1] as const;
const STEPS = ['step1', 'step2', 'step3'] as const;

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="how-it-works" className="relative py-20 md:py-28 bg-background-dark/60 border-y border-white/5 scroll-mt-16">
      <Container>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <p className="eyebrow mb-3 justify-center">{t('how.eyebrow')}</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary">{t('how.title')}</h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Connecting line on desktop */}
          <div
            className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-brand-primary/40 via-brand-accent/30 to-brand-gold/40"
            aria-hidden="true"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step}
              className="relative text-center"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
            >
              <span className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-primary/30 bg-background-card font-display text-3xl text-brand-accent shadow-glow">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{t(`how.${step}.title`)}</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{t(`how.${step}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
