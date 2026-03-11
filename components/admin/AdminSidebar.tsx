"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Film,
  Tag,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/upload", label: "Upload", icon: Upload },
  { href: "/admin/content", label: "Manage Content", icon: Film },
  { href: "/admin/categories", label: "Categories & Tags", icon: Tag },
  { href: "/admin/creators", label: "Creators", icon: Users },
];

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside
      className="w-56 flex-shrink-0 border-r border-[var(--border)] flex flex-col py-6"
      style={{ background: "var(--surface)" }}
    >
      {/* Logo */}
      <div className="px-4 mb-6">
        <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] text-sm transition-colors mb-4">
          <ChevronLeft size={14} />
          Back to site
        </Link>
        <p className="font-semibold text-sm">Frames Admin</p>
        <p className="text-xs text-[var(--muted)] truncate mt-0.5">{userEmail}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[var(--surface-hover)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
