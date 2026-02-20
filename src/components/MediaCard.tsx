import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types/ui';

interface MediaCardProps {
    item: Movie;
    width?: string;
    height?: string;
}

const MediaCard = ({ item, width = 'w-36', height = 'h-56' }: MediaCardProps) => {
    // Determine the best image
    const posterUrl = item.imageSet?.verticalPoster?.w480 ||
        item.imageSet?.verticalPoster?.w720 ||
        'https://via.placeholder.com/300x450?text=No+Poster';

    const renderRating = () => {
        if (!item.rating) return null;
        return (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{item.rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <Link
            to={`/details/movie/${item.imdbId}`}
            className={`group relative flex-shrink-0 ${width} flex flex-col gap-2 transition-transform duration-300 hover:scale-105`}
        >
            <div className={`relative ${height} rounded-xl overflow-hidden shadow-lg bg-gray-800`}>
                <img
                    src={posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    loading="lazy"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {renderRating()}
            </div>

            <div className="px-1">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
                    {item.title}
                </h3>
                {item.releaseYear && (
                    <p className="text-xs text-gray-400">{item.releaseYear}</p>
                )}
            </div>
        </Link>
    );
};

export default MediaCard;
