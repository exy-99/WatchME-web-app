import { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { getContentRows, getHeroMovies } from '../services/api';
import type { Movie } from '../types/ui';

const Home = () => {
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [newReleases, setNewReleases] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="flex items-center justify-center h-96 text-gray-400">Loading movies...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section (Basic Carousel Placeholder) */}
            <section className="relative h-[400px] w-full overflow-hidden rounded-2xl mb-8">
                {heroMovies[0] && (
                    <div className="absolute inset-0">
                        <img
                            src={heroMovies[0].imageSet?.horizontalPoster?.w1080}
                            alt={heroMovies[0].title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 space-y-4 max-w-2xl">
                            <h1 className="text-4xl font-bold drop-shadow-lg">{heroMovies[0].title}</h1>
                            <p className="line-clamp-3 text-gray-200 drop-shadow-md">{heroMovies[0].overview}</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Trending Row */}
            <section>
                <h2 className="text-2xl font-bold mb-4 px-2 border-l-4 border-indigo-500">Top Rated</h2>
                <div className="flex overflow-x-auto gap-4 py-2 px-1 pb-4 scrollbar-hide snap-x">
                    {topRated.map(movie => (
                        <div key={movie.imdbId} className="snap-start">
                            <MediaCard item={movie} />
                        </div>
                    ))}
                </div>
            </section>

            {/* New Releases Row */}
            <section>
                <h2 className="text-2xl font-bold mb-4 px-2 border-l-4 border-purple-500">New Releases</h2>
                <div className="flex overflow-x-auto gap-4 py-2 px-1 pb-4 scrollbar-hide snap-x">
                    {newReleases.map(movie => (
                        <div key={movie.imdbId} className="snap-start">
                            <MediaCard item={movie} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
