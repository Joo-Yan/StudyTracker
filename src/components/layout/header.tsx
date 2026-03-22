"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      router.push("/login");
    }
  }

  return (
    <header className="h-12 border-b flex items-center justify-end px-6 shrink-0">
      <div className="flex items-center gap-3 min-w-[140px] justify-end">
        {loading ? null : user ? (
          <>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
