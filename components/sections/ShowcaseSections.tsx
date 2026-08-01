'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { SHOWCASES, PLATFORM_NAMES } from '@/lib/constants';

const easeOut = [0.22, 1, 0.36, 1] as const;

function PulseBullet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true">
      <path
        d="M2 12h5l2-4 3 8 2.5-5H22"
        stroke="url(#bullet-grad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="bullet-grad" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6B7FD7" />
          <stop offset="1" stopColor="#F0C97E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ShowcaseSections() {
  const { t, language } = useLanguage();

  return (
    <section id="features" className="relative py-20 md:py-28 scroll-mt-16">
      <Container>
        <div className="space-y-24 md:space-y-36">
          {SHOWCASES.map((item) => (
            <div
              key={item.key}
              className={`flex flex-col ${item.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
            >
              {/* Copy */}
              <motion.div
                className="flex-1 max-w-xl text-center lg:text-left"
                initial={{ opacity: 0, x: item.reversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: easeOut }}
              >
                <p className="eyebrow mb-3 justify-center lg:justify-start">{t(`showcase.${item.key}.eyebrow`)}</p>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-text-primary mb-5">
                  {t(`showcase.${item.key}.title`)}
                </h2>
                <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-7">
                  {t(`showcase.${item.key}.desc`)}
                </p>
                <ul className="space-y-3 text-left inline-block lg:block">
                  {(['b1', 'b2', 'b3'] as const).map((b) => (
                    <li key={b} className="flex items-start gap-3 text-text-primary/90">
                      <PulseBullet />
                      <span>{t(`showcase.${item.key}.${b}`)}</span>
                    </li>
                  ))}
                </ul>

                {item.key === 'platforms' && (
                  <div className="mt-7 flex flex-wrap justify-center lg:justify-start gap-2" aria-label="Platforms">
                    {PLATFORM_NAMES.slice(0, 10).map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-white/10 bg-background-card/70 px-3 py-1 text-xs font-medium text-text-secondary"
                      >
                        {name}
                      </span>
                    ))}
                    <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                      +{PLATFORM_NAMES.length - 10}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div
                className="flex-1 flex justify-center"
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: easeOut }}
              >
                <div className="phone-mockup w-[240px] sm:w-[270px] md:w-[290px]">
                  <div className="phone-screen relative">
                    <Image
                      src={`/images/screenshots/${language}/${item.screenshot}`}
                      alt={t(`showcase.${item.key}.title`)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 240px, 290px"
                      quality={85}
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
