'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { ThemeToggle } from "./theme-toggle";

export const AppHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Signed out");
    } catch (error: any) {
      toast.error(error?.message ?? "Unable to logout");
    } finally {
      router.push("/login");
    }
  };

  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-neutral-900 dark:text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shadow-sm dark:bg-primary-900/40 dark:text-primary-100">
            ✓
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              TaskSphere
            </span>
            <span className="-mt-1 text-base font-semibold text-neutral-900 dark:text-white">Task Management</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />
          {user && !isAuthPage ? (
            <>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  {user.name?.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">Signed in as</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{user.name}</span>
                </div>
              </div>
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white">
                Log in
              </Link>
              <Button onClick={() => router.push("/register")}>Get started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
