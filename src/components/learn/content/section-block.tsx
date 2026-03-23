import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionBlockProps {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionBlock({
  icon: Icon,
  title,
  children,
  className,
}: SectionBlockProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}
