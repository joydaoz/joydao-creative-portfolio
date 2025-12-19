import { useEffect } from "react";
import { Instagram, Music } from "lucide-react";

export default function SocialMediaFeeds() {
  useEffect(() => {
    // Load Instagram embed script
    const instagramScript = document.createElement("script");
    instagramScript.src = "//www.instagram.com/embed.js";
    instagramScript.async = true;
    document.body.appendChild(instagramScript);

    // Load TikTok embed script
    const tiktokScript = document.createElement("script");
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);

    // Process embeds after scripts load
    const processEmbeds = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
      if (window.tiktok) {
        window.tiktok.Embed.lib.render(document.body);
      }
    };

    // Wait for scripts to load
    setTimeout(processEmbeds, 1000);

    return () => {
      // Cleanup
      if (instagramScript.parentNode) {
        instagramScript.parentNode.removeChild(instagramScript);
      }
      if (tiktokScript.parentNode) {
        tiktokScript.parentNode.removeChild(tiktokScript);
      }
    };
  }, []);

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-accent animate-pulse"></div>
        <h2 className="text-3xl font-bold text-accent">SOCIAL_STREAMS</h2>
        <div className="flex-1 border-t border-accent/30"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Instagram Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold text-accent">
            <Instagram className="w-5 h-5" />
            <span>@joydao.light</span>
          </div>
          <div className="border-2 border-accent overflow-hidden bg-black/50 p-4">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink="https://www.instagram.com/joydao.light/"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: "0",
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px",
                maxWidth: "540px",
                minWidth: "326px",
                padding: "0",
                width: "calc(100% - 2px)",
              }}
            ></blockquote>
          </div>
          <div className="border border-accent/30 p-3 bg-black/50 font-mono text-xs text-muted-foreground">
            <div>
              <span className="text-accent">{">"}</span> INSTAGRAM_PROFILE_EMBEDDED
            </div>
            <div>
              <span className="text-accent">{">"}</span> HANDLE: @joydao.light
            </div>
          </div>
        </div>

        {/* TikTok Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold text-accent">
            <Music className="w-5 h-5" />
            <span>@joydao.z</span>
          </div>
          <div className="border-2 border-accent overflow-hidden bg-black/50 p-4">
            <blockquote
              className="tiktok-embed"
              cite="https://www.tiktok.com/@joydao.z"
              data-unique-id="joydao.z"
              data-embed-type="creator"
              style={{
                maxWidth: "325px",
                minWidth: "325px",
              }}
            >
              <section>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.tiktok.com/@joydao.z?refer=creator_embed"
                >
                  @joydao.z
                </a>
              </section>
            </blockquote>
          </div>
          <div className="border border-accent/30 p-3 bg-black/50 font-mono text-xs text-muted-foreground">
            <div>
              <span className="text-accent">{">"}</span> TIKTOK_PROFILE_EMBEDDED
            </div>
            <div>
              <span className="text-accent">{">"}</span> HANDLE: @joydao.z
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Info */}
      <div className="border border-accent/30 p-4 bg-black/50 font-mono text-xs text-muted-foreground space-y-2">
        <div>
          <span className="text-accent">{">"}</span> STATUS: SOCIAL_FEEDS_ACTIVE
        </div>
        <div>
          <span className="text-accent">{">"}</span> INSTAGRAM: CONNECTED
        </div>
        <div>
          <span className="text-accent">{">"}</span> TIKTOK: CONNECTED
        </div>
        <div>
          <span className="text-accent">{">"}</span> LAST_SYNC: REAL_TIME
        </div>
      </div>
    </section>
  );
}

// Type definitions for window objects
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    tiktok?: {
      Embed: {
        lib: {
          render: (element: HTMLElement) => void;
        };
      };
    };
  }
}
