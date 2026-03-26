"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  CheckCircle2,
  ListTodo,
  FolderKanban,
  BookOpen,
  Lightbulb,
  Compass,
  BarChart3,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: CheckCircle2 },
  { href: "/todos", label: "Todos", icon: ListTodo },
  { href: "/okr", label: "OKR Goals", icon: Target },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/content", label: "Content", icon: BookOpen },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/compass", label: "Life Compass", icon: Compass },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/learn", label: "Learn", icon: GraduationCap },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

function NavContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-8 px-4 flex items-center gap-2">
        <div className="h-6 w-6 bg-primary rounded-full" />
        <h1 className="font-bold text-lg tracking-tight">LearningTracker</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white shadow-sm text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 text-xs text-muted-foreground">
        <p>Simple & Elegant</p>
      </div>
    </>
  );
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile drawer (fixed overlay, only shown below md) */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        {/* Drawer panel */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-64 flex flex-col bg-background px-4 py-6 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <NavContent onClose={onClose} />
        </aside>
      </div>

      {/* Desktop sidebar (in flex flow, always visible at md+) */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 md:sticky md:top-0 md:h-screen px-4 py-6">
        <NavContent />
      </aside>
    </>
  );
}
