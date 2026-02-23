import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../components/MediaCard';
import GenreChip from '../components/ui/GenreChip';
import { getContentRows, getHeroMovies } from '../services/api';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Movie } from '../types/ui';

const Home = () => {
    const prefersReducedMotion = useReducedMotion();
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [newReleases, setNewReleases] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [hero, rows] = await Promise.all([
                    getHeroMovies(),
                    getContentRows()
                ]);
                setHeroMovies(hero);
                setTopRated(rows.topRated);
                setNewReleases(rows.newReleases);
            } catch (error) {
                console.error("Failed to load home data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-cycling effect
    useEffect(() => {
        const startCycle = () => {
            intervalRef.current = setInterval(() => {
                setActiveIndex((prevIndex) => (prevIndex + 1) % 5);
            }, 6000);
        };

        const pauseCycle = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        if (!isHovering && heroMovies.length > 0) {
            startCycle();
        } else {
            pauseCycle();
        }

        return () => pauseCycle();
    }, [isHovering, heroMovies.length]);

    if (loading) {
        return <div className="flex items-center justify-center h-96 text-gray-400">Loading movies...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            {heroMovies.length > 0 && (
                <section
                    className="relative min-h-125 w-full overflow-hidden"
                    style={{
                        height: '70vh',
                        borderRadius: '0 0 24px 24px',
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                        >
                            {/* Background Image */}
                            <img
                                src={heroMovies[activeIndex].imageSet?.horizontalPoster?.w1080 || 'https://via.placeholder.com/1920x1080'}
                                alt={`${heroMovies[activeIndex].title} backdrop`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Gradient Overlay - Left to Right */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to right, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.5) 50%, transparent 100%)',
                                    pointerEvents: 'none',
                                }}
                            />

                            {/* Gradient Overlay - Bottom Fade */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(to top, #0A0A0F 0%, transparent 40%)',
                                    pointerEvents: 'none',
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`content-${activeIndex}`}
                            className="absolute left-[5%] flex flex-col gap-6"
                            style={{
                                bottom: '15%',
                            }}
                        >
                            {/* Genre Chips */}
                            {heroMovies[activeIndex].genres && heroMovies[activeIndex].genres.length > 0 && (
                                <motion.div
                                    className="flex flex-wrap gap-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {heroMovies[activeIndex].genres.slice(0, 3).map((genre) => (
                                        <GenreChip
                                            key={genre.id}
                                            label={genre.name}
                                            active={false}
                                        />
                                    ))}
                                </motion.div>
                            )}

                            {/* Title */}
                            <motion.h1
                                className="font-display text-white leading-tight"
                                style={{
                                    fontSize: 'clamp(48px, 8vw, 96px)',
                                    maxWidth: '600px',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {heroMovies[activeIndex].title}
                            </motion.h1>

                            {/* Overview */}
                            <motion.p
                                className="text-text-muted line-clamp-3"
                                style={{
                                    fontSize: '15px',
                                    color: '#D1D5DB',
                                    maxWidth: '480px',
                                    marginTop: '0px',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                            >
                                {heroMovies[activeIndex].overview}
                            </motion.p>

                            {/* Button Row */}
                            <motion.div
                                className="flex gap-3 pt-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                {/* Watch Trailer Button */}
                                <button
                                    style={{
                                        background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                        borderRadius: '999px',
                                        padding: '12px 28px',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                    }}
                                    className="hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                    aria-label={`Watch trailer for ${heroMovies[activeIndex].title}`}
                                >
                                    ▶ Watch Trailer
                                </button>

                                {/* Add to Watchlist Button */}
                                <button
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '999px',
                                        padding: '12px 28px',
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    className="hover:border-[rgba(255,255,255,0.4)] hover:bg-white/5 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                >
                                    + Add to Watchlist
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Dots (Bottom Center) */}
                    <div
                        className="absolute flex gap-2 justify-center"
                        style={{
                            bottom: '24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}
                        role="group"
                        aria-label="Hero slide navigation"
                    >
                        {[0, 1, 2, 3, 4].map((index) => (
                            <motion.button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                style={{
                                    height: '6px',
                                    background: index === activeIndex ? '#7C3AED' : 'rgba(124, 58, 237, 0.3)',
                                    borderRadius: '999px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    transition: 'all 0.3s ease',
                                }}
                                className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                initial={{ width: '6px' }}
                                animate={{ width: index === activeIndex ? '28px' : '6px' }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: prefersReducedMotion ? 10 : 25,
                                    duration: prefersReducedMotion ? 0.01 : 0.3,
                                }}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === activeIndex ? 'true' : 'false'}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Trending Row */}
            <section>
                <h2 className="text-2xl font-bold mb-4 px-2 border-l-4 border-indigo-500">Top Rated</h2>
                <div className="flex overflow-x-auto gap-4 py-2 px-1 pb-4 scrollbar-hide snap-x" role="list" aria-label="Top Rated movies">
                    {topRated.map(movie => (
                        <div key={movie.imdbId} className="snap-start" role="listitem">
                            <MediaCard item={movie} />
                        </div>
                    ))}
                </div>
            </section>

            {/* New Releases Row */}
            <section>
                <h2 className="text-2xl font-bold mb-4 px-2 border-l-4 border-purple-500">New Releases</h2>
                <div className="flex overflow-x-auto gap-4 py-2 px-1 pb-4 scrollbar-hide snap-x" role="list" aria-label="New release movies">
                    {newReleases.map(movie => (
                        <div key={movie.imdbId} className="snap-start" role="listitem">
                            <MediaCard item={movie} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
