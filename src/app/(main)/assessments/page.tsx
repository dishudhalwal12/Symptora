"use client";

import { useRouter } from "next/navigation";
import { Activity, ArrowRight, FileImage, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/card";

const modules = [
  {
    title: "Signal explorer",
    href: "/symptom-checker",
    description:
      "Let patients start from the condition they suspect, report symptoms, and review a clearer early signal before moving deeper.",
    icon: Sparkles,
    tone: "bg-[#7de7ff]",
  },
  {
    title: "Diabetes model",
    href: "/diabetes",
    description:
      "Use the trained diabetes pipeline with glucose, BMI, insulin, pregnancies, pedigree function, and age.",
    icon: Activity,
    tone: "bg-[#ffe75c]",
  },
  {
    title: "Heart model",
    href: "/heart",
    description:
      "Run the heart model with chest pain, resting ECG, exercise angina, max heart rate, and vessel-related features.",
    icon: HeartPulse,
    tone: "bg-[#ff8bc2]",
  },
  {
    title: "Kidney and liver",
    href: "/assessments/kidney-or-liver",
    description:
      "Run the trained kidney and liver workflows from one organ module, with renal chemistry, urine findings, and liver marker forms aligned to the local datasets.",
    icon: ShieldCheck,
    tone: "bg-[#b6f36d]",
  },
  {
    title: "Chest X-ray",
    href: "/xray",
    description:
      "Upload an X-ray record for image review. If image analysis is unavailable, the result page will explain that clearly.",
    icon: FileImage,
    tone: "bg-[#cdc5ff]",
  },
];

export default function AssessmentsPage() {
  const router = useRouter();
  const [featureModule, ...secondaryModules] = modules;

  return (
    <div className="space-y-5">
      <PageIntro
        eyebrow="Assessments hub"
        title="Choose the route that matches the patient’s starting point"
        description="Begin with signals when the case is still open, or jump into structured disease and imaging modules when the clinical data is already available."
      />

      <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="ink-panel rounded-[2.4rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">Primary route</p>
          <h3 className="mt-4 max-w-2xl text-4xl font-semibold text-white">
            Start with what the patient feels first, then move into structured review only when it adds value.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">
            Symptora’s default path is signal-first: frame the concern, capture the symptom story, then continue into diabetes, heart, kidney, liver, or X-ray workflows when values and reports are ready.
          </p>
        </Card>

        <Card className="accent-panel rounded-[2.25rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#121212]/60">Operational rhythm</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-[#121212]/80">
            <li>Open the signal explorer when the conversation starts with symptoms.</li>
            <li>Jump into a structured module when labs, vitals, or imaging already exist.</li>
            <li>Use the saved result page to compare contributors, warnings, and next steps.</li>
          </ul>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <button
          type="button"
          onClick={() => router.push(featureModule.href)}
          className="group block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73c9cf]/40"
          aria-label={`Open ${featureModule.title}`}
        >
          <Card className="h-full cursor-pointer rounded-[2.5rem] p-6 transition group-hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-4">
              <div className="medify-orb flex h-14 w-14 items-center justify-center rounded-[1.1rem]">
                <featureModule.icon className="h-6 w-6 text-[#fff7c5]" />
              </div>
              <ArrowRight className="h-5 w-5 text-[#171717]" />
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-[#171717]/65">Recommended starting point</p>
            <h3 className="mt-4 max-w-xl text-4xl font-semibold text-[#171717]">{featureModule.title}</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#171717]/78">{featureModule.description}</p>
          </Card>
        </button>

        <div className="grid gap-5 md:grid-cols-2">
          {secondaryModules.map((module, index) => (
            <button
              type="button"
              key={module.href}
              onClick={() => router.push(module.href)}
              className="group block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#73c9cf]/40"
              aria-label={`Open ${module.title}`}
            >
              <Card className={`h-full cursor-pointer p-6 transition group-hover:-translate-y-0.5 ${index % 2 === 0 ? "rounded-[2.1rem]" : "rounded-[2.1rem]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-[1rem] border-[3px] border-[#171717] p-3 shadow-[4px_4px_0_#171717] ${module.tone}`}>
                    <module.icon className="h-6 w-6 text-[#171717]" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#171717]" />
                </div>
                <h3 className="mt-8 text-3xl font-semibold text-gray-950">{module.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#3d3d3d]">{module.description}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
