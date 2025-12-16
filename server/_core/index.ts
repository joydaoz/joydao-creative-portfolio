import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // RSS Feed endpoint
  app.get("/blog/feed.xml", async (req, res) => {
    try {
      const { getPublishedBlogPosts } = await import("../db");
      const posts = await getPublishedBlogPosts();
      
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const feedUrl = `${baseUrl}/blog`;
      const lastBuildDate = posts.length > 0 ? new Date(posts[0].publishedAt || new Date()).toUTCString() : new Date().toUTCString();
      
      let rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>JoyDAO - Blog</title>
    <link>${feedUrl}</link>
    <description>Creative works, announcements, and updates from JoyDAO</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>JoyDAO - Blog</title>
      <link>${feedUrl}</link>
    </image>
`;
      
      posts.forEach((post) => {
        const postUrl = `${feedUrl}/${post.slug}`;
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
        const tags = post.tags?.map((tag) => `    <category>${escapeXml(tag.name)}</category>`).join("\n") || "";
        
        rssContent += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt || "")}</description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
${tags}
    </item>
`;
      });
      
      rssContent += `  </channel>
</rss>`;
      
      res.type("application/rss+xml");
      res.send(rssContent);
    } catch (error) {
      console.error("RSS feed error:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
