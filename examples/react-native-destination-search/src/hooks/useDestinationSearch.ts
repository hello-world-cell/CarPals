import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchOneMapSuggestions } from '../api/fetchOneMapSuggestions';
import { fetchGooglePlaceSuggestions } from '../api/fetchGoogleSuggestions';
import type { Destination } from '../types/destination';

export type SearchProvider = 'onemap' | 'google' | 'onemap_then_google';

export type UseDestinationSearchOptions = {
  /** OneMap access token (Authorization header value) */
  onemapToken?: string;
  /** Google Places API key (client-side only for demos) */
  googleApiKey?: string;
  /** Which API(s) to call */
  provider?: SearchProvider;
  debounceMs?: number;
  /** Minimum characters before requesting */
  minQueryLength?: number;
};

export function useDestinationSearch(options: UseDestinationSearchOptions = {}) {
  const {
    onemapToken,
    googleApiKey,
    provider = 'onemap',
    debounceMs = 350,
    minQueryLength = 2,
  } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Destination | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  const selectDestination = useCallback((d: Destination) => {
    setSelected(d);
    setQuery(d.title);
    setSuggestions([]);
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(null);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < minQueryLength) {
      abortRef.current?.abort();
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      const myId = ++requestIdRef.current;

      setLoading(true);
      setError(null);

      try {
        let list: Destination[] = [];

        if (provider === 'google') {
          if (!googleApiKey) throw new Error('Google Places API key missing');
          list = await fetchGooglePlaceSuggestions(q, googleApiKey, ac.signal);
        } else if (provider === 'onemap') {
          if (!onemapToken) throw new Error('OneMap token missing');
          list = await fetchOneMapSuggestions(q, onemapToken, ac.signal);
        } else {
          /* onemap_then_google */
          if (onemapToken) {
            try {
              list = await fetchOneMapSuggestions(q, onemapToken, ac.signal);
            } catch {
              list = [];
            }
          }
          if (!list.length) {
            if (!googleApiKey) {
              if (!onemapToken) throw new Error('Provide OneMap token and/or Google API key');
            } else {
              list = await fetchGooglePlaceSuggestions(q, googleApiKey, ac.signal);
            }
          }
        }

        if (myId !== requestIdRef.current || ac.signal.aborted) return;
        setSuggestions(list);
      } catch (e: unknown) {
        if (ac.signal.aborted || myId !== requestIdRef.current) return;
        const msg = e instanceof Error ? e.message : 'Search failed';
        setError(msg);
        setSuggestions([]);
      } finally {
        if (!ac.signal.aborted && myId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [
    query,
    debounceMs,
    minQueryLength,
    provider,
    onemapToken,
    googleApiKey,
  ]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    []
  );

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    selected,
    selectDestination,
    clearSuggestions,
    clearSelection,
  };
}
