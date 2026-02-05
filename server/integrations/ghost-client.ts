import axios, { AxiosInstance } from 'axios';

/**
 * Ghost CMS API Response Types
 */
export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  html?: string;
  plaintext?: string;
  feature_image?: string;
  featured: boolean;
  status: 'published' | 'draft' | 'scheduled';
  created_at: string;
  updated_at: string;
  published_at: string | null;
  tags?: GhostTag[];
  authors?: GhostAuthor[];
  custom_excerpt?: string;
  codeinjection_head?: string;
  codeinjection_foot?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  meta_title?: string;
  meta_description?: string;
  email_subject?: string;
  frontmatter?: string;
  reading_time?: number;
  access?: 'public' | 'members' | 'paid' | 'tiers';
  comments?: boolean;
  url?: string;
}

export interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  feature_image?: string;
  visibility?: 'public' | 'internal';
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  meta_title?: string;
  meta_description?: string;
  codeinjection_head?: string;
  codeinjection_foot?: string;
  canonical_url?: string;
  accent_color?: string;
  url?: string;
}

export interface GhostAuthor {
  id: string;
  name: string;
  slug: string;
  email?: string;
  profile_image?: string;
  cover_image?: string;
  bio?: string;
  website?: string;
  location?: string;
  facebook?: string;
  twitter?: string;
  url?: string;
}

export interface GhostMember {
  id: string;
  email: string;
  name?: string;
  note?: string;
  subscribed: boolean;
  comped: boolean;
  labels?: string[];
  created_at: string;
  updated_at: string;
  subscriptions?: GhostSubscription[];
}

export interface GhostSubscription {
  id: string;
  status: 'active' | 'canceled' | 'expired' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface GhostConfig {
  url: string;
  key: string;
  version?: string;
}

export interface GhostPostsResponse {
  posts: GhostPost[];
  meta?: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
      next: number | null;
      prev: number | null;
    };
  };
}

/**
 * Ghost CMS Content API Client
 * 
 * Provides methods to fetch content from Ghost CMS
 * Supports posts, tags, authors, and members
 */
export class GhostClient {
  private config: GhostConfig;
  private client: AxiosInstance;

  constructor(config: GhostConfig) {
    this.config = {
      version: 'v5.0',
      ...config,
    };

    this.client = axios.create({
      baseURL: `${this.config.url}/ghost/api/${this.config.version}`,
      timeout: 10000,
    });
  }

