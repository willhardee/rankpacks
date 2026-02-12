import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50',
  ghost: 'bg-transparent text-indigo-700 hover:bg-indigo-50'
};

export function Button({ className, children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
