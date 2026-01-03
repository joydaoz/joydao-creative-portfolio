import { useEffect, useRef, useState } from "react";

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
  const animationIdRef = useRef<number | null>(null);
  const [mode, setMode] = useState<VisualizationMode>("bars");

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

  // Draw frequency bars
  const drawBars = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / data.length) * 2.5;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * height;

      // Cyberpunk gradient: green to red
      const hue = (i / data.length) * 120;
      const saturation = 100;
      const lightness = 50 + (data[i] / 255) * 30;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

      // Glow effect
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }

    ctx.shadowColor = "transparent";
  };

  // Draw waveform
  const drawWaveform = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 255, 65, 0.5)";
    ctx.shadowBlur = 15;

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

  // Draw spectrum (circular/radial)
  const drawSpectrum = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    width: number,
    height: number
  ) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    for (let i = 0; i < data.length; i++) {
      const angle = (i / data.length) * Math.PI * 2;
      const value = data[i] / 255;
      const barLength = value * radius;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barLength);
      const y2 = centerY + Math.sin(angle) * (radius + barLength);

      const hue = (i / data.length) * 120;
      const saturation = 100;
      const lightness = 50 + value * 30;

      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`;
      ctx.shadowBlur = 10;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw center circle
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(0, 255, 65, 0.5)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowColor = "transparent";
  };

  // Animation loop
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

      switch (mode) {
        case "bars":
          drawBars(ctx, data, canvas.width, canvas.height);
          break;
        case "waveform":
          drawWaveform(ctx, data, canvas.width, canvas.height);
          break;
        case "spectrum":
          drawSpectrum(ctx, data, canvas.width, canvas.height);
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
    </div>
  );
}
