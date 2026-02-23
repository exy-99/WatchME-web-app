import { Play, Share2, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FastAverageColor } from 'fast-average-color';
import { getMovieDetails } from '../services/api';
import { useCollectionsStore } from '../store/collections';
import { useReducedMotion } from '../hooks/useReducedMotion';
import GenreChip from '../components/ui/GenreChip';
import GlassCard from '../components/ui/GlassCard';
import type { MovieDetails } from '../types/ui';

const MediaDetails = () => {
    const { id } = useParams<{ id: string }>();
    const prefersReducedMotion = useReducedMotion();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; color: string }>>([]);
    const [trailerPlaying, setTrailerPlaying] = useState(false);
    const [ambientColor, setAmbientColor] = useState('rgba(124, 58, 237, 0.3)');
    const posterImgRef = useRef<HTMLImageElement>(null);

    // Zustand store
    const { isItemInAnyCollection, addItem, collections } = useCollectionsStore();

    useEffect(() => {
        if (!id) return;
        const fetchDetails = async () => {
            setLoading(true);
            const data = await getMovieDetails(id);
            setMovie(data);
            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading details...</div>;
    if (!movie) return <div className="text-center py-20 text-red-400">Movie not found.</div>;

    const bgImage = movie.imageSet?.horizontalPoster?.w1080;
    const posterImage = movie.imageSet?.verticalPoster?.w720;
    const isSaved = isItemInAnyCollection(typeof movie.id === 'string' ? parseInt(movie.id, 10) : movie.id);
    const defaultWatchlist = collections.find(c => c.isDefault);

    // Confetti burst animation
    const createConfetti = () => {
        const colors = ['#7C3AED', '#EC4899', '#F59E0B', '#06B6D4'];
        const newConfetti = Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const velocity = 3 + Math.random() * 2;
            return {
                id: i,
                x: 0,
                y: 0,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
        });
        setConfetti(newConfetti);

        // Clear confetti after animation
        setTimeout(() => setConfetti([]), 1500);
    };

    // Extract color from poster for ambient glow
    const handlePosterLoad = async () => {
        if (!posterImgRef.current) return;
        try {
            const fac = new FastAverageColor();
            const color = await fac.getColor(posterImgRef.current);
            setAmbientColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.3)`);
        } catch (error) {
            console.error('Failed to extract color:', error);
            setAmbientColor('rgba(124, 58, 237, 0.3)');
        }
    };

    // Save to watchlist
    const handleSaveToWatchlist = () => {
        if (!movie || !defaultWatchlist) return;
        addItem(defaultWatchlist.id, movie);
        createConfetti();
    };

    return (
        <div>
            {/* Backdrop */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    height: '55vh',
                }}
            >
                <img
                    src={bgImage}
                    alt={`${movie.title} backdrop`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        filter: 'blur(2px)',
                        transform: 'scale(1.05)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, #0A0A0F 100%)',
                        pointerEvents: 'none',
                    }}
                />
            </div>

            {/* Content Area with 2 Columns */}
            <div className="px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex gap-8 -mt-20 relative z-10">
                    {/* Left Column - Poster */}
                    <motion.div
                        className="shrink-0 w-56 hidden md:block relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        {/* Ambient Glow Background */}
                        <div
                            className="absolute inset-0 rounded-2xl"
                            style={{
                                background: `radial-gradient(ellipse at 30% 50%, ${ambientColor} 0%, transparent 70%)`,
                                opacity: 0.6,
                                transition: 'background 1s ease',
                                filter: 'blur(20px)',
                            }}
                        />
                        <img
                            ref={posterImgRef}
                            src={posterImage}
                            alt={movie.title}
                            className="w-full rounded-2xl relative z-10"
                            onLoad={handlePosterLoad}
                            style={{
                                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.8)',
                            }}
                        />
                    </motion.div>

                    {/* Right Column - Content in GlassCard */}
                    <div className="flex-1 mt-8">
                        <GlassCard padding="lg">
                            <div className="space-y-6">
                                {/* Title */}
                                <h1
                                    className="font-display text-white leading-tight"
                                    style={{
                                        fontSize: 'clamp(36px, 5vw, 64px)',
                                    }}
                                >
                                    {movie.title}
                                </h1>

                                {/* Meta Row - Year, Runtime, Rating */}
                                <div
                                    className="flex items-center gap-2 flex-wrap"
                                    style={{
                                        fontSize: '14px',
                                        color: '#9CA3AF',
                                    }}
                                >
                                    {movie.year && (
                                        <>
                                            <span>{movie.year}</span>
                                            <span>•</span>
                                        </>
                                    )}
                                    {movie.runtime && (
                                        <>
                                            <span>{movie.runtime}</span>
                                            <span>•</span>
                                        </>
                                    )}
                                    {movie.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star size={14} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                                            <span style={{ color: '#F9FAFB' }}>{movie.rating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Genre Chips */}
                                {movie.genres && movie.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre) => (
                                            <GenreChip
                                                key={genre.id}
                                                label={genre.name}
                                                active={false}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Overview */}
                                <p
                                    className="leading-relaxed"
                                    style={{
                                        fontSize: '15px',
                                        color: '#D1D5DB',
                                        maxWidth: '600px',
                                        lineHeight: '1.7',
                                    }}
                                >
                                    {movie.overview}
                                </p>

                                {/* Action Buttons */}
                                <div className="relative flex gap-3 pt-4">
                                    {/* Watch Trailer Button */}
                                    <button
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '999px',
                                            padding: '14px 32px',
                                            color: 'white',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s',
                                        }}
                                        className="hover:bg-[rgba(255,255,255,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                        aria-label={`Watch trailer for ${movie.title}`}
                                    >
                                        <Play size={16} fill="white" />
                                        Watch Trailer
                                    </button>

                                    {/* Save to Watchlist Button - Primary CTA */}
                                    <button
                                        onClick={handleSaveToWatchlist}
                                        style={{
                                            background: isSaved
                                                ? 'linear-gradient(to right, rgba(124, 58, 237, 0.2), rgba(236, 72, 153, 0.2))'
                                                : 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                            border: isSaved ? '1px solid rgba(124, 58, 237, 0.5)' : 'none',
                                            borderRadius: '999px',
                                            padding: '14px 32px',
                                            color: 'white',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s',
                                        }}
                                        className="hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                        aria-label={isSaved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {isSaved ? (
                                                <motion.div
                                                    key="saved"
                                                    initial={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : 180 }}
                                                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                                                >
                                                    <BookmarkCheck size={16} fill="white" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="unsaved"
                                                    initial={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : 180 }}
                                                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                                                >
                                                    <Bookmark size={16} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                        {isSaved ? 'Saved to Watchlist' : 'Save to Watchlist'}
                                    </button>

                                    {/* Share Button */}
                                    <button
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '999px',
                                            padding: '14px 20px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                        }}
                                        className="hover:bg-[rgba(255,255,255,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
                                        aria-label="Share this movie"
                                    >
                                        <Share2 size={16} />
                                    </button>

                                    {/* Confetti Effect */}
                                    {confetti.map((particle) => (
                                        <motion.div
                                            key={particle.id}
                                            className="absolute pointer-events-none rounded-full"
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            animate={{
                                                x: prefersReducedMotion ? 0 : particle.vx * 100,
                                                y: prefersReducedMotion ? 0 : particle.vy * 100,
                                                opacity: 0,
                                                scale: 0,
                                            }}
                                            transition={{
                                                duration: prefersReducedMotion ? 0.01 : 1.5,
                                                ease: 'easeOut',
                                            }}
                                            style={{
                                                width: '6px',
                                                height: '6px',
                                                backgroundColor: particle.color,
                                                left: '50%',
                                                top: '50%',
                                                marginLeft: '-3px',
                                                marginTop: '-3px',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* Cast & Details Section */}
            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trailer Section */}
                    <section>
                        <h3 className="font-display text-3xl text-white mb-6 pb-3 border-b-4 border-brand-purple" style={{ fontSize: '36px' }}>
                            Trailer
                        </h3>
                        <div
                            className="relative rounded-3xl overflow-hidden"
                            style={{
                                aspectRatio: '16 / 9',
                                background: '#0A0A0F',
                            }}
                        >
                            <iframe
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '16px',
                                }}
                                src={trailerPlaying ? 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1' : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                                title="Movie Trailer"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />

                            {/* Play Overlay */}
                            <AnimatePresence>
                                {!trailerPlaying && (
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        style={{
                                            background: 'rgba(10, 10, 15, 0.6)',
                                            backdropFilter: 'blur(4px)',
                                            WebkitBackdropFilter: 'blur(4px)',
                                        }}
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => setTrailerPlaying(true)}
                                    >
                                        <motion.button
                                            className="rounded-full flex items-center justify-center"
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Play size={32} fill="white" color="white" />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* Overview Section */}
                    <section>
                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Overview</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{movie.overview}</p>
                    </section>

                    {/* Cast Section */}
                    {movie.cast && movie.cast.length > 0 && (
                        <section>
                            <h3 className="font-display text-3xl text-white mb-6 pb-3 border-b-4 border-brand-purple" style={{ fontSize: '36px' }}>
                                Cast
                            </h3>
                            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                                {movie.cast.map((actor) => (
                                    <motion.div
                                        key={actor.id}
                                        className="shrink-0 flex flex-col items-center gap-3 text-center"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-brand-purple/20">
                                            <img
                                                src={actor.image}
                                                alt={actor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <motion.p
                                            className="text-sm font-bold text-white w-24 line-clamp-2"
                                            whileHover={{ color: '#C4B5FD' }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {actor.name}
                                        </motion.p>
                                        <p className="text-xs text-text-muted w-24 line-clamp-2" style={{ color: '#9CA3AF' }}>
                                            {actor.role}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Director</span>
                            <p className="font-medium">{movie.director || 'Unknown'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Budget</span>
                            <p className="font-medium">{movie.budget || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500 text-xs uppercase tracking-wider">Revenue</span>
                            <p className="font-medium">{movie.revenue || 'N/A'}</p>
                        </div>
                        {movie.tagline && (
                            <div className="pt-4 border-t border-white/5">
                                <p className="italic text-gray-400 text-sm">"{movie.tagline}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaDetails;
