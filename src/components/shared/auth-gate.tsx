"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useDemo } from "@/lib/demo-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isDemo, enterDemo } = useDemo();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user && !isDemo) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Start tracking your goals</CardTitle>
            <CardDescription>
              Sign in to access your habits, OKRs, projects, and more.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create account</Link>
            </Button>
            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            <Button variant="ghost" onClick={enterDemo} className="text-muted-foreground">
              Try demo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
