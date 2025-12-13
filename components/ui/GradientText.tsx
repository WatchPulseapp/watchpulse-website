import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  gradient?: 'hero' | 'primary' | 'accent';
}

export default function GradientText({
  children,
  className,
  gradient = 'hero'
}: GradientTextProps) {
  const gradients = {
    hero: 'bg-gradient-hero',
    primary: 'bg-gradient-primary',
    accent: 'bg-gradient-accent',
  };

  return (
    <span
      className={cn(
        'bg-clip-text text-transparent inline-block',
        gradients[gradient],
        className
      )}
      style={{
        paddingBottom: '0.2em',
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone'
      }}
    >
      {children}
    </span>
  );
}
