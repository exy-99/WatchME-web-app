import axios from 'axios';
import type { Movie, MovieDetails } from '../types/ui';
import { generateCacheKey, getCachedData, setCachedData } from './cache';

// --- Configuration ---
const VITE_SIMKL_CLIENT_ID = import.meta.env.VITE_SIMKL_CLIENT_ID;

const simklClient = axios.create({
    baseURL: '/api/simkl',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Direct Simkl CDN (proxy was causing intermittent failures)
const IMAGE_BASE = 'https://simkl.in';

// --- Internal Types for Simkl ---
interface SimklItem {
    title: string;
    year?: number;
    ids: {
        simkl_id?: number;
        simkl?: number; // Sometimes it's 'simkl'
        slug?: string;
        imdb?: string;
        tmdb?: string;
    };
    poster?: string; // e.g., "12/12688617391bf69f62"
    fanart?: string;
    overview?: string;
    ratings?: {
        simkl?: {
            rating?: number;
            votes?: number;
        };
        imdb?: {
            rating?: number;
            votes?: number;
        };
    };
    runtime?: string | number; // "2h 11m" or minutes
    genres?: string[];
    trailer?: string; // YouTube ID
    director?: string;
    actors?: string[]; // Not always present directly in list
}

// --- Helper Functions ---

const getPosterUrl = (path?: string, _size: 'w' | 'm' | 'poster' = 'poster') => {
    // Simkl poster paths are like "12/126886..."
    // Proxy format: https://wsrv.nl/?url=https://simkl.in/posters/{path}_m.webp
    if (!path) return 'https://via.placeholder.com/300x450?text=No+Poster';
    return `${IMAGE_BASE}/posters/${path}_m.webp`;
}

const getFanartUrl = (path?: string) => {
    if (!path) return 'https://via.placeholder.com/1080x600?text=No+Image';
    return `${IMAGE_BASE}/fanart/${path}_medium.webp`;
}

const mapSimklToMovie = (item: SimklItem): Movie => ({
    id: item.ids.simkl_id || item.ids.simkl || item.ids.slug || Math.random(),
    title: item.title,
    imdbId: String(item.ids.simkl_id || item.ids.simkl), // Use Simkl ID as the main ID
    tmdbId: item.ids.tmdb,
    releaseYear: item.year || new Date().getFullYear(),
    overview: item.overview,
    rating: item.ratings?.simkl?.rating || item.ratings?.imdb?.rating,
    genres: item.genres?.map(g => ({ id: g, name: g })) || [],
    trailer: item.trailer ? `https://www.youtube.com/watch?v=${item.trailer}` : undefined,
    type: 'movie',
    imageSet: {
        verticalPoster: {
            w480: getPosterUrl(item.poster, 'm'),
            w720: getPosterUrl(item.poster, 'poster')
        },
        horizontalPoster: {
            w1080: getFanartUrl(item.fanart)
        },
    },
});

const mapSimklToDetails = (item: SimklItem): MovieDetails => ({
    ...mapSimklToMovie(item),
    cast: [], // Simkl 'summary' endpoint doesn't return cast by default, requires credits endpoint or similar if available
    director: item.director,
    imageSet: {
        verticalPoster: {
            w720: getPosterUrl(item.poster, 'poster'),
            w480: getPosterUrl(item.poster, 'm')
        },
        horizontalPoster: {
            w1080: getFanartUrl(item.fanart)
        },
    },
});

// --- API Functions ---

// Wrapper to handle errors
const fetchSimkl = async <T>(endpoint: string, params: any = {}): Promise<T | null> => {
    const cacheKey = generateCacheKey(endpoint, { ...params, client_id: VITE_SIMKL_CLIENT_ID });

    // 1. Try to get from cache
    const cached = await getCachedData<T>(cacheKey);
    if (cached) {
        console.log(`⚡ Serving from cache: ${endpoint}`);
        return cached;
    }

    try {
        const response = await simklClient.get<T>(endpoint, { params: { ...params, client_id: VITE_SIMKL_CLIENT_ID } });

        // 2. Save to cache on success
        if (response.data) {
            await setCachedData(cacheKey, response.data);
        }

        return response.data;
    } catch (error: any) {
        if (error.response) {
            if (error.response.status === 401) {
                console.error('❌ Simkl API Unauthorized. Check VITE_SIMKL_CLIENT_ID.');
            } else if (error.response.status === 429) {
                console.warn('⚠️ Simkl API Rate Limit Reached.');
            } else {
                console.error(`❌ Simkl API Error (${error.response.status}):`, error.message);
            }
        } else {
            console.error('❌ Simkl Network Error:', error.message);
        }
        return null;
    }
};

// 1. Hero Movies (Trending Today)
export const getHeroMovies = async (): Promise<Movie[]> => {
    // Trending today
    const data = await fetchSimkl<SimklItem[]>('/movies/trending', { wltime: 'today', extended: 'overview,metadata,tmdb,genres,trailer' });
    if (!data) return [];
    return data.slice(0, 5).map(mapSimklToMovie);
};

// 2. Content Rows
export const getTopRatedMovies = async (): Promise<Movie[]> => {
    // Using trending sorted by rank as a proxy for "Top Rated" since /movies/best might be invalid
    // Simkl API documentation suggests /movies/trending with filters
    const data = await fetchSimkl<SimklItem[]>('/movies/trending', { sort: 'rank', extended: 'overview,metadata,tmdb,genres,poster,fanart' });
    if (!data) return [];
    return data.slice(0, 10).map(mapSimklToMovie);
};

export const getNewReleases = async (): Promise<Movie[]> => {
    // Trending this week
    const data = await fetchSimkl<SimklItem[]>('/movies/trending', { wltime: 'week', extended: 'overview,metadata,tmdb,genres,poster,fanart' });
    if (!data) return [];
    return data.slice(0, 10).map(mapSimklToMovie);
};

// 2. Content Rows (Legacy/Current)
export const getContentRows = async () => {
    console.log('🔄 Fetching Content Rows from Simkl...');
    const [topRated, newReleases] = await Promise.all([
        getTopRatedMovies(),
        getNewReleases(),
    ]);
    return { topRated, newReleases };
};

// 3. Movie Details
export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
    console.log(`Getting details for Simkl ID: ${id}`);
    // id is expected to be simkl_id
    const data = await fetchSimkl<SimklItem>(`/movies/${id}`, { extended: 'full' });
    if (!data) return null;
    return mapSimklToDetails(data);
};

export const getMovieByImdbId = getMovieDetails;

// 4. Search
export const searchMovies = async (query: string, page: number = 1): Promise<{ results: Movie[]; totalPages: number }> => {
    try {
        // Direct axios call (instead of fetchSimkl) so we can read pagination headers
        const response = await simklClient.get<SimklItem[]>('/search/movie', {
            params: {
                q: query,
                page,
                limit: 20,
                extended: 'overview,metadata,genres,poster,tmdb',
                client_id: VITE_SIMKL_CLIENT_ID,
            },
        });

        const data = response.data;
        const totalPages = parseInt(response.headers['x-pagination-page-count'] ?? '1', 10) || 1;

        if (!data || data.length === 0) return { results: [], totalPages };

        // Map initial results
        const movies = data.map(mapSimklToMovie);

        // Enrich the top 10 results with full details to get genres
        const enriched = await enrichMoviesWithDetails(movies.slice(0, 10));

        return { results: [...enriched, ...movies.slice(10)], totalPages };
    } catch (error) {
        console.error('[API] searchMovies error:', error);
        return { results: [], totalPages: 1 };
    }
};

// Helper to enrich movies with full details (for genres)
const enrichMoviesWithDetails = async (movies: Movie[]): Promise<Movie[]> => {
    const promises = movies.map(async (movie) => {
        try {
            // Use the existing getMovieDetails which calls /movies/{id} with extended=full
            const details = await getMovieDetails(movie.imdbId); // imdbId here stores Simkl ID
            if (details) {
                return details; // Details has full genres
            }
            return movie;
        } catch (e) {
            console.warn(`[API] Failed to enrich movie: ${movie.title}`, e);
            return movie;
        }
    });

    return Promise.all(promises);
};

// 5. Genre Support
export const getMoviesByGenre = async (genre: string, page: number = 1): Promise<Movie[]> => {
    // Simkl Genre API: /movies/genres/{genre}/...
    // Converting genre to lowercase/slug format if needed.
    const genreSlug = genre.toLowerCase().replace(/\s+/g, '-');
    const data = await fetchSimkl<SimklItem[]>(`/movies/genres/${genreSlug}/all-types/all-countries/all-years/rank`, { limit: 50, page, extended: 'overview,metadata,tmdb,genres,poster,fanart' });
    if (!data) return [];

    // Filter out items without posters to ensure UI quality
    return data
        .filter(item => item.poster && item.poster !== "")
        .slice(0, 20)
        .map(mapSimklToMovie);
};


// --- Stubs/Compat for other exported functions ---

export const getGenres = async (): Promise<string[]> => [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

export const getMoviesByKeywords = async (query: string) => (await searchMovies(query)).results;
export const getMoviesOrderByRating = getTopRatedMovies;
export const getMoviesOrderByPopularity = getHeroMovies;
// Simkl doesn't have direct "by year" simple endpoint without genre/filter combo, simplified stub
export const getMoviesByYear = async (_year: string) => [];
export const getMoviesByContentRating = async (_rating: string) => [];
export const getKeywordsByMovieId = async (_id: string) => [];
export const getCastByMovieId = async (_id: string) => [];

// Series Stubs (Can be implemented similarly if needed)
export const getSeriesByImdbId = async (_id: string) => null;
export const getSeriesByTitle = async (_title: string) => [];
export const getSeriesByKeywords = async (_keyword: string) => [];
export const getSeriesByGenre = async (_genre: string) => [];
export const getSeriesByYear = async (_year: string) => [];
export const getSeriesByActorId = async (_actorId: string) => [];
export const getSeriesOrderByRating = async () => [];
export const getSeriesOrderByPopularity = async () => [];
export const getKeywordsBySeriesId = async (_id: string) => [];
export const getMoreLikeThisBySeriesId = async (_id: string) => [];
export const getEpisodeById = async (_id: string) => null;

// Actor Stubs
export const getActorDetailsById = async (_id: string) => null;
export const getActorIdByName = async (_name: string) => null;
export const getActorBioById = async (_id: string) => null;
export const getMoviesKnownForByActorId = async (_id: string) => [];
export const getSeriesKnownForByActorId = async (_id: string) => [];
export const getAllRolesByActorId = async (_id: string) => [];

export const getSimilarMovies = async (query: string) => (await searchMovies(query)).results; // Fallback
export const getSimilarSeries = async (_query: string) => [];

// 6. Generic Fetch for MediaFeed
export const fetchMoviesFromPath = async (path: string, params: Record<string, any> = {}): Promise<Movie[]> => {
    // Some paths in CATEGORY_MAP might already have query params (e.g., ?interval=week)
    // Axios handles this correctly when passed as the URL.
    // We add specific params like `extended` to ensure we get images/metadata.
    const data = await fetchSimkl<SimklItem[]>(path, {
        extended: 'overview,metadata,tmdb,genres,poster,fanart',
        ...params
    });
    if (!data) return [];
    return data.slice(0, 20).map(mapSimklToMovie);
};
