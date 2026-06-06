/**
 * Cache Management Utility
 * Provides caching functionality with TTL (Time-To-Live) support
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Get cached data if it exists and hasn't expired
 * @param key - Cache key
 * @returns Cached data if valid, null otherwise
 */
export const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now > entry.expiresAt) {
      sessionStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error(`Error reading cache for key "${key}":`, error);
    return null;
  }
};

/**
 * Set cache data with TTL
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttlMs - Time-to-live in milliseconds
 */
export const setCacheData = <T>(
  key: string,
  data: T,
  ttlMs: number
): void => {
  try {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error(`Error setting cache for key "${key}":`, error);
  }
};

/**
 * Clear specific cache entry
 * @param key - Cache key to clear
 */
export const clearCache = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing cache for key "${key}":`, error);
  }
};

/**
 * Clear all cache entries matching a pattern
 * @param pattern - Key pattern to match (e.g., "profile_*")
 */
export const clearCachePattern = (pattern: string): void => {
  try {
    const regex = new RegExp(pattern);
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && regex.test(key)) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error(`Error clearing cache pattern "${pattern}":`, error);
  }
};

/**
 * Get cache TTL in milliseconds from env variable
 * @param envVarName - Environment variable name
 * @param defaultMinutes - Default TTL in minutes if env var not set
 * @returns TTL in milliseconds
 */
export const getCacheTTL = (envVarName: string, defaultMinutes: number): number => {
  const envValue = import.meta.env[envVarName];
  if (envValue) {
    const minutes = parseInt(envValue, 10);
    if (!isNaN(minutes) && minutes > 0) {
      return minutes * 60 * 1000; // Convert minutes to milliseconds
    }
  }
  return defaultMinutes * 60 * 1000; // Default in milliseconds
};
