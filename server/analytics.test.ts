import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  trackPageView,
  trackAnalyticsEvent,
  createOrUpdateSession,
  getAnalyticsOverview,
  getTopPages,
  getTopEvents,
  getRecentSessions,
} from "./db";

describe("Analytics System", () => {
  describe("trackPageView", () => {
    it("should track a page view successfully", async () => {
      const result = await trackPageView({
        sessionId: "test-session-123",
        page: "/",
        referrer: "https://google.com",
        userAgent: "Mozilla/5.0",
      });
      expect(result).toBeDefined();
    });

    it("should handle page view without optional fields", async () => {
      const result = await trackPageView({
        sessionId: "test-session-456",
        page: "/blog",
      });
      expect(result).toBeDefined();
    });

    it("should track multiple page views for same session", async () => {
      const sessionId = "test-session-multi";
      await trackPageView({
        sessionId,
        page: "/",
      });
      await trackPageView({
        sessionId,
        page: "/blog",
      });
      // Both should succeed without error
      expect(true).toBe(true);
    });
  });

  describe("trackAnalyticsEvent", () => {
    it("should track a click event", async () => {
      const result = await trackAnalyticsEvent({
        sessionId: "test-session-789",
        eventType: "click",
        eventName: "youtube_link_click",
        page: "/",
        metadata: JSON.stringify({ url: "https://youtube.com/@joydao.z" }),
      });
      expect(result).toBeDefined();
    });

    it("should track form submission event", async () => {
      const result = await trackAnalyticsEvent({
        sessionId: "test-session-form",
        eventType: "form_submit",
        eventName: "contact_form_submit",
        page: "/",
      });
      expect(result).toBeDefined();
    });

    it("should track video play event", async () => {
      const result = await trackAnalyticsEvent({
        sessionId: "test-session-video",
        eventType: "video_play",
        eventName: "youtube_video_play",
        page: "/",
        metadata: JSON.stringify({ videoId: "dQw4w9WgXcQ" }),
      });
      expect(result).toBeDefined();
    });

    it("should track audio play event", async () => {
      const result = await trackAnalyticsEvent({
        sessionId: "test-session-audio",
        eventType: "audio_play",
        eventName: "audio_track_play",
        page: "/",
        metadata: JSON.stringify({ title: "mix-01" }),
      });
      expect(result).toBeDefined();
    });

    it("should track custom event", async () => {
      const result = await trackAnalyticsEvent({
        sessionId: "test-session-custom",
        eventType: "custom",
        eventName: "blog_post_view",
        page: "/blog/test-post",
      });
      expect(result).toBeDefined();
    });
  });

  describe("createOrUpdateSession", () => {
    it("should create a new session", async () => {
      const result = await createOrUpdateSession({
        sessionId: `new-session-${Date.now()}-001`,
        startTime: new Date(),
        pageCount: 1,
        eventCount: 0,
      });
      expect(result).toBeDefined();
    });

    it("should handle session with endTime", async () => {
      
      const result = await createOrUpdateSession({
        sessionId: `end-session-${Date.now()}-${Math.random()}`,
        startTime: new Date(),
        endTime: new Date(),
        duration: 300,
        pageCount: 5,
        eventCount: 12,
      });
      expect(result).toBeDefined();
    });

    it("should handle session with all fields", async () => {
      const result = await createOrUpdateSession({
        sessionId: `full-session-${Date.now()}`,
        startTime: new Date(),
        endTime: new Date(),
        duration: 600,
        pageCount: 3,
        eventCount: 8,
        referrer: "https://google.com",
        userAgent: "Mozilla/5.0",
        ipHash: "abc123def456",
      });
      expect(result).toBeDefined();
    });
  });

  describe("getAnalyticsOverview", () => {
    it("should return analytics overview with correct structure", async () => {
      const overview = await getAnalyticsOverview();
      
      expect(overview).toBeDefined();
      expect(overview).toHaveProperty("totalSessions");
      expect(overview).toHaveProperty("totalPageViews");
      expect(overview).toHaveProperty("totalEvents");
      expect(overview).toHaveProperty("avgSessionDuration");
      
      expect(typeof overview.totalSessions).toBe("number");
      expect(typeof overview.totalPageViews).toBe("number");
      expect(typeof overview.totalEvents).toBe("number");
      expect(typeof overview.avgSessionDuration).toBe("number");
    });

    it("should return non-negative numbers", async () => {
      const overview = await getAnalyticsOverview();
      
      expect(overview.totalSessions).toBeGreaterThanOrEqual(0);
      expect(overview.totalPageViews).toBeGreaterThanOrEqual(0);
      expect(overview.totalEvents).toBeGreaterThanOrEqual(0);
      expect(overview.avgSessionDuration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getTopPages", () => {
    it("should return array of top pages", async () => {
      const topPages = await getTopPages(10);
      
      expect(Array.isArray(topPages)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const topPages = await getTopPages(5);
      
      expect(topPages.length).toBeLessThanOrEqual(5);
    });

    it("should have correct structure for page objects", async () => {
      const topPages = await getTopPages(1);
      
      if (topPages.length > 0) {
        expect(topPages[0]).toHaveProperty("page");
        expect(topPages[0]).toHaveProperty("views");
      }
    });

    it("should return pages sorted by views descending", async () => {
      const topPages = await getTopPages(10);
      
      for (let i = 1; i < topPages.length; i++) {
        expect(topPages[i - 1].views).toBeGreaterThanOrEqual(topPages[i].views);
      }
    });
  });

  describe("getTopEvents", () => {
    it("should return array of top events", async () => {
      const topEvents = await getTopEvents(10);
      
      expect(Array.isArray(topEvents)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const topEvents = await getTopEvents(5);
      
      expect(topEvents.length).toBeLessThanOrEqual(5);
    });

    it("should have correct structure for event objects", async () => {
      const topEvents = await getTopEvents(1);
      
      if (topEvents.length > 0) {
        expect(topEvents[0]).toHaveProperty("eventName");
        expect(topEvents[0]).toHaveProperty("count");
      }
    });

    it("should return events sorted by count descending", async () => {
      const topEvents = await getTopEvents(10);
      
      for (let i = 1; i < topEvents.length; i++) {
        expect(topEvents[i - 1].count).toBeGreaterThanOrEqual(topEvents[i].count);
      }
    });
  });

  describe("getRecentSessions", () => {
    it("should return array of recent sessions", async () => {
      const recentSessions = await getRecentSessions(20);
      
      expect(Array.isArray(recentSessions)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const recentSessions = await getRecentSessions(5);
      
      expect(recentSessions.length).toBeLessThanOrEqual(5);
    });

    it("should have correct structure for session objects", async () => {
      const recentSessions = await getRecentSessions(1);
      
      if (recentSessions.length > 0) {
        const session = recentSessions[0];
        expect(session).toHaveProperty("sessionId");
        expect(session).toHaveProperty("startTime");
        expect(session).toHaveProperty("pageCount");
        expect(session).toHaveProperty("eventCount");
      }
    });

    it("should return sessions sorted by startTime descending", async () => {
      const recentSessions = await getRecentSessions(10);
      
      for (let i = 1; i < recentSessions.length; i++) {
        const prevTime = new Date(recentSessions[i - 1].startTime).getTime();
        const currTime = new Date(recentSessions[i].startTime).getTime();
        expect(prevTime).toBeGreaterThanOrEqual(currTime);
      }
    });
  });

  describe("Analytics Integration", () => {
    it("should track complete user session flow", async () => {
      const sessionId = `integration-test-${Date.now()}-${Math.random()}`;
      
      // Track initial page view
      await trackPageView({
        sessionId,
        page: "/",
      });

      // Track some interactions
      await trackAnalyticsEvent({
        sessionId,
        eventType: "click",
        eventName: "blog_link_click",
        page: "/",
      });

      // Navigate to blog
      await trackPageView({
        sessionId,
        page: "/blog",
      });

      // View a post
      await trackAnalyticsEvent({
        sessionId,
        eventType: "custom",
        eventName: "blog_post_view",
        page: "/blog/test-post",
      });

      // End session
      await createOrUpdateSession({
        sessionId,
        endTime: new Date(),
        duration: 300,
        pageCount: 2,
        eventCount: 2,
      });

      // Verify data was tracked
      const overview = await getAnalyticsOverview();
      expect(overview.totalSessions).toBeGreaterThan(0);
      expect(overview.totalPageViews).toBeGreaterThan(0);
      expect(overview.totalEvents).toBeGreaterThan(0);
    });

    it("should handle concurrent tracking", async () => {
      const promises = [];
      const timestamp = Date.now();
      for (let i = 0; i < 5; i++) {
        const sessionId = `concurrent-${timestamp}-${i}`;
        
        promises.push(
          trackPageView({
            sessionId,
            page: "/",
          })
        );
        
        promises.push(
          trackAnalyticsEvent({
            sessionId,
            eventType: "click",
            eventName: "test_click",
            page: "/",
          })
        );
      }

      await Promise.all(promises);
      
      const overview = await getAnalyticsOverview();
      expect(overview.totalPageViews).toBeGreaterThan(0);
      expect(overview.totalEvents).toBeGreaterThan(0);
    });
  });
});
