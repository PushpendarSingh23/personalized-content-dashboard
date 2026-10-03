import { ContentItem, CategoryType, SourceType } from '@/types';
import { INITIAL_CONTENT_ITEMS } from './mockData';

export interface FetchFeedParams {
  categories?: CategoryType[];
  sources?: SourceType[];
  searchQuery?: string;
  page?: number;
  limit?: number;
  category?: CategoryType | 'all';
  source?: SourceType | 'all';
  sortBy?: 'latest' | 'popular' | 'rating' | 'trending';
}

export interface FetchFeedResponse {
  items: ContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

class ContentApiService {
  private newsApiKey: string | null = null;
  private tmdbApiKey: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.newsApiKey = localStorage.getItem('app_news_api_key') || null;
      this.tmdbApiKey = localStorage.getItem('app_tmdb_api_key') || null;
    }
  }

  public setApiKeys(newsKey?: string, tmdbKey?: string) {
    if (newsKey !== undefined) this.newsApiKey = newsKey;
    if (tmdbKey !== undefined) this.tmdbApiKey = tmdbKey;
  }

  /**
   * Fetch content items based on user preferences, search, and pagination
   */
  public async fetchFeed(params: FetchFeedParams = {}): Promise<FetchFeedResponse> {
    // Artificial realistic network delay (300ms)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const {
      categories = ['technology', 'finance', 'sports', 'entertainment', 'health', 'science', 'ai'],
      sources = ['news', 'recommendation', 'social', 'podcast'],
      searchQuery = '',
      page = 1,
      limit = 10,
      category = 'all',
      source = 'all',
      sortBy = 'latest',
    } = params;

    // Filter master list
    let filtered = [...INITIAL_CONTENT_ITEMS];

    // Preference filtering
    filtered = filtered.filter((item) => {
      // Must match user enabled preferences
      const matchesPrefCategory = categories.includes(item.category);
      const matchesPrefSource = sources.includes(item.sourceType);
      return matchesPrefCategory && matchesPrefSource;
    });

    // Active dropdown/pill category filter
    if (category !== 'all') {
      filtered = filtered.filter((item) => item.category === category);
    }

    // Active source channel filter
    if (source !== 'all') {
      filtered = filtered.filter((item) => item.sourceType === source);
    }

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.author?.toLowerCase().includes(q) ||
          item.sourceName.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'trending':
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return (a.trendingRank || 99) - (b.trendingRank || 99);
        });
        break;
      case 'latest':
      default:
        // Keep natural fresh order
        break;
    }

    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(0, startIndex + limit);
    const hasMore = paginatedItems.length < filtered.length;

    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      hasMore,
    };
  }

  /**
   * Fetch top trending items
   */
  public async fetchTrending(): Promise<ContentItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return INITIAL_CONTENT_ITEMS.filter((item) => item.isTrending).sort(
      (a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)
    );
  }
}

export const apiService = new ContentApiService();
