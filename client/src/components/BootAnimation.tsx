import { useEffect, useState } from "react";

interface BootAnimationProps {
  onComplete: () => void;
}

export default function BootAnimation({ onComplete }: BootAnimationProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const bootSequence = [
    "INITIALIZING NEURAL_INTERFACE...",
    "LOADING KERNEL v2.1.4",
    "MOUNTING FILESYSTEM...",
    "CHECKING MEMORY: 16GB OK",
    "LOADING DRIVERS...",
    "AUDIO_DRIVER: INITIALIZED",
    "GRAPHICS_DRIVER: INITIALIZED",
    "NETWORK_DRIVER: INITIALIZED",
    "CONNECTING TO GLOBAL_NETWORK...",
    "VERIFYING CREDENTIALS...",
    "ACCESS_GRANTED: JOYDAO.Z",
    "LOADING CREATIVE_SUITE...",
    "INITIALIZING VISUAL_SYSTEMS...",
    "CALIBRATING GLITCH_EFFECTS...",
    "SYSTEM_READY",
    "",
    "WELCOME TO THE NETWORK, AGENT.",
    "PRESS_ANY_KEY_TO_CONTINUE...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setLines((prev) => [...prev, bootSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        // Auto-complete after 2 seconds on the final screen
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* CRT Overlay */}
      <div className="absolute inset-0 crt-overlay opacity-50 pointer-events-none"></div>

      {/* Boot Screen */}
      <div className="w-full h-full max-w-4xl p-8 font-mono text-sm md:text-base text-primary flex flex-col justify-center">
        <div className="border-2 border-primary p-6 bg-black relative">
          {/* Terminal Header */}
          <div className="mb-4 pb-2 border-b border-primary/30">
            <div className="text-xs font-bold tracking-widest mb-2">
              NEURAL_BOOT_SEQUENCE v2.1.4
            </div>
            <div className="text-xs text-muted-foreground">
              TIMESTAMP: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Boot Output */}
          <div className="space-y-1 min-h-64 max-h-96 overflow-y-auto">
            {lines.map((line, i) => {
              const lineStr = line || "";
              const isReady = lineStr.includes("READY") || lineStr.includes("GRANTED");
              const isError = lineStr.includes("ERROR") || lineStr.includes("FAILED");
              const colorClass = isReady
                ? "text-accent font-bold"
                : isError
                ? "text-destructive"
                : "text-primary";

              return (
                <div key={i} className={`leading-relaxed ${colorClass}`}>
                  <span className="text-muted-foreground">{`>`}</span> {lineStr}
                </div>
              );
            })}
            {isComplete && (
              <div className="mt-4 animate-pulse">
                <span className="text-primary">_</span>
              </div>
            )}
          </div>

          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10"></div>
        </div>

        {/* Skip Hint */}
        <div className="text-center mt-6 text-xs text-muted-foreground animate-pulse">
          INITIALIZING... PLEASE WAIT
        </div>
      </div>
    </div>
  );
}
