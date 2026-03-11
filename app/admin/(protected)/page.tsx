import { getAdminStats } from "@/lib/queries";
import Link from "next/link";
import { Film, Users, Tag, Eye, TrendingUp, Upload } from "lucide-react";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Your Frames platform at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total Frames",
            value: stats.totalFrames,
            icon: Film,
            href: "/admin/content",
          },
          {
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
          },
          {
            label: "Creators",
            value: stats.totalCreators,
            icon: Users,
            href: "/admin/creators",
          },
          {
            label: "Categories",
            value: stats.totalCategories,
            icon: Tag,
            href: "/admin/categories",
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <div
            key={label}
            className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
              <Icon size={16} className="text-[var(--muted)]" />
            </div>
            <p className="text-2xl font-semibold">{value}</p>
            {href && (
              <Link
                href={href}
                className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] mt-2 inline-block transition-colors"
              >
                View all →
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top performing frames */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[var(--muted)]" />
            <h2 className="text-sm font-semibold">Top Performing Frames</h2>
          </div>
          {stats.topFrames.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No frames yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.topFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/frame/${frame.slug}`}
                      className="text-sm font-medium hover:underline truncate block"
                    >
                      {frame.title}
                    </Link>
                    <p className="text-xs text-[var(--muted)]">
                      {frame.view_count?.toLocaleString()} views
                    </p>
                  </div>
                  <Link
                    href={`/admin/content?edit=${frame.id}`}
                    className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex-shrink-0 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/admin/upload", label: "Upload Frame", icon: Upload },
              { href: "/admin/content", label: "Manage Content", icon: Film },
              { href: "/admin/creators", label: "Add Creator", icon: Users },
              { href: "/admin/categories", label: "Edit Categories", icon: Tag },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors text-sm"
              >
                <Icon size={16} className="text-[var(--muted)]" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
