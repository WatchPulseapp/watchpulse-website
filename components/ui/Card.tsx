import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'bg-background-card rounded-xl p-6 border border-brand-primary/10',
        hover && 'hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
