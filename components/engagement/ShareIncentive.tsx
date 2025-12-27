'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle, X, Gift } from 'lucide-react';

interface ShareIncentiveProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareIncentive({ isOpen, onClose }: ShareIncentiveProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = 'https://watchpulseapp.com?ref=share';
  const shareText = 'Check out WatchPulse - AI-powered movie recommendations based on your mood! Never waste time scrolling again.';

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2]',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
          >
            <div className="bg-background-card rounded-2xl border border-brand-primary/30 p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent mb-4">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Share & Get Early Access
                </h3>
                <p className="text-text-secondary text-sm">
                  Share WatchPulse with friends and move up the waitlist!
                </p>
              </div>

              {/* Share buttons */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} rounded-xl p-3 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
                  >
                    <link.icon className="w-6 h-6 text-white" />
                    <span className="text-xs text-white font-medium">{link.name}</span>
                  </a>
                ))}
              </div>

              {/* Copy link */}
              <div className="flex items-center gap-2 p-3 bg-background-dark rounded-xl border border-brand-primary/20">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-transparent text-text-secondary text-sm outline-none"
                />
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-medium hover:bg-brand-primary/30 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-xs text-text-muted mt-4">
                Each share moves you 5 spots up the waitlist!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Share button trigger component
export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-medium">Share & Get Rewards</span>
      </button>

      <ShareIncentive isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
