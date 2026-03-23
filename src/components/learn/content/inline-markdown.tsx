import { Fragment } from "react";

interface InlineMarkdownProps {
  text: string;
}

/**
 * Renders simple inline markdown: **bold** and `code`.
 * Does NOT support full markdown — only these two patterns.
 * Limitation: bold content cannot contain asterisk characters.
 */
export function InlineMarkdown({ text }: InlineMarkdownProps) {
  // Split on **bold** and `code` patterns
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part === "") return null;
        if (part.length >= 5 && part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.length >= 3 && part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 rounded-md bg-muted text-xs font-mono text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
