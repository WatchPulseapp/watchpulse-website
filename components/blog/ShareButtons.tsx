'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://watchpulseapp.com/blog/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied; the X link below still works.
    }
  };

  const base =
    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="journal-eyebrow mr-1" style={{ color: 'var(--ink-faint)' }}>
        Share
      </span>

      <button
        onClick={copyLink}
        className={base}
        style={{
          borderColor: copied ? 'var(--accent-line)' : 'var(--rule)',
          color: copied ? 'var(--accent)' : 'var(--ink-soft)',
        }}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? 'Link copied' : 'Copy link'}
      </button>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&via=watchpulseapp`}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        style={{ borderColor: 'var(--rule)', color: 'var(--ink-soft)' }}
      >
        {/* X's mark is not in lucide, so it is drawn inline. */}
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M18.9 1.9h3.4l-7.4 8.5 8.7 11.7h-6.8l-5.3-7-6.1 7H2l7.9-9.1L1.6 1.9h7l4.8 6.4 5.5-6.4Zm-1.2 18.1h1.9L7.4 3.9H5.4l12.3 16.1Z" />
        </svg>
        Post
      </a>
    </div>
  );
}
