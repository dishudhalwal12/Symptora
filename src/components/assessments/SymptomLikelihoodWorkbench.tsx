"use client";

import { useState } from "react";
import { Activity, CheckCircle2, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DISEASE_PROFILES,
  DiseaseSlug,
  getDiseaseProfile,
  inferSymptomLikelihood,
} from "@/lib/symptom-checker";
import { cn } from "@/lib/utils";

const DISEASE_CARD_TONES = [
  "clay-card rounded-[2rem]",
  "mesh-panel rounded-[2rem]",
  "bubble-card rounded-[2rem]",
];

export function SymptomLikelihoodWorkbench() {
  const [diseaseId, setDiseaseId] = useState<DiseaseSlug>("diabetes");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const activeDisease = getDiseaseProfile(diseaseId);
  const result = inferSymptomLikelihood({ diseaseId, selectedSymptoms, notes });

  function handleDiseaseChange(nextDiseaseId: DiseaseSlug) {
    setDiseaseId(nextDiseaseId);
    setSelectedSymptoms([]);
    setNotes("");
  }

  function toggleSymptom(symptomId: string) {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((item) => item !== symptomId)
        : [...current, symptomId]
    );
  }

  function resetSelection() {
    setSelectedSymptoms([]);
    setNotes("");
  }

  return (
    <div className="grid gap-5 2xl:grid-cols-[280px_minmax(0,1fr)_360px]">
      <aside className="shell-card rounded-[2.25rem] p-5 md:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="medify-pill">Disease selection</p>
            <h3 className="mt-4 text-3xl font-semibold leading-[0.95] text-[#171717]">
              Start from what the patient suspects
            </h3>
            <p className="mt-4 text-sm leading-7 text-[#3d3d3d]">
              Pick the disease concern first, then capture the symptoms the patient is reporting.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={resetSelection}>
            Reset case
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          {DISEASE_PROFILES.map((profile, index) => {
            const active = profile.id === diseaseId;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleDiseaseChange(profile.id)}
                className={cn(
                  "w-full p-4 text-left transition",
                  active
                    ? "ink-panel rounded-[2rem] text-white"
                    : DISEASE_CARD_TONES[index]
                )}
              >
                <p className={cn("text-xs font-black uppercase tracking-[0.24em]", active ? "text-white/65" : "text-[#171717]/65")}>
                  {profile.tagline}
                </p>
                <p className={cn("mt-3 text-2xl font-semibold", active ? "text-white" : "text-[#171717]")}>
                  {profile.name}
                </p>
                <p className={cn("mt-3 text-sm leading-7", active ? "text-white/78" : "text-[#171717]/78")}>
                  {profile.description}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="space-y-5">
        <div className="mesh-panel rounded-[2.4rem] p-5 md:p-6">
          <div className="grid gap-5 xl:grid-cols-[1fr_auto]">
            <div>
              <p className="medify-pill bg-[#171717] text-[#fff7c5]">Symptom board</p>
              <h4 className="mt-4 text-3xl font-semibold text-[#171717]">{activeDisease.name}</h4>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#171717]/78">{activeDisease.highlight}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <QuickSignal label="Symptoms selected" value={String(selectedSymptoms.length)} />
              <QuickSignal label="Notes matched" value={String(result.noteMatches.length)} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {activeDisease.symptoms.map((symptom) => {
              const active = selectedSymptoms.includes(symptom.id);

              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={cn(
                    "rounded-full border-[3px] border-[#171717] px-4 py-3 text-sm font-black uppercase tracking-[0.08em] shadow-[4px_4px_0_#171717] transition",
                    active
                      ? "bg-[#171717] text-[#fff7c5]"
                      : "bg-[#fffdf5] text-[#171717] hover:bg-[#ffe75c]"
                  )}
                >
                  {symptom.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.94fr_1.06fr]">
          <div className="clay-card rounded-[2.2rem] p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="medify-orb flex h-12 w-12 items-center justify-center rounded-[1rem]">
                <FileText className="h-5 w-5 text-[#fff7c5]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Patient notes</p>
                <h4 className="text-2xl font-semibold text-[#171717]">Add the patient’s own words</h4>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#171717]/78">
              Free-text notes help Symptora match wording like chest pressure, fatigue, or appetite loss when estimating the chance.
            </p>
            <Textarea
              className="mt-4"
              placeholder="Example: chest pressure since yesterday, gets tired while climbing stairs, sometimes feels the heartbeat racing..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="shell-card rounded-[2.2rem] p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="medify-orb flex h-12 w-12 items-center justify-center rounded-[1rem]">
                <Activity className="h-5 w-5 text-[#fff7c5]" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Signal summary</p>
                <h4 className="text-2xl font-semibold text-[#171717]">What the current case already shows</h4>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryTile label="Likelihood band" value={result.band} />
              <SummaryTile label="Confidence" value={result.confidenceLabel} />
              <SummaryTile label="Matched indicators" value={String(result.matchedSymptoms.length)} />
              <SummaryTile
                label="Questions still open"
                value={result.missingSignals.length > 0 ? String(result.missingSignals.length) : "0"}
              />
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="ink-panel rounded-[2.25rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">Chance estimate</p>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-6xl font-semibold text-white">{result.probability}%</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[0.18em] text-white/60">{result.band}</p>
            </div>
            <div className="rounded-[1.25rem] border-[3px] border-white/15 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
              {result.confidenceLabel}
            </div>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full border-[3px] border-white/18 bg-white/8">
            <div
              className="h-full rounded-full bg-[#ffe75c]"
              style={{ width: `${result.probability}%` }}
            />
          </div>

          <p className="mt-6 text-sm leading-7 text-white/82">{result.explanation}</p>

          <div className="mt-6 rounded-[1.5rem] border-[3px] border-white/15 bg-white/8 p-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">Clinical caution</p>
            <p className="mt-3 text-sm leading-7 text-white/82">{result.disease.caution}</p>
          </div>
        </div>

        <div className="bubble-card rounded-[2.2rem] p-5">
          <div className="flex items-center gap-3">
            <div className="medify-orb flex h-12 w-12 items-center justify-center rounded-[1rem]">
              <CheckCircle2 className="h-5 w-5 text-[#fff7c5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Matched indicators</p>
              <h4 className="text-2xl font-semibold text-[#171717]">
                {result.matchedSymptoms.length > 0 ? `${result.matchedSymptoms.length} signs matched` : "Waiting for symptom input"}
              </h4>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {result.matchedSymptoms.length > 0 ? (
              result.matchedSymptoms.map((symptom) => (
                <span
                  key={symptom.id}
                  className="rounded-full border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-2 text-sm font-black uppercase tracking-[0.08em] text-[#171717] shadow-[3px_3px_0_#171717]"
                >
                  {symptom.label}
                </span>
              ))
            ) : (
              <p className="text-sm leading-7 text-[#171717]/78">
                Select the symptoms the patient reports and the matched indicators will appear here.
              </p>
            )}
          </div>

          {result.noteMatches.length > 0 ? (
            <div className="mt-5 rounded-[1.4rem] border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-4 text-sm leading-7 text-[#171717]/78 shadow-[4px_4px_0_#171717]">
              Symptora also found symptom cues inside the free-text notes and merged them into the estimate.
            </div>
          ) : null}
        </div>

        <div className="accent-panel rounded-[2.2rem] p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="medify-orb flex h-12 w-12 items-center justify-center rounded-[1rem]">
              <Sparkles className="h-5 w-5 text-[#fff7c5]" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#171717]/65">Next actions</p>
              <h4 className="text-2xl font-semibold text-[#171717]">How to continue the case</h4>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {result.disease.nextSteps.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "rounded-[1.4rem] border-[3px] border-[#171717] px-4 py-4 text-sm leading-7 text-[#171717] shadow-[4px_4px_0_#171717]",
                  index % 2 === 0 ? "bg-[#fffdf5]" : "bg-[#ffe75c]"
                )}
              >
                {step}
              </div>
            ))}
          </div>

          {result.missingSignals.length > 0 ? (
            <div className="mt-5 rounded-[1.4rem] border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-4 shadow-[4px_4px_0_#171717]">
              <p className="text-sm font-semibold text-[#171717]">High-value questions still missing</p>
              <p className="mt-2 text-sm leading-7 text-[#171717]/78">
                {result.missingSignals.map((symptom) => symptom.label).join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function QuickSignal({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bubble-card rounded-[1.5rem] px-4 py-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#171717]/65">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#171717]">{value}</p>
    </div>
  );
}

function SummaryTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.4rem] border-[3px] border-[#171717] bg-[#fffdf5] px-4 py-4 shadow-[4px_4px_0_#171717]">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#171717]/65">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#171717]">{value}</p>
    </div>
  );
}
