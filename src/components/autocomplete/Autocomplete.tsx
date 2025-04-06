import { useState, useEffect } from 'react';
import './Autocomplete.css';
import { fetchLocations } from '../../utils/api';

export default function Autocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await fetchLocations(query);
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }, 500); // Debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a city..."
      />
      {loading && <div className="loading">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => setQuery(item.name)}>
              {item.name}, {item.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}