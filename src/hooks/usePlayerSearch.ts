import { useState, useCallback, useEffect } from 'react';
import { Player } from '../types/autocomplete';

// API key from environment variable
const API_KEY = "39884195-b501-4caa-b2d3-704cfc80b1f0";

export function usePlayerSearch() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch players based on search term
  useEffect(() => {
    // Allow searching with just one character
    if (!searchTerm) {
      setPlayers([]);
      return;
    }

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(searchTerm)}&per_page=10`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid API response format');
        }

        setPlayers(data.data);
      } catch (err) {
        console.error('Error fetching players:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch players');
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call with a shorter delay for better responsiveness
    const timeoutId = setTimeout(() => {
      fetchPlayers();
    }, 200); // Reduced from 300ms to 200ms for better responsiveness

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const search = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return { players, loading, error, search };
} 