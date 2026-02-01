import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import AdvancedWaveformVisualizer from "./AdvancedWaveformVisualizer";
import { useBeatAnimation } from "@/hooks/useBeatAnimation";
import { BeatDetector, BeatData } from "@/lib/beatDetector";

interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  youtubeUrl: string;
}

const tracks: Track[] = [
  {
    id: "1",
    title: "MIX 01",
    artist: "joydao.z",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663246729475/uAqGaXxMvLLAmuvj.wav",
    youtubeUrl: "https://www.youtube.com/@joydao.z",
  },
  {
    id: "2",
    title: "MIX 02",
    artist: "joydao.z",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663246729475/aXYcGzhFXKGtBvmE.wav",
    youtubeUrl: "https://www.youtube.com/@joydao.z",
  },
  {
    id: "3",
    title: "MIX 03",
    artist: "joydao.z",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663246729475/PiNEPzHSwyjKqJZK.wav",
    youtubeUrl: "https://www.youtube.com/@joydao.z",
  },
  {
    id: "4",
    title: "MIX 04",
    artist: "joydao.z",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663246729475/rrFTPCJhqyASbqLG.wav",
    youtubeUrl: "https://www.youtube.com/@joydao.z",
  },
  {
    id: "5",
    title: "MIX 05",
    artist: "joydao.z",
    audioUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663246729475/qZcRxIwDhfRZrOOl.wav",
    youtubeUrl: "https://www.youtube.com/@joydao.z",
  },
];

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [beatData, setBeatData] = useState<BeatData | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const beatDetectorRef = useRef<BeatDetector | null>(null);

  const { triggerBeat } = useBeatAnimation(
    {
      elementId: "play-button",
      preset: "pulse",
      intensity: 0.4,
      duration: 200,
      triggerOnBeat: true,
    },
    beatData
  );

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-black/80 border-2 border-green-500 rounded-none overflow-hidden backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Hidden audio element - Note: Direct YouTube URLs won't work in audio tags */}
        {/* You'll need to provide direct audio file URLs or use YouTube iframe API */}
        <audio ref={audioRef} src={currentTrack.audioUrl} />

        <div className="space-y-4">
          {/* Track Info */}
          <div className="text-center space-y-2">
            <div className="font-mono text-xs text-green-500 tracking-widest animate-pulse">
              NOW_PLAYING
            </div>
            <h3 className="font-mono text-lg text-green-500 uppercase tracking-wide truncate">
              {currentTrack.title}
            </h3>
            <p className="font-mono text-sm text-green-500/70">{currentTrack.artist}</p>
          </div>

          {/* Waveform Visualizer */}
          <AdvancedWaveformVisualizer
            audioElement={audioRef.current}
            isPlaying={isPlaying}
          />

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="cursor-pointer"
            />
            <div className="flex justify-between font-mono text-xs text-green-500/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="text-green-500 hover:text-black hover:bg-green-500 rounded-none"
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              id="play-button"
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="w-12 h-12 border-2 border-green-500 text-green-500 hover:text-black hover:bg-green-500 rounded-none"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="text-green-500 hover:text-black hover:bg-green-500 rounded-none"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="text-green-500 hover:text-black hover:bg-green-500 rounded-none shrink-0"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer"
            />
          </div>

          {/* View on YouTube */}
          <div className="text-center">
            <a
              href={currentTrack.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs text-green-500 hover:text-green-400 underline"
            >
              VIEW_ON_YOUTUBE →
            </a>
          </div>


        </div>
      </CardContent>
    </Card>
  );
}
