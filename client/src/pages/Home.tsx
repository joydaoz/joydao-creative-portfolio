import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Terminal, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [bootSequence, setBootSequence] = useState<string[]>([]);

  // Simulate boot sequence
  useEffect(() => {
    const sequence = [
      "INITIALIZING KERNEL...",
      "LOADING ASSETS...",
      "CONNECTING TO NEURAL NET...",
      "BYPASSING FIREWALL...",
      "ACCESS GRANTED: JOYDAO.Z",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setBootSequence((prev) => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Random glitch trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* CRT Overlay */}
      <div className="fixed inset-0 z-50 crt-overlay pointer-events-none opacity-50 mix-blend-overlay"></div>
      
      {/* Background Noise/Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-luminosity"></div>

      <header className="relative z-10 border-b border-primary/50 bg-background/80 backdrop-blur-sm p-4 sticky top-0">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary animate-pulse" />
            <h1 className="text-2xl md:text-4xl font-bold tracking-tighter glitch-text" data-text="JOYDAO.Z">
              JOYDAO.Z
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs md:text-sm font-mono text-muted-foreground">
            <span className="hidden md:inline-flex items-center gap-1">
              <Wifi className="w-3 h-3" /> NET_STATUS: ONLINE
            </span>
            <span className="animate-pulse text-accent">SYS_WARNING: UNSTABLE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 container py-8 md:py-12 space-y-12">
        
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="border border-primary p-4 bg-black/50 backdrop-blur-md relative group">
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary"></div>
              
              <div className="font-mono text-xs text-primary/70 mb-2">
                {bootSequence.map((line, i) => (
                  <div key={i} className="leading-tight">
                    {">"} {line}
                  </div>
                ))}
                <span className="animate-pulse">_</span>
              </div>
              
              <h2 className={`text-4xl md:text-6xl font-bold leading-none mb-4 ${glitchActive ? 'translate-x-1 text-accent' : ''}`}>
                DIGITAL<br/>CREATIVE<br/>WORKS
              </h2>
              <p className="text-lg text-muted-foreground max-w-md font-mono">
                Exploring the boundaries of audio-visual chaos. 
                Cyberpunk aesthetics. Glitch art. Sonic warfare.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black rounded-none uppercase tracking-widest group relative overflow-hidden" asChild>
                <a href="https://www.youtube.com/@joydao.z" target="_blank" rel="noopener noreferrer">
                  <span className="relative z-10 flex items-center gap-2">
                    YouTube <ExternalLink className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
              </Button>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black rounded-none uppercase tracking-widest group relative overflow-hidden" asChild>
                <a href="https://soundcloud.com/lightoftransfer" target="_blank" rel="noopener noreferrer">
                  <span className="relative z-10 flex items-center gap-2">
                    SoundCloud <ExternalLink className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
              </Button>
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black rounded-none uppercase tracking-widest group relative overflow-hidden" asChild>
                <a href="https://open.spotify.com/artist/3z9wVpo6YllEc7qzzRrh0w" target="_blank" rel="noopener noreferrer">
                  <span className="relative z-10 flex items-center gap-2">
                    Spotify <ExternalLink className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse"></div>
            <div className="border-2 border-primary bg-black p-1 relative z-10 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              <div className="aspect-video w-full bg-black relative overflow-hidden group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/0wxbt3Rkiks?autoplay=0&controls=1&rel=0&modestbranding=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                ></iframe>
                <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-20"></div>
              </div>
              <div className="bg-primary text-black text-xs font-bold p-1 flex justify-between">
                <span>LATEST_TRANSMISSION</span>
                <span>REC_DATE: 2025-10-12</span>
              </div>
            </div>
          </div>
        </section>

        <Separator className="bg-primary/30" />

        {/* Audio Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-bold text-primary">AUDIO_LOGS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* SoundCloud Embed */}
            <Card className="bg-black/80 border-accent rounded-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-2 z-10">
                <div className="w-3 h-3 bg-accent rounded-full animate-ping"></div>
              </div>
              <CardHeader className="border-b border-accent/30 pb-2">
                <CardTitle className="text-accent font-mono text-xl flex items-center gap-2">
                  <span className="text-xs bg-accent text-black px-1">SC</span>
                  LIGHTOFTRANSFER
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <iframe 
                  width="100%" 
                  height="400" 
                  scrolling="no" 
                  frameBorder="no" 
                  allow="autoplay" 
                  src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/lightoftransfer&color=%23ff0055&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                ></iframe>
              </CardContent>
            </Card>

            {/* Spotify Embed */}
            <Card className="bg-black/80 border-green-500 rounded-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-2 z-10">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping delay-75"></div>
              </div>
              <CardHeader className="border-b border-green-500/30 pb-2">
                <CardTitle className="text-green-500 font-mono text-xl flex items-center gap-2">
                  <span className="text-xs bg-green-500 text-black px-1">SP</span>
                  JOYDAO.Z
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[400px]">
                <iframe 
                  style={{borderRadius: "0px"}} 
                  src="https://open.spotify.com/embed/artist/3z9wVpo6YllEc7qzzRrh0w?utm_source=generator&theme=0" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allowFullScreen 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                ></iframe>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-primary/30 pt-8 pb-12 text-center font-mono text-sm text-muted-foreground">
          <div className="mb-4 flex justify-center gap-4">
            <div className="w-2 h-2 bg-primary animate-pulse"></div>
            <div className="w-2 h-2 bg-accent animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-primary animate-pulse delay-150"></div>
          </div>
          <p>
            SYSTEM SHUTDOWN IMMINENT... <br/>
            © 2025 JOYDAO.Z // ALL RIGHTS RESERVED
          </p>
        </footer>
      </main>
    </div>
  );
}
