import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthGate } from "@/components/shared/auth-gate";
import { AuthProvider } from "@/lib/auth-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <AuthGate>
              <div className="max-w-4xl mx-auto p-6">{children}</div>
            </AuthGate>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
