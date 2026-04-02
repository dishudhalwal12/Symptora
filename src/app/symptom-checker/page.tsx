import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { BrandLockup } from "@/components/branding/BrandMark";
import { SymptomLikelihoodWorkbench } from "@/components/assessments/SymptomLikelihoodWorkbench";
import { Button } from "@/components/ui/button";

const SCREENING_POINTS = [
  "Choose the disease the patient wants to check.",
  "Mark the symptoms they are experiencing.",
  "Add notes and review the estimated likelihood.",
];

export default function SymptomCheckerPage() {
  return (
    <div className="min-h-screen px-3 py-3 md:px-5 md:py-5">
      <div className="mx-auto max-w-[1520px] space-y-5">
        <header className="glass-header rounded-[2.4rem] p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <BrandLockup label="Symptom signal explorer" markClassName="h-12 w-12 rounded-[1rem]" labelClassName="text-lg font-semibold text-[#171717]" />
            </Link>

            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button variant="outline">Open workspace</Button>
              </Link>
              <Link href="/register">
                <Button>Create account</Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="shell-card rounded-[2.6rem] p-6 md:p-8">
            <p className="medify-pill">Symptom-led screening</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#171717] md:text-7xl">
              Pick the condition, mark the signal, and get a fast first direction.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-[#3d3d3d] md:text-base">
              This public preview shows the redesigned Symptora intake flow with a much stronger visual identity: start from the concern, describe symptoms in natural language, and get a clear early screening view.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">Use Symptora in full</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Back to homepage
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <InfoBubble label="Start point" value="Disease concern" className="bubble-card rounded-[1.5rem]" />
              <InfoBubble label="Input style" value="Symptoms + notes" className="mesh-panel rounded-[1.5rem]" />
              <InfoBubble label="Output" value="Chance + next steps" className="accent-panel rounded-[1.5rem]" />
            </div>
          </div>

          <div className="grid gap-5">
            <div className="ink-panel rounded-[2.25rem] p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">How it works</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-white/82">
                {SCREENING_POINTS.map((point, index) => (
                  <p key={point}>
                    {index + 1}. {point}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              <div className="bubble-card rounded-[2.2rem] p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#171717]" />
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#171717]/65">Result focus</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#171717]/78">
                  The result view keeps the estimate, matched indicators, and next questions together so the patient and clinician can understand the flow quickly.
                </p>
              </div>

              <div className="clay-card rounded-[2.2rem] p-6">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#171717]/65">Workspace ready</p>
                <p className="mt-4 text-sm leading-7 text-[#171717]/78">
                  Continue inside Symptora to save the screening, add records, and carry the case into deeper assessments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <SymptomLikelihoodWorkbench />

        <section className="bubble-card rounded-[2.25rem] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Continue in workspace</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#171717]">Save the screening flow inside the full Symptora workspace</h2>
            </div>
            <Link href="/register" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#171717] underline decoration-[3px] underline-offset-4">
              Create your Symptora account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoBubble({
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
