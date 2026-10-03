import { describe, it, expect } from 'vitest';
import preferencesReducer, {
  toggleCategory,
  setTheme,
  setLanguage,
  setViewMode,
  setAutoRefresh,
  resetPreferences,
} from '@/lib/store/preferencesSlice';
import { UserPreferences } from '@/types';

describe('preferencesSlice reducer', () => {
  const initialState: UserPreferences = {
    categories: ['technology', 'finance', 'sports'],
    sources: ['news', 'recommendation'],
    theme: 'dark',
    language: 'en',
    viewMode: 'grid',
    autoRefresh: true,
    refreshInterval: 25,
    soundEffects: true,
    density: 'comfortable',
    customOrder: [],
  };

  it('should toggle a new category into the list', () => {
    const nextState = preferencesReducer(initialState, toggleCategory('ai'));
    expect(nextState.categories).toContain('ai');
  });

  it('should remove an existing category from the list if more than 1 remains', () => {
    const nextState = preferencesReducer(initialState, toggleCategory('sports'));
    expect(nextState.categories).not.toContain('sports');
    expect(nextState.categories.length).toBe(2);
  });

  it('should change theme mode', () => {
    const nextState = preferencesReducer(initialState, setTheme('cyberpunk'));
    expect(nextState.theme).toBe('cyberpunk');
  });

  it('should change language', () => {
    const nextState = preferencesReducer(initialState, setLanguage('es'));
    expect(nextState.language).toBe('es');
  });

  it('should change view mode', () => {
    const nextState = preferencesReducer(initialState, setViewMode('list'));
    expect(nextState.viewMode).toBe('list');
  });

  it('should toggle autoRefresh', () => {
    const nextState = preferencesReducer(initialState, setAutoRefresh(false));
    expect(nextState.autoRefresh).toBe(false);
  });

  it('should reset preferences to defaults', () => {
    const modifiedState: UserPreferences = {
      ...initialState,
      theme: 'light',
      categories: ['ai'],
    };
    const nextState = preferencesReducer(modifiedState, resetPreferences());
    expect(nextState.categories.length).toBe(7);
  });
});
