'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// The signature: the EKG line from the WatchPulse logo, drawn across the page.
// Flatline -> heartbeat -> flatline, fading from periwinkle into the logo's gold.
const PULSE_PATH =
  'M0,60 H420 L470,60 L490,42 L508,78 L526,10 L546,105 L566,60 L600,60 H1200';

export default function PulseLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      className={cn('w-full h-16 md:h-20', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pulse-gradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6B7FD7" stopOpacity="0" />
          <stop offset="0.25" stopColor="#6B7FD7" />
          <stop offset="0.55" stopColor="#A8B5DC" />
          <stop offset="0.8" stopColor="#F0C97E" />
          <stop offset="1" stopColor="#F0C97E" stopOpacity="0" />
        </linearGradient>
        <filter id="pulse-glow" x="-20%" y="-100%" width="140%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Glow underlay */}
      <motion.path
        d={PULSE_PATH}
        stroke="url(#pulse-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#pulse-glow)"
        initial={reduceMotion ? undefined : { pathLength: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.8, delay, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Main line */}
      <motion.path
        d={PULSE_PATH}
        stroke="url(#pulse-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? undefined : { pathLength: 0 }}
        whileInView={reduceMotion ? undefined : { pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.8, delay, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
