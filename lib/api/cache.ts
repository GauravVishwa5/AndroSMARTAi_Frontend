/**
 * Client-Side Local Caching Utility
 * Prevents redundant HTTP requests on tab switching and fast navigation.
 * Persists in sessionStorage / localStorage with configurable TTL.
 */

interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const localCache = {
  get: <T = any>(key: string): T | null => {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Try sessionStorage first, then localStorage
      const item = sessionStorage.getItem(key) || localStorage.getItem(key);
      if (!item) return null;

      const envelope: CacheEnvelope<T> = JSON.parse(item);
      const now = Date.now();

      // Check if expired
      if (now - envelope.timestamp > envelope.ttlMs) {
        sessionStorage.removeItem(key);
        localStorage.removeItem(key);
        return null;
      }

      return envelope.data;
    } catch (e) {
      console.warn(`[LocalCache] Failed to read key ${key}:`, e);
      return null;
    }
  },

  set: <T = any>(key: string, data: T, ttlMinutes: number = 5, persistent: boolean = false): void => {
    if (typeof window === 'undefined') return;

    try {
      const envelope: CacheEnvelope<T> = {
        data,
        timestamp: Date.now(),
        ttlMs: ttlMinutes * 60 * 1000,
      };
      const serialized = JSON.stringify(envelope);

      if (persistent) {
        localStorage.setItem(key, serialized);
      } else {
        sessionStorage.setItem(key, serialized);
      }
    } catch (e) {
      console.warn(`[LocalCache] Failed to write key ${key}:`, e);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  },

  invalidatePattern: (pattern: string | RegExp): void => {
    if (typeof window === 'undefined') return;

    try {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

      // Scan sessionStorage
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k && regex.test(k)) {
          sessionStorage.removeItem(k);
        }
      }

      // Scan localStorage
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && regex.test(k)) {
          localStorage.removeItem(k);
        }
      }
    } catch (e) {
      // ignore
    }
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.clear();
    } catch (e) {
      // ignore
    }
  },
};

export default localCache;
