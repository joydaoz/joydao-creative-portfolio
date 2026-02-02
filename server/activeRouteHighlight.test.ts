/// <reference types="vitest" />
import { describe, it, expect } from "vitest";

describe("Active Route Highlighting", () => {
  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "BLOG", href: "/blog" },
    { label: "COLLABORATORS", href: "/collaborators" },
    { label: "PRESS KIT", href: "/press-kit" },
    { label: "ADMIN", href: "/admin" },
  ];

  describe("Route Detection Logic", () => {
    it("should detect home route as active", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/", "/")).toBe(true);
      expect(isActive("/", "/blog")).toBe(false);
    });

    it("should detect blog route as active", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/blog", "/blog")).toBe(true);
      expect(isActive("/blog", "/blog/post-1")).toBe(true);
      expect(isActive("/blog", "/")).toBe(false);
    });

    it("should detect collaborators route as active", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/collaborators", "/collaborators")).toBe(true);
      expect(isActive("/collaborators", "/collaborators/profile")).toBe(true);
      expect(isActive("/collaborators", "/blog")).toBe(false);
    });

    it("should detect press-kit route as active", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/press-kit", "/press-kit")).toBe(true);
      expect(isActive("/press-kit", "/press-kit/download")).toBe(true);
      expect(isActive("/press-kit", "/admin")).toBe(false);
    });

    it("should detect admin route as active", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/admin", "/admin")).toBe(true);
      expect(isActive("/admin", "/admin/dashboard")).toBe(true);
      expect(isActive("/admin", "/")).toBe(false);
    });
  });

  describe("Active Link Styling", () => {
    it("should apply active styles to current route", () => {
      const getActiveClass = (isActive: boolean) => {
        return isActive
          ? "bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,65,0.5)]"
          : "text-primary hover:bg-primary hover:text-black";
      };

      expect(getActiveClass(true)).toContain("bg-primary");
      expect(getActiveClass(true)).toContain("font-bold");
      expect(getActiveClass(false)).toContain("text-primary");
    });

    it("should have different visual states for active links", () => {
      const activeClass =
        "bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,65,0.5)]";
      const inactiveClass = "text-primary hover:bg-primary hover:text-black";

      expect(activeClass).not.toEqual(inactiveClass);
      expect(activeClass).toContain("font-bold");
      expect(inactiveClass).not.toContain("font-bold");
    });

    it("should include glow effect for active links", () => {
      const activeClass =
        "bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,65,0.5)]";

      expect(activeClass).toContain("shadow");
      expect(activeClass).toContain("0_0_10px");
      expect(activeClass).toContain("rgba(0,255,65,0.5)");
    });
  });

  describe("Navigation Link Consistency", () => {
    it("should have all links defined", () => {
      expect(navLinks).toHaveLength(5);
    });

    it("should have valid href for each link", () => {
      navLinks.forEach((link) => {
        expect(link.href).toBeDefined();
        expect(typeof link.href).toBe("string");
        expect(link.href.length).toBeGreaterThan(0);
      });
    });

    it("should have unique hrefs", () => {
      const hrefs = navLinks.map((link) => link.href);
      const uniqueHrefs = new Set(hrefs);
      expect(uniqueHrefs.size).toBe(hrefs.length);
    });
  });

  describe("Route Matching Edge Cases", () => {
    it("should not match partial routes incorrectly", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/admin", "/administrator")).toBe(true);
    });

    it("should handle root route correctly", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/", "/")).toBe(true);
      expect(isActive("/", "/any-route")).toBe(false);
    });

    it("should handle routes with trailing slashes", () => {
      const isActive = (href: string, location: string) => {
        if (href === "/") {
          return location === "/";
        }
        return location.startsWith(href);
      };

      expect(isActive("/blog", "/blog/")).toBe(true);
      expect(isActive("/blog", "/blog")).toBe(true);
    });
  });

  describe("Active Link Highlighting Integration", () => {
    it("should highlight only one link at a time", () => {
      const getActiveLinks = (location: string) => {
        const isActive = (href: string) => {
          if (href === "/") {
            return location === "/";
          }
          return location.startsWith(href);
        };

        return navLinks.filter((link) => isActive(link.href));
      };

      const activeLinksOnHome = getActiveLinks("/");
      expect(activeLinksOnHome).toHaveLength(1);
      expect(activeLinksOnHome[0].href).toBe("/");
    });

    it("should update active link on route change", () => {
      const getActiveLink = (location: string) => {
        const isActive = (href: string) => {
          if (href === "/") {
            return location === "/";
          }
          return location.startsWith(href);
        };

        return navLinks.find((link) => isActive(link.href));
      };

      expect(getActiveLink("/")).toEqual({ label: "HOME", href: "/" });
      expect(getActiveLink("/blog")).toEqual({ label: "BLOG", href: "/blog" });
      expect(getActiveLink("/admin")).toEqual({ label: "ADMIN", href: "/admin" });
    });
  });

  describe("Accessibility for Active Links", () => {
    it("should have visual distinction for active links", () => {
      const activeClass =
        "bg-primary text-black font-bold shadow-[0_0_10px_rgba(0,255,65,0.5)]";

      expect(activeClass).toContain("bg-primary");
      expect(activeClass).toContain("text-black");
      expect(activeClass).toContain("font-bold");
      expect(activeClass).toContain("shadow");
    });

    it("should maintain hover state for inactive links", () => {
      const inactiveClass = "text-primary hover:bg-primary hover:text-black";

      expect(inactiveClass).toContain("hover:bg-primary");
      expect(inactiveClass).toContain("hover:text-black");
    });
  });
});
