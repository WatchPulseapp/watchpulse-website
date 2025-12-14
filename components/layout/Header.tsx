'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Container from './Container';
import { cn } from '@/lib/utils';
import { Smartphone, Globe, BookOpen, Mail, Instagram, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SOCIAL_LINKS } from '@/lib/constants';

interface HeaderProps {
  hideLanguageSwitcher?: boolean;
  forceEnglish?: boolean;
}

export default function Header({ hideLanguageSwitcher = false, forceEnglish = false }: HeaderProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language: contextLanguage, setLanguage, t } = useLanguage();

  const language = forceEnglish ? 'en' : contextLanguage;

  const englishTranslations = {
    'nav.blog': 'Blog',
    'nav.comingSoon': 'Coming Soon',
    'contact.email': 'Email',
    'contact.twitter': 'Twitter',
    'contact.tiktok': 'TikTok',
    'contact.instagram': 'Instagram'
  };

  const getText = (key: string) => {
    return forceEnglish ? englishTranslations[key as keyof typeof englishTranslations] : t(key);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Header */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background-dark/95 backdrop-blur-xl border-b border-brand-primary/20 shadow-lg'
            : 'bg-background-dark/50 backdrop-blur-md'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <motion.div
                className="flex items-center cursor-pointer relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl md:text-2xl font-bold">
                  <span className="text-white">Watch</span>
                  <span className="bg-gradient-hero bg-clip-text text-transparent">Pulse</span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Blog Link */}
              <Link href="/blog">
                <motion.div
                  className="flex items-center gap-2 text-text-primary hover:text-brand-gold transition-colors font-medium group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-5 h-5 text-brand-primary group-hover:text-brand-gold transition-colors" />
                  <span>{getText('nav.blog')}</span>
                </motion.div>
              </Link>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2">
                <motion.a
                  href={`https://mail.google.com/mail/?view=cm&to=${SOCIAL_LINKS.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={getText('contact.email')}
                >
                  <Mail className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
                </motion.a>

                <motion.a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="X (Twitter)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </motion.a>

                <motion.a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="TikTok"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </motion.a>

                <motion.a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={getText('contact.instagram')}
                >
                  <Instagram className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors" />
                </motion.a>
              </div>

              {/* Language Switcher */}
              {!hideLanguageSwitcher && (
                <motion.button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-5 h-5" />
                  <span>{language === 'tr' ? 'EN' : 'TR'}</span>
                </motion.button>
              )}

              {/* Download Button */}
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600/30"
                disabled
                whileHover={{ scale: 1.02 }}
              >
                <Smartphone className="w-5 h-5" />
                <span>{getText('nav.comingSoon')}</span>
              </motion.button>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Blog Link - Mobile */}
              <Link href="/blog">
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                  <span className="text-sm font-semibold text-text-primary">{getText('nav.blog')}</span>
                </motion.div>
              </Link>

              {/* Language Switcher - Mobile */}
              {!hideLanguageSwitcher && (
                <motion.button
                  onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
                  className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="w-5 h-5 text-brand-primary" />
                </motion.button>
              )}

              {/* Hamburger Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative z-10 p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-brand-primary" />
                ) : (
                  <Menu className="w-6 h-6 text-brand-primary" />
                )}
              </motion.button>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Mobile Menu Overlay - Only Social Media */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-16 left-0 right-0 bottom-0 bg-background-dark z-40 lg:hidden overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <Container className="py-8">
                <div className="flex flex-col gap-4">
                  {/* Download Button */}
                  <motion.button
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-600/30 text-gray-400 cursor-not-allowed border border-gray-600/30"
                    disabled
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-lg font-semibold">
                      {getText('nav.comingSoon')}
                    </span>
                  </motion.button>

                  {/* Divider */}
                  <div className="h-px bg-brand-primary/20 my-2" />

                  {/* Social Links */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider px-4">
                      Connect
                    </h3>

                    <a
                      href={`https://mail.google.com/mail/?view=cm&to=${SOCIAL_LINKS.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-background-card hover:bg-brand-primary/10 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Mail className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors" />
                      <span className="text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        Email
                      </span>
                    </a>

                    <a
                      href={SOCIAL_LINKS.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-background-card hover:bg-brand-primary/10 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        X (Twitter)
                      </span>
                    </a>

                    <a
                      href={SOCIAL_LINKS.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-background-card hover:bg-brand-primary/10 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors fill-current"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                      <span className="text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        TikTok
                      </span>
                    </a>

                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl bg-background-card hover:bg-brand-primary/10 transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Instagram className="w-6 h-6 text-brand-primary group-hover:text-brand-accent transition-colors" />
                      <span className="text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                        Instagram
                      </span>
                    </a>
                  </div>
                </div>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
