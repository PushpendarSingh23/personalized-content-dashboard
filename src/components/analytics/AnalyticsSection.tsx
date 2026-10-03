'use client';

import React from 'react';
import {
  BarChart3,
  BookmarkCheck,
  Heart,
  Clock,
  Zap,
  Layers,
} from 'lucide-react';
import { useAppSelector } from '@/lib/store/store';
import { getTranslation } from '@/lib/i18n/translations';
import { CategoryType } from '@/types';

export default function AnalyticsSection() {
  const language = useAppSelector((state) => state.preferences.language);
  const favorites = useAppSelector((state) => state.favorites.items);
  const items = useAppSelector((state) => state.content.items);
  const preferredCategories = useAppSelector((state) => state.preferences.categories);

  const totalLikes = items.filter((i) => i.userLiked).length;
  const totalSaved = favorites.length;
  const estimatedReadingMinutes = favorites.length * 4 + items.length * 2;

  const categoryCounts: Record<string, number> = {};
  items.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  const categoriesOrder: CategoryType[] = [
    'ai',
    'technology',
    'finance',
    'entertainment',
    'sports',
    'science',
    'health',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-500">
            <BarChart3 className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {getTranslation(language, 'analyticsTitle')}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Personal engagement metrics, consumption habits, and topic affinity analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Discovered</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {items.length} Stories
          </div>
          <p className="text-[11px] text-slate-500">Active feed cache capacity</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Bookmarked</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalSaved} Saved
          </div>
          <p className="text-[11px] text-slate-500">Stored in personal favorites archive</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Likes Given</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalLikes} Reactions
          </div>
          <p className="text-[11px] text-slate-500">Upvoted stories & recommendations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Est. Read Time</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ~{estimatedReadingMinutes} Mins
          </div>
          <p className="text-[11px] text-slate-500">Weekly content consumption</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" />
              <span>Category Weight & Preference Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">
              Relative density of articles and recommendations in your curated feed.
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-500">
            {preferredCategories.length} Active Tracks
          </span>
        </div>

        <div className="space-y-4">
          {categoriesOrder.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const percentage = items.length > 0 ? Math.round((count / items.length) * 100) : 0;
            const isPreferred = preferredCategories.includes(cat);

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize flex items-center gap-1.5">
                    {cat}
                    {isPreferred && (
                      <span className="text-[10px] text-emerald-500 font-bold">● Active</span>
                    )}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {count} items ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
