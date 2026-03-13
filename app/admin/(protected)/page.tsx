import { getAdminStats } from "@/lib/queries";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {
  FilmStrip,
  Users,
  Tag,
  Eye,
  ChartLine,
  UploadSimple,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  const statCards = [
    {
      label: "Total Frames",
      value: stats.totalFrames,
      icon: FilmStrip,
      href: "/admin/content",
      accentColor: "#3b82f6",
    },
    {
      label: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      href: null,
      accentColor: "#8b5cf6",
    },
    {
      label: "Creators",
      value: stats.totalCreators,
      icon: Users,
      href: "/admin/creators",
      accentColor: "#10b981",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      href: "/admin/categories",
      accentColor: "#f59e0b",
    },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "text.primary" }}
        >
          Overview
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Your Frames platform at a glance.
        </Typography>
      </Box>

      {/* Stat cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.5,
          mb: 4,
        }}
      >
        {statCards.map(({ label, value, icon: Icon, href, accentColor }) => (
          <Paper
            key={label}
            sx={{
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: "0 12px 12px 0",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </Typography>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 1.5,
                  bgcolor: "action.selected",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icon size={13} weight="regular" style={{ color: "inherit", opacity: 0.5 }} />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: "text.primary",
              }}
            >
              {value}
            </Typography>

            {href && (
              <Box
                component={Link}
                href={href}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: 11,
                  color: "text.secondary",
                  textDecoration: "none",
                  transition: "color 0.12s ease",
                  "&:hover": { color: "text.primary" },
                  "&:hover .arrow": { transform: "translateX(2px)" },
                }}
              >
                View all
                <Box className="arrow" sx={{ display: "flex", transition: "transform 0.15s ease" }}>
                  <ArrowRight size={10} weight="regular" />
                </Box>
              </Box>
            )}
          </Paper>
        ))}
      </Box>

      {/* Bottom grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        {/* Top performing frames */}
        <Paper
          sx={{
            p: 2.5,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <ChartLine size={14} weight="regular" style={{ opacity: 0.4 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Top Performing Frames</Typography>
          </Box>

          {stats.topFrames.length === 0 ? (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <FilmStrip size={22} weight="regular" style={{ opacity: 0.2, display: "block", margin: "0 auto 8px" }} />
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>No frames yet.</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
              {stats.topFrames.map((frame, i) => (
                <Box
                  key={frame.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 1.5,
                    transition: "background 0.12s ease",
                    "&:hover": { bgcolor: "action.hover" },
                    "&:hover .edit-link": { opacity: 1 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Typography
                      sx={{ fontSize: 11, color: "text.disabled", width: 16, flexShrink: 0, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
                    >
                      {i + 1}
                    </Typography>
                    <Box sx={{ minWidth: 0 }}>
                      <Box
                        component={Link}
                        href={`/frame/${frame.slug}`}
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {frame.title}
                      </Box>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                        {(frame.view_count ?? 0).toLocaleString()} views
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    className="edit-link"
                    component={Link}
                    href={`/admin/content?edit=${frame.id}`}
                    sx={{
                      fontSize: 11,
                      color: "text.secondary",
                      textDecoration: "none",
                      flexShrink: 0,
                      opacity: 0,
                      transition: "opacity 0.15s ease, color 0.12s ease",
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    Edit
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* Quick actions */}
        <Paper
          sx={{
            p: 2.5,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 3 }}>Quick Actions</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 1,
            }}
          >
            {[
              { href: "/admin/upload",     label: "Upload Frame",    icon: UploadSimple, primary: true },
              { href: "/admin/content",    label: "Manage Content",  icon: FilmStrip                  },
              { href: "/admin/creators",   label: "Add Creator",     icon: Users                      },
              { href: "/admin/categories", label: "Edit Categories", icon: Tag                        },
            ].map(({ href, label, icon: Icon, primary }) => (
              <Box
                key={href}
                component={Link}
                href={href}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 1.75,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "opacity 0.15s ease, background 0.12s ease",
                  ...(primary
                    ? {
                        bgcolor: "text.primary",
                        color: "background.default",
                        "&:hover": { opacity: 0.82 },
                      }
                    : {
                        border: "1px solid",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover", color: "text.primary" },
                      }),
                }}
              >
                <Icon size={14} weight="regular" style={{ opacity: primary ? 0.7 : 0.6, flexShrink: 0 }} />
                {label}
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
