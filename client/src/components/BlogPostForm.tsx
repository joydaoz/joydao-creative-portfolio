import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MarkdownEditor from "./MarkdownEditor";
import { X, Plus, Save, Eye } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface BlogPostFormProps {
  initialPost?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    status: "draft" | "published";
    tags?: Array<{ id: number; name: string; slug: string }>;
  };
  onSuccess?: () => void;
}

export default function BlogPostForm({ initialPost, onSuccess }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    content: initialPost?.content || "",
    excerpt: initialPost?.excerpt || "",
    status: (initialPost?.status || "draft") as "draft" | "published",
  });

  const [selectedTags, setSelectedTags] = useState<Array<{ id: number; name: string; slug: string }>>(
    initialPost?.tags || []
  );
  const [newTagName, setNewTagName] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Fetch available tags
  const { data: allTags } = trpc.blog.getAllTags.useQuery();

  // Create/update mutations
  const createMutation = trpc.admin.createBlogPost.useMutation();
  const updateMutation = trpc.admin.updateBlogPost.useMutation();

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialPost && formData.title) {
      const newSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, initialPost]);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    // Check if tag already exists
    const existingTag = allTags?.find(
      (tag) => tag.name.toLowerCase() === newTagName.toLowerCase()
    );

    if (existingTag) {
      if (!selectedTags.find((t) => t.id === existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag]);
      }
    } else {
      // Create new tag
      // Add new tag to selected tags
      setSelectedTags([
        ...selectedTags,
        {
          id: Date.now(),
          name: newTagName,
          slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
        },
      ]);
    }

    setNewTagName("");
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      if (initialPost) {
        await updateMutation.mutateAsync({
          id: initialPost.id,
          ...formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Card className="bg-black/80 border-primary rounded-none">
        <CardHeader className="border-b border-primary/30 pb-3">
          <CardTitle className="text-primary font-mono">Post Title</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Input
            type="text"
            placeholder="Enter post title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-black border-2 border-primary text-primary placeholder-primary/50 focus:ring-2 focus:ring-accent rounded-none"
            required
          />
        </CardContent>
      </Card>

      {/* Slug */}
      <Card className="bg-black/80 border-primary rounded-none">
        <CardHeader className="border-b border-primary/30 pb-3">
          <CardTitle className="text-primary font-mono">URL Slug</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Input
            type="text"
            placeholder="url-slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="bg-black border-2 border-primary text-primary placeholder-primary/50 focus:ring-2 focus:ring-accent rounded-none font-mono"
            required
          />
          <p className="text-xs text-primary/50 mt-2 font-mono">
            Auto-generated from title, customize as needed
          </p>
        </CardContent>
      </Card>

      {/* Excerpt */}
      <Card className="bg-black/80 border-primary rounded-none">
        <CardHeader className="border-b border-primary/30 pb-3">
          <CardTitle className="text-primary font-mono">Excerpt</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea
            placeholder="Brief summary of the post..."
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="bg-black border-2 border-primary text-primary placeholder-primary/50 focus:ring-2 focus:ring-accent rounded-none resize-none h-20"
          />
        </CardContent>
      </Card>

      {/* Content Editor */}
      <MarkdownEditor
        value={formData.content}
        onChange={(content) => setFormData({ ...formData, content })}
        placeholder="Write your post content here... Markdown supported"
      />

      {/* Tags */}
      <Card className="bg-black/80 border-primary rounded-none">
        <CardHeader className="border-b border-primary/30 pb-3">
          <CardTitle className="text-primary font-mono">Tags</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  className="bg-primary/20 text-primary border border-primary/50 rounded-none text-xs pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="hover:text-accent transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add Tag */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a tag..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              className="bg-black border-2 border-primary text-primary placeholder-primary/50 focus:ring-2 focus:ring-accent rounded-none flex-1"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              className="bg-primary text-black hover:bg-primary/90 rounded-none font-mono uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Available Tags */}
          {allTags && allTags.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-primary/50 font-mono">Available tags:</p>
              <div className="flex flex-wrap gap-1">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      if (!selectedTags.find((t) => t.id === tag.id)) {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    disabled={selectedTags.some((t) => t.id === tag.id)}
                    className={`px-2 py-1 text-xs border rounded-none font-mono transition-colors ${
                      selectedTags.some((t) => t.id === tag.id)
                        ? "border-primary/30 text-primary/50 bg-black/50 cursor-not-allowed"
                        : "border-primary/50 text-primary hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-black/80 border-primary rounded-none">
        <CardHeader className="border-b border-primary/30 pb-3">
          <CardTitle className="text-primary font-mono">Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                className="w-4 h-4"
              />
              <span className="text-primary font-mono">Draft</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === "published"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                className="w-4 h-4"
              />
              <span className="text-primary font-mono">Published</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-black rounded-none uppercase tracking-widest font-mono flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? "Hide Preview" : "Preview"}
        </Button>
        <Button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending || false}
          className="bg-primary text-black hover:bg-primary/90 rounded-none uppercase tracking-widest font-mono flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </form>
  );
}
