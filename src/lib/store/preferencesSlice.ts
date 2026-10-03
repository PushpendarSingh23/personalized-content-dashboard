import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences, CategoryType, SourceType, ThemeMode, ViewMode, LanguageCode } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  categories: ['technology', 'finance', 'sports', 'entertainment', 'health', 'science', 'ai'],
  sources: ['news', 'recommendation', 'social', 'podcast'],
  theme: 'dark',
  language: 'en',
  viewMode: 'grid',
  autoRefresh: true,
  refreshInterval: 25,
  soundEffects: true,
  density: 'comfortable',
  customOrder: [],
};

// Load saved preferences if in browser
const loadInitialPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const saved = localStorage.getItem('user_dashboard_preferences');
    if (saved) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to parse saved preferences from localStorage:', e);
  }
  return DEFAULT_PREFERENCES;
};

const initialState: UserPreferences = loadInitialPreferences();

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<CategoryType>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        // Prevent removing all categories
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== category);
        }
      } else {
        state.categories.push(category);
      }
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      if (action.payload.length > 0) {
        state.categories = action.payload;
      }
    },
    toggleSource: (state, action: PayloadAction<SourceType>) => {
      const source = action.payload;
      if (state.sources.includes(source)) {
        if (state.sources.length > 1) {
          state.sources = state.sources.filter((s) => s !== source);
        }
      } else {
        state.sources.push(source);
      }
    },
    setSources: (state, action: PayloadAction<SourceType[]>) => {
      if (action.payload.length > 0) {
        state.sources = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.language = action.payload;
    },
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    setSoundEffects: (state, action: PayloadAction<boolean>) => {
      state.soundEffects = action.payload;
    },
    setDensity: (state, action: PayloadAction<'comfortable' | 'compact'>) => {
      state.density = action.payload;
    },
    setCustomOrder: (state, action: PayloadAction<string[]>) => {
      state.customOrder = action.payload;
    },
    resetPreferences: () => {
      return DEFAULT_PREFERENCES;
    },
  },
});

export const {
  toggleCategory,
  setCategories,
  toggleSource,
  setSources,
  setTheme,
  setLanguage,
  setViewMode,
  setAutoRefresh,
  setRefreshInterval,
  setSoundEffects,
  setDensity,
  setCustomOrder,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
