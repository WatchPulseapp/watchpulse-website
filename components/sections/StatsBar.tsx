'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Container from '../layout/Container';
import { useLanguage } from '@/contexts/LanguageContext';
import { Palette, Heart, Tv, Film } from 'lucide-react';

function AnimatedCounter({ end, suffix = '+', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stats = [
  { key: 'themes', value: 22, suffix: '+', icon: Palette },
  { key: 'moods', value: 10, suffix: '', icon: Heart },
  { key: 'platforms', value: 8, suffix: '+', icon: Tv },
  { key: 'titles', value: 1, suffix: 'M+', icon: Film },
];

export default function StatsBar() {
  const { t } = useLanguage();

  return (
    <section id="stats-bar" className="relative py-16 md:py-20 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-primary/10 to-brand-primary/5" />
      <div className="absolute inset-0 bg-background-dark/80" />

      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                className="relative flex flex-col items-center text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>

                {/* Number */}
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">
                  {t(`stats.${stat.key}`)}
                </div>

                {/* Separator line (not on last item per row) */}
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
