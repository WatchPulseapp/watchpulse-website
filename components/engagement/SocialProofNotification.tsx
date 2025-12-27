'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, X } from 'lucide-react';

// Gerçekçi isimler ve şehirler
const NAMES = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'James', 'Isabella', 'Oliver',
  'Mia', 'Benjamin', 'Charlotte', 'Elijah', 'Amelia', 'Lucas', 'Harper', 'Mason',
  'Ahmet', 'Mehmet', 'Ayşe', 'Fatma', 'Ali', 'Zeynep', 'Mustafa', 'Elif',
  'Yuki', 'Sakura', 'Hans', 'Maria', 'Pierre', 'Sophie', 'Carlos', 'Ana'
];

const CITIES = [
  'New York', 'Los Angeles', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney',
  'Toronto', 'Amsterdam', 'Dubai', 'Singapore', 'Seoul', 'Mumbai', 'São Paulo',
  'Istanbul', 'Ankara', 'Izmir', 'Barcelona', 'Milan', 'Stockholm', 'Vienna',
  'Chicago', 'Miami', 'San Francisco', 'Seattle', 'Austin', 'Denver', 'Boston'
];

const TIMES = ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago'];

export default function SocialProofNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({ name: '', city: '', time: '' });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // İlk gösterim için 5 saniye bekle
    const initialDelay = setTimeout(() => {
      if (!dismissed) {
        showRandomNotification();
      }
    }, 5000);

    // Her 20-40 saniyede bir göster
    const interval = setInterval(() => {
      if (!dismissed) {
        showRandomNotification();
      }
    }, Math.random() * 20000 + 20000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [dismissed]);

  const showRandomNotification = () => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    const time = TIMES[Math.floor(Math.random() * TIMES.length)];

    setNotification({ name, city, time });
    setIsVisible(true);

    // 5 saniye sonra gizle
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          className="fixed bottom-4 left-4 z-50 max-w-xs"
        >
          <div className="bg-background-card rounded-xl border border-brand-primary/20 shadow-lg shadow-brand-primary/10 p-4 flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">
                {notification.name} from {notification.city}
              </p>
              <p className="text-xs text-text-muted">
                joined the waitlist {notification.time}
              </p>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-text-muted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
