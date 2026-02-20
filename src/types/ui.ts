export interface Actor {
    id: number;
    name: string;
    image: string;
    role: string;
}

export interface Episode {
    id: number;
    title: string;
    season: number;
    episode: number;
    type: string;
    aired?: string;
    img?: string;
    description?: string;
}

export interface ImageSet {
    verticalPoster?: { w480?: string; w720?: string };
    horizontalPoster?: { w1080?: string };
}

export interface Movie {
    id: number | string; // Normalized ID for store compatibility
    title: string;
    imdbId: string; // Storing Simkl ID or Slug as ID
    tmdbId?: string;
    overview?: string;
    releaseYear: number;
    genres?: { id: string; name: string }[];
    rating?: number;
    runtime?: number;
    contentRating?: string;
    trailer?: string;
    keywords?: string[];
    type?: 'movie' | 'tv' | 'anime';
    imageSet?: ImageSet;
    year?: string; // Legacy support
    poster?: string; // Legacy
    fanart?: string; // Legacy
}

export interface Recommendation {
    id: number;
    title: string;
    poster: string;
    year?: string;
    rating?: number;
    runtime?: string;
}

export interface MovieDetails extends Movie {
    tagline?: string;
    director?: string;
    budget?: string;
    revenue?: string;
    cast: Actor[]; // Normalized to Actor objects
    recommendations?: Recommendation[];
    // Explicitly define imageSet for details as required
    imageSet: {
        verticalPoster: { w720: string; w480?: string };
        horizontalPoster: { w1080: string };
    };
}

export interface SeriesDetail {
    id: number;
    title: string;
    year?: string;
    poster?: string;
    fanart?: string;
    overview?: string;
    rating?: number;
    runtime?: number; // minutes
    totalEpisodes?: number;
    network?: string;
    country?: string;
    status?: string; // e.g., "Returning Series", "Ended"
    genres: string[];
    cast: Actor[];
    seasons: Record<number, Episode[]>; // Dictionary for O(1) season lookup
    trailer?: string;
    imageSet?: ImageSet;
}

// Union type for shared components (HeroHeader, ActionBar)
export type MediaItem = SeriesDetail | MovieDetails;

// Type guard to distinguish MovieDetails from SeriesDetail
export const isMovie = (media: MediaItem): media is MovieDetails => 'budget' in media || 'revenue' in media;

export interface Collection {
    id: string;        // UUID
    title: string;     // e.g. "My Watchlist"
    isDefault?: boolean; // True for the main "Watchlist" (cannot be deleted)
    items: MediaItem[]; // Array of movies/shows (Reuse existing MediaItem type)
    createdAt: number;
}
