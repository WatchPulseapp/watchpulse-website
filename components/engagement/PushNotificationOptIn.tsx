'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Sparkles } from 'lucide-react';

export default function PushNotificationOptIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);

      // Show prompt after 30 seconds if not already decided
      const dismissed = localStorage.getItem('pushNotificationDismissed');
      const subscribed = localStorage.getItem('pushNotificationSubscribed');

      if (!dismissed && !subscribed && Notification.permission === 'default') {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 30000); // 30 saniye sonra göster

        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Simüle edilmiş başarılı abonelik
        localStorage.setItem('pushNotificationSubscribed', 'true');

        // Teşekkür mesajı göster
        new Notification('WatchPulse 🎬', {
          body: 'You\'ll be the first to know when we launch!',
          icon: '/icon-192.png',
          badge: '/icon-192.png'
        });

        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Push notification error:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pushNotificationDismissed', 'true');
  };

  if (!isSupported || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-24 right-6 z-[55] max-w-sm"
      >
        <div className="bg-background-card rounded-2xl border border-brand-primary/30 p-5 shadow-xl shadow-brand-primary/10">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {permission === 'granted' ? (
            // Success state
            <div className="text-center py-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold">You&apos;re all set!</h4>
              <p className="text-text-secondary text-sm mt-1">
                We&apos;ll notify you when WatchPulse launches
              </p>
            </div>
          ) : (
            // Request state
            <>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="text-white font-semibold mb-1">
                    Don&apos;t miss the launch! 🚀
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Get notified when WatchPulse is ready. Be the first to discover movies based on your mood.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-2 rounded-lg border border-brand-primary/30 text-text-secondary text-sm font-medium hover:bg-brand-primary/10 transition-colors"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleSubscribe}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4" />
                  Notify me
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
