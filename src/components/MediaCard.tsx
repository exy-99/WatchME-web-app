import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState } from 'react';
import type { Movie } from '../types/ui';
import Skeleton from './ui/Skeleton';
import AnimatedRating from './ui/AnimatedRating';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MediaCardProps {
    item: Movie;
    width?: string;
    height?: string;
}

const MediaCard = ({ item, width = 'w-36', height = 'h-56' }: MediaCardProps) => {
    const prefersReducedMotion = useReducedMotion();

    // Determine the best image
    const posterUrl = item.imageSet?.verticalPoster?.w480 ||
        item.imageSet?.verticalPoster?.w720 ||
        'https://via.placeholder.com/300x450?text=No+Poster';

    // Image loading state
    const [imageLoaded, setImageLoaded] = useState(false);

    // Hover state
    const [isHovered, setIsHovered] = useState(false);

    // 3D tilt motion values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Transform mouse position to rotation (±6 degrees)
    const rotateX = useTransform(mouseY, [-100, 100], [6, -6]);
    const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const x = e.clientX - rect.left - centerX;
        const y = e.clientY - rect.top - centerY;

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    const renderRating = () => {
        if (!item.rating) return null;
        return (
            <div
                className="absolute top-3 right-3 rounded-full px-2.5 py-1 flex items-center border"
                style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                }}
            >
                <AnimatedRating value={item.rating} size="sm" />
            </div>
        );
    };

    return (
        <Link
            to={`/details/movie/${item.imdbId}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] rounded-2xl"
        >
            <motion.div
                className={`relative shrink-0 ${width} cursor-pointer`}
                style={{ perspective: prefersReducedMotion ? 'none' : 800 }}
                whileHover={prefersReducedMotion ? {} : {
                    scale: 1.05,
                    y: -4,
                    zIndex: 10,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    duration: prefersReducedMotion ? 0.01 : 0.3,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >
                <motion.div
                    className={`relative ${height} rounded-2xl overflow-hidden flex flex-col`}
                    style={{
                        background: '#141420',
                        rotateX: prefersReducedMotion ? 0 : rotateX,
                        rotateY: prefersReducedMotion ? 0 : rotateY,
                        transformPerspective: prefersReducedMotion ? 'none' : 800,
                    }}
                    animate={{
                        boxShadow: isHovered
                            ? '0 0 30px rgba(124, 58, 237, 0.5), 0 8px 32px rgba(0, 0, 0, 0.8)'
                            : '0 4px 24px rgba(0, 0, 0, 0.6)',
                    }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                >
                {!imageLoaded && <Skeleton variant="card" />}

                <motion.img
                    src={posterUrl}
                    alt={`${item.title} poster`}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
                    animate={imageLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: prefersReducedMotion ? 1 : 0.97 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.4 }}
                />

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
                    }}
                />

                {renderRating()}

                {/* Slide-up Info Panel */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 px-3 py-4"
                    style={{
                        background: 'linear-gradient(to top, rgba(10, 10, 15, 0.98), rgba(10, 10, 15, 0.7))',
                    }}
                    initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
                    animate={isHovered ? { y: 0, opacity: 1 } : { y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                >
                    <h3 className="font-display text-white line-clamp-2" style={{ fontSize: '20px' }}>
                        {item.title}
                    </h3>
                    {item.releaseYear && (
                        <p className="text-text-muted" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                            {item.releaseYear}
                        </p>
                    )}
                </motion.div>
            </motion.div>

            {/* Bottom info (not on hover) */}
            <motion.div
                className="flex flex-col gap-1 mt-3"
                animate={isHovered ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                style={{ pointerEvents: isHovered ? 'none' : 'auto' }}
            >
                <h3 className="font-display text-lg text-white line-clamp-2" style={{ fontSize: '18px' }}>
                    {item.title}
                </h3>
                {item.releaseYear && (
                    <p className="text-text-muted" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                        {item.releaseYear}
                    </p>
                )}
            </motion.div>
            </motion.div>
        </Link>
    );
};

export default MediaCard;
