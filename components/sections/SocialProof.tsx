'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star, Quote, Download } from 'lucide-react';

const reviews = [
  {
    key: 'review1',
    gradient: 'from-blue-500 to-purple-500',
    initial: 'A',
  },
  {
    key: 'review2',
    gradient: 'from-pink-500 to-rose-500',
    initial: 'E',
  },
  {
    key: 'review3',
    gradient: 'from-emerald-500 to-teal-500',
    initial: 'C',
  },
];

export default function SocialProof() {
  const { t } = useLanguage();

  return (
    <section id="social-proof" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-6">
            {t('socialProof.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            {t('socialProof.title')}
            <span className="text-gradient">{t('socialProof.titleHighlight')}</span>
          </h2>
        </motion.div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.key}
              className="relative group rounded-2xl border border-white/5 bg-background-card/60 backdrop-blur-sm p-6 md:p-8 hover:border-brand-primary/20 transition-all duration-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-brand-primary/30 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                  &ldquo;{t(`socialProof.${review.key}.text`)}&rdquo;
                </p>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                    {review.initial}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">
                      {t(`socialProof.${review.key}.name`)}
                    </div>
                    <div className="text-text-muted text-xs">
                      {t(`socialProof.${review.key}.role`)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Bar */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-brand-primary" />
            <span>{t('socialProof.trustFree')}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span>{t('socialProof.trustRating')}</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
