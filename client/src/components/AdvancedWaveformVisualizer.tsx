import { useEffect, useRef, useState } from "react";
import { BeatDetector, BeatData } from "@/lib/beatDetector";
import { FrequencyColorMapper } from "@/lib/frequencyColorMapper";

interface AdvancedWaveformVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

type VisualizationMode = "bars" | "waveform" | "spectrum";

export default function AdvancedWaveformVisualizer({
  audioElement,
  isPlaying,
}: AdvancedWaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const beatDetectorRef = useRef<BeatDetector | null>(null);
  const colorMapperRef = useRef<FrequencyColorMapper>(new FrequencyColorMapper());
  const animationIdRef = useRef<number | null>(null);
  const [mode, setMode] = useState<VisualizationMode>("bars");
  const [beatData, setBeatData] = useState<BeatData | null>(null);
  const beatPulseRef = useRef<number>(0);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement) return;

    const initAudioContext = () => {
      if (audioContextRef.current) return;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      beatDetectorRef.current = new BeatDetector(analyser);
    };

    const handleUserInteraction = () => {
      initAudioContext();
      audioElement.removeEventListener("play", handleUserInteraction);
    };

    audioElement.addEventListener("play", handleUserInteraction);

    return () => {
      audioElement.removeEventListener("play", handleUserInteraction);
    };
  }, [audioElement]);

  // Draw frequency bars with beat sync
  const drawBars = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
    beatData: BeatData | null
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / data.length) * 2.5;
    let x = 0;

    // Add beat pulse effect
    const beatPulse = beatData?.isBeat ? 1.3 : 1.0;
    const pulseDecay = Math.max(1.0, beatPulseRef.current);
    beatPulseRef.current = Math.max(1.0, beatPulseRef.current - 0.05);

    for (let i = 0; i < data.length; i++) {
      let barHeight = (data[i] / 255) * height;

      // Apply beat pulse to kick frequencies
      if (beatData?.kickDetected && i < data.length * 0.15) {
        barHeight *= pulseDecay;
      }

      // Get frequency-specific color
      const nyquist = 22050;
      const frequencyHz = (i / data.length) * nyquist;
      const color = colorMapperRef.current.getColorWithMagnitude(
        frequencyHz,
        data[i],
        255,
        100
      );

      ctx.fillStyle = color;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

      // Enhanced glow on beat
      const glowIntensity = beatData?.isBeat ? 0.8 : 0.6;
      const glowColor = color.replace("hsl", "hsla").replace(")", `, ${glowIntensity})`);
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = beatData?.isBeat ? 15 : 10;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }

    ctx.shadowColor = "transparent";
  };

  // Draw waveform with beat sync
  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
    beatData: BeatData | null
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, width, height);

    // Beat-responsive line width
    const lineWidth = beatData?.isBeat ? 3 : 2;
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = beatData?.isBeat
      ? "rgba(0, 255, 65, 0.8)"
      : "rgba(0, 255, 65, 0.5)";
    ctx.shadowBlur = beatData?.isBeat ? 20 : 15;

    ctx.beginPath();
    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.shadowColor = "transparent";
  };

  // Draw spectrum with beat sync
  const drawSpectrum = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number,
    beatData: BeatData | null
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    // Beat pulse for center circle
    const beatPulse = beatData?.isBeat ? 1.2 : 1.0;

    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      let value = data[i] / 255;

      // Enhance bass and kick on beat
      if (beatData?.kickDetected && i < data.length * 0.15) {
        value = Math.min(1, value * 1.3);
      }
      if (beatData?.bassDetected && i < data.length * 0.3) {
        value = Math.min(1, value * 1.2);
      }

      const barLength = value * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const nyquist = 22050;
      const frequencyHz = (i / data.length) * nyquist;
      const color = colorMapperRef.current.getColorWithMagnitude(
        frequencyHz,
        data[i],
        255,
        100
      );

      ctx.strokeStyle = color;
      ctx.lineWidth = beatData?.isBeat ? 4 : 3;
      const glowIntensity = beatData?.isBeat ? 0.9 : 0.8;
      const glowColor = color.replace("hsl", "hsla").replace(")", `, ${glowIntensity})`);
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = beatData?.isBeat ? 15 : 10;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw center circle with beat pulse
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 2;
    ctx.shadowColor = beatData?.isBeat
      ? "rgba(0, 255, 65, 0.8)"
      : "rgba(0, 255, 65, 0.5)";
    ctx.shadowBlur = beatData?.isBeat ? 15 : 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * beatPulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowColor = "transparent";
  };

  // Animation loop with beat detection
  useEffect(() => {
    if (!isPlaying || !canvasRef.current || !analyserRef.current) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(data);

      // Detect beats
      const currentBeatData = beatDetectorRef.current?.detect() || null;
      if (currentBeatData?.isBeat) {
        beatPulseRef.current = 1.3;
      }
      setBeatData(currentBeatData);

      switch (mode) {
        case "bars":
          drawBars(ctx, data, canvas.width, canvas.height, currentBeatData);
          break;
        case "waveform":
          drawWaveform(ctx, data, canvas.width, canvas.height, currentBeatData);
          break;
        case "spectrum":
          drawSpectrum(ctx, data, canvas.width, canvas.height, currentBeatData);
          break;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, mode]);

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setMode("bars")}
          className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-sm transition-all ${
            mode === "bars"
              ? "border-primary bg-primary text-black"
              : "border-primary/50 text-primary hover:border-primary"
          }`}
        >
          Bars
        </button>
        <button
          onClick={() => setMode("waveform")}
          className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-sm transition-all ${
            mode === "waveform"
              ? "border-primary bg-primary text-black"
              : "border-primary/50 text-primary hover:border-primary"
          }`}
        >
          Waveform
        </button>
        <button
          onClick={() => setMode("spectrum")}
          className={`px-3 py-1 text-xs font-mono uppercase tracking-widest border rounded-sm transition-all ${
            mode === "spectrum"
              ? "border-primary bg-primary text-black"
              : "border-primary/50 text-primary hover:border-primary"
          }`}
        >
          Spectrum
        </button>
      </div>

      <div className="w-full bg-black/50 border border-primary/50 rounded-sm overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={150}
          className="w-full h-32 bg-black"
        />
      </div>

      {beatData && (
        <div className="text-xs font-mono text-primary/70 space-y-1">
          <div className="flex justify-between">
            <span>BPM: {beatData.bpm}</span>
            <span>Beat: {beatData.beatStrength.toFixed(2)}</span>
            <span>Kick: {beatData.kickStrength.toFixed(2)}</span>
            <span>Bass: {beatData.bassStrength.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
