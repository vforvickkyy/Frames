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
    <aside className="admin-sidebar w-[220px] shrink-0 flex flex-col min-h-screen">

      {/* Header */}
      <div className="admin-sidebar-header px-4 pt-5 pb-4">
        <Link
          href="/"
          className="admin-back-link inline-flex items-center gap-1.5 text-[12px] mb-4 group"
        >
          <ArrowLeft size={12} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
          Back to site
        </Link>
        <p className="admin-title text-[13px] font-semibold">Frames Admin</p>
        <p className="admin-subtitle text-[11px] truncate mt-0.5">{userEmail}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="admin-section-label text-[10px] font-semibold uppercase tracking-wider px-2 pt-1 pb-2">
          Menu
        </p>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium ${
                active ? "admin-nav-link-active" : "admin-nav-link"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="admin-sidebar-footer p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="admin-nav-link w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px]"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
