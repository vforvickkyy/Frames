"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { MagnifyingGlass } from "@phosphor-icons/react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        borderRadius: "9999px",
        overflow: "hidden",
        border: `1px solid ${
          focused
            ? theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.16)"
              : "rgba(0,0,0,0.18)"
            : theme.palette.divider
        }`,
        background: theme.palette.background.paper,
        boxShadow: focused
          ? theme.palette.mode === "dark"
            ? "0 0 0 3px rgba(255,255,255,0.05)"
            : "0 0 0 3px rgba(0,0,0,0.05)"
          : "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <MagnifyingGlass
        size={16}
        weight="regular"
        style={{
          marginLeft: 20,
          marginRight: 4,
          color: theme.palette.text.disabled,
          flexShrink: 0,
        }}
      />

      <InputBase
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search by technique, mood, style…"
        inputProps={{ "aria-label": "hero search" }}
        sx={{
          flex: 1,
          px: 1,
          py: 1.75,
          fontSize: 14,
          color: theme.palette.text.primary,
          "& .MuiInputBase-input::placeholder": {
            color: theme.palette.text.disabled,
            opacity: 1,
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        disableElevation
        sx={{
          flexShrink: 0,
          m: 0.75,
          px: 2.5,
          py: 1,
          borderRadius: "9999px",
          fontSize: 13,
          fontWeight: 500,
          height: 36,
        }}
      >
        Search
      </Button>
    </Box>
  );
}
