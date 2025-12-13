'use client';

import { motion } from 'framer-motion';
import Container from './Container';
import { SOCIAL_LINKS } from '@/lib/constants';
import { Mail, Instagram } from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
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
            <h3 className="text-2xl font-bold mb-4">{t('contact.title')}</h3>
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
                {t('contact.email')}
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
                {t('contact.tiktok')}
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
                {t('contact.instagram')}
              </span>
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-center text-sm text-text-muted mt-8"
            {...fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <p>{t('footer.copyright')}</p>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}
