import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import BlogPostForm from "@/components/BlogPostForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, Calendar, Eye, EyeOff } from "lucide-react";
import NavigationMenu from "@/components/NavigationMenu";

export default function AdminBlogEditor() {
  const { user, loading } = useAuth();
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Fetch all posts (admin view)
  const { data: allPosts, refetch: refetchPosts } = trpc.admin.getAllBlogPosts.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Delete mutation
  const deleteMutation = trpc.admin.deleteBlogPost.useMutation({
    onSuccess: () => {
      refetchPosts();
    },
  });

  // Check if user is admin
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-primary font-mono">
        <p className="animate-pulse">LOADING_AUTH...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-primary font-mono">
        <p>UNAUTHORIZED: ADMIN_ACCESS_REQUIRED</p>
      </div>
    );
  }

  const editingPost = allPosts?.find((post) => post.id === editingPostId);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* CRT Overlay */}
      <div className="fixed inset-0 z-50 crt-overlay pointer-events-none opacity-50 mix-blend-overlay" />

      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity" />

      {/* Header */}
      <header className="relative z-10 border-b border-primary/50 bg-background/80 backdrop-blur-sm p-4 sticky top-0">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-primary">
              BLOG_EDITOR
            </h1>
          </div>
          <NavigationMenu />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container py-8 md:py-12 space-y-8">
        {/* Editor Section */}
        {showNewPostForm || editingPostId ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">
                {editingPost ? "EDIT_POST" : "CREATE_NEW_POST"}
              </h2>
              <Button
                onClick={() => {
                  setShowNewPostForm(false);
                  setEditingPostId(null);
                }}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-black rounded-none uppercase tracking-widest"
              >
                Cancel
              </Button>
            </div>
            <BlogPostForm
              initialPost={editingPost}
              onSuccess={() => {
                setShowNewPostForm(false);
                setEditingPostId(null);
                refetchPosts();
              }}
            />
          </div>
        ) : (
          <>
            {/* Create New Post Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowNewPostForm(true)}
                className="bg-primary text-black hover:bg-primary/90 rounded-none uppercase tracking-widest font-mono"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-primary">ALL_POSTS</h2>

              {!allPosts || allPosts.length === 0 ? (
                <Card className="bg-black/80 border-primary rounded-none">
                  <CardContent className="pt-8 pb-8 text-center">
                    <p className="text-primary/70 font-mono">NO_POSTS_FOUND</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {allPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-black/80 border-primary rounded-none overflow-hidden hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] transition-all"
                    >
                      <CardHeader className="border-b border-primary/30 pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-primary text-lg mb-2">
                              {post.title}
                            </CardTitle>
                            <div className="flex items-center gap-4 text-sm text-primary/70 font-mono">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {post.publishedAt
                                  ? new Date(post.publishedAt).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )
                                  : "Not published"}
                              </div>
                              <div className="flex items-center gap-1">
                                {post.status === "published" ? (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    Published
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-4 h-4" />
                                    Draft
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`rounded-none text-xs uppercase tracking-widest ${
                              post.status === "published"
                                ? "bg-primary/20 text-primary border border-primary/50"
                                : "bg-accent/20 text-accent border border-accent/50"
                            }`}
                          >
                            {post.status}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4 space-y-4">
                        {post.excerpt && (
                          <p className="text-primary/80 text-sm line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Tags display */}

                        <div className="flex gap-2 pt-2 border-t border-primary/20">
                          <Button
                            onClick={() => setEditingPostId(post.id)}
                            variant="outline"
                            size="sm"
                            className="border-primary text-primary hover:bg-primary hover:text-black rounded-none flex-1 font-mono text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete "${post.title}"? This cannot be undone.`
                                )
                              ) {
                                deleteMutation.mutate({ id: post.id });
                              }
                            }}
                            disabled={deleteMutation.isPending}
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive hover:text-white rounded-none flex-1 font-mono text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
