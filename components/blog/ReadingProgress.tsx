'use client';

import { useEffect, useState } from 'react';

/**
 * A hairline at the top of the viewport showing how far through the article the
 * reader is. Deliberately 2px and a single flat colour — the previous
 * three-stop gradient drew attention to the chrome instead of the text.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min((window.scrollY / scrollable) * 100, 100) : 0);
    };

    // Coalesced into a frame so a fast scroll does not queue a state update per
    // scroll event.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Scaled, not resized. Animating width lays the bar out again on every
          frame of every scroll; a transform is handed to the compositor and
          never touches layout. Same hairline, none of the main-thread work. */}
      <div
        className="h-full w-full origin-left transition-transform duration-75 ease-out"
        style={{ transform: `scaleX(${progress / 100})`, backgroundColor: 'var(--accent)' }}
      />
    </div>
  );
}
