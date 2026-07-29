'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;
const QUESTIONS = [1, 2, 3, 4, 5, 6] as const;

export default function FAQ() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(1);

  // Built from the same strings the section renders, so the markup and the page
  // cannot drift apart — and so it exists only where the questions do. It used
  // to be a hard-coded Turkish copy in the site-wide schema component, which
  // meant every URL on the site claimed an FAQ it did not show, and the English
  // edition claimed one in the wrong language.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QUESTIONS.map((q) => ({
      '@type': 'Question',
      name: t(`faq.q${q}`),
      acceptedAnswer: { '@type': 'Answer', text: t(`faq.a${q}`) },
    })),
  };

  return (
    <section id="faq" className="relative py-20 md:py-28 scroll-mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <Container className="max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <p className="eyebrow mb-3 justify-center">{t('faq.eyebrow')}</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary">{t('faq.title')}</h2>
        </motion.div>

        <div className="space-y-3">
          {QUESTIONS.map((q) => {
            const isOpen = open === q;
            return (
              <motion.div
                key={q}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: q * 0.04, ease: easeOut }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : q)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${q}`}
                >
                  <span className="font-semibold text-text-primary">{t(`faq.q${q}`)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${q}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                    >
                      <p className="px-6 pb-5 text-text-secondary leading-relaxed">{t(`faq.a${q}`)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
