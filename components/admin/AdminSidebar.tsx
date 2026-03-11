"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SquaresFour,
  UploadSimple,
  FilmStrip,
  Tag,
  Users,
  SignOut,
  ArrowLeft,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin",            label: "Overview",         icon: SquaresFour,  exact: true },
  { href: "/admin/upload",     label: "Upload",           icon: UploadSimple             },
  { href: "/admin/content",    label: "Manage Content",   icon: FilmStrip                },
  { href: "/admin/categories", label: "Categories & Tags",icon: Tag                      },
  { href: "/admin/creators",   label: "Creators",         icon: Users                    },
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
          <ArrowLeft size={12} weight="regular" className="transition-transform duration-150 group-hover:-translate-x-0.5" />
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
              <Icon size={15} weight="regular" className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className="admin-nav-link w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px]"
        >
          <SignOut size={15} weight="regular" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
