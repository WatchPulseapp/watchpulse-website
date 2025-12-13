'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Container from './Container';
import { cn } from '@/lib/utils';
import { Smartphone, Globe, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-2xl font-bold">
                <span className="text-white">Watch</span>
                <span className="bg-gradient-hero bg-clip-text text-transparent">Pulse</span>
              </span>
            </motion.div>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-6">
            {/* Blog Link */}
            <Link href="/blog">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-brand-primary/10 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen className="w-5 h-5 text-brand-primary group-hover:text-brand-gold transition-colors" />
                <span className="font-semibold text-text-primary group-hover:text-brand-gold transition-colors">
                  Blog
                </span>
              </motion.div>
            </Link>

            <div className="h-6 w-px bg-brand-primary/20" /> {/* Divider */}

            <div className="flex items-center gap-4">
            {/* Language Switcher */}
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

            {/* Download Button (Disabled) */}
            <motion.button
              className={cn(
                'relative px-6 py-3 rounded-full font-semibold',
                'bg-gray-600/50 text-gray-400 cursor-not-allowed',
                'border border-gray-600/30'
              )}
              disabled
              whileHover={{ scale: 1.02 }}
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {t('nav.comingSoon')}
              </span>
            </motion.button>
            </div>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
