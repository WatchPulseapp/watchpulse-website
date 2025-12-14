'use client';

import { motion } from 'framer-motion';
import { Share2, Twitter, Facebook, Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

export default function ShareButtons({
  url = 'https://watchpulseapp.com',
  title = 'WatchPulse - AI Movie Recommendations',
  description = 'Get personalized movie recommendations based on your mood!',
  compact = false
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=watchpulseapp`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary transition-colors font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </motion.button>

        {showShareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-2 right-0 bg-background-card rounded-xl p-3 shadow-2xl border border-brand-primary/20 z-50"
          >
            <div className="flex gap-2">
              <ShareButton
                href={shareLinks.twitter}
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
              />
              <ShareButton
                href={shareLinks.facebook}
                icon={<Facebook className="w-4 h-4" />}
                label="Facebook"
              />
              <ShareButton
                href={shareLinks.whatsapp}
                icon={<MessageCircle className="w-4 h-4" />}
                label="WhatsApp"
              />
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
                title="Copy Link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <LinkIcon className="w-4 h-4 text-brand-primary" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-text-primary">Share with friends</h3>
      <div className="flex flex-wrap gap-3">
        <ShareButton
          href={shareLinks.twitter}
          icon={<Twitter className="w-5 h-5" />}
          label="Twitter"
          large
        />
        <ShareButton
          href={shareLinks.facebook}
          icon={<Facebook className="w-5 h-5" />}
          label="Facebook"
          large
        />
        <ShareButton
          href={shareLinks.linkedin}
          icon={<Linkedin className="w-5 h-5" />}
          label="LinkedIn"
          large
        />
        <ShareButton
          href={shareLinks.whatsapp}
          icon={<MessageCircle className="w-5 h-5" />}
          label="WhatsApp"
          large
        />
        <motion.button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-card hover:bg-brand-primary/10 transition-colors border border-brand-primary/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-5 h-5 text-brand-primary" />
              <span className="text-sm font-medium text-text-primary">Copy Link</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function ShareButton({
  href,
  icon,
  label,
  large = false
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  large?: boolean;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 rounded-lg bg-background-card hover:bg-brand-primary/10 transition-colors border border-brand-primary/20 ${
        large ? 'px-4 py-2' : 'p-2'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-brand-primary">{icon}</span>
      {large && <span className="text-sm font-medium text-text-primary">{label}</span>}
    </motion.a>
  );
}
