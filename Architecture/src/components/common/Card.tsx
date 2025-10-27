import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Card({ children, className, gradient }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200',
        gradient && 'bg-gradient-to-br from-blue-50 to-purple-50',
        className
      )}
    >
      {children}
    </div>
  );
}
