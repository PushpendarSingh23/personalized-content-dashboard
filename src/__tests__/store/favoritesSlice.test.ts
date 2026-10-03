import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearFavorites,
} from '@/lib/store/favoritesSlice';
import { ContentItem } from '@/types';

const mockItem: ContentItem = {
  id: 'test-item-1',
  title: 'Test Article Title',
  description: 'Test description content',
  category: 'technology',
  sourceType: 'news',
  sourceName: 'TechCrunch',
  url: 'https://example.com',
  imageUrl: 'https://example.com/image.jpg',
  publishedAt: '5 mins ago',
  likes: 10,
  shares: 2,
  tags: ['test'],
};

describe('favoritesSlice reducer', () => {
  it('should add an item to favorites on toggle', () => {
    const nextState = favoritesReducer({ items: [] }, toggleFavorite(mockItem));
    expect(nextState.items.length).toBe(1);
    expect(nextState.items[0].id).toBe('test-item-1');
  });

  it('should remove an item from favorites if already present on toggle', () => {
    const initialState = { items: [mockItem] };
    const nextState = favoritesReducer(initialState, toggleFavorite(mockItem));
    expect(nextState.items.length).toBe(0);
  });

  it('should remove favorite by ID', () => {
    const initialState = { items: [mockItem] };
    const nextState = favoritesReducer(initialState, removeFavorite('test-item-1'));
    expect(nextState.items.length).toBe(0);
  });

  it('should clear all favorites', () => {
    const initialState = { items: [mockItem, { ...mockItem, id: 'test-2' }] };
    const nextState = favoritesReducer(initialState, clearFavorites());
    expect(nextState.items.length).toBe(0);
  });
});
