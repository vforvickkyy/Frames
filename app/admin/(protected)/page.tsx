import { getAdminStats } from "@/lib/queries";
import Link from "next/link";
import { Film, Users, Tag, Eye, TrendingUp, Upload, ArrowRight } from "lucide-react";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="fade-in">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="text-[13px] text-muted mt-1">Your Frames platform at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Frames", value: stats.totalFrames,                icon: Film,  href: "/admin/content",    accent: "border-l-[3px] border-l-blue-500"    },
          { label: "Total Views",  value: stats.totalViews.toLocaleString(), icon: Eye,   href: null,                accent: "border-l-[3px] border-l-violet-500"  },
          { label: "Creators",     value: stats.totalCreators,               icon: Users, href: "/admin/creators",   accent: "border-l-[3px] border-l-emerald-500" },
          { label: "Categories",   value: stats.totalCategories,             icon: Tag,   href: "/admin/categories", accent: "border-l-[3px] border-l-amber-500"   },
        ].map(({ label, value, icon: Icon, href, accent }) => (
          <div key={label} className={`admin-card p-5 flex flex-col gap-3 ${accent}`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted uppercase tracking-wider">{label}</p>
              <span className="p-1.5 rounded-lg bg-surface-hover">
                <Icon size={13} className="text-muted" />
              </span>
            </div>
            <p className="text-[28px] font-semibold tracking-tight leading-none">{value}</p>
            {href && (
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-[11px] text-muted hover:text-foreground transition-colors group"
              >
                View all
                <ArrowRight size={10} className="transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">

        {/* Top performing frames */}
        <div className="admin-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={14} className="text-muted" />
            <h2 className="text-[13px] font-semibold">Top Performing Frames</h2>
          </div>
          {stats.topFrames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Film size={22} className="text-muted/40 mb-2" />
              <p className="text-[13px] text-muted">No frames yet.</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {stats.topFrames.map((frame, i) => (
                <div
                  key={frame.id}
                  className="flex items-center justify-between gap-4 px-3 py-2.5 rounded-lg hover:bg-surface-hover transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] text-muted w-4 shrink-0 text-center tabular-nums">{i + 1}</span>
                    <div className="min-w-0">
                      <Link
                        href={`/frame/${frame.slug}`}
                        className="text-[13px] font-medium hover:underline truncate block"
                      >
                        {frame.title}
                      </Link>
                      <p className="text-[11px] text-muted">
                        {(frame.view_count ?? 0).toLocaleString()} views
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/content?edit=${frame.id}`}
                    className="text-[11px] text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="admin-card p-5">
          <h2 className="text-[13px] font-semibold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "/admin/upload",     label: "Upload Frame",    icon: Upload, primary: true },
              { href: "/admin/content",    label: "Manage Content",  icon: Film   },
              { href: "/admin/creators",   label: "Add Creator",     icon: Users  },
              { href: "/admin/categories", label: "Edit Categories", icon: Tag    },
            ].map(({ href, label, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 p-3.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  primary
                    ? "bg-foreground text-background hover:opacity-80"
                    : "border border-border hover:bg-surface-hover"
                }`}
              >
                <Icon size={14} className={primary ? "opacity-70" : "text-muted"} />
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
