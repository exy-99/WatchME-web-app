const CACHE_PREFIX = 'movie_app_web_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CacheEntry<T> {
    timestamp: number;
    data: T;
}

/**
 * Generates a unique cache key for a given endpoint and params.
 */
export const generateCacheKey = (endpoint: string, params: any = {}): string => {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${JSON.stringify(params[key])}`) // simple serialization
        .join('&');
    return `${CACHE_PREFIX}${endpoint}?${sortedParams}`;
};

/**
 * Retrieves data from the cache if it exists and is valid.
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
    try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue != null) {
            const entry: CacheEntry<T> = JSON.parse(jsonValue);
            const now = Date.now();

            if (now - entry.timestamp < CACHE_DURATION) {
                // Cache is valid
                return entry.data;
            } else {
                // Cache expired, remove it (fire and forget)
                localStorage.removeItem(key);
                return null;
            }
        }
        return null;
    } catch (e) {
        console.warn('Error reading from cache', e);
        return null;
    }
};

/**
 * Saves data to the cache with the current timestamp.
 */
export const setCachedData = async <T>(key: string, data: T): Promise<void> => {
    try {
        const entry: CacheEntry<T> = {
            timestamp: Date.now(),
            data,
        };
        localStorage.setItem(key, JSON.stringify(entry));
    } catch (e) {
        console.warn('Error saving to cache', e);
    }
};

/**
 * Clears all app-specific cache keys.
 */
export const clearAppCache = async (): Promise<void> => {
    try {
        const keys = await Promise.resolve(Object.keys(localStorage)); // async signature compat
        const appKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
        appKeys.forEach(key => localStorage.removeItem(key));
        console.log('App cache cleared.');
    } catch (e) {
        console.error('Error clearing app cache:', e);
    }
}
