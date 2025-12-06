'use client';

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";
import { Moon, Sun, Laptop } from "lucide-react";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const saved = (localStorage.getItem("task-theme") as typeof theme | null) || "system";
    setTheme(saved);
  }, [setTheme]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-1 rounded-full px-2 py-1 transition ${
              active
                ? "bg-primary-50 text-primary-700 shadow-sm dark:bg-primary-900/30 dark:text-primary-100"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
};
