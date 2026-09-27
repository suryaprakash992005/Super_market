import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className,
}) => {
  const variantStyles = {
    primary: 'bg-brand-crimson-tint text-brand-crimson border-brand-crimson/20',
    success: 'bg-supermarket-fresh-tint text-supermarket-fresh border-supermarket-fresh/20',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    outline: 'bg-transparent text-obsidian border-surface-border',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded',
    md: 'text-xs px-2.5 py-1 font-medium rounded-md',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border uppercase tracking-wider',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
