import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import MediaCard from '../components/MediaCard';
import { searchMovies } from '../services/api';
import type { Movie } from '../types/ui';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

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
        <div className="max-w-4xl mx-auto space-y-8">
            <form onSubmit={handleSearch} className="relative group">
                <input
                    type="text"
                    placeholder="Search movies, TV shows, anime..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-4 pl-12 pr-6 text-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-500"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </form>

            <div className="min-h-[50vh]">
                {loading ? (
                    <div className="text-center text-gray-500 py-12">Searching Simkl...</div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {results.map(movie => (
                            <MediaCard key={movie.imdbId} item={movie} width="w-full" height="h-64" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 py-12">
                        {query ? 'No results found.' : 'Start typing to find your next obsession.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
