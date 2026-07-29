'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Container from './Container';
import { cn } from '@/lib/utils';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  hideLanguageSwitcher?: boolean;
  forceEnglish?: boolean;
}

const NAV_LINKS = [
  { key: 'nav.features', href: '/#features' },
  // The string and the section existed; the link between them did not, so the
  // social band was unreachable from the nav.
  { key: 'nav.social', href: '/#social' },
  { key: 'nav.howItWorks', href: '/#how-it-works' },
  { key: 'nav.faq', href: '/#faq' },
  { key: 'nav.blog', href: '/blog' },
];

const EN_FALLBACKS: Record<string, string> = {
  'nav.features': 'Features',
  'nav.social': 'Social',
  'nav.howItWorks': 'How It Works',
  'nav.faq': 'FAQ',
  'nav.blog': 'Blog',
  'nav.download': 'Download',
};

export default function Header({ hideLanguageSwitcher = false, forceEnglish = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language: contextLanguage, setLanguage, t: contextT } = useLanguage();
  const language = forceEnglish ? 'en' : contextLanguage;
  const t = (key: string) => (forceEnglish ? EN_FALLBACKS[key] ?? contextT(key) : contextT(key));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background-deep/90 backdrop-blur-2xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        )}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={36} height={36} className="rounded-lg" />
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                <span className="text-white">Watch</span>
                <span className="text-gradient-pulse">Pulse</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7" aria-label="Main">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {!hideLanguageSwitcher && (
              <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-background-card/60 py-1 pl-3 pr-1 backdrop-blur-md">
                <Globe className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                <div className="relative flex items-center text-xs font-semibold">
                  {(['tr', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        'relative rounded-full px-3.5 py-1.5 uppercase transition-colors duration-300',
                        language === lang ? 'text-white' : 'text-text-muted hover:text-text-primary'
                      )}
                      aria-pressed={language === lang}
                    >
                      {language === lang && (
                        <motion.span
                          layoutId="lang-pill"
                          className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{lang}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden bg-background-deep/95 backdrop-blur-xl pt-24 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3.5 text-lg font-medium text-text-primary hover:bg-white/5"
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {!hideLanguageSwitcher && (
              <div className="mt-6 px-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background-card/60 py-1 pl-3 pr-1">
                  <Globe className="h-4 w-4 text-text-muted" aria-hidden="true" />
                  <div className="relative flex items-center text-sm font-semibold">
                    {(['tr', 'en'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          'relative rounded-full px-4 py-2 uppercase transition-colors duration-300',
                          language === lang ? 'text-white' : 'text-text-muted'
                        )}
                        aria-pressed={language === lang}
                      >
                        {language === lang && (
                          <motion.span
                            layoutId="lang-pill-mobile"
                            className="absolute inset-0 rounded-full bg-gradient-primary shadow-glow"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{lang}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
