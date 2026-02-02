import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Heading2,
  List,
  Code,
  Link,
  Eye,
  Edit2,
} from "lucide-react";
import { Streamdown } from "streamdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content here... Markdown supported",
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || "text";

    const newValue =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <Card className="bg-black/80 border-primary rounded-none overflow-hidden">
      <CardHeader className="border-b border-primary/30 pb-3">
        <CardTitle className="text-primary font-mono">Content Editor</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
          <TabsList className="w-full rounded-none border-b border-primary/30 bg-black/50 p-0">
            <TabsTrigger
              value="edit"
              className="flex-1 rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-primary font-mono"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex-1 rounded-none border-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent text-primary font-mono"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="p-4 space-y-3">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 bg-black/50 border border-primary/30 rounded-none">
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("**", "**")}
                title="Bold"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("*", "*")}
                title="Italic"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("## ", "")}
                title="Heading 2"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("- ", "")}
                title="Bullet List"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("`", "`")}
                title="Inline Code"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => insertMarkdown("[", "](url)")}
                title="Link"
                className="rounded-none border-primary/50 text-primary hover:bg-primary hover:text-black"
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>

            {/* Editor */}
            <textarea
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-96 p-4 bg-black border-2 border-primary text-primary placeholder-primary/50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />

            {/* Character count */}
            <div className="text-right text-xs text-primary/50 font-mono">
              {value.length} characters
            </div>
          </TabsContent>

          <TabsContent value="preview" className="p-4">
            <div className="bg-black border-2 border-primary/30 p-4 min-h-96 max-h-96 overflow-auto">
              {value ? (
                <div className="prose prose-invert max-w-none">
                  <Streamdown>{value}</Streamdown>
                </div>
              ) : (
                <p className="text-primary/50 font-mono">No content to preview</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
