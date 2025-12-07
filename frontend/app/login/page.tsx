'use client';

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [styleVariant, setStyleVariant] = useState<"classic" | "hero">("classic");
  const { user, accessToken } = useAuthStore();

  if (user && accessToken) {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col justify-center px-4 py-10">
        <div className="mb-6 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
          <span>Layout:</span>
          <div className="rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
            {["classic", "hero"].map((variant) => (
              <button
                key={variant}
                className={`rounded-full px-3 py-1 ${styleVariant === variant ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 shadow" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                onClick={() => setStyleVariant(variant as "classic" | "hero")}
              >
                {variant === "classic" ? "Classic" : "Hero"}
              </button>
            ))}
          </div>
        </div>

        {styleVariant === "classic" ? (
          <div className="mx-auto w-full max-w-md">
            <Card className="space-y-6 border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Welcome back
                </p>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Sign in to TaskSphere</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Stay on top of your tasks with a modern dashboard.
                </p>
              </div>
              <AuthForm mode="login" />
              <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                Don&apos;t have an account?{" "}
                <Link className="text-primary-600 hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100" href="/register">
                  Create one
                </Link>
              </p>
            </Card>
          </div>
        ) : (
          <div className="grid w-full gap-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-card dark:border-neutral-800 dark:bg-neutral-900 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-500 p-6 text-white shadow-lg">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_30%)]" />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">Welcome</p>
                <h2 className="text-3xl font-bold leading-tight">Stay on top of every task</h2>
                <p className="text-sm text-white/80">
                  Secure authentication, clean dashboard, and flexible layouts to fit your workflow.
                </p>
                <ul className="space-y-2 text-sm text-white/85">
                  <li>• Auto token refresh</li>
                  <li>• Card or table views</li>
                  <li>• Priorities and due dates</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Sign in
                </p>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">TaskSphere Account</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Access your tasks and keep momentum.
                </p>
              </div>
              <Card className="space-y-6 border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                <AuthForm mode="login" />
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
                  Need an account?{" "}
                  <Link className="text-primary-600 hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100" href="/register">
                    Register
                  </Link>
                </p>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
