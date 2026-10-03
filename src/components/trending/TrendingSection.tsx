'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, ArrowUpRight, Clock, Star } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { fetchTrending, setSelectedModalItem } from '@/lib/store/contentSlice';
import { CategoryBadge, SourceBadge } from '../common/Badge';
import { getTranslation } from '@/lib/i18n/translations';
import ContentCard from '../feed/ContentCard';

export default function TrendingSection({ onToast }: { onToast: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const trendingItems = useAppSelector((state) => state.content.trendingItems);
  const language = useAppSelector((state) => state.preferences.language);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  useEffect(() => {
    dispatch(fetchTrending());
  }, [dispatch]);

  const topHero = trendingItems[0];
  const otherTrending = trendingItems.slice(1);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 dark:from-amber-500/20 dark:via-rose-500/20 dark:to-indigo-500/20 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-md">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold tracking-wide uppercase shadow-md shadow-amber-500/30">
            <Flame className="w-4 h-4" />
            <span>{getTranslation(language, 'trendingNow')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Real-Time Viral & Spotlight Discoveries
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Algorithmic aggregation of the fastest rising news, blockbuster movie trailers, and high-engagement conversations across the web.
          </p>
        </div>
      </div>

      {topHero && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-3xl overflow-hidden bg-slate-900 text-white border border-slate-800 shadow-xl cursor-pointer"
          onClick={() => dispatch(setSelectedModalItem(topHero))}
        >
          <div className="relative h-72 sm:h-96 w-full">
            <Image
              src={topHero.imageUrl}
              alt={topHero.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                #1 TRENDING WORLDWIDE
              </span>
              <CategoryBadge category={topHero.category} />
            </div>

            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
                <SourceBadge sourceType={topHero.sourceType} sourceName={topHero.sourceName} />
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {topHero.publishedAt}
                </span>
                {topHero.rating && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      {topHero.rating}/10
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                {topHero.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-3xl">
                {topHero.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Spotlight</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  🔥 {topHero.likes.toLocaleString()} Engagements
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-500" />
          <span>Hot Trending Lineup</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherTrending.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onShareToast={onToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
