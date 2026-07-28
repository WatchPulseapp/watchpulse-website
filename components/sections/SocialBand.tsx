'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeartHandshake, MessagesSquare, ListChecks, UserCheck } from 'lucide-react';

const easeOut = [0.22, 1, 0.36, 1] as const;

const CARDS = [
  { key: 'match', Icon: HeartHandshake },
  { key: 'chat', Icon: MessagesSquare },
  { key: 'posts', Icon: ListChecks },
  { key: 'follow', Icon: UserCheck },
] as const;

function Waveform() {
  const bars = [5, 9, 14, 8, 12, 16, 10, 6, 11, 15, 9, 5, 8, 12, 7];
  return (
    <span className="flex items-center gap-[3px] h-5" aria-hidden="true">
      {bars.map((h, i) => (
        <span key={i} className="w-[3px] rounded-full bg-white/70" style={{ height: `${h}px` }} />
      ))}
    </span>
  );
}

export default function SocialBand() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section id="social" className="relative py-20 md:py-28 bg-background-dark/60 border-y border-white/5 scroll-mt-16 overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-brand-primary/8 rounded-full blur-[120px]" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          {/* Copy + cards */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: easeOut }}
          >
            <p className="eyebrow mb-3">{t('social.eyebrow')}</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-text-primary mb-5 max-w-lg">
              {t('social.title')}
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-9 max-w-lg">
              {t('social.desc')}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {CARDS.map(({ key, Icon }, i) => (
                <motion.div
                  key={key}
                  className="glass-card p-5"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOut }}
                >
                  <Icon className="w-6 h-6 text-brand-accent mb-3" aria-hidden="true" />
                  <h3 className="font-semibold text-text-primary mb-1.5">{t(`social.${key}.title`)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(`social.${key}.desc`)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat mock — built with the app's own visual language */}
          <motion.div
            className="flex-1 flex justify-center w-full"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeOut }}
          >
            <div className="gradient-border w-full max-w-[400px] p-6 shadow-card">
              {/* Chat header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-hero text-sm font-bold text-white">
                  E
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background-card bg-[#4ADE80]" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-text-primary leading-tight">{t('social.chatDemo.name')}</p>
                  <p className="text-xs text-[#4ADE80]">{t('social.chatDemo.status')}</p>
                </div>
                <span className="ml-auto rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-bold text-brand-gold">
                  %92
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-3 py-5">
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-background-elevated px-4 py-2.5 text-sm text-text-primary">
                  {t('social.chatDemo.msg1')}
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-gradient-primary px-4 py-2.5 text-sm text-white">
                  {t('social.chatDemo.msg2')}
                </div>
                {/* Voice message */}
                <div className="ml-auto flex max-w-[80%] items-center gap-3 rounded-2xl rounded-br-md bg-gradient-primary px-4 py-2.5">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <Waveform />
                  <span className="text-xs text-white/80">0:07</span>
                </div>
                <div className="max-w-[80%] rounded-2xl rounded-bl-md bg-background-elevated px-4 py-2.5 text-sm text-text-primary">
                  {t('social.chatDemo.msg3')}
                </div>
              </div>

              {/* Typing indicator */}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-brand-accent"
                      animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </span>
                {t('social.chatDemo.name')} {t('social.chatDemo.typing')}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
