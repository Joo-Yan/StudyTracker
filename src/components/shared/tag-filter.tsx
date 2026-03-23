"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type TagEntity } from "@/lib/tags";

interface Props {
  entity: TagEntity;
  selected: string | null;
  onSelect: (tag: string | null) => void;
  refreshKey?: number;
}

export function TagFilter({ entity, selected, onSelect, refreshKey }: Props) {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/tags?entity=${encodeURIComponent(entity)}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : [])
      .then((data: string[]) => setTags(data))
      .catch(() => {
        if (!controller.signal.aborted) setTags([]);
      });
    return () => controller.abort();
  }, [entity, refreshKey]);

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge
        variant={selected === null ? "default" : "outline"}
        className="cursor-pointer text-xs"
        onClick={() => onSelect(null)}
      >
        All
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selected === tag ? "default" : "outline"}
          className={cn("cursor-pointer text-xs", selected === tag && "ring-1 ring-primary")}
          onClick={() => onSelect(selected === tag ? null : tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
