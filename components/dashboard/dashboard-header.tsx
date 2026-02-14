"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Flame, LogOut, User } from "lucide-react";

export function DashboardHeader({
  userEmail,
  role,
}: {
  userEmail?: string;
  role?: string;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Flame className="h-5 w-5 text-primary" />
          <span>{"Husk'd Label"}</span>
        </Link>

        <div className="flex items-center gap-4">
          {role && (
            <span className="glass-pill hidden rounded-full px-3 py-1 text-xs font-semibold capitalize text-primary sm:inline-block">
              {role}
            </span>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">{userEmail || "User"}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/[0.05] hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
