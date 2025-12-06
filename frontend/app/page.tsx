import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const featureHighlights = [
  "JWT-secured auth with auto refresh",
  "Search, filter, and paginate tasks",
  "Optimistic, reactive UI with toasts",
  "Responsive dashboard built for speed",
];

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl flex-col items-center justify-center px-4 py-12">
        <section className="grid w-full items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.15em] text-cyan-200 ring-1 ring-white/10">
              Full-stack perfection
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Own your day with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">TaskFlow</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              A modern task system with secure authentication, delightful UX, and
              production-grade Node.js APIs. Designed to keep you in flow on any device.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button>Get started</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">I already have an account</Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureHighlights.map((item) => (
                <Card key={item} className="flex items-center gap-3 border border-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-200">
                    ✓
                  </div>
                  <p className="text-sm text-slate-200">{item}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="glass relative overflow-hidden rounded-3xl border border-cyan-500/20 p-6 shadow-card">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-400/5" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Today
                  </p>
                  <h3 className="text-2xl font-semibold text-white">Momentum Board</h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Live
                </span>
              </div>
              <div className="grid gap-3">
                {["Design login flow", "Polish dashboard", "Ship API tests"].map(
                  (task, idx) => (
                    <Card key={task} className="border border-white/5 bg-white/5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{task}</p>
                          <p className="text-xs text-slate-400">Priority #{idx + 1}</p>
                        </div>
                        <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                          {idx === 2 ? "Review" : "Active"}
                        </div>
                      </div>
                    </Card>
                  )
                )}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Security
                  </p>
                  <p className="font-semibold text-white">JWT + Refresh rotation</p>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Zero trust ready
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
