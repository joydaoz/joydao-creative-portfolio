import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  channelTitle: string;
}

interface VideoCarouselProps {
  videos: YouTubeVideo[];
  onVideoSelect?: (video: YouTubeVideo) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function VideoCarousel({
  videos,
  onVideoSelect,
  autoPlay = false,
  autoPlayInterval = 5000,
}: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || videos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, videos.length, autoPlayInterval]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    setIsAutoPlaying(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    if (onVideoSelect && videos[index]) {
      onVideoSelect(videos[index]);
    }
  };

  const handlePlayClick = () => {
    if (onVideoSelect && videos[currentIndex]) {
      onVideoSelect(videos[currentIndex]);
    }
  };

  const currentVideo = videos[currentIndex];

  if (!currentVideo) {
    return (
      <div className="w-full aspect-video bg-black/50 flex items-center justify-center text-muted-foreground font-mono">
        NO_VIDEOS_AVAILABLE
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Video Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse"></div>
        <div className="border-2 border-primary bg-black p-1 relative z-10 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
          <div className="aspect-video w-full bg-black relative overflow-hidden group">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <Button
                onClick={handlePlayClick}
                className="w-16 h-16 rounded-full bg-primary text-black hover:bg-primary/80 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,65,0.5)]"
              >
                <Play className="w-8 h-8 fill-current" />
              </Button>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-20"></div>
          </div>

          {/* Video Info */}
          <div className="bg-primary text-black text-xs font-bold p-3 space-y-1">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="truncate text-sm font-bold">{currentVideo.title}</h3>
                <p className="text-xs opacity-80">{currentVideo.channelTitle}</p>
              </div>
              <span className="whitespace-nowrap text-xs">
                {formatDate(currentVideo.publishedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="icon"
          className="border-primary text-primary hover:bg-primary hover:text-black rounded-none"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Thumbnail Strip */}
        <div className="flex-1 flex gap-2 overflow-x-auto px-2">
          {videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleThumbnailClick(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-none border-2 transition-all duration-300 overflow-hidden group ${
                index === currentIndex
                  ? "border-primary shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                  : "border-primary/30 hover:border-primary/60"
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Hover Overlay */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
              )}

              {/* Active Indicator */}
              {index === currentIndex && (
                <div className="absolute inset-0 border-2 border-primary"></div>
              )}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="border-primary text-primary hover:bg-primary hover:text-black rounded-none"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-primary/30 hover:bg-primary/60"
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center font-mono text-xs text-primary/70">
        {currentIndex + 1} / {videos.length}
      </div>
    </div>
  );
}
