import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "BLOG", href: "/blog" },
  { label: "COLLABORATORS", href: "/collaborators" },
  { label: "PRESS KIT", href: "/press-kit" },
  { label: "ADMIN", href: "/admin" },
];

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Hamburger Button */}
      <Button
        onClick={toggleMenu}
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 hover:text-primary rounded-none"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Navigation Menu */}
      <nav
        className={`absolute right-0 top-full mt-2 bg-black border-2 border-primary shadow-[0_0_20px_rgba(0,255,65,0.3)] z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        } md:relative md:mt-0 md:border-0 md:shadow-none md:bg-transparent md:opacity-100 md:visible md:pointer-events-auto md:flex md:gap-1`}
      >
        <div className="flex flex-col md:flex-row md:gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                onClick={closeMenu}
                className="block px-4 py-3 md:px-2 md:py-1 text-sm font-mono text-primary hover:bg-primary hover:text-black transition-colors border-b border-primary/20 md:border-0 last:border-b-0 md:last:border-0 whitespace-nowrap"
              >
                {link.label}
              </a>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
