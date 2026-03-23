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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 px-4 py-6">
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
    </aside>
  );
}
