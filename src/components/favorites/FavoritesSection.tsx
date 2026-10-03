'use client';

import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Trash2,
  Search,
  FileJson,
  FileSpreadsheet,
  BookmarkX,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { clearFavorites } from '@/lib/store/favoritesSlice';
import { CategoryType } from '@/types';
import ContentCard from '../feed/ContentCard';
import { getTranslation } from '@/lib/i18n/translations';

export default function FavoritesSection({ onToast }: { onToast: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const language = useAppSelector((state) => state.preferences.language);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');

  const filteredFavorites = useMemo(() => {
    return favorites.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [favorites, selectedCategory, searchQuery]);

  const handleExportJson = () => {
    if (favorites.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favorites, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `favorites-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Favorites successfully exported to JSON!');
  };

  const handleExportCsv = () => {
    if (favorites.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Source', 'URL', 'Likes', 'PublishedAt'];
    const rows = favorites.map((item) => [
      `"${item.id}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      `"${item.sourceName}"`,
      `"${item.url}"`,
      item.likes,
      `"${item.publishedAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `favorites-export-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Favorites successfully exported to CSV!');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all bookmarked items?')) {
      dispatch(clearFavorites());
      onToast('All favorites cleared.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <Bookmark className="w-5 h-5 fill-current" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {getTranslation(language, 'favorites')} ({favorites.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your saved articles, movie recommendations, podcasts, and discussions.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <FileJson className="w-3.5 h-3.5 text-sky-500" />
              <span>{getTranslation(language, 'exportJson')}</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>{getTranslation(language, 'exportCsv')}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200/60 dark:border-rose-800/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'clearFavorites')}</span>
            </button>
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in favorites..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['all', 'ai', 'technology', 'finance', 'entertainment', 'sports', 'science', 'health'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-inner">
            <BookmarkX className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {getTranslation(language, 'emptyFavoritesTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {getTranslation(language, 'emptyFavoritesDesc')}
            </p>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No saved favorites match &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div
          className={
            viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          <AnimatePresence>
            {filteredFavorites.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                isDraggable={false}
                onShareToast={onToast}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
