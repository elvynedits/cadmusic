import { create } from 'zustand';
import { Song } from './playerStore';
import { API_ENDPOINTS } from '../config/apiConfig';

interface SearchState {
  searchQuery: string;
  searchResults: Song[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchQuery: '',
  searchResults: [],
  isSearching: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  performSearch: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isSearching: true });
    try {
      const response = await fetch(API_ENDPOINTS.SEARCH_MUSIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      set({ searchResults: data.results || [], isSearching: false });
    } catch (error) {
      console.error('Search failed:', error);
      set({ searchResults: [], isSearching: false });
    }
  },

  clearSearch: () => set({ searchQuery: '', searchResults: [], isSearching: false }),
}));
