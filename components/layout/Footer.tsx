'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import { SOCIAL_LINKS } from '@/lib/constants';
import { Mail, Instagram } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterProps {
  forceEnglish?: boolean;
}

export default function Footer({ forceEnglish = false }: FooterProps = {}) {
  const { t } = useLanguage();

  // English translations for blog pages
  const englishTranslations = {
    'contact.title': 'Get in Touch',
    'contact.email': 'Email',
    'contact.twitter': 'Twitter',
    'contact.tiktok': 'TikTok',
    'contact.instagram': 'Instagram',
    'footer.copyright': '© 2025 WatchPulse. All rights reserved.'
  };

  // Use English translations when forceEnglish is true
  const getText = (key: string) => {
    return forceEnglish ? englishTranslations[key as keyof typeof englishTranslations] : t(key);
  };
  return (
    <footer className="relative py-12 border-t border-brand-primary/20">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-hero opacity-50" />

      <Container>
        <div className="flex flex-col items-center gap-8">
          {/* Contact Section */}
          <motion.div
            className="text-center"
            {...fadeInUp}
          >
            <h3 className="text-2xl font-bold mb-4">{getText('contact.title')}</h3>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-6"
            {...fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {/* Email */}
            <motion.a
              href={`https://mail.google.com/mail/?view=cm&to=${SOCIAL_LINKS.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {getText('contact.email')}
              </span>
            </motion.a>

            {/* X (Twitter) */}
            <motion.a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                X (Twitter)
              </span>
            </motion.a>

            {/* TikTok */}
            <motion.a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {getText('contact.tiktok')}
              </span>
            </motion.a>

            {/* Instagram */}
            <motion.a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-background-card rounded-full border border-brand-primary/20 hover:border-brand-primary/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {getText('contact.instagram')}
              </span>
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-center text-sm text-text-muted mt-8"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <p>{getText('footer.copyright')}</p>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}
