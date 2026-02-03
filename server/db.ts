import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactMessages, InsertContactMessage, newsletterSubscriptions, InsertNewsletterSubscription, blogPosts, InsertBlogPost, blogTags, InsertBlogTag, blogPostTags, pageViews, InsertPageView, analyticsEvents, InsertAnalyticsEvent, sessions, InsertSession, pageEngagement, InsertPageEngagement } from "../drizzle/schema";
import { ENV } from './_core/env';
import { eq, desc, count, avg } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Contact message queries
export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(contactMessages).values(data);
  return result;
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db.select().from(contactMessages);
}

// Newsletter subscription queries
export async function subscribeToNewsletter(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(newsletterSubscriptions).values({ email, isActive: 1 });
    return result;
  } catch (error: any) {
    // Handle duplicate email
    if (error.code === "ER_DUP_ENTRY") {
      // Try to reactivate if it exists
      await db.update(newsletterSubscriptions).set({ isActive: 1 }).where(eq(newsletterSubscriptions.email, email));
      return { success: true };
    }
    throw error;
  }
}

export async function getNewsletterSubscriptions() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.isActive, 1));
}

export async function unsubscribeFromNewsletter(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.update(newsletterSubscriptions).set({ isActive: 0 }).where(eq(newsletterSubscriptions.email, email));
}

// Blog post queries
export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(blogPosts).values(data);
  return result;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    return null;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  if (result.length === 0) return null;
  
  const post = result[0];
  const tags = await db
    .select({ id: blogTags.id, name: blogTags.name, slug: blogTags.slug })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(eq(blogPostTags.postId, post.id));
  
  return { ...post, tags };
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt));
  
  // Fetch tags for each post
  const postsWithTags = await Promise.all(
    posts.map(async (post) => {
      const tags = await db
        .select({ id: blogTags.id, name: blogTags.name, slug: blogTags.slug })
        .from(blogPostTags)
        .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
        .where(eq(blogPostTags.postId, post.id));
      return { ...post, tags };
    })
  );
  
  return postsWithTags;
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  // Delete associated tags first
  await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
  return await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// Blog tag queries
export async function createBlogTag(data: InsertBlogTag) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  try {
    const result = await db.insert(blogTags).values(data);
    return result;
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      // Tag already exists, return it
      const existing = await db.select().from(blogTags).where(eq(blogTags.slug, data.slug)).limit(1);
      return existing[0];
    }
    throw error;
  }
}

export async function getAllBlogTags() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db.select().from(blogTags);
}


// Analytics queries
export async function trackPageView(data: {
  sessionId: string;
  page: string;
  referrer?: string;
  userAgent?: string;
  ipHash?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.insert(pageViews).values(data);
}

export async function trackAnalyticsEvent(data: {
  sessionId: string;
  eventType: string;
  eventName: string;
  page: string;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  return await db.insert(analyticsEvents).values(data);
}

export async function createOrUpdateSession(data: {
  sessionId: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  pageCount?: number;
  eventCount?: number;
  referrer?: string;
  userAgent?: string;
  ipHash?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  try {
    // Try to insert first
    return await db.insert(sessions).values({
      sessionId: data.sessionId,
      startTime: data.startTime || new Date(),
      endTime: data.endTime,
      duration: data.duration,
      pageCount: data.pageCount || 0,
      eventCount: data.eventCount || 0,
      referrer: data.referrer,
      userAgent: data.userAgent,
      ipHash: data.ipHash,
    });
  } catch (error: any) {
    // If session exists, update it
    if (error.code === "ER_DUP_ENTRY") {
      return await db.update(sessions)
        .set({
          endTime: data.endTime,
          duration: data.duration,
          pageCount: data.pageCount,
          eventCount: data.eventCount,
        })
        .where(eq(sessions.sessionId, data.sessionId));
    }
    throw error;
  }
}

export async function getPageEngagementStats() {
  const db = await getDb();
  if (!db) {
    return [];
  }
  return await db.select().from(pageEngagement).orderBy(desc(pageEngagement.totalViews));
}

export async function getPageEngagementByPage(page: string) {
  const db = await getDb();
  if (!db) {
    return null;
  }
  const result = await db.select().from(pageEngagement).where(eq(pageEngagement.page, page)).limit(1);
  return result[0] || null;
}

export async function updatePageEngagement(page: string, data: Partial<InsertPageEngagement>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  try {
    // Try to insert first
    return await db.insert(pageEngagement).values({
      page,
      totalViews: data.totalViews || 0,
      uniqueVisitors: data.uniqueVisitors || 0,
      avgTimeOnPage: data.avgTimeOnPage || 0,
      bounceRate: data.bounceRate || 0,
    });
  } catch (error: any) {
    // If page exists, update it
    if (error.code === "ER_DUP_ENTRY") {
      return await db.update(pageEngagement)
        .set(data)
        .where(eq(pageEngagement.page, page));
    }
    throw error;
  }
}

export async function getAnalyticsOverview() {
  const db = await getDb();
  if (!db) {
    return {
      totalSessions: 0,
      totalPageViews: 0,
      totalEvents: 0,
      avgSessionDuration: 0,
    };
  }

  try {
    const sessionStats = await db.select({
      count: count(),
      avgDuration: avg(sessions.duration),
    }).from(sessions);

    const pageViewCount = await db.select({ count: count() }).from(pageViews);
    const eventCount = await db.select({ count: count() }).from(analyticsEvents);

    return {
      totalSessions: sessionStats[0]?.count || 0,
      totalPageViews: pageViewCount[0]?.count || 0,
      totalEvents: eventCount[0]?.count || 0,
      avgSessionDuration: Math.floor(Number(sessionStats[0]?.avgDuration) || 0),
    };
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    return {
      totalSessions: 0,
      totalPageViews: 0,
      totalEvents: 0,
      avgSessionDuration: 0,
    };
  }
}

export async function getTopPages(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select({
      page: pageViews.page,
      views: count(),
    })
      .from(pageViews)
      .groupBy(pageViews.page)
      .orderBy(desc(count()))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching top pages:", error);
    return [];
  }
}

export async function getTopEvents(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select({
      eventName: analyticsEvents.eventName,
      count: count(),
    })
      .from(analyticsEvents)
      .groupBy(analyticsEvents.eventName)
      .orderBy(desc(count()))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching top events:", error);
    return [];
  }
}

export async function getRecentSessions(limit: number = 20) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    return await db.select()
      .from(sessions)
      .orderBy(desc(sessions.startTime))
      .limit(limit);
  } catch (error) {
    console.error("Error fetching recent sessions:", error);
    return [];
  }
}
