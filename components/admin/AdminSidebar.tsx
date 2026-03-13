"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
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
  { href: "/admin",            label: "Overview",          icon: SquaresFour,  exact: true },
  { href: "/admin/upload",     label: "Upload",            icon: UploadSimple              },
  { href: "/admin/content",    label: "Manage Content",    icon: FilmStrip                 },
  { href: "/admin/categories", label: "Categories & Tags", icon: Tag                       },
  { href: "/admin/creators",   label: "Creators",          icon: Users                     },
];

interface AdminSidebarProps {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const linkSx = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 1.25,
    px: 1.5,
    py: 1,
    borderRadius: 1.5,
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    color: active ? theme.palette.text.primary : theme.palette.text.secondary,
    background: active ? theme.palette.action.selected : "transparent",
    textDecoration: "none",
    transition: "background 0.12s ease, color 0.12s ease",
    "&:hover": {
      background: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
  });

  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        flexShrink: 0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 2.5, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box
          component={Link}
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 12,
            color: theme.palette.text.disabled,
            textDecoration: "none",
            mb: 2,
            transition: "color 0.12s ease",
            "&:hover": { color: theme.palette.text.secondary },
          }}
        >
          <ArrowLeft size={11} weight="regular" />
          Back to site
        </Box>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", lineHeight: 1 }}>
          Frames Admin
        </Typography>
        <Typography
          title={userEmail}
          sx={{ fontSize: 11, color: "text.disabled", mt: 0.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {userEmail}
        </Typography>
      </Box>

      {/* Nav */}
      <Box component="nav" sx={{ flex: 1, p: 1.5 }}>
        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "text.disabled",
            px: 1.5,
            py: 0.75,
          }}
        >
          Menu
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Box key={href} component={Link} href={href} sx={linkSx(active)}>
                <Icon size={15} weight="regular" style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />
                {label}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider />

      {/* Sign out */}
      <Box sx={{ p: 1.5 }}>
        <Box
          component="button"
          type="button"
          onClick={handleSignOut}
          sx={{
            ...linkSx(false),
            width: "100%",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            background: "transparent",
            "&:hover": {
              background: theme.palette.action.hover,
              color: theme.palette.text.primary,
            },
          }}
        >
          <SignOut size={15} weight="regular" style={{ flexShrink: 0 }} />
          Sign out
        </Box>
      </Box>
    </Box>
  );
}
