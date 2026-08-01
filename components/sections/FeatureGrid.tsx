'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { Swords, Star, Palette, Users, CalendarCheck } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const ITEMS = [
  { key: 'duels', Icon: Swords },
  { key: 'recommendFor', Icon: Users },
  { key: 'dailyPick', Icon: CalendarCheck },
  { key: 'actors', Icon: Star },
  { key: 'themes', Icon: Palette },
] as const;

export default function FeatureGrid() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-28">
      <Container>
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary mb-3">{t('grid.title')}</h2>
          <p className="text-text-secondary text-lg">{t('grid.subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map(({ key, Icon }, i) => (
            <motion.div
              key={key}
              className="glass-card p-6 transition-colors duration-300 hover:border-brand-primary/30"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease: easeOut }}
            >
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary/15">
                <Icon className="w-5 h-5 text-brand-accent" aria-hidden="true" />
              </span>
              <h3 className="font-semibold text-text-primary mb-2">{t(`grid.${key}.title`)}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{t(`grid.${key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
