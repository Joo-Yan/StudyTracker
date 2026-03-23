import * as React from "react";
import { cn } from "@/lib/utils";

type ModalWidth = "sm" | "md" | "lg";

const widthClasses: Record<ModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

interface ModalShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: ModalWidth;
}

export function ModalShell({
  children,
  className,
  maxWidth = "md",
}: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="absolute inset-0 overflow-y-auto p-4 sm:p-6">
        <div className="flex min-h-full items-start justify-center py-4 sm:items-center sm:py-8">
          <div
            role="dialog"
            aria-modal="true"
            className={cn(
              "flex max-h-[calc(100dvh-2rem)] w-full flex-col overflow-hidden rounded-xl border bg-background shadow-lg sm:max-h-[calc(100dvh-4rem)]",
              widthClasses[maxWidth],
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ModalShellHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalShellHeader({
  children,
  className,
}: ModalShellHeaderProps) {
  return <div className={cn("shrink-0 border-b p-5", className)}>{children}</div>;
}

interface ModalShellBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalShellBody({
  children,
  className,
}: ModalShellBodyProps) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto p-5", className)}>
      {children}
    </div>
  );
}

interface ModalShellFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalShellFooter({
  children,
  className,
}: ModalShellFooterProps) {
  return (
    <div className={cn("shrink-0 border-t bg-background px-5 py-4", className)}>
      {children}
    </div>
  );
}
