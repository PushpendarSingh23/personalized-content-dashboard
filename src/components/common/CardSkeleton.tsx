import React from 'react';

export function CardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' | 'compact' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white/70 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm animate-pulse">
        <div className="w-full sm:w-48 h-32 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 flex flex-col justify-between space-y-3 py-1">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="w-24 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="w-3/4 h-5 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="w-20 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-850/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm animate-pulse">
      <div className="w-full h-44 bg-slate-200 dark:bg-slate-800" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-full h-5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-4/5 h-5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-full h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="w-2/3 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="w-20 h-3.5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-16 h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeletonGrid({ count = 6, viewMode = 'grid' }: { count?: number; viewMode?: 'grid' | 'list' | 'compact' }) {
  return (
    <div
      className={
        viewMode === 'list'
          ? 'space-y-4'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
