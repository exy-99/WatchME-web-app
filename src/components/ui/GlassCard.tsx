import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export default function GlassCard({
  children,
  className,
  padding = 'md',
}: GlassCardProps) {
  const baseClasses = clsx(
    'backdrop-blur-[16px] rounded-2xl',
    paddingMap[padding]
  );

  const mergedClasses = twMerge(baseClasses, className);

  return (
    <div
      className={mergedClasses}
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {children}
    </div>
  );
}
