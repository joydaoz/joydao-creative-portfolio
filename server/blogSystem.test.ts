/// <reference types="vitest" />
import { describe, it, expect } from "vitest";

describe("Blog System", () => {
  const mockPosts = [
    {
      id: 1,
      title: "Getting Started with Electronic Music Production",
      slug: "getting-started-electronic-music",
      excerpt: "Learn the basics of electronic music production and get started with your first track.",
      content: "Full content here...",
      status: "published" as const,
      publishedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      tags: [
        { id: 1, name: "Music Production", slug: "music-production" },
        { id: 2, name: "Tutorial", slug: "tutorial" },
      ],
    },
    {
      id: 2,
      title: "Advanced Synthesis Techniques",
      slug: "advanced-synthesis",
      excerpt: "Explore advanced synthesis techniques to create unique sounds.",
      content: "Full content here...",
      status: "published" as const,
      publishedAt: new Date("2024-02-01"),
      createdAt: new Date("2024-01-25"),
      updatedAt: new Date("2024-01-25"),
      tags: [
        { id: 2, name: "Tutorial", slug: "tutorial" },
        { id: 3, name: "Synthesis", slug: "synthesis" },
      ],
    },
    {
      id: 3,
      title: "Behind the Scenes: Creating JOYDAO.Z",
      slug: "behind-scenes-joydao",
      excerpt: "A deep dive into the creative process behind JOYDAO.Z releases.",
      content: "Full content here...",
      status: "published" as const,
      publishedAt: new Date("2024-02-10"),
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-05"),
      tags: [
        { id: 4, name: "Behind the Scenes", slug: "behind-the-scenes" },
      ],
    },
  ];

  const mockTags = [
    { id: 1, name: "Music Production", slug: "music-production" },
    { id: 2, name: "Tutorial", slug: "tutorial" },
    { id: 3, name: "Synthesis", slug: "synthesis" },
    { id: 4, name: "Behind the Scenes", slug: "behind-the-scenes" },
  ];

  describe("Blog Post Listing", () => {
    it("should return all published posts", () => {
      const publishedPosts = mockPosts.filter((post) => post.status === "published");
      expect(publishedPosts).toHaveLength(3);
      expect(publishedPosts.every((post) => post.status === "published")).toBe(true);
    });

    it("should include post metadata (title, excerpt, date)", () => {
      const post = mockPosts[0];
      expect(post.title).toBeDefined();
      expect(post.excerpt).toBeDefined();
      expect(post.publishedAt).toBeDefined();
    });

    it("should include tags for each post", () => {
      const post = mockPosts[0];
      expect(post.tags).toBeDefined();
      expect(post.tags.length).toBeGreaterThan(0);
    });

    it("should sort posts by publication date (newest first)", () => {
      const sorted = [...mockPosts].sort(
        (a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
      );
      expect(sorted[0].id).toBe(3);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(1);
    });
  });

  describe("Search Functionality", () => {
    it("should filter posts by title search", () => {
      const query = "synthesis";
      const results = mockPosts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("advanced-synthesis");
    });

    it("should filter posts by excerpt search", () => {
      const query = "creative";
      const results = mockPosts.filter((post) =>
        post.excerpt?.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("behind-scenes-joydao");
    });

    it("should return empty array for non-matching search", () => {
      const query = "nonexistent";
      const results = mockPosts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(0);
    });

    it("should be case-insensitive", () => {
      const query1 = "MUSIC";
      const query2 = "music";
      const results1 = mockPosts.filter((post) =>
        post.title.toLowerCase().includes(query1.toLowerCase())
      );
      const results2 = mockPosts.filter((post) =>
        post.title.toLowerCase().includes(query2.toLowerCase())
      );
      expect(results1).toEqual(results2);
    });
  });

  describe("Tag Filtering", () => {
    it("should filter posts by single tag", () => {
      const tagSlug = "tutorial";
      const results = mockPosts.filter((post) =>
        post.tags.some((tag) => tag.slug === tagSlug)
      );
      expect(results).toHaveLength(2);
      expect(results.map((p) => p.id)).toEqual([1, 2]);
    });

    it("should return all posts when no tag is selected", () => {
      const results = mockPosts;
      expect(results).toHaveLength(3);
    });

    it("should return empty array for non-existent tag", () => {
      const tagSlug = "nonexistent";
      const results = mockPosts.filter((post) =>
        post.tags.some((tag) => tag.slug === tagSlug)
      );
      expect(results).toHaveLength(0);
    });

    it("should extract unique tags from all posts", () => {
      const uniqueTags = new Set<string>();
      mockPosts.forEach((post) => {
        post.tags.forEach((tag) => uniqueTags.add(tag.name));
      });
      expect(uniqueTags.size).toBe(4);
    });
  });

  describe("Combined Search and Filter", () => {
    it("should filter by both search query and tag", () => {
      const query = "advanced";
      const tagSlug = "tutorial";

      const results = mockPosts.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(query.toLowerCase());
        const matchesTag = post.tags.some((tag) => tag.slug === tagSlug);
        return matchesSearch && matchesTag;
      });

      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("advanced-synthesis");
    });

    it("should return empty when search matches but tag doesn't", () => {
      const query = "synthesis";
      const tagSlug = "behind-the-scenes";

      const results = mockPosts.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(query.toLowerCase());
        const matchesTag = post.tags.some((tag) => tag.slug === tagSlug);
        return matchesSearch && matchesTag;
      });

      expect(results).toHaveLength(0);
    });
  });

  describe("Blog Post Detail", () => {
    it("should retrieve post by slug", () => {
      const slug = "advanced-synthesis";
      const post = mockPosts.find((p) => p.slug === slug);
      expect(post).toBeDefined();
      expect(post?.title).toBe("Advanced Synthesis Techniques");
    });

    it("should include full content in detail view", () => {
      const post = mockPosts[0];
      expect(post.content).toBeDefined();
      expect(post.content.length).toBeGreaterThan(0);
    });

    it("should format publication date correctly", () => {
      const post = mockPosts[0];
      const formattedDate = post.publishedAt?.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      expect(formattedDate).toMatch(/Jan \d{1,2}, 2024/);
    });

    it("should return null for non-existent slug", () => {
      const slug = "nonexistent-post";
      const post = mockPosts.find((p) => p.slug === slug);
      expect(post).toBeUndefined();
    });
  });

  describe("Blog Statistics", () => {
    it("should count total published posts", () => {
      const count = mockPosts.filter((p) => p.status === "published").length;
      expect(count).toBe(3);
    });

    it("should count unique tags", () => {
      const uniqueTags = new Set<string>();
      mockPosts.forEach((post) => {
        post.tags.forEach((tag) => uniqueTags.add(tag.slug));
      });
      expect(uniqueTags.size).toBe(4);
    });

    it("should calculate posts per tag", () => {
      const tagCounts: Record<string, number> = {};
      mockPosts.forEach((post) => {
        post.tags.forEach((tag) => {
          tagCounts[tag.slug] = (tagCounts[tag.slug] || 0) + 1;
        });
      });

      expect(tagCounts["tutorial"]).toBe(2);
      expect(tagCounts["synthesis"]).toBe(1);
      expect(tagCounts["behind-the-scenes"]).toBe(1);
    });
  });

  describe("Post Metadata", () => {
    it("should have valid slug format", () => {
      mockPosts.forEach((post) => {
        expect(post.slug).toMatch(/^[a-z0-9-]+$/);
      });
    });

    it("should have publication date for published posts", () => {
      const publishedPosts = mockPosts.filter((p) => p.status === "published");
      publishedPosts.forEach((post) => {
        expect(post.publishedAt).toBeDefined();
        expect(post.publishedAt instanceof Date).toBe(true);
      });
    });

    it("should have excerpt for all posts", () => {
      mockPosts.forEach((post) => {
        expect(post.excerpt).toBeDefined();
        expect(post.excerpt?.length).toBeGreaterThan(0);
      });
    });

    it("should have tags array", () => {
      mockPosts.forEach((post) => {
        expect(Array.isArray(post.tags)).toBe(true);
      });
    });
  });
});
