import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import preferencesReducer from './preferencesSlice';
import favoritesReducer from './favoritesSlice';
import contentReducer from './contentSlice';
import authReducer from './authSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    favorites: favoritesReducer,
    content: contentReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Sync store changes to localStorage
if (typeof window !== 'undefined') {
  store.subscribe(() => {
    try {
      const state = store.getState();
      localStorage.setItem('user_dashboard_preferences', JSON.stringify(state.preferences));
      localStorage.setItem('user_dashboard_favorites', JSON.stringify(state.favorites.items));
      localStorage.setItem('user_dashboard_profile', JSON.stringify(state.auth.user));
    } catch (e) {
      console.warn('Could not persist state to localStorage:', e);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
