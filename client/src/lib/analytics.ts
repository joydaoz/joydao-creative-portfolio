/**
 * Analytics tracking library for client-side event tracking
 * Tracks page views, clicks, interactions, and session data
 */

import { trpc } from "./trpc";

// Session management
let sessionId: string | null = null;
let sessionStartTime: number = 0;
let currentPage: string = "";
let pageStartTime: number = 0;
let pageViewCount: number = 0;
let eventCount: number = 0;

/**
 * Initialize analytics session
 * Should be called once on app load
 */
export function initializeAnalytics() {
  // Generate or retrieve session ID from sessionStorage
  sessionId = sessionStorage.getItem("analyticsSessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem("analyticsSessionId", sessionId);
  }

  sessionStartTime = Date.now();
  currentPage = window.location.pathname;
  pageStartTime = Date.now();

  // Track initial page view
  trackPageView(currentPage);

  // Listen for page changes (for SPA routing)
  setupRouteListener();

  // Setup unload handler to end session
  window.addEventListener("beforeunload", endSession);
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Track a page view
 */
export async function trackPageView(page: string) {
  if (!sessionId) return;

  currentPage = page;
  pageStartTime = Date.now();
  pageViewCount++;

  try {
    // Use fetch directly to avoid React hook issues in non-component context
    await fetch("/api/trpc/analytics.trackPageView", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          sessionId,
          page,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
}

/**
 * Track a user interaction event
 */
export async function trackEvent(
  eventType: "click" | "form_submit" | "video_play" | "audio_play" | "scroll" | "custom",
  eventName: string,
  metadata?: Record<string, any>
) {
  if (!sessionId) return;

  eventCount++;

  try {
    // Use fetch directly to avoid React hook issues in non-component context
    await fetch("/api/trpc/analytics.trackEvent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          sessionId,
          eventType,
          eventName,
          page: currentPage,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

/**
 * Track time spent on page
 */
export function getTimeOnPage(): number {
  return Math.floor((Date.now() - pageStartTime) / 1000);
}

/**
 * End the current session
 */
async function endSession() {
  if (!sessionId) return;

  const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

  try {
    // Use fetch directly to avoid React hook issues in non-component context
    await fetch("/api/trpc/analytics.endSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        json: {
          sessionId,
          duration: sessionDuration,
          pageCount: pageViewCount,
          eventCount,
        },
      }),
    });
  } catch (error) {
    console.error("Failed to end session:", error);
  }
}

/**
 * Setup listener for route changes (SPA routing)
 * Works with wouter router
 */
function setupRouteListener() {
  // Listen for history changes
  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function (...args) {
    originalPushState.apply(window.history, args);
    const newPath = args[2] as string;
    if (newPath !== currentPage) {
      trackPageView(newPath);
    }
  };

  window.history.replaceState = function (...args) {
    originalReplaceState.apply(window.history, args);
    const newPath = args[2] as string;
    if (newPath !== currentPage) {
      trackPageView(newPath);
    }
  };

  // Listen for popstate events (back/forward buttons)
  window.addEventListener("popstate", () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPage) {
      trackPageView(newPath);
    }
  });
}

/**
 * Helper to track external link clicks
 */
export function setupExternalLinkTracking() {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (link && link.href) {
      const href = link.href;
      const isExternal = !href.startsWith(window.location.origin);

      if (isExternal) {
        const url = new URL(href);
        trackEvent("click", "external_link_click", {
          url: href,
          domain: url.hostname,
          text: link.textContent?.trim(),
        });
      }
    }
  });
}

/**
 * Helper to track video plays
 */
export function trackVideoPlay(videoId: string, title?: string) {
  trackEvent("video_play", "youtube_video_play", {
    videoId,
    title,
  });
}

/**
 * Helper to track audio plays
 */
export function trackAudioPlay(audioTitle: string, duration?: number) {
  trackEvent("audio_play", "audio_track_play", {
    title: audioTitle,
    duration,
  });
}

/**
 * Helper to track blog post views
 */
export function trackBlogPostView(slug: string, title?: string) {
  trackEvent("custom", "blog_post_view", {
    slug,
    title,
  });
}

/**
 * Helper to track form submissions
 */
export function trackFormSubmit(formName: string, metadata?: Record<string, any>) {
  trackEvent("form_submit", `${formName}_submit`, metadata);
}

/**
 * Get current session info
 */
export function getSessionInfo() {
  return {
    sessionId,
    currentPage,
    pageViewCount,
    eventCount,
    timeOnPage: getTimeOnPage(),
    sessionDuration: Math.floor((Date.now() - sessionStartTime) / 1000),
  };
}
