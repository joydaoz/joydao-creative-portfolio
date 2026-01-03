import { useEffect, useRef, useState } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
}

export default function AudioVisualizer({
  audioElement,
  isPlaying,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioElement) return;

    const initAudioContext = () => {
      if (audioContextRef.current) return; // Already initialized

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Frequency bins (128 bars)
      analyser.smoothingTimeConstant = 0.85;

      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source as MediaElementAudioSourceNode;

      const bufferLength = analyser.frequencyBinCount;
      setDataArray(new Uint8Array(bufferLength));
    };

    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      audioElement.removeEventListener("play", handleUserInteraction);
    };

    audioElement.addEventListener("play", handleUserInteraction);

    return () => {
      audioElement.removeEventListener("play", handleUserInteraction);
    };
  }, [audioElement]);

  // Animation loop for visualization
  useEffect(() => {
    if (!isPlaying || !canvasRef.current || !analyserRef.current || !dataArray) {
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

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (data[i] / 255) * canvas.height;

        // Cyberpunk color gradient: green (#00ff41) to accent red (#ff0051)
        const hue = (i / bufferLength) * 120; // Green to red spectrum
        const saturation = 100;
        const lightness = 50 + (data[i] / 255) * 20; // Brighter when louder

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        // Add glow effect
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    };

    draw();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, dataArray]);

  return (
    <div className="w-full bg-black/50 border border-primary/50 rounded-sm overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={100}
        className="w-full h-24 bg-black"
      />
    </div>
  );
}
