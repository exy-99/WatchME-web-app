import { Calendar, Clock, Play, Plus, Share2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../services/api';
import type { MovieDetails } from '../types/ui';

const MediaDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="-mt-6"> {/* Negative margin to offset container padding for hero effect */}
            {/* Hero Background */}
            <div className="relative h-[60vh] w-full">
                <div className="absolute inset-0">
                    <img
                        src={bgImage}
                        alt=""
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 container mx-auto flex items-end gap-8">
                    {/* Poster (Hidden on mobile, visible on tablet+) */}
                    <div className="hidden md:block w-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0">
                        <img src={posterImage} alt={movie.title} className="w-full h-auto" />
                    </div>

                    <div className="space-y-6 max-w-2xl mb-8">
                        <h1 className="text-5xl font-bold leading-tight drop-shadow-2xl">{movie.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300">
                            {movie.rating && (
                                <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                                    <Star size={16} fill="currentColor" />
                                    <span>{movie.rating.toFixed(1)}</span>
                                </div>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Calendar size={16} />
                                {movie.year}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={16} />
                                {movie.runtime}
                            </span>
                            <div className="flex gap-2">
                                {movie.genres?.map(g => (
                                    <span key={g.id} className="px-2 py-1 bg-white/10 rounded-md text-xs backdrop-blur-md border border-white/5">
                                        {g.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                                <Play size={20} fill="currentColor" />
                                Watch Trailer
                            </button>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium backdrop-blur-md transition-all">
                                <Plus size={20} />
                                Add to List
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Overview</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{movie.overview}</p>
                    </section>

                    {movie.cast && movie.cast.length > 0 && (
                        <section>
                            <h3 className="text-xl font-semibold mb-4 text-gray-200">Cast</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {movie.cast.map(actor => (
                                    <div key={actor.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                            <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white line-clamp-1">{actor.name}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{actor.role}</p>
                                        </div>
                                    </div>
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
