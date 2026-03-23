"use client";

import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TreeNode {
  name: string;
  description?: string;
  children?: TreeNode[];
}

interface FileTreeExplorerProps {
  tree: TreeNode[];
  defaultExpanded?: string[];
}

function TreeItem({
  node,
  path,
  depth,
  expandedSet,
  toggle,
}: {
  node: TreeNode;
  path: string;
  depth: number;
  expandedSet: Set<string>;
  toggle: (path: string) => void;
}) {
  const isFolder = !!node.children;
  const isOpen = expandedSet.has(path);
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) toggle(path);
          if (node.description) setShowDesc(!showDesc);
        }}
        aria-expanded={isFolder ? isOpen : undefined}
        className={cn(
          "flex items-center gap-1.5 w-full text-left py-1 px-2 rounded-lg text-sm hover:bg-muted/50 transition-colors group",
          showDesc && "bg-muted/30"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {isFolder ? (
          <>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                isOpen && "rotate-90"
              )}
            />
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-amber-500" />
            ) : (
              <Folder className="h-4 w-4 text-amber-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <FileCode className="h-4 w-4 text-blue-400" />
          </>
        )}
        <span className="font-mono text-xs">{node.name}</span>
        {node.description && (
          <span className="text-xs text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            ?
          </span>
        )}
      </button>
      {showDesc && node.description && (
        <div
          className="text-xs text-muted-foreground py-1 px-2 ml-6 mb-1 border-l-2 border-blue-200"
          style={{ marginLeft: `${depth * 16 + 32}px` }}
        >
          {node.description}
        </div>
      )}
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.name}
              node={child}
              path={`${path}/${child.name}`}
              depth={depth + 1}
              expandedSet={expandedSet}
              toggle={toggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeExplorer({
  tree,
  defaultExpanded = [],
}: FileTreeExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-white p-3 font-mono">
      {tree.map((node) => (
        <TreeItem
          key={node.name}
          node={node}
          path={node.name}
          depth={0}
          expandedSet={expanded}
          toggle={toggle}
        />
      ))}
    </div>
  );
}
