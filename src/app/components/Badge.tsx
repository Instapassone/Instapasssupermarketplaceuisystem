import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'trending' | 'soldout' | 'live' | 'new' | 'default';
  className?: string;
}

const variantClasses = {
  trending: 'bg-red-600 text-white',
  soldout: 'bg-orange-600 text-white animate-pulse',
  live: 'bg-green-600 text-white',
  new: 'bg-blue-600 text-white',
  default: 'bg-[#1F2937] text-white/70',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
