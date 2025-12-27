'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, CheckCircle, Loader2 } from 'lucide-react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('You\'re on the list! We\'ll keep you updated.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 bg-gradient-to-br from-brand-primary/20 via-background-card to-brand-accent/10 rounded-2xl border border-brand-primary/30 p-8 text-center"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent mb-4">
        <Sparkles className="w-7 h-7 text-white" />
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        Never Miss a Great Movie Again
      </h3>

      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Join 10,000+ movie lovers getting personalized recommendations,
        hidden gems, and exclusive content delivered to their inbox.
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background-dark border-2 border-brand-primary/20 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold hover:shadow-lg hover:shadow-brand-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Subscribe
              </>
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-red-400 text-sm">{message}</p>
      )}

      <p className="mt-4 text-xs text-text-muted">
        No spam, unsubscribe anytime. We respect your privacy.
      </p>
    </motion.div>
  );
}
