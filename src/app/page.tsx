import Link from "next/link";
import { Activity, ArrowRight, FileStack, ShieldCheck, Sparkles } from "lucide-react";

import { BrandLockup } from "@/components/branding/BrandMark";
import { Button } from "@/components/ui/button";

const JOURNEY = [
  {
    title: "Frame the concern",
    description: "Begin from the condition the patient is worried about instead of dropping them into a long form.",
  },
  {
    title: "Capture the signal",
    description: "Mix structured symptom chips with plain-language notes so the case stays natural and readable.",
  },
  {
    title: "Carry context forward",
    description: "Move into records, structured assessments, and explanations without rebuilding the case from scratch.",
  },
];

const SNAPSHOTS = [
  {
    label: "Primary intake",
    value: "Symptom-led screening",
    detail: "Patients can start with what they feel before any lab-heavy module is needed.",
    className: "mesh-panel rounded-[2rem]",
  },
  {
    label: "Connected output",
    value: "Evidence + guidance",
    detail: "Results stay linked to contributing indicators, recommendations, and uploaded source files.",
    className: "clay-card rounded-[2rem]",
  },
];

const FEATURES = [
  { icon: Sparkles, title: "Signal-first triage" },
  { icon: FileStack, title: "Records and source files" },
  { icon: ShieldCheck, title: "Explainable assessment views" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <header className="glass-header rounded-[2.4rem] p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <BrandLockup label="Symptom intelligence workspace" markClassName="h-14 w-14 rounded-[1.4rem]" />

            <nav className="flex flex-wrap gap-3">
              <Link href="/symptom-checker">
                <Button variant="outline">Signal explorer</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button>Create account</Button>
              </Link>
            </nav>
          </div>
        </header>

        <main className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <section className="shell-card rounded-[2.6rem] p-6 md:p-8">
            <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <div>
                <p className="medify-pill">Signal-first screening</p>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-[#171717] md:text-7xl">
                  A completely new face for the same powerful health workflow.
                </h1>
                <p className="mt-6 max-w-2xl text-sm leading-8 text-[#3d3d3d] md:text-base">
                  Symptora is a bold symptom intelligence workspace for academic healthcare projects: begin from what the patient feels, move into deeper modules only when needed, and keep every result tied to profile context, history, and records.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/symptom-checker">
                    <Button size="lg">Open signal explorer</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline">
                      Launch workspace
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <StatBubble label="Assessment routes" value="5 modules" className="bubble-card rounded-[1.5rem]" />
                  <StatBubble label="Core journey" value="Symptoms first" className="mesh-panel rounded-[1.5rem]" />
                  <StatBubble label="Evidence layer" value="Records + history" className="accent-panel rounded-[1.5rem]" />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="ink-panel rounded-[2.2rem] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">Patient journey</p>
                  <div className="mt-5 space-y-4">
                    {JOURNEY.map((step, index) => (
                      <div key={step.title} className="rounded-[1.5rem] border-[3px] border-white/15 bg-white/8 px-4 py-4">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/50">Phase {index + 1}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{step.title}</p>
                        <p className="mt-2 text-sm leading-7 text-white/78">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                  {SNAPSHOTS.map((snapshot) => (
                    <div key={snapshot.label} className={`${snapshot.className} p-5`}>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">{snapshot.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-[#171717]">{snapshot.value}</p>
                      <p className="mt-3 text-sm leading-7 text-[#171717]/78">{snapshot.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5">
            <div className="ink-panel rounded-[2.4rem] p-6 md:p-7">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">Platform perspective</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold text-white">
                Symptora turns your existing healthcare engine into a louder, fresher, harder-to-confuse product.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/78">
                The UX is rebuilt around punchy forms, thick borders, bright contrast, and strong hierarchy while preserving the same underlying workflows and data paths.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              <article className="bubble-card rounded-[2.2rem] p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#171717]/65">Why it feels different</p>
                <h2 className="mt-4 text-3xl font-semibold text-[#171717]">A new visual identity without changing the engine</h2>
                <p className="mt-4 text-sm leading-7 text-[#171717]/78">
                  The product now reads like a completely separate application because the layout, surfaces, typography, and interaction styling all have a new design language.
                </p>
              </article>

              <article className="mesh-panel rounded-[2.2rem] p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-[#171717]" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#171717]/65">Workspace outcomes</p>
                    <p className="text-2xl font-semibold text-[#171717]">Readable, connected, unmistakably new</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3">
                  {FEATURES.map((feature) => (
                    <FeatureRow key={feature.title} icon={feature.icon} title={feature.title} />
                  ))}
                </div>
                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#171717] underline decoration-[3px] underline-offset-4"
                >
                  Create your Symptora account
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </div>
          </section>
        </main>

        <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="accent-panel rounded-[2.4rem] p-6 md:p-7">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#171717]/65">Coverage</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#171717]">Move from intake to deeper review without fragmenting the case.</h2>
            <p className="mt-4 text-sm leading-7 text-[#171717]/78">
              Symptora keeps the same feature set intact while presenting it through a more modern screening, records, and result-review experience.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <RouteTile title="Signal explorer" description="Symptom-led screening with disease-first entry." className="bubble-card rounded-[2rem]" />
            <RouteTile title="Structured models" description="Diabetes, heart, kidney, liver, and X-ray modules." className="clay-card rounded-[2rem]" />
            <RouteTile title="History + records" description="Saved timelines, uploads, linked evidence, and explanations." className="mesh-panel rounded-[2rem]" />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
}: {
  icon: typeof Activity;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1.5rem] border-[3px] border-[#171717] bg-[#fffdf5]/70 px-4 py-4 shadow-[4px_4px_0_#171717]">
      <div className="medify-orb flex h-11 w-11 items-center justify-center rounded-[1rem]">
        <Icon className="h-5 w-5 text-[#fff7c5]" />
      </div>
      <p className="font-semibold text-[#171717] dark:text-[#171717]">{title}</p>
    </div>
  );
}

function StatBubble({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className={`${className} p-4`}>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#171717]/65">{label}</p>
      <p className="mt-3 text-lg font-semibold text-[#171717]">{value}</p>
    </div>
  );
}

function RouteTile({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className: string;
}) {
  return (
    <div className={`${className} p-5`}>
      <p className="text-2xl font-semibold text-[#171717]">{title}</p>
      <p className="mt-3 text-sm leading-7 text-[#171717]/78">{description}</p>
    </div>
  );
}
