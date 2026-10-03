'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Bookmark,
  Heart,
  Share2,
  Clock,
  Check,
  Play,
  Volume2,
  Bot,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import { setSelectedModalItem, toggleLikeItem } from '@/lib/store/contentSlice';
import { toggleFavorite } from '@/lib/store/favoritesSlice';
import { CategoryBadge, SourceBadge } from '../common/Badge';
import { getTranslation } from '@/lib/i18n/translations';

export default function ContentModal({ onToast }: { onToast: (msg: string) => void }) {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => state.content.selectedModalItem);
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const language = useAppSelector((state) => state.preferences.language);

  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!item) return null;

  const isFavorite = favoriteItems.some((fav) => fav.id === item.id);

  const handleClose = () => {
    dispatch(setSelectedModalItem(null));
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite(item));
    if (!isFavorite) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0ea5e9', '#ec4899', '#f59e0b'],
      });
      onToast(getTranslation(language, 'savedToFavorites'));
    } else {
      onToast(getTranslation(language, 'removedFromFavorites'));
    }
  };

  const handleLike = () => {
    dispatch(toggleLikeItem(item.id));
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(item.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        onToast(getTranslation(language, 'copiedToClipboard'));
      }
    } catch {}
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          <div className="relative w-full h-56 sm:h-72 bg-slate-900 shrink-0">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-black/40" />

            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-md z-10"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
              <CategoryBadge category={item.category} size="md" />
              <SourceBadge sourceType={item.sourceType} sourceName={item.sourceName} size="md" />
            </div>

            {item.mediaType === 'video' && item.mediaUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-xl transition-transform hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Watch Official Trailer</span>
                </a>
              </div>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-xl sm:text-2xl font-extrabold line-clamp-2 drop-shadow-md">
                {item.title}
              </h2>
            </div>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {item.authorAvatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                    <Image src={item.authorAvatar} alt={item.author || 'Author'} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {item.author || item.sourceName}
                  </p>
                  {item.authorHandle && (
                    <p className="text-slate-400">{item.authorHandle}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {item.publishedAt}
                </span>
                {item.readTime && <span>• {item.readTime}</span>}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 space-y-2">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>AI Intelligent Executive Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {item.summary || item.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">
                Overview & In-Depth Details
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {item.description}
              </p>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                This item is curated based on your personalized tracking preferences in the{' '}
                <span className="font-semibold text-sky-500 capitalize">{item.category}</span> channel.
                Engagement scores show high resonance across global developer communities and readers.
              </p>
            </div>

            {item.mediaType === 'audio' && (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500 text-white">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Audio Stream Preview
                    </h5>
                    <p className="text-xs text-slate-500">High fidelity direct audio stream</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isPlayingAudio ? 'Pause Audio' : 'Play Preview'}</span>
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  item.userLiked
                    ? 'bg-rose-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${item.userLiked ? 'fill-current' : ''}`} />
                <span>{item.likes} Likes</span>
              </button>

              <button
                type="button"
                onClick={handleFavorite}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isFavorite
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save Favorite'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Share link"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <span>Visit Original Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
