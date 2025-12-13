'use client';

import { motion } from 'framer-motion';
import Container from '../layout/Container';
import GradientText from '../ui/GradientText';
import { MOODS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MoodSection() {
  const { t } = useLanguage();

  const moodKeys = ['tired', 'happy', 'sad', 'excited', 'romantic', 'scared', 'nostalgic', 'thoughtful', 'adventurous', 'chill'];

  return (
    <section className="relative py-24 bg-background-elevated">
      <Container>
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <GradientText>{t('mood.title')}</GradientText>
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {t('mood.subtitle')}
          </p>
        </motion.div>

        {/* Moods Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          {...staggerContainer}
        >
          {MOODS.map((mood, index) => (
            <motion.div
              key={mood.id}
              className={cn(
                'group relative p-6 rounded-2xl',
                'bg-gradient-to-br',
                mood.gradient,
                'transition-transform duration-300 cursor-pointer',
                'flex flex-col items-center justify-center gap-3',
                'min-h-[140px]'
              )}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Emoji */}
              <span className="text-4xl group-hover:scale-110 transition-transform">
                {mood.emoji}
              </span>

              {/* Mood Name */}
              <span className="text-white font-semibold text-center text-sm">
                {t(`mood.moods.${moodKeys[index]}`)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
