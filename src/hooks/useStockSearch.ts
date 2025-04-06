import { useState, useCallback } from 'react';
import { Stock } from '../types/autocomplete';
import { useDebounce } from './useDebounce';

const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v1/finance/search';

export function useStockSearch() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setStocks([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${YAHOO_FINANCE_API}?q=${encodeURIComponent(searchTerm)}&lang=en-US&region=US&quotesCount=10&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.quotes || !Array.isArray(data.quotes)) {
        throw new Error('Invalid API response format');
      }

      const formattedStocks: Stock[] = data.quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.longname || quote.shortname,
        exchange: quote.exchange,
        type: quote.quoteType,
        currency: quote.currency,
        region: quote.region,
        marketOpen: quote.regularMarketOpen,
        marketClose: quote.regularMarketClose,
        timezone: quote.timezone,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        previousClose: quote.regularMarketPreviousClose,
        volume: quote.regularMarketVolume,
        marketCap: quote.marketCap
      }));

      setStocks(formattedStocks);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const search = useCallback((searchTerm: string) => {
    debouncedSearch(searchTerm);
  }, [debouncedSearch]);

  return { stocks, loading, error, search };
} 