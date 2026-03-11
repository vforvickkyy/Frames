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
  ArrowLeft,
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
    <aside className="w-[220px] shrink-0 flex flex-col border-r border-border bg-surface min-h-screen">

      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-border">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-foreground transition-colors mb-4 group"
        >
          <ArrowLeft size={12} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
          Back to site
        </Link>
        <p className="text-[13px] font-semibold text-foreground">Frames Admin</p>
        <p className="text-[11px] text-muted truncate mt-0.5">{userEmail}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider px-2 pt-1 pb-2">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                active
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-border">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-muted hover:text-foreground hover:bg-surface-hover transition-all duration-150"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
