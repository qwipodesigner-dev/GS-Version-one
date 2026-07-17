import React, { createContext, useContext, useState, useCallback } from 'react';
import { seedRecentSearches } from '../data/catalog';
import { Persona } from '../search/personalize';

type Ctx = {
  recent: string[];
  addRecent: (q: string) => void;
  clearRecent: () => void;
  persona: Persona;
};

const SearchCtx = createContext<Ctx | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [recent, setRecent] = useState<string[]>(seedRecentSearches);
  // Who the retailer is, inferred rather than toggled. The app opens with seeded
  // history (existing retailer); clearing it drops to the new-retailer state and
  // stays there — searching again builds recents but not an order history.
  const [returning, setReturning] = useState(seedRecentSearches.length > 0);

  const addRecent = useCallback((q: string) => {
    const query = q.trim();
    if (!query) return;
    setRecent((prev) => [query, ...prev.filter((r) => r.toLowerCase() !== query.toLowerCase())].slice(0, 12));
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    setReturning(false);
  }, []);

  const persona: Persona = returning ? 'existing' : 'new';

  return (
    <SearchCtx.Provider value={{ recent, addRecent, clearRecent, persona }}>
      {children}
    </SearchCtx.Provider>
  );
}

export function useSearch(): Ctx {
  const c = useContext(SearchCtx);
  if (!c) throw new Error('useSearch must be used within SearchProvider');
  return c;
}
