import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

export default function LatestReleases() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const latestReleasesQuery = trpc.youtube.getLatestReleases.useQuery({ limit: 3 }, { enabled: true });

  useEffect(() => {
    if (latestReleasesQuery.data) {
      setVideos(latestReleasesQuery.data);
      setLoading(false);
    }
    if (latestReleasesQuery.error) {
      setError("Failed to load latest releases");
      setLoading(false);
    }
  }, [latestReleasesQuery.data, latestReleasesQuery.error]);

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-accent animate-pulse"></div>
          <h2 className="text-3xl font-bold text-accent">LATEST_RELEASES</h2>
          <div className="flex-1 border-t border-accent/30"></div>
        </div>
        <div className="text-center text-muted-foreground font-mono text-sm">
          <span className="text-accent">{">"}</span> LOADING_RELEASES...
        </div>
      </section>
    );
  }

  if (error || videos.length === 0) {
    return (
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-accent animate-pulse"></div>
          <h2 className="text-3xl font-bold text-accent">LATEST_RELEASES</h2>
          <div className="flex-1 border-t border-accent/30"></div>
        </div>
        <div className="border border-accent/30 p-4 bg-black/50 font-mono text-xs text-muted-foreground">
          <div>
            <span className="text-accent">{">"}</span> ERROR: {error || "NO_RELEASES_FOUND"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-accent animate-pulse"></div>
        <h2 className="text-3xl font-bold text-accent">LATEST_RELEASES</h2>
        <div className="flex-1 border-t border-accent/30"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            onMouseEnter={() => setHoveredId(video.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative"
          >
            {/* Video Card */}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block border-2 border-accent overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-video bg-black overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Play Button Overlay */}
                {hoveredId === video.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-300">
                    <div className="w-16 h-16 border-2 border-accent rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-accent fill-accent" />
                    </div>
                  </div>
                )}

                {/* Scanline Effect */}
                {hoveredId === video.id && (
                  <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2 bg-black/50">
                {/* Title */}
                <h3 className="text-sm font-bold uppercase leading-tight line-clamp-2 text-accent group-hover:tracking-widest transition-all">
                  {video.title}
                </h3>

                {/* Published Date */}
                <p className="text-xs text-muted-foreground font-mono">
                  {new Date(video.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>

                {/* Description Preview */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {video.description || "No description available"}
                </p>

                {/* Link Indicator */}
                <div className="flex items-center gap-2 text-xs font-mono pt-2 opacity-0 group-hover:opacity-100 transition-opacity text-accent">
                  <span>WATCH_NOW</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {/* Terminal Info */}
      <div className="border border-accent/30 p-4 bg-black/50 font-mono text-xs text-muted-foreground space-y-2">
        <div>
          <span className="text-accent">{">"}</span> TOTAL_RELEASES: {videos.length}
        </div>
        <div>
          <span className="text-accent">{">"}</span> STATUS: STREAMING
        </div>
        <div>
          <span className="text-accent">{">"}</span> LAST_UPDATED: {new Date().toLocaleString()}
        </div>
      </div>
    </section>
  );
}
