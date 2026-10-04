import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}

export function Button({ className, variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold shadow-sm transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy disabled:cursor-not-allowed disabled:opacity-55',
        variant === 'primary' && 'border border-[#5b1b32] bg-[#5b1b32] text-white hover:-translate-y-0.5 hover:bg-[#6d203c]',
        variant === 'secondary' && 'border border-rose/25 bg-white/70 text-[#5b1b32] hover:border-rose/45 hover:bg-white',
        variant === 'ghost' && 'text-[#5b1b32] hover:text-[#7c2d48]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
