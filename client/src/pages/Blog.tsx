import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Blog() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const postsQuery = trpc.blog.getPublishedPosts.useQuery();

  const filteredPosts = useMemo(() => {
    if (!postsQuery.data) return [];
    return postsQuery.data.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [postsQuery.data, searchQuery]);

  const handlePostClick = (slug: string) => {
    setLocation(`/blog/${slug}`);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unpublished";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-black text-primary">
      {/* Header */}
      <div className="border-b border-accent/30 py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold text-accent font-mono">
              BLOG
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            &gt; ACCESSING_NEURAL_DATABASE.BLOG_POSTS... ({filteredPosts.length} POSTS_FOUND)
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-accent/30 py-6 px-4 md:px-8 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <span className="absolute left-3 top-3 text-accent text-sm">&gt;</span>
            <input
              type="text"
              placeholder="SEARCH_POSTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-2 bg-black border border-accent/30 text-primary placeholder-muted-foreground focus:border-accent outline-none font-mono text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {postsQuery.isLoading ? (
            <div className="text-center py-12">
              <span className="text-accent animate-pulse font-mono">
                LOADING_POSTS...
              </span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="border border-accent/30 p-8 text-center bg-black/50">
              <p className="text-muted-foreground font-mono">
                NO_POSTS_FOUND. TRY_DIFFERENT_SEARCH_QUERY.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => handlePostClick(post.slug)}
                  className="group border border-accent/30 p-6 bg-black hover:border-accent hover:shadow-[0_0_15px_rgba(0,255,150,0.15)] transition-all cursor-pointer"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-xs px-2 py-1 border border-primary text-primary bg-black/50">
                      {post.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-lg font-bold text-accent mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-primary mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Post Meta */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 border-t border-accent/20 pt-4">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-accent text-sm font-mono group-hover:gap-3 transition-all">
                    <span>READ_POST</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Glitch Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-accent/30 py-8 px-4 md:px-8 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="border border-accent/20 p-4">
              <p className="text-2xl font-bold text-accent">
                {filteredPosts.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">POSTS_FOUND</p>
            </div>
            <div className="border border-accent/20 p-4">
              <p className="text-2xl font-bold text-primary">
                {postsQuery.data?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">TOTAL_POSTS</p>
            </div>
            <div className="border border-accent/20 p-4">
              <p className="text-2xl font-bold text-accent">
                {new Date().getFullYear()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">CURRENT_YEAR</p>
            </div>
            <div className="border border-accent/20 p-4">
              <p className="text-2xl font-bold text-primary">ACTIVE</p>
              <p className="text-xs text-muted-foreground mt-1">STATUS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
