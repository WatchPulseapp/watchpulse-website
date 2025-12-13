import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-gradient-hero text-white hover:shadow-lg hover:shadow-brand-primary/50 hover:scale-105',
    secondary: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    disabled: 'bg-gray-600/50 text-gray-400 cursor-not-allowed border border-gray-600/30',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
