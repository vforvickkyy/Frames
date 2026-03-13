"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { useTheme, alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MagnifyingGlass, Moon, Sun, List, X } from "@phosphor-icons/react";
import { useThemeToggle } from "@/components/providers/AppProvider";

const MotionAppBar = motion(AppBar);

const navLinks = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const { isDark, toggle } = useThemeToggle();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setFocused(false);
    }
  }

  return (
    <MotionAppBar
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      position="fixed"
      elevation={0}
      sx={{
        height: 52,
        background: alpha(theme.palette.background.default, 0.85),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        zIndex: theme.zIndex.appBar,
        color: theme.palette.text.primary,
      }}
    >
      <Box
        sx={{
          maxWidth: "88rem",
          mx: "auto",
          px: { xs: 2, md: 3 },
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, md: 3 },
          width: "100%",
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          href="/"
          sx={{
            flexShrink: 0,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: theme.palette.text.primary,
            textDecoration: "none",
            transition: "opacity 0.15s ease",
            "&:hover": { opacity: 0.55 },
          }}
        >
          Frames
        </Box>

        {/* Desktop nav */}
        {isMd && (
          <Box component="nav" sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
            {navLinks.map((link) => (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1.5,
                  fontSize: 13,
                  fontWeight: 450,
                  letterSpacing: "-0.01em",
                  color: pathname === link.href
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
                  textDecoration: "none",
                  transition: "color 0.12s ease",
                  "&:hover": { color: theme.palette.text.primary },
                }}
              >
                {link.label}
              </Box>
            ))}
          </Box>
        )}

        {/* Search — center, expands on focus */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <motion.div
            animate={{ width: focused ? 460 : 360 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ position: "relative", display: "flex", alignItems: "center", maxWidth: "100%" }}
          >
            <InputBase
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search frames…"
              inputProps={{ "aria-label": "search" }}
              startAdornment={
                <MagnifyingGlass
                  size={14}
                  weight="regular"
                  style={{
                    marginLeft: 14,
                    marginRight: 6,
                    color: theme.palette.text.disabled,
                    flexShrink: 0,
                  }}
                />
              }
              sx={{
                width: "100%",
                height: 34,
                background: theme.palette.background.paper,
                border: `1px solid ${
                  focused
                    ? alpha(theme.palette.text.primary, 0.15)
                    : theme.palette.divider
                }`,
                borderRadius: "9999px",
                color: theme.palette.text.primary,
                transition: "border-color 0.15s ease",
                "& .MuiInputBase-input": {
                  pr: 1.5,
                  fontSize: 13,
                  py: 0,
                  "&::placeholder": {
                    color: theme.palette.text.disabled,
                    opacity: 1,
                  },
                },
              }}
            />
          </motion.div>
        </Box>

        {/* Theme toggle */}
        <IconButton
          onClick={toggle}
          aria-label="Toggle theme"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          {isDark
            ? <Sun size={17} weight="regular" />
            : <Moon size={17} weight="regular" />
          }
        </IconButton>

        {/* Mobile menu toggle */}
        {!isMd && (
          <IconButton
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            size="small"
            sx={{ flexShrink: 0 }}
          >
            {mobileOpen
              ? <X size={17} weight="regular" />
              : <List size={17} weight="regular" />
            }
          </IconButton>
        )}
      </Box>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              borderTop: `1px solid ${theme.palette.divider}`,
              background: theme.palette.background.default,
            }}
          >
            <Box
              component="nav"
              sx={{ px: 2.5, py: 1.5, display: "flex", flexDirection: "column", gap: 0.25 }}
            >
              {navLinks.map((link) => (
                <Box
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    fontSize: 13,
                    fontWeight: 450,
                    color: pathname === link.href
                      ? theme.palette.text.primary
                      : theme.palette.text.secondary,
                    textDecoration: "none",
                    transition: "color 0.12s ease",
                    "&:hover": { color: theme.palette.text.primary },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionAppBar>
  );
}
