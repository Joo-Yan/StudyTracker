import { LearnSidebar } from "@/components/learn/layout/learn-sidebar";
import { LearnHeader } from "@/components/learn/layout/learn-header";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <LearnSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <LearnHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 lg:p-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
