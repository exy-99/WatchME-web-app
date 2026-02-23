import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

interface AnimatedRatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedRating({ value, size = 'md' }: AnimatedRatingProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const displayValue = useTransform(motionValue, (v) => parseFloat(v.toFixed(1)));

  // Get color based on rating
  const getRatingColor = (val: number) => {
    if (val >= 7.5) return '#22C55E'; // green
    if (val >= 6.0) return '#F59E0B'; // gold
    return '#EF4444'; // red
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { fontSize: '12px', iconSize: 12, gap: '4px' };
      case 'lg':
        return { fontSize: '18px', iconSize: 18, gap: '6px' };
      case 'md':
      default:
        return { fontSize: '14px', iconSize: 14, gap: '4px' };
    }
  };

  const sizeStyles = getSizeStyles();
  const ratingColor = getRatingColor(value);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for viewport detection
  useEffect(() => {
    if (prefersReducedMotion || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate from 0 to value over 600ms
          animate(motionValue, value, {
            duration: 0.6,
            ease: 'easeOut',
          });
          setHasAnimated(true);

          // Show pulse after animation
          setTimeout(() => {
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 300);
          }, 600);

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion, hasAnimated, motionValue, value]);

  // If reduced motion, set to final value immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value);
      setHasAnimated(true);
    }
  }, [prefersReducedMotion, value, motionValue]);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1"
      style={{
        gap: `${sizeStyles.gap}`,
      }}
    >
      {/* Star Icon with Pulse */}
      <AnimatePresence mode="wait">
        {showPulse ? (
          <motion.div
            key="pulse"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            exit={{ scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Star
              size={sizeStyles.iconSize}
              fill={ratingColor}
              style={{ color: ratingColor }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="static"
            initial={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Star
              size={sizeStyles.iconSize}
              fill={ratingColor}
              style={{ color: ratingColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Rating Value */}
      <motion.span
        style={{
          fontSize: `${sizeStyles.fontSize}`,
          color: ratingColor,
          fontWeight: '600',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {displayValue}
      </motion.span>
    </div>
  );
}
