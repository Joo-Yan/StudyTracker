import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface KeyConceptProps {
  term: string;
  children: React.ReactNode;
}

export function KeyConcept({ term, children }: KeyConceptProps) {
  return (
    <Card className="border-blue-200/50 bg-blue-50/30">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">{term}</p>
            <div className="text-sm text-foreground/70 leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
