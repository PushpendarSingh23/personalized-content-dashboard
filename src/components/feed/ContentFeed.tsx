'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Reorder, AnimatePresence } from 'framer-motion';
import {
  Grid3X3,
  List,
  RotateCcw,
  Move,
  SearchX,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  fetchFeed,
  setSelectedCategory,
  setSelectedSource,
  setSortBy,
  reorderItems,
} from '@/lib/store/contentSlice';
import { setViewMode } from '@/lib/store/preferencesSlice';
import { CategoryType, SourceType, ContentItem } from '@/types';
import ContentCard from './ContentCard';
import { FeedSkeletonGrid } from '../common/CardSkeleton';
import { getTranslation } from '@/lib/i18n/translations';

const CATEGORY_LIST: { id: CategoryType | 'all'; labelKey: string }[] = [
  { id: 'all', labelKey: 'allCategories' },
  { id: 'ai', labelKey: 'ai' },
  { id: 'technology', labelKey: 'technology' },
  { id: 'finance', labelKey: 'finance' },
  { id: 'entertainment', labelKey: 'entertainment' },
  { id: 'sports', labelKey: 'sports' },
  { id: 'science', labelKey: 'science' },
  { id: 'health', labelKey: 'health' },
];

const SOURCE_LIST: { id: SourceType | 'all'; labelKey: string }[] = [
  { id: 'all', labelKey: 'allSources' },
  { id: 'news', labelKey: 'news' },
  { id: 'recommendation', labelKey: 'recommendation' },
  { id: 'social', labelKey: 'social' },
  { id: 'podcast', labelKey: 'podcast' },
];

interface ContentFeedProps {
  onToast: (msg: string) => void;
}

export default function ContentFeed({ onToast }: ContentFeedProps) {
  const dispatch = useAppDispatch();
  const {
    items,
    loading,
    loadingMore,
    hasMore,
    selectedCategory,
    selectedSource,
    searchQuery,
    sortBy,
  } = useAppSelector((state) => state.content);

  const { viewMode, language, categories: userPreferredCategories } = useAppSelector(
    (state) => state.preferences
  );

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchFeed(false));
  }, [dispatch, selectedCategory, selectedSource, searchQuery, sortBy, userPreferredCategories]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && !loadingMore) {
        dispatch(fetchFeed(true));
      }
    },
    [dispatch, hasMore, loading, loadingMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  const handleReorder = (newOrder: ContentItem[]) => {
    dispatch(reorderItems(newOrder));
  };

  const handleResetOrder = () => {
    dispatch(fetchFeed(false));
    onToast('Feed refreshed to default algorithm sorting.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORY_LIST.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => dispatch(setSelectedCategory(cat.id))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sky-500/20 shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {getTranslation(language, cat.labelKey as any)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end">
          <div className="relative">
            <select
              value={selectedSource}
              onChange={(e) => dispatch(setSelectedSource(e.target.value as SourceType | 'all'))}
              aria-label="Filter by content source"
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
            >
              {SOURCE_LIST.map((src) => (
                <option key={src.id} value={src.id}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {getTranslation(language, src.labelKey as any)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) =>
                dispatch(
                  setSortBy(e.target.value as 'latest' | 'popular' | 'rating' | 'trending')
                )
              }
              aria-label="Sort content by"
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 cursor-pointer"
            >
              <option value="latest">{getTranslation(language, 'latest')}</option>
              <option value="popular">{getTranslation(language, 'popular')}</option>
              <option value="rating">{getTranslation(language, 'highestRated')}</option>
              <option value="trending">{getTranslation(language, 'trending')}</option>
            </select>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => dispatch(setViewMode('grid'))}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={getTranslation(language, 'viewGrid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(setViewMode('list'))}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-sky-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title={getTranslation(language, 'viewList')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetOrder}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors"
            title={getTranslation(language, 'resetOrder')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/40 text-sky-700 dark:text-sky-300 text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <Move className="w-3.5 h-3.5" />
          {getTranslation(language, 'reorderInfo')}
        </span>
        <span className="hidden sm:inline text-[11px] opacity-80">
          Showing {items.length} dynamic items
        </span>
      </div>

      {loading ? (
        <FeedSkeletonGrid count={6} viewMode={viewMode} />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shadow-inner">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {getTranslation(language, 'noResultsFound')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {getTranslation(language, 'tryDifferentSearch')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              dispatch(setSelectedCategory('all'));
              dispatch(setSelectedSource('all'));
            }}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-md transition-colors"
          >
            {getTranslation(language, 'resetOrder')}
          </button>
        </div>
      ) : (
        <Reorder.Group
          axis={viewMode === 'list' ? 'y' : 'y'}
          values={items}
          onReorder={handleReorder}
          className={
            viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                id={item.id}
                className="list-none"
                whileDrag={{ scale: 1.03, zIndex: 50 }}
              >
                <ContentCard
                  item={item}
                  viewMode={viewMode}
                  onShareToast={onToast}
                />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      <div ref={observerRef} className="py-6 flex flex-col items-center justify-center">
        {loadingMore && (
          <div className="w-full">
            <FeedSkeletonGrid count={3} viewMode={viewMode} />
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            ✨ You are all caught up with your personalized stream!
          </p>
        )}
      </div>
    </div>
  );
}
