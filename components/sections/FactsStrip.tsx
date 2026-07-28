'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';

const FACTS = ['moods', 'themes', 'platforms', 'catalog'] as const;

export default function FactsStrip() {
  const { t } = useLanguage();

  return (
    <section className="relative border-y border-white/5 bg-background-dark/60">
      <Container>
        <motion.dl
          className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {FACTS.map((fact) => (
            <div key={fact} className="text-center">
              <dt className="sr-only">{t(`facts.${fact}Label`)}</dt>
              <dd className="font-display text-4xl md:text-5xl text-text-primary">{t(`facts.${fact}`)}</dd>
              <dd className="mt-1 text-sm uppercase tracking-[0.18em] text-text-muted">{t(`facts.${fact}Label`)}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
