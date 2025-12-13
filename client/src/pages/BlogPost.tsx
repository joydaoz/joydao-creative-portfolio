import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/blog/:slug");

  const slug = params?.slug as string;
  const postQuery = trpc.blog.getPostBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "Unpublished";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!match) return null;

  if (postQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black text-primary flex items-center justify-center">
        <span className="text-accent animate-pulse font-mono">
          LOADING_POST...
        </span>
      </div>
    );
  }

  if (!postQuery.data) {
    return (
      <div className="min-h-screen bg-black text-primary">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
          <button
            onClick={() => setLocation("/blog")}
            className="flex items-center gap-2 text-accent hover:text-primary transition-colors mb-8 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK_TO_BLOG
          </button>
          <div className="border border-accent/30 p-8 text-center bg-black/50">
            <p className="text-muted-foreground font-mono">
              POST_NOT_FOUND. ERROR_CODE: 404
            </p>
          </div>
        </div>
      </div>
    );
  }

  const post = postQuery.data;

  return (
    <div className="min-h-screen bg-black text-primary">
      {/* Header */}
      <div className="border-b border-accent/30 py-8 px-4 md:px-8 bg-black/50">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setLocation("/blog")}
            className="flex items-center gap-2 text-accent hover:text-primary transition-colors mb-6 font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK_TO_BLOG
          </button>

          <div className="flex items-start gap-3 mb-4">
            <FileText className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-accent font-mono mb-3">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <span className="text-xs px-2 py-1 border border-primary text-primary bg-black/50">
                  {post.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {post.excerpt && (
            <p className="text-primary text-lg italic border-l-2 border-accent pl-4 py-2">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none">
            <div className="border border-accent/20 p-8 bg-black/50">
              <Streamdown className="text-primary [&_h1]:text-accent [&_h2]:text-accent [&_h3]:text-accent [&_a]:text-accent [&_a]:hover:underline [&_code]:bg-black [&_code]:border [&_code]:border-accent/30 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_pre]:border [&_pre]:border-accent/30 [&_pre]:bg-black [&_pre]:p-4 [&_pre]:overflow-x-auto [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
                {post.content}
              </Streamdown>
            </div>
          </div>

          {/* Post Footer */}
          <div className="mt-12 pt-8 border-t border-accent/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-accent/20 p-4 bg-black/50">
                <p className="text-xs text-muted-foreground mb-2">PUBLISHED</p>
                <p className="text-accent font-mono">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
              <div className="border border-accent/20 p-4 bg-black/50">
                <p className="text-xs text-muted-foreground mb-2">LAST_UPDATED</p>
                <p className="text-accent font-mono">
                  {formatDate(post.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Back to Blog Button */}
          <div className="mt-8">
            <button
              onClick={() => setLocation("/blog")}
              className="flex items-center gap-2 px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK_TO_BLOG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
