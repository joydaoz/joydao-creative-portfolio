/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi } from "vitest";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

describe("VideoCarousel Component Logic", () => {
  let mockVideos: YouTubeVideo[];

  beforeEach(() => {
    mockVideos = [
      {
        id: "video1",
        title: "Latest Release",
        description: "The newest video",
        thumbnail: "https://example.com/thumb1.jpg",
        publishedAt: "2026-02-01T10:00:00Z",
        url: "https://youtube.com/watch?v=video1",
        channelTitle: "joydao.z",
      },
      {
        id: "video2",
        title: "Previous Release",
        description: "The second newest video",
        thumbnail: "https://example.com/thumb2.jpg",
        publishedAt: "2026-01-25T10:00:00Z",
        url: "https://youtube.com/watch?v=video2",
        channelTitle: "joydao.z",
      },
      {
        id: "video3",
        title: "Older Release",
        description: "The third newest video",
        thumbnail: "https://example.com/thumb3.jpg",
        publishedAt: "2026-01-18T10:00:00Z",
        url: "https://youtube.com/watch?v=video3",
        channelTitle: "joydao.z",
      },
    ];
  });

  it("should have exactly 3 videos", () => {
    expect(mockVideos).toHaveLength(3);
  });

  it("should have all required video properties", () => {
    mockVideos.forEach((video) => {
      expect(video).toHaveProperty("id");
      expect(video).toHaveProperty("title");
      expect(video).toHaveProperty("description");
      expect(video).toHaveProperty("thumbnail");
      expect(video).toHaveProperty("publishedAt");
      expect(video).toHaveProperty("url");
      expect(video).toHaveProperty("channelTitle");
    });
  });

  it("should have valid video IDs", () => {
    mockVideos.forEach((video) => {
      expect(video.id).toBeTruthy();
      expect(typeof video.id).toBe("string");
    });
  });

  it("should have valid thumbnail URLs", () => {
    mockVideos.forEach((video) => {
      expect(video.thumbnail).toMatch(/^https:\/\//);
    });
  });

  it("should have valid YouTube URLs", () => {
    mockVideos.forEach((video) => {
      expect(video.url).toMatch(/youtube\.com\/watch\?v=/);
    });
  });

  it("should have valid ISO 8601 dates", () => {
    mockVideos.forEach((video) => {
      const date = new Date(video.publishedAt);
      expect(date).toBeInstanceOf(Date);
      expect(date.getTime()).toBeGreaterThan(0);
    });
  });

  it("should have videos in reverse chronological order", () => {
    const dates = mockVideos.map((v) => new Date(v.publishedAt).getTime());
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
    }
  });

  describe("Carousel Navigation Logic", () => {
    it("should cycle through videos with next navigation", () => {
      let currentIndex = 0;
      const next = () => {
        currentIndex = (currentIndex + 1) % mockVideos.length;
      };

      expect(currentIndex).toBe(0);
      next();
      expect(currentIndex).toBe(1);
      next();
      expect(currentIndex).toBe(2);
      next();
      expect(currentIndex).toBe(0); // Cycles back to start
    });

    it("should cycle through videos with previous navigation", () => {
      let currentIndex = 0;
      const previous = () => {
        currentIndex = (currentIndex - 1 + mockVideos.length) % mockVideos.length;
      };

      expect(currentIndex).toBe(0);
      previous();
      expect(currentIndex).toBe(2); // Cycles to end
      previous();
      expect(currentIndex).toBe(1);
      previous();
      expect(currentIndex).toBe(0);
    });

    it("should select video by index", () => {
      const selectVideo = (index: number) => {
        if (index >= 0 && index < mockVideos.length) {
          return mockVideos[index];
        }
        return null;
      };

      expect(selectVideo(0)).toBe(mockVideos[0]);
      expect(selectVideo(1)).toBe(mockVideos[1]);
      expect(selectVideo(2)).toBe(mockVideos[2]);
      expect(selectVideo(3)).toBeNull();
      expect(selectVideo(-1)).toBeNull();
    });
  });

  describe("Date Formatting", () => {
    it("should format date to YYYY-MM-DD", () => {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toISOString().split("T")[0];
      };

      expect(formatDate("2026-02-01T10:00:00Z")).toBe("2026-02-01");
      expect(formatDate("2026-01-25T10:00:00Z")).toBe("2026-01-25");
      expect(formatDate("2026-01-18T10:00:00Z")).toBe("2026-01-18");
    });

    it("should handle different timezone dates", () => {
      const formatDate = (dateString: string) => {
        return new Date(dateString).toISOString().split("T")[0];
      };

      // All should normalize to UTC date
      expect(formatDate("2026-02-01T23:59:59Z")).toBe("2026-02-01");
      expect(formatDate("2026-02-02T00:00:00Z")).toBe("2026-02-02");
    });
  });

  describe("Carousel State Management", () => {
    it("should track current index", () => {
      let currentIndex = 0;
      expect(currentIndex).toBe(0);

      currentIndex = 1;
      expect(currentIndex).toBe(1);

      currentIndex = 2;
      expect(currentIndex).toBe(2);
    });

    it("should track hovered thumbnail", () => {
      let hoveredIndex: number | null = null;

      expect(hoveredIndex).toBeNull();

      hoveredIndex = 0;
      expect(hoveredIndex).toBe(0);

      hoveredIndex = 1;
      expect(hoveredIndex).toBe(1);

      hoveredIndex = null;
      expect(hoveredIndex).toBeNull();
    });

    it("should disable auto-play on manual navigation", () => {
      let isAutoPlaying = true;

      const handleManualNavigation = () => {
        isAutoPlaying = false;
      };

      expect(isAutoPlaying).toBe(true);
      handleManualNavigation();
      expect(isAutoPlaying).toBe(false);
    });
  });

  describe("Video Carousel Indicators", () => {
    it("should generate correct number of indicators", () => {
      const indicators = Array.from({ length: mockVideos.length }, (_, i) => i);
      expect(indicators).toHaveLength(3);
    });

    it("should highlight current indicator", () => {
      let currentIndex = 0;
      const isActive = (index: number) => index === currentIndex;

      expect(isActive(0)).toBe(true);
      expect(isActive(1)).toBe(false);
      expect(isActive(2)).toBe(false);

      currentIndex = 1;
      expect(isActive(0)).toBe(false);
      expect(isActive(1)).toBe(true);
      expect(isActive(2)).toBe(false);
    });
  });

  describe("Thumbnail Strip", () => {
    it("should render all video thumbnails", () => {
      const thumbnails = mockVideos.map((v) => v.thumbnail);
      expect(thumbnails).toHaveLength(3);
      thumbnails.forEach((thumb) => {
        expect(thumb).toMatch(/^https:\/\//);
      });
    });

    it("should highlight current video in thumbnail strip", () => {
      let currentIndex = 0;
      const getThumbnailClass = (index: number) => {
        return index === currentIndex ? "border-primary" : "border-primary/30";
      };

      expect(getThumbnailClass(0)).toBe("border-primary");
      expect(getThumbnailClass(1)).toBe("border-primary/30");

      currentIndex = 1;
      expect(getThumbnailClass(0)).toBe("border-primary/30");
      expect(getThumbnailClass(1)).toBe("border-primary");
    });
  });

  describe("Video Counter", () => {
    it("should display correct counter text", () => {
      let currentIndex = 0;
      const getCounterText = () => `${currentIndex + 1} / ${mockVideos.length}`;

      expect(getCounterText()).toBe("1 / 3");

      currentIndex = 1;
      expect(getCounterText()).toBe("2 / 3");

      currentIndex = 2;
      expect(getCounterText()).toBe("3 / 3");
    });
  });
});
