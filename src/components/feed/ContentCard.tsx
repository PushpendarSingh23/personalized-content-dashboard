'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Heart,
  Share2,
  ExternalLink,
  Clock,
  Play,
  Check,
  GripVertical,
  Sparkles,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ContentItem } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { toggleFavorite } from '@/lib/store/favoritesSlice';
import { toggleLikeItem, setSelectedModalItem } from '@/lib/store/contentSlice';
import { CategoryBadge, SourceBadge } from '../common/Badge';
import { getTranslation } from '@/lib/i18n/translations';

interface ContentCardProps {
  item: ContentItem;
  viewMode?: 'grid' | 'list' | 'compact';
  isDraggable?: boolean;
  onShareToast?: (msg: string) => void;
}

export default function ContentCard({
  item,
  viewMode = 'grid',
  isDraggable = true,
  onShareToast,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.preferences.language);
  const favoriteItems = useAppSelector((state) => state.favorites.items);

  const isFavorite = favoriteItems.some((fav) => fav.id === item.id);
  const [isCopied, setIsCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));

    if (!isFavorite) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#0ea5e9', '#ec4899', '#f59e0b', '#8b5cf6'],
      });
      if (onShareToast) {
        onShareToast(getTranslation(language, 'savedToFavorites'));
      }
    } else {
      if (onShareToast) {
        onShareToast(getTranslation(language, 'removedFromFavorites'));
      }
    }
  };

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleLikeItem(item.id));
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.url || window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        if (onShareToast) {
          onShareToast(getTranslation(language, 'copiedToClipboard'));
        }
      }
    } catch {
      // fallback
    }
  };

  const handleCardClick = () => {
    dispatch(setSelectedModalItem(item));
  };

  const getCtaLabel = () => {
    if (item.sourceType === 'recommendation' && item.mediaType === 'video') {
      return getTranslation(language, 'watchTrailer');
    }
    if (item.sourceType === 'podcast' || item.mediaType === 'audio') {
      return getTranslation(language, 'playNow');
    }
    if (item.sourceType === 'social') {
      return getTranslation(language, 'viewPost');
    }
    return getTranslation(language, 'readMore');
  };

  if (viewMode === 'list') {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="group relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-sky-500/40 dark:hover:border-sky-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
      >
        {isDraggable && (
          <div
            className="absolute top-3 left-2 text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block z-10"
            title={getTranslation(language, 'reorderInfo')}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="relative w-full sm:w-52 h-44 sm:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {item.isBreaking && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-sm animate-pulse">
              <Flame className="w-3 h-3" />
              LIVE
            </div>
          )}
          {item.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-sky-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CategoryBadge category={item.category} />
                <SourceBadge sourceType={item.sourceType} sourceName={item.sourceName} />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.publishedAt}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
              {item.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              {item.authorAvatar && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <Image src={item.authorAvatar} alt={item.author || 'Author'} fill sizes="24px" className="object-cover" />
                </div>
              )}
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {item.author || item.sourceName}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={handleLikeToggle}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  item.userLiked
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                    : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Like"
              >
                <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-current' : ''}`} />
                <span>{item.likes}</span>
              </button>

              <button
                type="button"
                onClick={handleFavoriteToggle}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  isFavorite
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Share"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="ml-1 px-3 py-1 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-colors flex items-center gap-1"
              >
                <span>{getCtaLabel()}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
    >
      <div>
        <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <CategoryBadge category={item.category} />
            {item.isBreaking && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md animate-pulse">
                <Flame className="w-3 h-3" />
                Live
              </span>
            )}
            {item.isTrending && !item.isBreaking && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-bold tracking-wider shadow-md">
                <Sparkles className="w-3 h-3" />
                #{item.trendingRank || 'Hot'}
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
                isFavorite
                  ? 'bg-amber-500 text-white ring-2 ring-white/50'
                  : 'bg-black/40 text-white/90 hover:bg-black/60 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {item.mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-slate-900/90 text-sky-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
          )}

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
            <span className="font-semibold drop-shadow">{item.sourceName}</span>
            <span className="text-[11px] drop-shadow opacity-90 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.publishedAt}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
            {item.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/70">
        <div className="flex items-center gap-2">
          {item.authorAvatar ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
              <Image src={item.authorAvatar} alt={item.author || 'Author'} fill sizes="24px" className="object-cover" />
            </div>
          ) : null}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
              {item.author || item.sourceName}
            </span>
            {item.readTime && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {item.readTime}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors ${
              item.userLiked
                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                : 'text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Like"
          >
            <Heart className={`w-3.5 h-3.5 ${item.userLiked ? 'fill-current' : ''}`} />
            <span>{item.likes}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Share link"
            title="Share"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-colors flex items-center gap-1"
          >
            <span>{getCtaLabel()}</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
