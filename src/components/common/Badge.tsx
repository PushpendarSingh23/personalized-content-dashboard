import React from 'react';
import { CategoryType, SourceType } from '@/types';
import {
  Cpu,
  TrendingUp,
  Trophy,
  Film,
  HeartPulse,
  Atom,
  Bot,
  Newspaper,
  Sparkles,
  Share2,
  Headphones,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'sm' | 'md';
}

const CATEGORY_STYLES: Record<
  CategoryType,
  { bg: string; text: string; border: string; label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  technology: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    label: 'Tech',
    icon: Cpu,
  },
  finance: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    label: 'Finance',
    icon: TrendingUp,
  },
  sports: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    label: 'Sports',
    icon: Trophy,
  },
  entertainment: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    label: 'Entertainment',
    icon: Film,
  },
  health: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    label: 'Health',
    icon: HeartPulse,
  },
  science: {
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30',
    label: 'Science',
    icon: Atom,
  },
  ai: {
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-500/30',
    label: 'AI & AGI',
    icon: Bot,
  },
};

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = CATEGORY_STYLES[category] || CATEGORY_STYLES.technology;
  const Icon = config.icon;

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-sm gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClass}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
}

interface SourceBadgeProps {
  sourceType: SourceType;
  sourceName?: string;
  size?: 'sm' | 'md';
}

const SOURCE_CONFIG: Record<
  SourceType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  news: { label: 'News', icon: Newspaper, color: 'text-sky-500' },
  recommendation: { label: 'Picks', icon: Sparkles, color: 'text-amber-500' },
  social: { label: 'Social', icon: Share2, color: 'text-pink-500' },
  podcast: { label: 'Audio', icon: Headphones, color: 'text-emerald-500' },
};

export function SourceBadge({ sourceType, sourceName, size = 'sm' }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[sourceType] || SOURCE_CONFIG.news;
  const Icon = config.icon;
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
      <Icon className={`${iconSize} ${config.color}`} />
      <span>{sourceName || config.label}</span>
    </span>
  );
}
