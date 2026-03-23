import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface AnalogyCardProps {
  title: string;
  children: React.ReactNode;
}

export function AnalogyCard({ title, children }: AnalogyCardProps) {
  return (
    <Card className="border-amber-200/50 bg-amber-50/30">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm mb-1">{title}</p>
            <div className="text-sm text-foreground/70 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
