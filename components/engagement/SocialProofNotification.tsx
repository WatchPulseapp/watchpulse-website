'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SocialProofNotification() {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', city: '' });
  const [dismissed, setDismissed] = useState(false);

  // Get names and cities based on language
  const getRandomPerson = () => {
    const names = language === 'tr'
      ? ['Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Elif', 'Hasan', 'Esra', 'Emre', 'Selin', 'Burak', 'Deniz', 'Can', 'Ece']
      : ['Alex', 'Sarah', 'Mike', 'Emma', 'James', 'Olivia', 'Daniel', 'Sophie', 'Chris', 'Isabella', 'David', 'Mia', 'John', 'Ava', 'Ryan', 'Grace'];

    const cities = language === 'tr'
      ? ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Gaziantep', 'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Samsun', 'Trabzon']
      : ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego', 'Dallas', 'Austin', 'Miami', 'Seattle', 'Denver', 'Boston', 'Atlanta', 'Portland'];

    return {
      name: names[Math.floor(Math.random() * names.length)],
      city: cities[Math.floor(Math.random() * cities.length)]
    };
  };

  useEffect(() => {
    // İlk gösterim için 5 saniye bekle
    const initialDelay = setTimeout(() => {
      if (!dismissed) {
        const person = getRandomPerson();
        setNotification(person);
        setIsVisible(true);
      }
    }, 5000);

    // Her 20-40 saniyede bir göster
    const interval = setInterval(() => {
      if (!dismissed) {
        const person = getRandomPerson();
        setNotification(person);
        setIsVisible(true);

        // 5 saniye sonra gizle
        setTimeout(() => setIsVisible(false), 5000);
      }
    }, Math.random() * 20000 + 20000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [dismissed, language]);

  // 5 saniye sonra ilk bildirimi kapat
  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  const justJoinedText = language === 'tr' ? 'az önce katıldı' : 'just joined';

  return (
    <AnimatePresence>
      {isVisible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs"
        >
          <div className="bg-background-card rounded-xl border border-brand-primary/30 p-4 shadow-xl shadow-brand-primary/10 flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {notification.name} ({notification.city})
              </p>
              <p className="text-xs text-text-muted">
                {justJoinedText} ✨
              </p>
            </div>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="p-1 text-text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
