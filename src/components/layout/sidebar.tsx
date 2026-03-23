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
    <aside className="w-56 shrink-0 border-r bg-background flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b">
        <h1 className="font-bold text-lg tracking-tight">StudyTracker</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              (href === "/" ? pathname === "/" : pathname.startsWith(href))
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
