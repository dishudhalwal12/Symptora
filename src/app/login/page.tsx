"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { BrandLockup } from "@/components/branding/BrandMark";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <header className="glass-header rounded-[2.4rem] p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3 text-[#171717]">
              <BrandLockup label="Welcome back" markClassName="h-12 w-12 rounded-[1rem]" labelClassName="text-lg font-semibold text-[#171717]" />
            </Link>

            <div className="bubble-card rounded-[1.7rem] px-4 py-3">
              <p className="text-sm leading-7 text-[#171717]/78">
                Re-enter the redesigned workspace to continue signal review, assessments, and connected record analysis.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
          <section className="ink-panel rounded-[2.6rem] p-6 md:p-8">
            <p className="medify-pill bg-[#fff7c5] text-[#171717]">Sign-in flow</p>
            <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white md:text-6xl">
              Step back into the Symptora workspace.
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-white/78">
              Continue from symptom-first intake into saved assessments, uploaded records, and explainable result review.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="bubble-card rounded-[1.8rem] p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Primary route</p>
                <p className="mt-3 text-2xl font-semibold text-[#171717]">Signal-first screening</p>
              </div>
              <div className="clay-card rounded-[1.8rem] p-5">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Also available</p>
                <p className="mt-3 text-2xl font-semibold text-[#171717]">Assessments, records, insights</p>
              </div>
            </div>
          </section>

          <Card className="overflow-hidden p-1">
            <CardHeader className="px-6 pt-8 md:px-8">
              <CardTitle className="text-4xl">Access Symptora</CardTitle>
              <CardDescription className="text-base text-[#3d3d3d]">
                Open your workspace and continue from symptom-led intake into records, saved assessments, and result review.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8 md:px-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs font-semibold uppercase tracking-[0.18em] text-[#10253c] underline decoration-2 underline-offset-4">
                      Forgot password
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error ? (
                  <div className="rounded-[1.5rem] border-[3px] border-[#171717] bg-[#ff8bc2] px-4 py-4 text-sm text-[#171717] shadow-[4px_4px_0_#171717]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  </div>
                ) : null}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Enter workspace"}
                </Button>
              </form>

              <div className="mt-6 bubble-card rounded-[1.8rem] p-4">
                <p className="text-sm font-semibold text-[#171717]">Admin access</p>
                <p className="mt-2 text-sm leading-7 text-[#171717]/78">
                  Admin users sign in through the same account flow, then open the control room if they have admin access.
                </p>
                <Link href="/admin/login" className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.14em] text-[#171717] underline decoration-[3px] underline-offset-4">
                  Open admin sign-in
                </Link>
              </div>

              <p className="mt-6 text-sm text-[#3d3d3d]">
                New to Symptora?{" "}
                <Link href="/register" className="font-black uppercase tracking-[0.12em] text-[#171717] underline decoration-[3px] underline-offset-4">
                  Create an account
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
