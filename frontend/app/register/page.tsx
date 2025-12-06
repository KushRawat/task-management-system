import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { AuthForm } from "@/components/auth/auth-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-4 py-10">
        <Card className="space-y-6 border border-white/5">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
              Start fresh
            </p>
            <h1 className="text-3xl font-bold text-white">Create your account</h1>
            <p className="text-sm text-slate-400">
              Register to manage tasks with confidence.
            </p>
          </div>
          <AuthForm mode="register" />
          <p className="text-center text-sm text-slate-400">
            Already with us?{" "}
            <Link className="text-cyan-200 hover:text-white" href="/login">
              Log in
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
