"use client";

import Box from "@mui/material/Box";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: "88rem",
          mx: "auto",
          px: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[
            { href: "/", label: "Frames", bold: true },
            { href: "/about", label: "About" },
            { href: "/search", label: "Search" },
          ].map(({ href, label, bold }) => (
            <Box
              key={href}
              component={Link}
              href={href}
              sx={{
                fontSize: 13,
                fontWeight: bold ? 600 : 400,
                color: bold ? "text.secondary" : "text.disabled",
                textDecoration: "none",
                transition: "color 0.15s ease",
                "&:hover": { color: bold ? "text.primary" : "text.secondary" },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        <Box component="p" sx={{ fontSize: 12, color: "text.disabled", m: 0 }}>
          © {new Date().getFullYear()} Frames
        </Box>
      </Box>
    </Box>
  );
}
