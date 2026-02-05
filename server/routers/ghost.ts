import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { GhostClient } from "../integrations/ghost-client";

// Initialize Ghost client
let ghostClient: GhostClient | null = null;

function getGhostClient(): GhostClient {
  if (!ghostClient) {
    const url = process.env.GHOST_API_URL;
    const key = process.env.GHOST_API_KEY;

    if (!url || !key) {
      throw new Error("Ghost CMS not configured. Set GHOST_API_URL and GHOST_API_KEY.");
    }

    ghostClient = new GhostClient({
      url,
      key,
      version: process.env.GHOST_API_VERSION || "v5.0",
    });
  }

  return ghostClient;
}

export const ghostRouter = router({
  // Get all published posts
  getPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20).optional(),
        page: z.number().min(1).default(1).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getPosts({
          limit: input?.limit,
          page: input?.page,
        });
      } catch (error) {
        console.error("Error fetching Ghost posts:", error);
        return [];
      }
    }),

  // Get a single post by slug
  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getPostBySlug(input.slug);
      } catch (error) {
        console.error(`Error fetching Ghost post "${input.slug}":`, error);
        return null;
      }
    }),

  // Get event posts
  getEvents: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getEvents({ limit: input?.limit });
      } catch (error) {
        console.error("Error fetching Ghost events:", error);
        return [];
      }
    }),

  // Get blog posts
  getBlogPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getBlogPosts({ limit: input?.limit });
      } catch (error) {
        console.error("Error fetching Ghost blog posts:", error);
        return [];
      }
    }),

  // Get audio posts
  getAudioPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getAudioPosts({ limit: input?.limit });
      } catch (error) {
        console.error("Error fetching Ghost audio posts:", error);
        return [];
      }
    }),

  // Get announcements
  getAnnouncements: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(5).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getAnnouncements({ limit: input?.limit });
      } catch (error) {
        console.error("Error fetching Ghost announcements:", error);
        return [];
      }
    }),

  // Get featured posts
  getFeaturedPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(6).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getFeaturedPosts({ limit: input?.limit });
      } catch (error) {
        console.error("Error fetching Ghost featured posts:", error);
        return [];
      }
    }),

  // Get all tags
  getTags: publicProcedure.query(async () => {
    try {
      const ghost = getGhostClient();
      return await ghost.getTags();
    } catch (error) {
      console.error("Error fetching Ghost tags:", error);
      return [];
    }
  }),

  // Get tag by slug
  getTagBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getTagBySlug(input.slug);
      } catch (error) {
        console.error(`Error fetching Ghost tag "${input.slug}":`, error);
        return null;
      }
    }),

  // Get all authors
  getAuthors: publicProcedure.query(async () => {
    try {
      const ghost = getGhostClient();
      return await ghost.getAuthors();
    } catch (error) {
      console.error("Error fetching Ghost authors:", error);
      return [];
    }
  }),

  // Get author by slug
  getAuthorBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.getAuthorBySlug(input.slug);
      } catch (error) {
        console.error(`Error fetching Ghost author "${input.slug}":`, error);
        return null;
      }
    }),

  // Search posts
  searchPosts: publicProcedure
    .input(z.object({ keyword: z.string().min(1) }))
    .query(async ({ input }) => {
      try {
        const ghost = getGhostClient();
        return await ghost.searchPosts(input.keyword);
      } catch (error) {
        console.error(`Error searching Ghost posts for "${input.keyword}":`, error);
        return [];
      }
    }),

  // Get site information
  getSiteInfo: publicProcedure.query(async () => {
    try {
      const ghost = getGhostClient();
      return await ghost.getSiteInfo();
    } catch (error) {
      console.error("Error fetching Ghost site info:", error);
      return null;
    }
  }),

  // Health check
  healthCheck: publicProcedure.query(async () => {
    try {
      const ghost = getGhostClient();
      const isHealthy = await ghost.healthCheck();
      return { healthy: isHealthy };
    } catch (error) {
      console.error("Ghost health check failed:", error);
      return { healthy: false };
    }
  }),
});
