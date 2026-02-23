import { motion } from 'framer-motion';

interface GenreChipProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export default function GenreChip({
  label,
  onClick,
  active = false,
}: GenreChipProps) {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-bg-base"
      style={{
        background: active ? '#7C3AED' : 'rgba(124, 58, 237, 0.15)',
        border: `1px solid ${
          active ? '#7C3AED' : 'rgba(124, 58, 237, 0.3)'
        }`,
        color: active ? '#FFFFFF' : '#C4B5FD',
        boxShadow: active
          ? '0 0 20px rgba(124, 58, 237, 0.4)'
          : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}
