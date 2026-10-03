'use client';

import React from 'react';
import {
  LayoutDashboard,
  Flame,
  Bookmark,
  BarChart3,
  Sliders,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { setActiveSection } from '@/lib/store/contentSlice';
import { getTranslation } from '@/lib/i18n/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function Sidebar({ isOpen, onClose, onOpenSettings }: SidebarProps) {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector((state) => state.content.activeSection);
  const language = useAppSelector((state) => state.preferences.language);
  const favoriteCount = useAppSelector((state) => state.favorites.items.length);
  const preferredCategories = useAppSelector((state) => state.preferences.categories);

  const NAV_ITEMS = [
    {
      id: 'feed' as const,
      labelKey: 'personalizedFeed',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'trending' as const,
      labelKey: 'trendingNow',
      icon: Flame,
      badge: 'Hot',
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'favorites' as const,
      labelKey: 'favorites',
      icon: Bookmark,
      badge: favoriteCount > 0 ? favoriteCount.toString() : null,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      id: 'analytics' as const,
      labelKey: 'analytics',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Navigation
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    dispatch(setActiveSection(item.id));
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 scale-102'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <span>{getTranslation(language, item.labelKey as any)}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.badgeColor || 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/70 dark:border-slate-800/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span>My Active Feeds</span>
              </span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-[11px] font-semibold text-sky-500 hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {preferredCategories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-medium text-slate-600 dark:text-slate-400 capitalize"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <button
            type="button"
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700/60"
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-sky-500" />
              <span>{getTranslation(language, 'settings')}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </aside>
    </>
  );
}
