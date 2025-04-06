import { useState, useCallback } from 'react';
import { Player } from '../types/autocomplete';

const DEBOUNCE_DELAY = 300; // 300ms delay

export function usePlayerSearch() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const searchPlayers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setPlayers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }

      const data = await response.json();
      setPlayers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (query: string) => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      const newTimeoutId = window.setTimeout(() => {
        searchPlayers(query);
      }, DEBOUNCE_DELAY);
      setTimeoutId(newTimeoutId);
    },
    [timeoutId, searchPlayers]
  );

  return { players, loading, error, search: debouncedSearch };
} 