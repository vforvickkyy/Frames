import { createTheme } from "@mui/material/styles";

const typography = {
  fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  h1: {
    fontSize: "clamp(3rem, 7vw, 5.5rem)",
    fontWeight: 600,
    letterSpacing: "-0.04em",
    lineHeight: 1.03,
  },
  h2: { fontSize: "1.1rem", fontWeight: 500, letterSpacing: "-0.01em" },
  h3: { fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "-0.015em" },
  body1: { fontSize: "0.9375rem", lineHeight: 1.6 },
  body2: { fontSize: "0.8125rem", lineHeight: 1.5 },
  caption: { fontSize: "0.6875rem", letterSpacing: "0.05em" },
  button: { textTransform: "none" as const, fontWeight: 500, letterSpacing: "-0.01em" },
};

/* ─── DARK ─────────────────────────────────────────────────────────────── */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#0a0a0a", paper: "#111111" },
    text: {
      primary: "#ededed",
      secondary: "rgba(255,255,255,0.4)",
      disabled: "rgba(255,255,255,0.2)",
    },
    primary: { main: "#ffffff", contrastText: "#0a0a0a" },
    divider: "rgba(255,255,255,0.07)",
    action: {
      hover: "rgba(255,255,255,0.05)",
      selected: "rgba(255,255,255,0.08)",
      hoverOpacity: 0.05,
    },
  },
  typography,
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        body: {
          minHeight: "100dvh",
          overflowX: "hidden",
          transition: "background-color 0.2s ease, color 0.2s ease",
        },
        "::selection": { backgroundColor: "rgba(255,255,255,0.15)" },
        "::-webkit-scrollbar": { width: 4, height: 4 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
          background: "rgba(255,255,255,0.14)",
          borderRadius: 99,
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        containedPrimary: {
          background: "#ffffff",
          color: "#0a0a0a",
          "&:hover": { background: "rgba(255,255,255,0.88)", boxShadow: "none" },
        },
        outlinedPrimary: {
          borderColor: "rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
          "&:hover": { background: "#1a1a1a", borderColor: "rgba(255,255,255,0.18)" },
        },
        text: {
          color: "rgba(255,255,255,0.5)",
          "&:hover": { background: "#1a1a1a", color: "#ededed" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.4)",
          borderRadius: 8,
          "&:hover": { background: "#1a1a1a", color: "#ededed" },
          transition: "background 0.12s ease, color 0.12s ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontSize: 12,
          height: 30,
          letterSpacing: "-0.01em",
          transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.4)",
          "&:hover": {
            background: "#1a1a1a",
            borderColor: "rgba(255,255,255,0.15)",
            color: "#ededed",
          },
        },
        filled: {
          background: "#ffffff",
          color: "#0a0a0a",
          "&:hover": { background: "rgba(255,255,255,0.88)" },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          background: "transparent",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "12px 16px",
          fontFamily: '"Inter", ui-sans-serif',
          fontSize: 13,
          color: "#ededed",
        },
        head: {
          fontWeight: 500,
          color: "rgba(255,255,255,0.35)",
          background: "#111111",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "10px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
          "&:hover td": { background: "#161616" },
          transition: "background 0.12s ease",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#111111",
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.07)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.14)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.22)",
            borderWidth: 1,
          },
        },
        input: {
          color: "#ededed",
          fontSize: 13,
          padding: "10px 14px",
          "&::placeholder": { color: "rgba(255,255,255,0.22)", opacity: 1 },
        },
        multiline: { padding: 0 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(255,255,255,0.25)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          "&.Mui-focused": { color: "rgba(255,255,255,0.5)" },
          "&.MuiInputLabel-shrink": { color: "rgba(255,255,255,0.35)" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { icon: { color: "rgba(255,255,255,0.35)" } },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13,
          color: "#ededed",
          "&:hover": { background: "#1a1a1a" },
          "&.Mui-selected": { background: "#1a1a1a" },
          "&.Mui-selected:hover": { background: "#222222" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          backgroundImage: "none",
          boxShadow: "0 32px 64px rgba(0,0,0,0.7)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 24px",
          color: "#ededed",
          letterSpacing: "-0.01em",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: "20px 24px", paddingTop: "20px !important" } },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 16px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          gap: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#1a1a1a",
          color: "#ededed",
          fontSize: 11,
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: "4px 10px",
        },
        arrow: { color: "#1a1a1a" },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(255,255,255,0.07)" } },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { background: "#181818", transform: "none", borderRadius: 12 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { background: "#1a1a1a", borderRadius: 4, height: 2 },
        bar: { background: "#ffffff" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          fontSize: 13,
          color: "#ededed",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        },
      },
    },
  },
});

