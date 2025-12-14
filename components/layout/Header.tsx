'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import { cn } from '@/lib/utils';
import { Smartphone, Globe, BookOpen, Mail, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SOCIAL_LINKS } from '@/lib/constants';

interface HeaderProps {
  hideLanguageSwitcher?: boolean;
  forceEnglish?: boolean;
}

export default function Header({ hideLanguageSwitcher = false, forceEnglish = false }: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const { language: contextLanguage, setLanguage, t } = useLanguage();

  // Force English on blog pages
  const language = forceEnglish ? 'en' : contextLanguage;

  // English translations for blog pages
  const englishTranslations = {
    'nav.blog': 'Blog',
    'nav.comingSoon': 'Coming Soon',
    'contact.email': 'Email',
    'contact.twitter': 'Twitter',
    'contact.tiktok': 'TikTok',
    'contact.instagram': 'Instagram'
  };

  // Use English translations when forceEnglish is true
  const getText = (key: string) => {
    return forceEnglish ? englishTranslations[key as keyof typeof englishTranslations] : t(key);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background-dark/80 backdrop-blur-lg border-b border-brand-primary/20'
          : 'bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-white">Watch</span>
                <span className="bg-gradient-hero bg-clip-text text-transparent">Pulse</span>
              </span>
            </motion.div>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 lg:gap-6">
            {/* Blog Link */}
            <Link href="/blog">
              <motion.div
                className="flex items-center gap-1 px-2 py-1.5 sm:py-2 md:px-4 rounded-lg hover:bg-brand-primary/10 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-gold transition-colors" />
                <span className="hidden sm:inline font-semibold text-text-primary group-hover:text-brand-gold transition-colors text-sm md:text-base">
                  {getText('nav.blog')}
                </span>
              </motion.div>
            </Link>

            {/* Social Media Links - Always visible, just smaller on mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Email - Always visible */}
              <motion.a
                href={`https://mail.google.com/mail/?view=cm&to=${SOCIAL_LINKS.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={getText('contact.email')}
              >
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
              </motion.a>

              {/* X (Twitter) - Always visible */}
              <motion.a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="X (Twitter)"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>

              {/* TikTok - Always visible */}
              <motion.a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </motion.a>

              {/* Instagram - Always visible */}
              <motion.a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:p-1.5 md:p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={getText('contact.instagram')}
              >
                <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
              </motion.a>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
            {/* Language Switcher - Hidden on blog pages */}
            {!hideLanguageSwitcher && (
              <motion.button
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                className="relative p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="w-5 h-5 text-brand-primary" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {language === 'tr' ? 'EN' : 'TR'}
                </span>
              </motion.button>
            )}

            {/* Download Button (Disabled) - Always shows text */}
            <motion.button
              className={cn(
                'relative px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base',
                'bg-gray-600/50 text-gray-400 cursor-not-allowed',
                'border border-gray-600/30',
                'whitespace-nowrap'
              )}
              disabled
              whileHover={{ scale: 1.02 }}
            >
              <span className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span>{getText('nav.comingSoon')}</span>
              </span>
            </motion.button>
            </div>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
