"use client";

import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type TagEntity } from "@/lib/tags";

interface Props {
  entity: TagEntity;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ entity, value, onChange, placeholder = "Add tag..." }: Props) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/tags?entity=${encodeURIComponent(entity)}`, { signal: controller.signal })
      .then((res) => res.ok ? res.json() : [])
      .then((tags: string[]) => setSuggestions(tags))
      .catch(() => {
        if (!controller.signal.aborted) setSuggestions([]);
      });
    return () => controller.abort();
  }, [entity]);

  function addTag(tag: string) {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) addTag(input);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  const filtered = suggestions.filter(
    (s) => s.includes(input.toLowerCase()) && !value.includes(s)
  );
  const open = isFocused && input.trim().length > 0 && filtered.length > 0;

  return (
    <Popover.Root open={open} onOpenChange={setIsFocused}>
      <Popover.Anchor asChild>
        <div ref={containerRef} className="relative">
          <div className="flex min-h-[2.5rem] flex-wrap gap-1.5 rounded-md border bg-background p-2 focus-within:ring-1 focus-within:ring-ring">
            {value.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-destructive"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                requestAnimationFrame(() => {
                  if (!containerRef.current?.contains(document.activeElement)) {
                    setIsFocused(false);
                  }
                });
              }}
              placeholder={value.length === 0 ? placeholder : ""}
              className="h-auto min-w-[80px] flex-1 border-0 bg-transparent p-0 text-xs focus-visible:ring-0"
            />
          </div>
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          className="z-50 overflow-y-auto rounded-md border bg-background shadow-md"
          style={{
            width: "var(--radix-popper-anchor-width)",
            maxHeight: "min(10rem, var(--radix-popper-available-height))",
          }}
        >
          {filtered.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-secondary"
              onMouseDown={(event) => {
                event.preventDefault();
                addTag(s);
              }}
            >
              {s}
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