/* ─── LIGHT ─────────────────────────────────────────────────────────────── */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#ffffff", paper: "#f5f5f5" },
    text: {
      primary: "#0a0a0a",
      secondary: "rgba(0,0,0,0.45)",
      disabled: "rgba(0,0,0,0.25)",
    },
    primary: { main: "#0a0a0a", contrastText: "#ffffff" },
    divider: "rgba(0,0,0,0.08)",
    action: {
      hover: "rgba(0,0,0,0.04)",
      selected: "rgba(0,0,0,0.06)",
      hoverOpacity: 0.04,
    },
  },
  typography,
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        body: {
          minHeight: "100dvh",
          overflowX: "hidden",
          transition: "background-color 0.2s ease, color 0.2s ease",
        },
        "::selection": { backgroundColor: "rgba(0,0,0,0.1)" },
        "::-webkit-scrollbar": { width: 4, height: 4 },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.16)",
          borderRadius: 99,
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          background: "#f5f5f5",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 16,
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8 },
        containedPrimary: {
          background: "#0a0a0a",
          color: "#ffffff",
          "&:hover": { background: "#1a1a1a", boxShadow: "none" },
        },
        outlinedPrimary: {
          borderColor: "rgba(0,0,0,0.1)",
          color: "rgba(0,0,0,0.6)",
          "&:hover": { background: "#ebebeb", borderColor: "rgba(0,0,0,0.18)" },
        },
        text: {
          color: "rgba(0,0,0,0.5)",
          "&:hover": { background: "#ebebeb", color: "#0a0a0a" },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgba(0,0,0,0.45)",
          borderRadius: 8,
          "&:hover": { background: "#ebebeb", color: "#0a0a0a" },
          transition: "background 0.12s ease, color 0.12s ease",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontSize: 12,
          height: 30,
          letterSpacing: "-0.01em",
          transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        },
        outlined: {
          borderColor: "rgba(0,0,0,0.1)",
          color: "rgba(0,0,0,0.45)",
          "&:hover": {
            background: "#ebebeb",
            borderColor: "rgba(0,0,0,0.18)",
            color: "#0a0a0a",
          },
        },
        filled: {
          background: "#0a0a0a",
          color: "#ffffff",
          "&:hover": { background: "#1a1a1a" },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 16,
          background: "transparent",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "12px 16px",
          fontFamily: '"Inter", ui-sans-serif',
          fontSize: 13,
          color: "#0a0a0a",
        },
        head: {
          fontWeight: 500,
          color: "rgba(0,0,0,0.4)",
          background: "#f5f5f5",
          fontSize: 11,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "10px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
          "&:hover td": { background: "#f0f0f0" },
          transition: "background 0.12s ease",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#f5f5f5",
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.09)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.16)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0,0,0,0.25)",
            borderWidth: 1,
          },
        },
        input: {
          color: "#0a0a0a",
          fontSize: 13,
          padding: "10px 14px",
          "&::placeholder": { color: "rgba(0,0,0,0.22)", opacity: 1 },
        },
        multiline: { padding: 0 },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "rgba(0,0,0,0.35)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          "&.Mui-focused": { color: "rgba(0,0,0,0.6)" },
          "&.MuiInputLabel-shrink": { color: "rgba(0,0,0,0.45)" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { icon: { color: "rgba(0,0,0,0.4)" } },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13,
          color: "#0a0a0a",
          "&:hover": { background: "#ebebeb" },
          "&.Mui-selected": { background: "#ebebeb" },
          "&.Mui-selected:hover": { background: "#e0e0e0" },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: "#f5f5f5",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 16,
          backgroundImage: "none",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          padding: "16px 24px",
          color: "#0a0a0a",
          letterSpacing: "-0.01em",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: "20px 24px", paddingTop: "20px !important" } },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 24px 16px",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          gap: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#ebebeb",
          color: "#0a0a0a",
          fontSize: 11,
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          padding: "4px 10px",
        },
        arrow: { color: "#ebebeb" },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "rgba(0,0,0,0.08)" } },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { background: "#ebebeb", transform: "none", borderRadius: 12 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { background: "#ebebeb", borderRadius: 4, height: 2 },
        bar: { background: "#0a0a0a" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          background: "#ebebeb",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 12,
          fontSize: 13,
          color: "#0a0a0a",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        },
      },
    },
  },
});
