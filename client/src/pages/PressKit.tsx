import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, ExternalLink, FileText, Image, Music, Video } from "lucide-react";

export default function PressKit() {
  const downloadAsset = (assetName: string) => {
    // Placeholder for download functionality
    alert(`Download initiated for: ${assetName}\n\nNote: In production, this would trigger a real download.`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-accent/30 py-8">
        <div className="container space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-accent animate-pulse"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent font-mono">
              PRESS_KIT
            </h1>
            <div className="flex-1 border-t border-accent/30"></div>
          </div>
          <p className="text-muted-foreground font-mono text-sm max-w-2xl">
            <span className="text-accent">{">"}</span> MEDIA_ASSETS: DOWNLOAD_READY
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 space-y-12">
        {/* Bio Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">BIO</h2>
          </div>
          
          <div className="border-2 border-accent/30 p-6 bg-black/50 space-y-4">
            <div className="font-mono text-xs text-accent mb-4">
              <span>{">"}</span> ARTIST_PROFILE_LOADED
            </div>
            
            <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                <strong className="text-accent">joydao.z</strong> is a multidisciplinary creative force 
                operating at the intersection of experimental electronic music, visual glitch art, and 
                cyberpunk aesthetics. Based in the digital underground, joydao.z crafts sonic landscapes 
                that blur the boundaries between chaos and control, noise and melody.
              </p>
              
              <p>
                Drawing inspiration from the raw energy of punk culture and the dystopian visions of 
                cyberpunk fiction, joydao.z's work explores themes of technological decay, digital 
                rebellion, and the fragmentation of modern identity. Through a combination of deep 
                dubstep, experimental bass music, and glitchy sound design, each release is a 
                transmission from the edge of the digital void.
              </p>
              
              <p>
                Known for immersive live performances and boundary-pushing collaborations with artists 
                like catacomes, Jamie Rose X, and Ghosts Bones N Grime, joydao.z continues to push 
                the limits of audio-visual expression in the underground electronic music scene.
              </p>
            </div>

            <Separator className="bg-accent/20" />

            <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <span className="text-accent">LOCATION:</span> Digital Underground
              </div>
              <div>
                <span className="text-accent">GENRES:</span> Experimental Bass, Glitch, Dubstep
              </div>
              <div>
                <span className="text-accent">ACTIVE_SINCE:</span> 2020
              </div>
              <div>
                <span className="text-accent">STATUS:</span> ACTIVE_TRANSMISSION
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">QUICK_FACTS</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="text-accent font-mono text-sm">PLATFORMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• YouTube: @joydao.z</div>
                <div>• SoundCloud: lightoftransfer</div>
                <div>• Spotify: joydao.z</div>
                <div>• Instagram: @joydao.light</div>
                <div>• TikTok: @joydao.z</div>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="text-accent font-mono text-sm">COLLABORATORS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• catacomes</div>
                <div>• Jamie Rose X</div>
                <div>• Ghosts Bones N Grime</div>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="text-accent font-mono text-sm">NOTABLE_RELEASES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>• smoking blvnts</div>
                <div>• D.D.T.S. 2</div>
                <div>• Deep Dubsound Trench Steppa</div>
                <div>• Crash Out Core</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Downloadable Assets */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">DOWNLOADABLE_ASSETS</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Photos */}
            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-mono">
                  <Image className="w-4 h-4" />
                  PRESS_PHOTOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  High-resolution promotional images for media use.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_press_photo_01.jpg")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    PHOTO_01.JPG (3000x3000)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_press_photo_02.jpg")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    PHOTO_02.JPG (3000x3000)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_press_photos_all.zip")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    ALL_PHOTOS.ZIP
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Logos */}
            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-mono">
                  <Image className="w-4 h-4" />
                  LOGOS_&_BRANDING
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Official logos and branding assets in various formats.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_logo_black.png")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    LOGO_BLACK.PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_logo_white.png")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    LOGO_WHITE.PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_logos_all.zip")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    ALL_LOGOS.ZIP
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Music Samples */}
            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-mono">
                  <Music className="w-4 h-4" />
                  MUSIC_SAMPLES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Audio samples for promotional and broadcast use.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_sample_01.mp3")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    SAMPLE_01.MP3 (30s)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_sample_02.mp3")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    SAMPLE_02.MP3 (30s)
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_music_samples.zip")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    ALL_SAMPLES.ZIP
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Content */}
            <Card className="border-accent/30 bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-mono">
                  <Video className="w-4 h-4" />
                  VIDEO_CONTENT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Video clips and performance footage.
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_promo_video.mp4")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    PROMO_VIDEO.MP4
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    onClick={() => downloadAsset("joydao_live_performance.mp4")}
                  >
                    <Download className="w-3 h-3 mr-2" />
                    LIVE_PERFORMANCE.MP4
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent/50 text-accent hover:bg-accent/10 font-mono text-xs"
                    asChild
                  >
                    <a href="https://www.youtube.com/@joydao.z" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      VIEW_YOUTUBE_CHANNEL
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">CONTACT_INFO</h2>
          </div>

          <div className="border-2 border-accent/30 p-6 bg-black/50 space-y-4">
            <div className="font-mono text-xs text-accent mb-4">
              <span>{">"}</span> MEDIA_INQUIRIES_WELCOME
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-accent font-mono">BOOKING:</span>
                <span className="ml-2">Via contact form on website</span>
              </div>
              <div>
                <span className="text-accent font-mono">PRESS:</span>
                <span className="ml-2">Via contact form on website</span>
              </div>
              <div>
                <span className="text-accent font-mono">GENERAL:</span>
                <span className="ml-2">Via contact form on website</span>
              </div>
            </div>

            <Separator className="bg-accent/20" />

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 font-mono"
                asChild
              >
                <a href="/">
                  RETURN_HOME
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10 font-mono"
                asChild
              >
                <a href="/#contact">
                  CONTACT_FORM
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">USAGE_GUIDELINES</h2>
          </div>

          <div className="border-l-2 border-accent/50 pl-6 space-y-3 text-sm text-foreground/80">
            <p>
              All press kit materials are provided for editorial and promotional use by journalists, 
              bloggers, event promoters, and media outlets covering joydao.z.
            </p>
            <p>
              Please credit photos and materials appropriately. For high-resolution assets not listed 
              here or for specific requests, please reach out via the contact form.
            </p>
            <div className="border border-accent/30 p-4 bg-black/50 font-mono text-xs space-y-1">
              <div><span className="text-accent">{">"}</span> ATTRIBUTION_REQUIRED</div>
              <div><span className="text-accent">{">"}</span> COMMERCIAL_USE_PROHIBITED_WITHOUT_PERMISSION</div>
              <div><span className="text-accent">{">"}</span> MODIFICATIONS_DISCOURAGED</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
