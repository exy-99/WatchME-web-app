import { useEffect, useState, useRef, type CSSProperties, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import GenreChip from '../components/ui/GenreChip';
import { getContentRows, getHeroMovies } from '../services/api';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Movie } from '../types/ui';

// ── Reusable scroll row wrapper ────────────────────────────────────────────
const ScrollRow = ({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isRowHovered, setIsRowHovered] = useState(false);

    const updateScrollState = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
    };

    const arrowStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(10,10,15,0.9)',
        border: '1px solid rgba(124,58,237,0.4)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsRowHovered(true)}
            onMouseLeave={() => setIsRowHovered(false)}
        >
            {/* Left arrow */}
            <motion.button
                aria-label="Scroll left"
                onClick={() => scroll('left')}
                style={{ ...arrowStyle, left: 0 }}
                animate={{ opacity: isRowHovered && canScrollLeft ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                tabIndex={canScrollLeft ? 0 : -1}
            >
                <ChevronLeft size={20} />
            </motion.button>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 py-2 px-1 pb-4 scrollbar-hide snap-x"
                role="list"
                aria-label={ariaLabel}
                onScroll={updateScrollState}
            >
                {children}
            </div>

            {/* Right arrow */}
            <motion.button
                aria-label="Scroll right"
                onClick={() => scroll('right')}
                style={{ ...arrowStyle, right: 0 }}
                animate={{ opacity: isRowHovered && canScrollRight ? 1 : 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                tabIndex={canScrollRight ? 0 : -1}
            >
                <ChevronRight size={20} />
            </motion.button>

            {/* Right edge fade gradient */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '80px',
                    height: '100%',
                    background: 'linear-gradient(to right, transparent, #0A0A0F)',
                    pointerEvents: 'none',
                    zIndex: 5,
                }}
            />
        </div>
    );
};

// ────────────────────────────────────────────────────────────────────────────
const Home = () => {
    const prefersReducedMotion = useReducedMotion();
    const navigate = useNavigate();
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
                            className="absolute left-[5%] flex flex-col justify-end gap-6"
                            style={{
                                bottom: '15%',
                                maxHeight: '60%',
                            }}
                        >
                            {/* Genre Chips — always above title */}
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
                                className="font-display text-white"
                                style={{
                                    fontSize: 'clamp(32px, 5vw, 80px)',
                                    maxWidth: '80%',
                                    lineHeight: 1.05,
                                    wordBreak: 'break-word',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
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
                                className={heroMovies[activeIndex].title.length > 20 ? 'line-clamp-2' : 'line-clamp-3'}
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
                        className="absolute flex gap-2 justify-center flex-shrink-0"
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
                <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-2xl font-bold border-l-4 border-indigo-500 pl-2">Top Rated</h2>
                    <motion.button
                        onClick={() => navigate('/search?category=top-rated')}
                        className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                        style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Inter, sans-serif', padding: '4px 0' }}
                        initial={{ color: '#9CA3AF' }}
                        whileHover="hover"
                        animate={{ color: '#9CA3AF' }}
                        variants={{ hover: { color: '#7C3AED' } }}
                    >
                        <span>View All</span>
                        <motion.span
                            variants={{ hover: { x: 4 } }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronRight size={16} />
                        </motion.span>
                    </motion.button>
                </div>
                <ScrollRow ariaLabel="Top Rated movies">
                    {topRated.map(movie => (
                        <div key={movie.imdbId} className="snap-start" role="listitem">
                            <MediaCard item={movie} width="w-[225px]" height="h-[338px]" />
                        </div>
                    ))}
                </ScrollRow>
            </section>

            {/* New Releases Row */}
            <section>
                <div className="flex justify-between items-center mb-4 px-2">
                    <h2 className="text-2xl font-bold border-l-4 border-purple-500 pl-2">New Releases</h2>
                    <motion.button
                        onClick={() => navigate('/search?category=new-releases')}
                        className="flex items-center gap-1 bg-transparent border-none cursor-pointer"
                        style={{ fontSize: '14px', fontWeight: '500', fontFamily: 'Inter, sans-serif', padding: '4px 0' }}
                        initial={{ color: '#9CA3AF' }}
                        whileHover="hover"
                        animate={{ color: '#9CA3AF' }}
                        variants={{ hover: { color: '#7C3AED' } }}
                    >
                        <span>View All</span>
                        <motion.span
                            variants={{ hover: { x: 4 } }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <ChevronRight size={16} />
                        </motion.span>
                    </motion.button>
                </div>
                <ScrollRow ariaLabel="New release movies">
                    {newReleases.map(movie => (
                        <div key={movie.imdbId} className="snap-start" role="listitem">
                            <MediaCard item={movie} width="w-[225px]" height="h-[338px]" />
                        </div>
                    ))}
                </ScrollRow>
            </section>
        </div>
    );
};

export default Home;
