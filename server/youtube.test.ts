import { describe, it, expect, beforeAll, vi } from "vitest";
import { getLatestUploads } from "./youtube";

describe("YouTube Service", () => {
  beforeAll(() => {
    // Ensure API key is set
    if (!process.env.YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY environment variable is required for tests");
    }
  });

  it("should fetch latest uploads successfully", async () => {
    const videos = await getLatestUploads(3);
    
    expect(videos).toBeDefined();
    expect(Array.isArray(videos)).toBe(true);
    expect(videos.length).toBeGreaterThan(0);
    expect(videos.length).toBeLessThanOrEqual(3);
  });

  it("should return videos with required properties", async () => {
    const videos = await getLatestUploads(1);
    
    expect(videos.length).toBeGreaterThan(0);
    const video = videos[0];
    
    expect(video).toHaveProperty("id");
    expect(video).toHaveProperty("title");
    expect(video).toHaveProperty("description");
    expect(video).toHaveProperty("thumbnail");
    expect(video).toHaveProperty("publishedAt");
    expect(video).toHaveProperty("url");
    expect(video).toHaveProperty("channelTitle");
    
    expect(typeof video.id).toBe("string");
    expect(typeof video.title).toBe("string");
    expect(typeof video.url).toBe("string");
    expect(video.url).toContain("youtube.com");
  });

  it("should respect the limit parameter", async () => {
    const videos1 = await getLatestUploads(1);
    const videos3 = await getLatestUploads(3);
    
    expect(videos1.length).toBeLessThanOrEqual(1);
    expect(videos3.length).toBeLessThanOrEqual(3);
  });

  it("should throw error if API key is not configured", async () => {
    const originalKey = process.env.YOUTUBE_API_KEY;
    delete process.env.YOUTUBE_API_KEY;
    
    try {
      await expect(getLatestUploads(1)).rejects.toThrow("YOUTUBE_API_KEY not configured");
    } finally {
      process.env.YOUTUBE_API_KEY = originalKey;
    }
  });
});
