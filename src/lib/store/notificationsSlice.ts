import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LiveNotification } from '@/types';

export interface NotificationsState {
  items: LiveNotification[];
  isDrawerOpen: boolean;
}

const initialState: NotificationsState = {
  items: [
    {
      id: 'welcome-notif-1',
      title: 'Welcome to your Personalized Content Hub',
      description: 'Customize your feed categories, toggle sources, and reorder cards in real time.',
      category: 'technology',
      sourceType: 'news',
      timestamp: 'Just now',
      read: false,
    },
  ],
  isDrawerOpen: false,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<LiveNotification>) => {
      state.items.unshift(action.payload);
      // Keep max 20 notifications
      if (state.items.length > 20) {
        state.items.pop();
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const target = state.items.find((item) => item.id === action.payload);
      if (target) {
        target.read = true;
      }
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const {
  addNotification,
  markAllAsRead,
  markAsRead,
  setDrawerOpen,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
