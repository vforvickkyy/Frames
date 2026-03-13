"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { darkTheme, lightTheme } from "@/lib/theme";

const ThemeCtx = createContext<{ isDark: boolean; toggle: () => void }>({
  isDark: true,
  toggle: () => {},
});

export function useThemeToggle() {
  return useContext(ThemeCtx);
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved !== "light";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <ThemeCtx.Provider value={{ isDark, toggle }}>
      <AppRouterCacheProvider options={{ key: "mui" }}>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ThemeCtx.Provider>
  );
}
