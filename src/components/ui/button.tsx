import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary: 'gradient-badge text-white shadow-lg hover:scale-[1.01] active:scale-[0.99]',
  secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50',
  ghost: 'bg-transparent text-primary hover:bg-violet-50'
};

export function Button({ className, children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-150 disabled:opacity-50 disabled:hover:scale-100',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
