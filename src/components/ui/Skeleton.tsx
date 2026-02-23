import clsx from 'clsx';

interface SkeletonProps {
  variant?: 'card' | 'hero' | 'text';
  width?: string;
  className?: string;
}

export default function Skeleton({
  variant = 'text',
  width = '100%',
  className,
}: SkeletonProps) {
  const shimmerClasses = clsx(
    'bg-bg-surface2 bg-gradient-to-r from-bg-surface2 via-bg-surface to-bg-surface2',
    'bg-[length:200%_100%] animate-shimmer',
    className
  );

  if (variant === 'card') {
    return (
      <div
        className={clsx('w-45 h-67.5 rounded-lg', shimmerClasses)}
      />
    );
  }

  if (variant === 'hero') {
    return (
      <div className={clsx('w-full h-125', shimmerClasses)} />
    );
  }

  // text variant
  return (
    <div
      className={clsx('h-4 rounded', shimmerClasses)}
      style={{ width }}
    />
  );
}
