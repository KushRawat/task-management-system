'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { Toaster, ToastBar } from "react-hot-toast";
import { initTheme, useThemeStore } from "@/lib/theme-store";

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: 1 },
          mutations: { retry: 0 },
        },
      })
  );

  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          className:
            "rounded-lg border border-neutral-200 shadow-md bg-white text-neutral-900 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-50",
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{ background: "transparent", boxShadow: "none" }}
          >
            {({ icon, message }) => (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                  {icon}
                  {message}
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: "100%", animation: "toast-progress linear 3.2s forwards" }}
                  />
                </div>
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      {children}
    </QueryClientProvider>
  );
};

// Simple progress animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes toast-progress {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
}
