export type CategoryType =
  | 'technology'
  | 'finance'
  | 'sports'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'ai';

export type SourceType =
  | 'news'
  | 'recommendation'
  | 'social'
  | 'podcast';

export type ThemeMode = 'dark' | 'light' | 'system' | 'cyberpunk';
export type ViewMode = 'grid' | 'list' | 'compact';
export type LanguageCode = 'en' | 'es' | 'hi' | 'fr' | 'de';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  sourceType: SourceType;
  sourceName: string;
  author?: string;
  authorAvatar?: string;
  authorHandle?: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  readTime?: string;
  rating?: number;
  likes: number;
  shares: number;
  commentsCount?: number;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio' | 'image' | 'article';
  tags: string[];
  isTrending?: boolean;
  trendingRank?: number;
  isBreaking?: boolean;
  userLiked?: boolean;
  summary?: string;
}

export interface UserPreferences {
  categories: CategoryType[];
  sources: SourceType[];
  theme: ThemeMode;
  language: LanguageCode;
  viewMode: ViewMode;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds (e.g. 15, 30, 60)
  soundEffects: boolean;
  density: 'comfortable' | 'compact';
  customOrder?: string[]; // Array of content IDs for drag-and-drop
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  isAuthenticated: boolean;
  joinedDate: string;
}

export interface LiveNotification {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  sourceType: SourceType;
  timestamp: string;
  read: boolean;
  item?: ContentItem;
}

export interface FilterState {
  searchQuery: string;
  selectedCategory: CategoryType | 'all';
  selectedSource: SourceType | 'all';
  sortBy: 'latest' | 'popular' | 'rating' | 'trending';
  activeSection: 'feed' | 'trending' | 'favorites' | 'explore' | 'analytics';
}

export interface AnalyticsData {
  totalRead: number;
  totalSaved: number;
  totalLikes: number;
  categoryBreakdown: Record<CategoryType, number>;
  sourceBreakdown: Record<SourceType, number>;
  weeklyEngagement: { day: string; count: number }[];
}
