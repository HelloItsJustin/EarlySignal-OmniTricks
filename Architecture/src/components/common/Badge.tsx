import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'orange' | 'red' | 'blue' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ children, variant = 'gray', size = 'md' }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-800 border-green-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={cn('inline-flex items-center font-medium rounded-full border', variants[variant], sizes[size])}>
      {children}
    </span>
  );
}
