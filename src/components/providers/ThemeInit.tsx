"use client";

import { useEffect } from "react";
import { useUI } from "@/store/ui";

/** Sync the UI store's theme with the class the pre-paint script already applied. */
export function ThemeInit() {
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    useUI.getState().setTheme(isDark ? "dark" : "light");
  }, []);
  return null;
}
