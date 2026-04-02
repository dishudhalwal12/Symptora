"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  FileStack,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";

import { BrandLockup } from "@/components/branding/BrandMark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", hint: "Signal overview, readiness, and quick actions", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", hint: "Baseline health details and patient context", icon: UserRound },
  { href: "/assessments", label: "Assessments", hint: "Symptom-led flow and structured screenings", icon: Activity },
  { href: "/records", label: "Records", hint: "Reports, prescriptions, and imaging uploads", icon: FileStack },
  { href: "/history", label: "History", hint: "Saved runs, comparisons, and timelines", icon: HeartPulse },
  { href: "/insights", label: "Insights", hint: "Explainable trends and recommendations", icon: Sparkles },
  { href: "/settings", label: "Settings", hint: "Workspace controls and preferences", icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems =
    user?.role === "admin"
      ? [
          ...NAV_ITEMS,
          {
            href: "/admin/dashboard",
            label: "Admin",
            hint: "Operations, users, models, and system health",
            icon: Shield,
          },
        ]
      : NAV_ITEMS;

  const activeItem =
    navigationItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) || null;
  const currentLabel =
    activeItem?.label ||
    (pathname === "/dashboard" ? "Dashboard" : pathname.split("/").filter(Boolean).join(" / ") || "Workspace");

  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="mx-auto grid max-w-[1680px] gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="glass-header rounded-[2.25rem] p-5 md:p-6">
            <BrandLockup
              label="Symptom intelligence workspace"
              className="items-start"
              markClassName="h-14 w-14 rounded-[1.4rem]"
              labelClassName="mt-1 text-lg font-semibold text-[#171717]"
            />
            <p className="mt-5 text-sm leading-7 text-[#3d3d3d]">
              Symptora brings symptom capture, records, model review, and explainable outputs into one bold but readable workspace.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="bubble-card rounded-[1.6rem] p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Session mode</p>
                <p className="mt-2 text-xl font-semibold text-[#171717]">
                  {user?.role === "admin" ? "Operations control room" : "Patient screening workspace"}
                </p>
              </div>
            </div>
          </section>

          <section className="shell-card rounded-[2.15rem] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Navigation</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#171717]">Jump deck</h2>
              </div>
              <Sparkles className="h-5 w-5 text-[#171717]" />
            </div>

            <div className="mt-5 grid gap-3">
              {navigationItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[1.6rem] border-[3px] px-4 py-4 text-left transition",
                      active
                        ? "border-[#171717] bg-[#171717] text-[#fff7c5] shadow-[5px_5px_0_#171717]"
                        : "border-[#171717] bg-[#fffdf5]/80 text-[#171717] shadow-[4px_4px_0_#171717] hover:bg-[#ffe75c] dark:border-[#f8f4ea] dark:bg-[#f8f4ea] dark:text-[#171717] dark:shadow-[4px_4px_0_#000000]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "medify-orb relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem]",
                          active && "bg-[#ffe75c] shadow-[4px_4px_0_#fff7c5]"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", active ? "text-[#171717]" : "text-[#fff7c5]")} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-current">{item.label}</p>
                        <p className={cn("mt-1 text-xs leading-6", active ? "text-[#fff7c5]/82" : "text-current/75")}>
                          {item.hint}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="ink-panel rounded-[2.15rem] p-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/58">Operating principle</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Start with signals, not friction.</h3>
            <p className="mt-3 text-sm leading-7 text-white/78">
              Symptora keeps the first interaction lightweight, then carries that context forward into records, model outputs, and follow-up actions.
            </p>
          </section>

          {user ? (
            <section className="accent-panel rounded-[2.15rem] p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Workspace owner</p>
              <h3 className="mt-3 text-2xl font-semibold text-[#171717]">{user.fullName}</h3>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.2em] text-[#171717]/70">{user.role}</p>
              <p className="mt-4 text-sm leading-7 text-[#171717]/78">
                Use the active route summary above to move between screening, records, saved results, and operations views without losing context.
              </p>
              <Button variant="outline" className="mt-5 w-full justify-center" onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </section>
          ) : null}
        </aside>

        <div className="space-y-5">
          <header className="glass-header rounded-[2.25rem] p-5 md:p-6">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:items-center">
              <div className="min-w-0">
                <p className="medify-pill">Workspace pulse</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#171717] md:text-5xl">
                  {currentLabel}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-[#3d3d3d]">
                  {activeItem?.hint || "Navigate the patient workspace, review connected health data, and move through the assessment flow without breaking continuity."}
                </p>
              </div>

              <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-end">
                <div className="bubble-card min-w-[260px] flex-1 rounded-[1.7rem] p-4 lg:max-w-[340px]">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Current route</p>
                  <p className="mt-2 break-words text-2xl font-semibold text-[#171717]">{currentLabel}</p>
                  <p className="mt-2 break-words text-sm leading-7 text-[#171717]/78">
                    {pathname.split("/").filter(Boolean).join(" / ") || "dashboard"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3 lg:justify-end">
                  <Link href="/assessments/symptom-checker">
                    <Button>Launch screening</Button>
                  </Link>
                  <Link href="/records">
                    <Button variant="outline">Open records</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <HeaderMetric label="Primary route" value="Symptoms first" />
              <HeaderMetric label="Connected layer" value="Profile + records" />
              <HeaderMetric label="Access level" value={user?.role === "admin" ? "Admin oversight" : "Patient workflow"} />
            </div>
          </header>

          <main className="order-2 space-y-5 xl:order-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border-[3px] border-[#171717] bg-[#fffdf5]/80 px-4 py-4 shadow-[4px_4px_0_#171717] dark:border-[#f8f4ea] dark:bg-[#f8f4ea] dark:shadow-[4px_4px_0_#000000]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#171717]/65 dark:text-[#171717]/65">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-lg font-semibold text-[#171717] dark:text-[#171717]">{value}</p>
        <ArrowRight className="h-4 w-4 text-[#171717] dark:text-[#171717]" />
      </div>
    </div>
  );
}
