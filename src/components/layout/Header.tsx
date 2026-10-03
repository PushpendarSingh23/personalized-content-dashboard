'use client';

import React from 'react';
import Image from 'next/image';
import {
  Bell,
  Sliders,
  Moon,
  Sun,
  Menu,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { setSearchQuery } from '@/lib/store/contentSlice';
import { setTheme } from '@/lib/store/preferencesSlice';
import { setAuthModalOpen } from '@/lib/store/authSlice';
import { setDrawerOpen } from '@/lib/store/notificationsSlice';
import DebouncedInput from '../common/DebouncedInput';
import { getTranslation } from '@/lib/i18n/translations';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
}

export default function Header({ onOpenSettings, onToggleSidebar }: HeaderProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.content.searchQuery);
  const theme = useAppSelector((state) => state.preferences.theme);
  const language = useAppSelector((state) => state.preferences.language);
  const user = useAppSelector((state) => state.auth.user);
  const unreadCount = useAppSelector(
    (state) => state.notifications.items.filter((i) => !i.read).length
  );
  const autoRefresh = useAppSelector((state) => state.preferences.autoRefresh);

  const handleToggleTheme = () => {
    if (theme === 'dark') {
      dispatch(setTheme('light'));
    } else if (theme === 'light') {
      dispatch(setTheme('cyberpunk'));
    } else {
      dispatch(setTheme('dark'));
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 px-4 sm:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 sm:gap-6 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Pulse<span className="text-sky-500">Feed</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              Omni-Source Hub
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl">
        <DebouncedInput
          value={searchQuery}
          onChange={(val) => dispatch(setSearchQuery(val))}
          placeholder={getTranslation(language, 'searchPlaceholder')}
        />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {autoRefresh && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wide animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[11px]">{getTranslation(language, 'liveTicker')}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Theme: ${theme}`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-sky-400" />
          ) : theme === 'cyberpunk' ? (
            <Zap className="w-4 h-4 text-pink-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => dispatch(setDrawerOpen(true))}
          className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={getTranslation(language, 'settings')}
          aria-label="Preferences"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => dispatch(setAuthModalOpen(true))}
          className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title="Profile & Accounts"
        >
          <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
            <Image src={user.avatar} alt={user.name} fill sizes="28px" className="object-cover" />
          </div>
          <span className="hidden lg:inline text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
