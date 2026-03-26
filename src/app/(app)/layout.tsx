import { AppShell } from "@/components/layout/app-shell";
import { AuthGate } from "@/components/shared/auth-gate";
import { AuthProvider } from "@/lib/auth-context";
import { DemoProvider } from "@/lib/demo-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DemoProvider>
        <AppShell>
          <AuthGate>
            <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">{children}</div>
          </AuthGate>
        </AppShell>
      </DemoProvider>
    </AuthProvider>
  );
}
