import { describe, it, expect } from 'vitest';
import contentReducer, {
  setSelectedCategory,
  setSearchQuery,
  reorderItems,
  toggleLikeItem,
  injectLiveItem,
} from '@/lib/store/contentSlice';
import { ContentItem } from '@/types';

const mockItem: ContentItem = {
  id: 'test-item-1',
  title: 'AI Breakthrough',
  description: 'AI model achieves new benchmark',
  category: 'ai',
  sourceType: 'news',
  sourceName: 'DeepMind',
  url: 'https://example.com',
  imageUrl: 'https://example.com/image.jpg',
  publishedAt: 'Just now',
  likes: 50,
  shares: 10,
  tags: ['AI'],
  userLiked: false,
};

describe('contentSlice reducer', () => {
  it('should update selectedCategory', () => {
    const nextState = contentReducer(undefined, setSelectedCategory('ai'));
    expect(nextState.selectedCategory).toBe('ai');
  });

  it('should update searchQuery', () => {
    const nextState = contentReducer(undefined, setSearchQuery('quantum'));
    expect(nextState.searchQuery).toBe('quantum');
  });

  it('should reorder items in feed', () => {
    const item1 = { ...mockItem, id: 'item-1' };
    const item2 = { ...mockItem, id: 'item-2' };
    const initialState = {
      items: [item1, item2],
      trendingItems: [],
      loading: false,
      loadingMore: false,
      error: null,
      page: 1,
      hasMore: true,
      total: 2,
      selectedCategory: 'all' as const,
      selectedSource: 'all' as const,
      searchQuery: '',
      sortBy: 'latest' as const,
      activeSection: 'feed' as const,
      selectedModalItem: null,
    };

    const nextState = contentReducer(initialState, reorderItems([item2, item1]));
    expect(nextState.items[0].id).toBe('item-2');
    expect(nextState.items[1].id).toBe('item-1');
  });

  it('should toggle like on an item', () => {
    const initialState = {
      items: [mockItem],
      trendingItems: [],
      loading: false,
      loadingMore: false,
      error: null,
      page: 1,
      hasMore: true,
      total: 1,
      selectedCategory: 'all' as const,
      selectedSource: 'all' as const,
      searchQuery: '',
      sortBy: 'latest' as const,
      activeSection: 'feed' as const,
      selectedModalItem: null,
    };

    const likedState = contentReducer(initialState, toggleLikeItem('test-item-1'));
    expect(likedState.items[0].likes).toBe(51);
    expect(likedState.items[0].userLiked).toBe(true);

    const unlikedState = contentReducer(likedState, toggleLikeItem('test-item-1'));
    expect(unlikedState.items[0].likes).toBe(50);
    expect(unlikedState.items[0].userLiked).toBe(false);
  });

  it('should inject real-time live items at the beginning of the feed', () => {
    const initialState = {
      items: [mockItem],
      trendingItems: [],
      loading: false,
      loadingMore: false,
      error: null,
      page: 1,
      hasMore: true,
      total: 1,
      selectedCategory: 'all' as const,
      selectedSource: 'all' as const,
      searchQuery: '',
      sortBy: 'latest' as const,
      activeSection: 'feed' as const,
      selectedModalItem: null,
    };

    const liveItem = { ...mockItem, id: 'live-breaking-1', title: 'Breaking Alert' };
    const nextState = contentReducer(initialState, injectLiveItem(liveItem));
    expect(nextState.items[0].id).toBe('live-breaking-1');
    expect(nextState.items.length).toBe(2);
  });
});
