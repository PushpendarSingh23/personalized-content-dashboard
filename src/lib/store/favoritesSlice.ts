import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from '@/types';

export interface FavoritesState {
  items: ContentItem[];
}

const loadInitialFavorites = (): ContentItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('user_dashboard_favorites');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse favorites from localStorage:', e);
  }
  return [];
};

const initialState: FavoritesState = {
  items: loadInitialFavorites(),
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const exists = state.items.some((f) => f.id === item.id);
      if (exists) {
        state.items = state.items.filter((f) => f.id !== item.id);
      } else {
        state.items.unshift(item);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
