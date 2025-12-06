'use client';

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  const [styleVariant, setStyleVariant] = useState<"classic" | "minimal">("classic");
  const cardClasses =
    styleVariant === "classic"
      ? "space-y-6 border border-neutral-200 bg-white/90 dark:border-neutral-800 dark:bg-neutral-900/90"
      : "space-y-6 border border-neutral-200 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800";

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-4 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
          <span>Style:</span>
          <div className="rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
            <button
              className={`rounded-full px-3 py-1 ${styleVariant === "classic" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 shadow" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
              onClick={() => setStyleVariant("classic")}
            >
              Classic
            </button>
            <button
              className={`rounded-full px-3 py-1 ${styleVariant === "minimal" ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 shadow" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
              onClick={() => setStyleVariant("minimal")}
            >
              Minimal
            </button>
          </div>
        </div>
        <Card className={cardClasses}>
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
              Start fresh
            </p>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Create your account</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Register to manage tasks with confidence.
            </p>
          </div>
          <AuthForm mode="register" />
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-300">
            Already with us?{" "}
            <Link className="text-primary-600 hover:text-primary-700 dark:text-primary-200 dark:hover:text-primary-100" href="/login">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