  /**
   * Get all published posts
   */
  async getPosts(options?: {
    limit?: number;
    page?: number;
    include?: string;
    filter?: string;
  }): Promise<GhostPost[]> {
    try {
      const params = {
        key: this.config.key,
        include: options?.include || 'tags,authors',
        limit: options?.limit || 'all',
        page: options?.page || 1,
        filter: options?.filter || 'status:published',
      };

      const response = await this.client.get<GhostPostsResponse>('/content/posts/', {
        params,
      });

      return response.data.posts || [];
    } catch (error) {
      console.error('[Ghost] Error fetching posts:', error);
      return [];
    }
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<GhostPost | null> {
    try {
      const response = await this.client.get<GhostPostsResponse>(
        `/content/posts/slug/${slug}/`,
        {
          params: {
            key: this.config.key,
            include: 'tags,authors',
          },
        }
      );

      return response.data.posts?.[0] || null;
    } catch (error) {
      console.error(`[Ghost] Error fetching post by slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Get posts filtered by tag
   */
  async getPostsByTag(tag: string, options?: {
    limit?: number;
    include?: string;
  }): Promise<GhostPost[]> {
    try {
      const params = {
        key: this.config.key,
        filter: `tag:${tag}+status:published`,
        include: options?.include || 'tags,authors',
        limit: options?.limit || 'all',
      };

      const response = await this.client.get<GhostPostsResponse>('/content/posts/', {
        params,
      });

      return response.data.posts || [];
    } catch (error) {
      console.error(`[Ghost] Error fetching posts by tag "${tag}":`, error);
      return [];
    }
  }

  /**
   * Get event posts (tagged with 'event')
   */
  async getEvents(options?: { limit?: number }): Promise<GhostPost[]> {
    return this.getPostsByTag('event', { limit: options?.limit });
  }

  /**
   * Get blog posts (tagged with 'blog')
   */
  async getBlogPosts(options?: { limit?: number }): Promise<GhostPost[]> {
    return this.getPostsByTag('blog', { limit: options?.limit });
  }

  /**
   * Get audio posts (tagged with 'audio')
   */
  async getAudioPosts(options?: { limit?: number }): Promise<GhostPost[]> {
    return this.getPostsByTag('audio', { limit: options?.limit });
  }

  /**
   * Get announcement posts (tagged with 'announcement')
   */
  async getAnnouncements(options?: { limit?: number }): Promise<GhostPost[]> {
    return this.getPostsByTag('announcement', { limit: options?.limit });
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(options?: { limit?: number }): Promise<GhostPost[]> {
    try {
      const params = {
        key: this.config.key,
        filter: 'featured:true+status:published',
        include: 'tags,authors',
        limit: options?.limit || 10,
      };

      const response = await this.client.get<GhostPostsResponse>('/content/posts/', {
        params,
      });

      return response.data.posts || [];
    } catch (error) {
      console.error('[Ghost] Error fetching featured posts:', error);
      return [];
    }
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<GhostTag[]> {
    try {
      const response = await this.client.get<{ tags: GhostTag[] }>(
        '/content/tags/',
        {
          params: {
            key: this.config.key,
            limit: 'all',
          },
        }
      );

      return response.data.tags || [];
    } catch (error) {
      console.error('[Ghost] Error fetching tags:', error);
      return [];
    }
  }

  /**
   * Get a single tag by slug
   */
  async getTagBySlug(slug: string): Promise<GhostTag | null> {
    try {
      const response = await this.client.get<{ tags: GhostTag[] }>(
        `/content/tags/slug/${slug}/`,
        {
          params: {
            key: this.config.key,
          },
        }
      );

      return response.data.tags?.[0] || null;
    } catch (error) {
      console.error(`[Ghost] Error fetching tag by slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Get all authors
   */
  async getAuthors(): Promise<GhostAuthor[]> {
    try {
      const response = await this.client.get<{ authors: GhostAuthor[] }>(
        '/content/authors/',
        {
          params: {
            key: this.config.key,
            limit: 'all',
          },
        }
      );

      return response.data.authors || [];
    } catch (error) {
      console.error('[Ghost] Error fetching authors:', error);
      return [];
    }
  }

  /**
   * Get an author by slug
   */
  async getAuthorBySlug(slug: string): Promise<GhostAuthor | null> {
    try {
      const response = await this.client.get<{ authors: GhostAuthor[] }>(
        `/content/authors/slug/${slug}/`,
        {
          params: {
            key: this.config.key,
          },
        }
      );

      return response.data.authors?.[0] || null;
    } catch (error) {
      console.error(`[Ghost] Error fetching author by slug "${slug}":`, error);
      return null;
    }
  }

  /**
   * Search posts by keyword
   */
  async searchPosts(keyword: string): Promise<GhostPost[]> {
    try {
      const params = {
        key: this.config.key,
        filter: `status:published+(title:~'${keyword}'+OR+excerpt:~'${keyword}')`,
        include: 'tags,authors',
        limit: 'all',
      };

      const response = await this.client.get<GhostPostsResponse>('/content/posts/', {
        params,
      });

      return response.data.posts || [];
    } catch (error) {
      console.error(`[Ghost] Error searching posts for "${keyword}":`, error);
      return [];
    }
  }

  /**
   * Get site information
   */
  async getSiteInfo(): Promise<any> {
    try {
      const response = await this.client.get('/content/site/', {
        params: {
          key: this.config.key,
        },
      });

      return response.data.site || null;
    } catch (error) {
      console.error('[Ghost] Error fetching site info:', error);
      return null;
    }
  }

  /**
   * Health check - verify Ghost API is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/content/site/', {
        params: {
          key: this.config.key,
        },
      });

      return !!response.data.site;
    } catch (error) {
      console.error('[Ghost] Health check failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create Ghost client with environment variables
 */
export function createGhostClient(): GhostClient {
  const url = process.env.GHOST_API_URL;
  const key = process.env.GHOST_API_KEY;

  if (!url || !key) {
    throw new Error(
      'Ghost CMS not configured. Set GHOST_API_URL and GHOST_API_KEY environment variables.'
    );
  }

  return new GhostClient({
    url,
    key,
    version: process.env.GHOST_API_VERSION || 'v5.0',
  });
}
