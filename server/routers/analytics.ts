import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { ENV } from "../_core/env";
import {
  trackPageView,
  trackAnalyticsEvent,
  createOrUpdateSession,
  getAnalyticsOverview,
  getTopPages,
  getTopEvents,
  getRecentSessions,
  getPageEngagementStats,
} from "../db";

export const analyticsRouter = router({
  // Track page views (public)
  trackPageView: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        page: z.string(),
        referrer: z.string().optional(),
        userAgent: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackPageView({
          sessionId: input.sessionId,
          page: input.page,
          referrer: input.referrer,
          userAgent: input.userAgent,
        });
        return { success: true };
      } catch (error) {
        console.error("Error tracking page view:", error);
        return { success: false };
      }
    }),

  // Track events (public)
  trackEvent: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        eventType: z.enum(["click", "form_submit", "video_play", "audio_play", "scroll", "custom"]),
        eventName: z.string(),
        page: z.string(),
        metadata: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await trackAnalyticsEvent({
          sessionId: input.sessionId,
          eventType: input.eventType,
          eventName: input.eventName,
          page: input.page,
          metadata: input.metadata,
        });
        return { success: true };
      } catch (error) {
        console.error("Error tracking event:", error);
        return { success: false };
      }
    }),

  // End session (public)
  endSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        duration: z.number(),
        pageCount: z.number(),
        eventCount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createOrUpdateSession({
          sessionId: input.sessionId,
          endTime: new Date(),
          duration: input.duration,
          pageCount: input.pageCount,
          eventCount: input.eventCount,
        });
        return { success: true };
      } catch (error) {
        console.error("Error ending session:", error);
        return { success: false };
      }
    }),

  // Get analytics overview (admin only)
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.openId !== ENV.ownerOpenId) {
      throw new Error("Unauthorized: Admin access only");
    }
    try {
      return await getAnalyticsOverview();
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      throw new Error("Failed to fetch analytics overview");
    }
  }),

  // Get top pages (admin only)
  getTopPages: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user?.openId !== ENV.ownerOpenId) {
        throw new Error("Unauthorized: Admin access only");
      }
      try {
        return await getTopPages(input?.limit || 10);
      } catch (error) {
        console.error("Error fetching top pages:", error);
        throw new Error("Failed to fetch top pages");
      }
    }),

  // Get top events (admin only)
  getTopEvents: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user?.openId !== ENV.ownerOpenId) {
        throw new Error("Unauthorized: Admin access only");
      }
      try {
        return await getTopEvents(input?.limit || 10);
      } catch (error) {
        console.error("Error fetching top events:", error);
        throw new Error("Failed to fetch top events");
      }
    }),

  // Get recent sessions (admin only)
  getRecentSessions: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }).optional())
    .query(async ({ ctx, input }) => {
      if (ctx.user?.openId !== ENV.ownerOpenId) {
        throw new Error("Unauthorized: Admin access only");
      }
      try {
        return await getRecentSessions(input?.limit || 20);
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
        throw new Error("Failed to fetch recent sessions");
      }
    }),

  // Get page engagement stats (admin only)
  getPageEngagement: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.openId !== ENV.ownerOpenId) {
      throw new Error("Unauthorized: Admin access only");
    }
    try {
      return await getPageEngagementStats();
    } catch (error) {
      console.error("Error fetching page engagement:", error);
      throw new Error("Failed to fetch page engagement");
    }
  }),
});
