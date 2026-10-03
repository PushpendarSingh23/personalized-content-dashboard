'use client';

import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { BREAKING_LIVE_POOL } from '@/services/mockData';
import { injectLiveItem } from '@/lib/store/contentSlice';
import { addNotification } from '@/lib/store/notificationsSlice';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((state) => state.preferences.theme);
  const autoRefresh = useAppSelector((state) => state.preferences.autoRefresh);
  const refreshInterval = useAppSelector((state) => state.preferences.refreshInterval);
  const soundEffects = useAppSelector((state) => state.preferences.soundEffects);
  const dispatch = useAppDispatch();
  const livePoolIndexRef = useRef(0);

  // Apply dark mode & cyberpunk mode to DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'cyberpunk');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'cyberpunk') {
      root.classList.add('dark', 'cyberpunk');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    }
  }, [theme]);

  // Real-time live stream simulation (WebSockets / SSE Simulation)
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (BREAKING_LIVE_POOL.length === 0) return;
      
      const item = BREAKING_LIVE_POOL[livePoolIndexRef.current % BREAKING_LIVE_POOL.length];
      livePoolIndexRef.current += 1;

      // Unique timestamp clone
      const liveItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        publishedAt: 'Just now',
      };

      dispatch(injectLiveItem(liveItem));
      dispatch(
        addNotification({
          id: `notif-${Date.now()}`,
          title: `🔴 ${liveItem.sourceName}: ${liveItem.title.slice(0, 60)}...`,
          description: liveItem.description.slice(0, 100) + '...',
          category: liveItem.category,
          sourceType: liveItem.sourceType,
          timestamp: 'Just now',
          read: false,
          item: liveItem,
        })
      );

      // Play chime if sound enabled
      if (soundEffects && typeof Audio !== 'undefined') {
        try {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch {}
      }
    }, (refreshInterval || 25) * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, soundEffects, dispatch]);

  return <>{children}</>;
}
