import { Search as SearchIcon, Film } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaCard from '../components/MediaCard';
import Skeleton from '../components/ui/Skeleton';
import { searchMovies } from '../services/api';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Movie } from '../types/ui';

const Search = () => {
    const prefersReducedMotion = useReducedMotion();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const placeholderRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const placeholders = [
        'Search for a movie...',
        "Try 'Inception'...",
        'Find your next obsession...'
    ];

    // Typewriter placeholder cycling
    useEffect(() => {
        if (isFocused || query) return;

        placeholderRef.current = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);

        return () => {
            if (placeholderRef.current) clearInterval(placeholderRef.current);
        };
    }, [isFocused, query]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const data = await searchMovies(query);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="px-4 md:px-8 pt-8 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative">
                        <motion.div
                            animate={{
                                borderColor: isFocused ? 'rgba(124, 58, 237, 1)' : 'rgba(124, 58, 237, 0.3)',
                                boxShadow: isFocused
                                    ? '0 0 0 3px rgba(124, 58, 237, 0.2)'
                                    : '0 0 0 0px rgba(124, 58, 237, 0)',
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                background: 'rgba(30, 26, 58, 0.8)',
                                border: '1px solid',
                                borderRadius: '16px',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                            }}
                            className="flex items-center"
                        >
                            <SearchIcon
                                size={20}
                                className="absolute left-4 pointer-events-none"
                                style={{ color: '#9CA3AF' }}
                            />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder={!isFocused && !query ? placeholders[placeholderIndex] : ''}
                                className="w-full bg-transparent border-none outline-none text-white text-base px-4 py-4 pl-14"
                                style={{
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            />
                        </motion.div>
                    </form>
                </div>
            </div>

            {/* Results or Empty State */}
            <div className="flex-1 px-4 md:px-8 pb-12">
                {loading ? (
                    <div className="max-w-7xl mx-auto">
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: '20px',
                        }}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} variant="card" />
                            ))}
                        </div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="max-w-7xl mx-auto">
                        {/* Results Count Header */}
                        <motion.p
                            className="mb-6"
                            style={{
                                color: '#9CA3AF',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                marginBottom: '24px',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {results.length} results for '{query}'
                        </motion.p>

                        {/* Results Grid */}
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                                    gap: '20px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                                role="list"
                                aria-label="Search results"
                            >
                                {results.map((movie, index) => (
                                    <motion.div
                                        key={movie.imdbId}
                                        layout
                                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                                        transition={{
                                            duration: prefersReducedMotion ? 0.01 : 0.4,
                                            delay: prefersReducedMotion ? 0 : (index < 8 ? index * 0.05 : 0)
                                        }}
                                        role="listitem"
                                    >
                                        <MediaCard item={movie} width="w-full" height="h-64" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : query ? (
                    // No results state
                    <div className="h-full flex items-center justify-center">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <motion.div
                                className="mb-6 flex justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.05 }}
                            >
                                <Film
                                    size={80}
                                    style={{ color: '#9CA3AF', opacity: 0.5 }}
                                />
                            </motion.div>

                            <motion.h2
                                className="font-display font-bold mb-3"
                                style={{
                                    fontSize: '32px',
                                    color: '#F9FAFB',
                                    letterSpacing: '1px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                No results for '{query}'
                            </motion.h2>

                            <motion.p
                                className="text-base"
                                style={{
                                    color: '#9CA3AF',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                            >
                                Try a different title
                            </motion.p>
                        </motion.div>
                    </div>
                ) : (
                    // Empty state
                    <div className="h-full flex items-center justify-center">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="mb-6 flex justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <Film
                                    size={80}
                                    style={{ color: 'rgba(124, 58, 237, 0.4)' }}
                                />
                            </motion.div>

                            <motion.h2
                                className="font-display text-5xl font-bold mb-3"
                                style={{
                                    fontSize: '48px',
                                    background: 'linear-gradient(to right, #7C3AED, #EC4899)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '2px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Find Your Next Obsession
                            </motion.h2>

                            <motion.p
                                className="text-base"
                                style={{
                                    color: '#9CA3AF',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '16px',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Search across thousands of movies
                            </motion.p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
