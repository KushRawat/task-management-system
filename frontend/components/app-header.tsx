'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

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
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0b1224]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400 text-ink shadow-lg shadow-cyan-500/30">
            ✓
          </div>
          <span>TaskFlow</span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user && !isAuthPage ? (
            <>
              <span className="hidden text-slate-300 sm:inline">
                Hi, <span className="font-semibold text-white">{user.name}</span>
              </span>
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-200 hover:text-white">
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
