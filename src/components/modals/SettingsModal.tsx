'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sliders,
  Sparkles,
  Layers,
  Moon,
  Sun,
  Laptop,
  Globe,
  Radio,
  Volume2,
  VolumeX,
  RotateCcw,
  Check,
  Zap,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/store';
import {
  toggleCategory,
  toggleSource,
  setTheme,
  setLanguage,
  setAutoRefresh,
  setRefreshInterval,
  setSoundEffects,
  resetPreferences,
} from '@/lib/store/preferencesSlice';
import { CategoryType, SourceType, ThemeMode, LanguageCode } from '@/types';
import { getTranslation } from '@/lib/i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

const ALL_CATEGORIES: { id: CategoryType; labelKey: string }[] = [
  { id: 'ai', labelKey: 'ai' },
  { id: 'technology', labelKey: 'technology' },
  { id: 'finance', labelKey: 'finance' },
  { id: 'entertainment', labelKey: 'entertainment' },
  { id: 'sports', labelKey: 'sports' },
  { id: 'science', labelKey: 'science' },
  { id: 'health', labelKey: 'health' },
];

const ALL_SOURCES: { id: SourceType; labelKey: string }[] = [
  { id: 'news', labelKey: 'news' },
  { id: 'recommendation', labelKey: 'recommendation' },
  { id: 'social', labelKey: 'social' },
  { id: 'podcast', labelKey: 'podcast' },
];

export default function SettingsModal({ isOpen, onClose, onToast }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);
  const language = preferences.language;

  if (!isOpen) return null;

  const handleReset = () => {
    dispatch(resetPreferences());
    onToast('Preferences reset to initial defaults.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sky-500">
                <Sliders className="w-5 h-5" />
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {getTranslation(language, 'preferencesTitle')}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {getTranslation(language, 'preferencesSubtitle')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto space-y-8 flex-1">
            {/* 1. Favorite Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500" />
                  <span>{getTranslation(language, 'favoriteCategories')}</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {preferences.categories.length} Selected
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {getTranslation(language, 'selectCategoriesDesc')}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {ALL_CATEGORIES.map((cat) => {
                  const isChecked = preferences.categories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => dispatch(toggleCategory(cat.id))}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/40 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span className="capitalize">{getTranslation(language, cat.labelKey as any)}</span>
                      {isChecked && <Check className="w-4 h-4 text-sky-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Content Source Channels */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{getTranslation(language, 'contentSources')}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {getTranslation(language, 'selectSourcesDesc')}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {ALL_SOURCES.map((src) => {
                  const isChecked = preferences.sources.includes(src.id);
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => dispatch(toggleSource(src.id))}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        isChecked
                          ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{getTranslation(language, src.labelKey as any)}</span>
                      {isChecked && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Appearance & Theme */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {getTranslation(language, 'appearance')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'dark' as ThemeMode, labelKey: 'darkMode', icon: Moon },
                  { id: 'light' as ThemeMode, labelKey: 'lightMode', icon: Sun },
                  { id: 'system' as ThemeMode, labelKey: 'systemMode', icon: Laptop },
                  { id: 'cyberpunk' as ThemeMode, labelKey: 'cyberpunkMode', icon: Zap },
                ].map((thm) => {
                  const Icon = thm.icon;
                  const isSelected = preferences.theme === thm.id;
                  return (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => dispatch(setTheme(thm.id))}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-102'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <span>{getTranslation(language, thm.labelKey as any)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Language Switcher */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>{getTranslation(language, 'language')}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { code: 'en' as LanguageCode, label: 'English' },
                  { code: 'es' as LanguageCode, label: 'Español' },
                  { code: 'hi' as LanguageCode, label: 'हिन्दी' },
                  { code: 'fr' as LanguageCode, label: 'Français' },
                  { code: 'de' as LanguageCode, label: 'Deutsch' },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => dispatch(setLanguage(l.code))}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      language === l.code
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Real-Time Streaming & Audio Settings */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-4 h-4 text-rose-500" />
                    <span>{getTranslation(language, 'realTimeSettings')}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    {getTranslation(language, 'autoRefreshDesc')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.autoRefresh}
                  onChange={(e) => dispatch(setAutoRefresh(e.target.checked))}
                  className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
              </div>

              {preferences.autoRefresh && (
                <div className="flex items-center justify-between pl-6 text-xs text-slate-600 dark:text-slate-400">
                  <span>{getTranslation(language, 'refreshRate')}</span>
                  <select
                    value={preferences.refreshInterval}
                    onChange={(e) => dispatch(setRefreshInterval(Number(e.target.value)))}
                    aria-label="Select refresh interval"
                    className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <option value={15}>Every 15s (Fast Pulse)</option>
                    <option value={25}>Every 25s (Recommended)</option>
                    <option value={60}>Every 60s (Standard)</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {preferences.soundEffects ? (
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{getTranslation(language, 'soundEffects')}</span>
                  </h4>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.soundEffects}
                  onChange={(e) => dispatch(setSoundEffects(e.target.checked))}
                  className="w-5 h-5 rounded text-sky-500 focus:ring-sky-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{getTranslation(language, 'resetDefaults')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onToast('Preferences saved successfully.');
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              {getTranslation(language, 'savePreferences')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
