import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'green';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-[#E52324] text-white hover:bg-[#c91f20] shadow-lg shadow-[#E52324]/20':
              variant === 'primary' || variant === 'green',
            'bg-secondary text-secondary-foreground hover:bg-muted':
              variant === 'secondary',
            'hover:bg-white/5 text-foreground': variant === 'ghost',
            'border border-white/10 hover:bg-white/5 text-foreground':
              variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';