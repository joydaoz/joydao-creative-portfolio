import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
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
  const [location] = useLocation();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return location === "/";
    }
    return location.startsWith(href);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen && e.key !== "Tab") return;

      switch (e.key) {
        case "Escape":
          if (isOpen) {
            e.preventDefault();
            closeMenu();
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev + 1;
            return next >= navLinks.length ? 0 : next;
          });
          break;

        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? navLinks.length - 1 : next;
          });
          break;

        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && linkRefs.current[focusedIndex]) {
            linkRefs.current[focusedIndex]?.click();
            closeMenu();
          }
          break;

        case "Tab":
          if (isOpen) {
            e.preventDefault();
            if (e.shiftKey) {
              setFocusedIndex((prev) => {
                const next = prev - 1;
                return next < 0 ? navLinks.length - 1 : next;
              });
            } else {
              setFocusedIndex((prev) => {
                const next = prev + 1;
                return next >= navLinks.length ? 0 : next;
              });
            }
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, focusedIndex]);

  // Focus the currently focused link
  useEffect(() => {
    if (focusedIndex >= 0 && linkRefs.current[focusedIndex]) {
      linkRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger Button */}
      <Button
        onClick={toggleMenu}
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 hover:text-primary rounded-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="nav-menu"
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
          role="presentation"
        />
      )}

      {/* Navigation Menu */}
      <nav
        id="nav-menu"
        className={`absolute right-0 top-full mt-2 bg-black border-2 border-primary shadow-[0_0_20px_rgba(0,255,65,0.3)] z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        } md:relative md:mt-0 md:border-0 md:shadow-none md:bg-transparent md:opacity-100 md:visible md:pointer-events-auto md:flex md:gap-1`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col md:flex-row md:gap-1">
          {navLinks.map((link, index) => {
            const active = isActive(link.href);
            const isFocused = focusedIndex === index;

            return (
              <Link key={link.href} href={link.href}>
                <a
                  ref={(el) => {
                    linkRefs.current[index] = el;
                  }}
                  onClick={closeMenu}
                  onFocus={() => isOpen && setFocusedIndex(index)}
                  className={`block px-4 py-3 md:px-2 md:py-1 text-sm font-mono transition-colors border-b border-primary/20 md:border-0 last:border-b-0 md:last:border-0 whitespace-nowrap outline-none ${
                    active
                      ? "bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                      : "text-primary hover:bg-primary hover:text-black"
                  } ${
                    isFocused
                      ? "ring-2 ring-accent ring-inset"
                      : ""
                  }`}
                  tabIndex={isOpen && isFocused ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
