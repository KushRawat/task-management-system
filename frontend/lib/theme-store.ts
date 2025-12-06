import { create } from "zustand";

type Theme = "light" | "dark" | "system";

type ThemeState = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "system",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("task-theme", theme);
      applyTheme(theme);
    }
    set({ theme });
  },
}));

export const initTheme = () => {
  if (typeof window === "undefined") return;
  const saved = (localStorage.getItem("task-theme") as Theme | null) || "system";
  const root = document.documentElement;
  if (saved === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", saved === "dark");
  }
};
