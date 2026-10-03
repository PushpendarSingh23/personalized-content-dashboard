import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/types';
import { DEMO_PROFILES } from '@/services/mockData';

export interface AuthState {
  user: UserProfile;
  isAuthModalOpen: boolean;
}

const loadInitialUser = (): UserProfile => {
  if (typeof window === 'undefined') return DEMO_PROFILES[0];
  try {
    const saved = localStorage.getItem('user_dashboard_profile');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse user profile from localStorage:', e);
  }
  return DEMO_PROFILES[0];
};

const initialState: AuthState = {
  user: loadInitialUser(),
  isAuthModalOpen: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    switchDemoUser: (state, action: PayloadAction<string>) => {
      const target = DEMO_PROFILES.find((p) => p.id === action.payload);
      if (target) {
        state.user = target;
      }
    },
    updateProfile: (
      state,
      action: PayloadAction<Partial<Omit<UserProfile, 'id' | 'isAuthenticated'>>>
    ) => {
      state.user = { ...state.user, ...action.payload };
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    logout: (state) => {
      state.user = {
        id: 'guest',
        name: 'Guest Explorer',
        email: 'guest@dashboard.io',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: 'Browsing personalized public feed as guest',
        role: 'Guest',
        isAuthenticated: false,
        joinedDate: 'Today',
      };
    },
  },
});

export const { setUser, switchDemoUser, updateProfile, setAuthModalOpen, logout } =
  authSlice.actions;

export default authSlice.reducer;
