"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Verify admin role
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("role")
      .eq("email", email)
      .single();

    if (!adminUser || adminUser.role !== "admin") {
      await supabase.auth.signOut();
      setError("You don't have admin access.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-90 scale-in">

        {/* Logo */}
        <div className="mb-10 text-center">
          <p className="text-[13px] font-semibold tracking-tight text-muted mb-6">Frames</p>
          <h1 className="text-[22px] font-semibold tracking-tight mb-1.5">Welcome back</h1>
          <p className="text-[13px] text-muted">Sign in to your admin account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-[12px] font-medium mb-1.5 text-muted">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2.5 text-[14px] rounded-xl border border-border bg-surface outline-none
                         focus:ring-2 focus:ring-foreground/15 focus:border-foreground/30
                         transition-all duration-200 placeholder:text-muted"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[12px] font-medium mb-1.5 text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-[14px] rounded-xl border border-border bg-surface outline-none
                         focus:ring-2 focus:ring-foreground/15 focus:border-foreground/30
                         transition-all duration-200 placeholder:text-muted"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500 bg-red-500/8 px-3.5 py-2.5 rounded-xl border border-red-500/15 fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 rounded-xl bg-foreground text-background text-[14px] font-medium
                       hover:opacity-80 active:scale-[0.98] transition-all duration-150 disabled:opacity-40"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
