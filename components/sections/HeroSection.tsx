'use client';

import Image from 'next/image';
import Container from '../layout/Container';
import StoreButtons from '../ui/StoreButtons';
import PulseLine from '../ui/PulseLine';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * The fold, and nothing in it waits for JavaScript.
 *
 * This used to be five framer-motion elements, which meant the server sent the
 * headline as style="opacity:0" and the first paint of the site was an empty
 * screen — held there until 166 kB of JavaScript had downloaded, parsed and
 * hydrated. On a mid-range phone on mobile data that is seconds of blank page,
 * and the largest contentful paint cannot be recorded before it ends. The same
 * staircase now runs as CSS keyframes, so it starts with the stylesheet.
 *
 * Timings are also roughly half what they were: the old sequence did not settle
 * until 1.3s, with the store buttons — the thing the page exists for — still
 * fading in. It settles by ~0.75s now.
 */
export default function HeroSection() {
  const { t, language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-28 pb-0 md:pt-36">
      {/* Background glows */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/15 via-background-deep to-background-deep" />
        <div className="absolute top-1/4 right-[15%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[130px] animate-glow-pulse" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[110px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-8">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            {/* Launch badge */}
            <span
              className="animate-rise inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-semibold text-brand-accent mb-6"
              style={{ animationDelay: '60ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
              </span>
              {t('hero.badge')}
            </span>

            {/* Headline: the question everyone asks, set like a movie poster */}
            <h1
              className="animate-rise font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[0.95] mb-6"
              style={{ animationDelay: '120ms' }}
            >
              <span className="block text-text-primary">{t('hero.title1')}</span>
              <span className="block text-gradient-pulse">{t('hero.title2')}</span>
            </h1>

            <p
              className="animate-rise text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              style={{ animationDelay: '200ms' }}
            >
              {t('hero.subtitle')}
            </p>

            <div className="animate-rise" style={{ animationDelay: '280ms' }}>
              <StoreButtons className="justify-center lg:justify-start" />
              <p className="mt-4 text-sm text-text-muted">{t('hero.trust')}</p>
            </div>
          </div>

          {/* Right: phone + floating mood chips */}
          <div className="flex-1 flex items-center justify-center lg:justify-end pb-8">
            <div className="animate-rise-far relative" style={{ animationDelay: '100ms' }}>
              <div className="absolute -inset-10 bg-brand-primary/20 rounded-full blur-3xl animate-glow-pulse" aria-hidden="true" />

              {/* The float is CSS too. It never stops, and driving a forever-loop
                  through JavaScript keeps a callback on the main thread for the
                  entire visit — competing with scrolling — where a keyframed
                  transform is handed to the compositor once and costs nothing
                  after that. The reduced-motion rule in globals.css flattens
                  every animation on this page, this one included. */}
              <div className="animate-float-slow">
                <div className="phone-mockup w-[240px] sm:w-[270px] md:w-[290px]">
                  <div className="phone-screen relative">
                    <Image
                      src={`/images/screenshots/${language}/home.jpg`}
                      alt="WatchPulse"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 240px, 290px"
                      quality={85}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Signature: the pulse line draws across the fold */}
      <div className="relative z-10 -mt-2">
        <PulseLine delay={0.6} />
      </div>
    </section>
  );
}
