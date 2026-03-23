import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TipCalloutProps {
  variant?: "tip" | "warning";
  children: React.ReactNode;
}

export function TipCallout({ variant = "tip", children }: TipCalloutProps) {
  const isWarning = variant === "warning";

  return (
    <Card
      className={cn(
        isWarning
          ? "border-orange-200/50 bg-orange-50/30"
          : "border-emerald-200/50 bg-emerald-50/30"
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          {isWarning ? (
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <div className="text-sm text-foreground/70 leading-relaxed">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
