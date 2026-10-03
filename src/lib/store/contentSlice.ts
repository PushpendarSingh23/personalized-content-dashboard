import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, CategoryType, SourceType } from '@/types';
import { apiService, FetchFeedParams } from '@/services/apiService';
import { RootState } from './store';

export interface ContentState {
  items: ContentItem[];
  trendingItems: ContentItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  total: number;
  selectedCategory: CategoryType | 'all';
  selectedSource: SourceType | 'all';
  searchQuery: string;
  sortBy: 'latest' | 'popular' | 'rating' | 'trending';
  activeSection: 'feed' | 'trending' | 'favorites' | 'explore' | 'analytics';
  selectedModalItem: ContentItem | null;
}

const initialState: ContentState = {
  items: [],
  trendingItems: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  total: 0,
  selectedCategory: 'all',
  selectedSource: 'all',
  searchQuery: '',
  sortBy: 'latest',
  activeSection: 'feed',
  selectedModalItem: null,
};

export const fetchFeed = createAsyncThunk(
  'content/fetchFeed',
  async (isLoadMore: boolean = false, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { categories, sources } = state.preferences;
      const { selectedCategory, selectedSource, searchQuery, sortBy, page } = state.content;

      const targetPage = isLoadMore ? page + 1 : 1;

      const params: FetchFeedParams = {
        categories,
        sources,
        category: selectedCategory,
        source: selectedSource,
        searchQuery,
        sortBy,
        page: targetPage,
        limit: 12,
      };

      const res = await apiService.fetchFeed(params);
      return { ...res, isLoadMore };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch content';
      return rejectWithValue(msg);
    }
  }
);

export const fetchTrending = createAsyncThunk(
  'content/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiService.fetchTrending();
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch trending content';
      return rejectWithValue(msg);
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<CategoryType | 'all'>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedSource: (state, action: PayloadAction<SourceType | 'all'>) => {
      state.selectedSource = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'latest' | 'popular' | 'rating' | 'trending'>) => {
      state.sortBy = action.payload;
    },
    setActiveSection: (
      state,
      action: PayloadAction<'feed' | 'trending' | 'favorites' | 'explore' | 'analytics'>
    ) => {
      state.activeSection = action.payload;
    },
    setSelectedModalItem: (state, action: PayloadAction<ContentItem | null>) => {
      state.selectedModalItem = action.payload;
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
    },
    injectLiveItem: (state, action: PayloadAction<ContentItem>) => {
      const newItem = action.payload;
      // Prevent duplicate
      if (!state.items.some((item) => item.id === newItem.id)) {
        state.items.unshift(newItem);
        state.total += 1;
      }
    },
    toggleLikeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const target = state.items.find((item) => item.id === itemId);
      if (target) {
        if (target.userLiked) {
          target.likes -= 1;
          target.userLiked = false;
        } else {
          target.likes += 1;
          target.userLiked = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state, action) => {
        const isLoadMore = action.meta.arg;
        if (isLoadMore) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { items, hasMore, page, total, isLoadMore } = action.payload;
        state.loading = false;
        state.loadingMore = false;
        state.hasMore = hasMore;
        state.page = page;
        state.total = total;

        if (isLoadMore) {
          // Append unique items
          const existingIds = new Set(state.items.map((i) => i.id));
          const newItems = items.filter((i) => !existingIds.has(i.id));
          state.items.push(...newItems);
        } else {
          state.items = items;
        }
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = (action.payload as string) || 'Failed to load content';
      })
      // Fetch Trending
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trendingItems = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedSource,
  setSearchQuery,
  setSortBy,
  setActiveSection,
  setSelectedModalItem,
  reorderItems,
  injectLiveItem,
  toggleLikeItem,
} = contentSlice.actions;

export default contentSlice.reducer;
