import { ExternalLink, Music, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Collaborator {
  name: string;
  handle: string;
  instagramUrl: string;
  description: string;
  color: string;
}

const collaborators: Collaborator[] = [
  {
    name: "catacomes",
    handle: "@_catacomes",
    instagramUrl: "https://www.instagram.com/_catacomes",
    description:
      "Visual artist and creative collaborator exploring the intersection of sound and digital aesthetics.",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Jamie Rose X",
    handle: "@doggurljamierose",
    instagramUrl: "https://www.instagram.com/doggurljamierose?igsh=anZyYjc2MTR0bGNt",
    description:
      "Multi-disciplinary artist bringing experimental energy and sonic innovation to collaborative projects.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Ghosts Bones N Grime",
    handle: "@gbng.z",
    instagramUrl: "https://www.instagram.com/gbng.z?igsh=MWY1Z2FrMDhmN3EyNw==",
    description:
      "Collective exploring the raw edges of electronic music and visual culture with uncompromising vision.",
    color: "from-red-500 to-orange-600",
  },
];

export default function Collaborators() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-accent/30 py-8">
        <div className="container space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-accent animate-pulse"></div>
            <h1 className="text-4xl md:text-5xl font-bold text-accent font-mono">
              COLLABORATORS
            </h1>
            <div className="flex-1 border-t border-accent/30"></div>
          </div>
          <p className="text-muted-foreground font-mono text-sm max-w-2xl">
            <span className="text-accent">{">"}</span> NETWORK_ACTIVE: CONNECTING_WITH_CREATIVE_MINDS
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Terminal Info Box */}
        <div className="mb-12 border-2 border-accent/50 p-6 bg-black/50 font-mono text-sm space-y-2">
          <div>
            <span className="text-accent">{">"}</span> COLLABORATORS_LOADED: {collaborators.length}
          </div>
          <div>
            <span className="text-accent">{">"}</span> STATUS: ACTIVE_PARTNERSHIPS
          </div>
          <div>
            <span className="text-accent">{">"}</span> LAST_UPDATED: REAL_TIME
          </div>
        </div>

        {/* Collaborators Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {collaborators.map((collab, idx) => (
            <div
              key={idx}
              className="group relative border-2 border-accent/30 hover:border-accent transition-all duration-300 overflow-hidden"
            >
              {/* Glitch Background */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-6 space-y-4 bg-black/50 backdrop-blur-sm">
                {/* Colored Accent Line */}
                <div
                  className={`h-1 w-12 bg-gradient-to-r ${collab.color} group-hover:w-full transition-all duration-500`}
                />

                {/* Name and Handle */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-accent font-mono">
                    {collab.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {collab.handle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {collab.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-accent/20" />

                {/* Link Button */}
                <a
                  href={collab.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-accent/50 hover:border-accent hover:bg-accent/10 transition-all duration-300 font-mono text-sm text-accent group/link"
                >
                  <span>VISIT_PROFILE</span>
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>

                {/* Terminal Status */}
                <div className="pt-2 border-t border-accent/20 font-mono text-xs text-muted-foreground">
                  <div>
                    <span className="text-accent">{">"}</span> CONNECTED
                  </div>
                </div>
              </div>

              {/* Hover Glitch Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-accent animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <Separator className="bg-accent/30 my-12" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-accent font-mono">
              INTERESTED_IN_COLLABORATION?
            </h2>
          </div>

          <div className="border-l-2 border-accent/50 pl-6 space-y-4">
            <p className="text-foreground/80">
              These artists represent the cutting edge of experimental sound and visual culture. 
              If you're interested in exploring collaborative possibilities or learning more about 
              these creative minds, reach out through the contact form or connect directly via their 
              Instagram profiles.
            </p>

            <div className="border border-accent/30 p-4 bg-black/50 font-mono text-xs space-y-2">
              <div>
                <span className="text-accent">{">"}</span> COLLABORATION_PROTOCOL_ACTIVE
              </div>
              <div>
                <span className="text-accent">{">"}</span> CONTACT_AVAILABLE_VIA_FORM
              </div>
              <div>
                <span className="text-accent">{">"}</span> DIRECT_MESSAGE_ENCOURAGED
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Back */}
        <div className="mt-12 pt-8 border-t border-accent/30">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-mono text-sm"
          >
            <span>{"<"}</span>
            <span>RETURN_HOME</span>
          </a>
        </div>
      </div>
    </div>
  );
}
