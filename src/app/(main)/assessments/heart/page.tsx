"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, HeartPulse } from "lucide-react";

import { RecentAssessmentList } from "@/components/assessments/RecentAssessmentList";
import {
  AssessmentNumberField as NumberField,
  AssessmentSelectField as SelectField,
} from "@/components/assessments/AssessmentFields";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  HEART_CHEST_PAIN_OPTIONS,
  HEART_REST_ECG_OPTIONS,
  HEART_SLOPE_OPTIONS,
  HEART_THAL_OPTIONS,
} from "@/lib/assessment-options";
import { useAuth } from "@/hooks/useAuth";
import { getAssessmentService } from "@/services/loaders";
import { AssessmentRecord, HeartAssessmentInput } from "@/types";

const DEFAULT_FORM: HeartAssessmentInput = {
  age: 42,
  sex: "Male",
  cp: "asymptomatic",
  trestbps: 148,
  chol: 238,
  fbs: true,
  restecg: "ST-T wave abnormality",
  thalch: 143,
  exang: true,
  oldpeak: 2.1,
  slope: "flat",
  ca: "1",
  thal: "reversible defect",
};

export default function HeartAssessmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<HeartAssessmentInput>(DEFAULT_FORM);
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    void (async () => {
      try {
        const assessmentService = await getAssessmentService();
        const records = await assessmentService.getRelatedAssessments(user.uid, "heart");
        setHistory(records);
      } catch (historyError) {
        setError(
          historyError instanceof Error
            ? historyError.message
            : "Unable to load recent heart assessments."
        );
        setHistory([]);
      } finally {
        setLoadingHistory(false);
      }
    })();
  }, [user]);

  function updateForm<K extends keyof HeartAssessmentInput>(key: K, value: HeartAssessmentInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setSubmitting(true);
    setError(null);

    try {
      const assessmentService = await getAssessmentService();
      const result = await assessmentService.predict(user.uid, {
        assessmentType: "heart",
        inputValues: form,
      });
      router.push(`/history/${result.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to run the heart assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Session unavailable"
        description="Sign in again to run a heart assessment."
      />
    );
  }

  return (
    <div>
      <Link href="/assessments" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
        <ArrowLeft className="h-4 w-4" />
        Back to modules
      </Link>

      <PageIntro
        eyebrow="Heart module"
        title="Run the cardiovascular risk workflow"
        description="This page is aligned to the heart dataset columns used during training, including categorical fields like chest pain type, ECG pattern, slope, vessels, and thal status."
      />

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="shell-card border-0 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-[22px] bg-[#fff1f0] p-3">
              <HeartPulse className="h-6 w-6 text-gray-950" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-950">Heart assessment inputs</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">
                Use the most recent clinically relevant values. The form maps directly to the saved model schema.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-4">
              <NumberField label="Age" value={form.age} onChange={(value) => updateForm("age", value)} />
              <SelectField
                label="Sex"
                value={form.sex}
                onChange={(value) => updateForm("sex", value)}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
              />
              <SelectField
                label="Chest pain type"
                value={form.cp}
                onChange={(value) => updateForm("cp", value)}
                options={HEART_CHEST_PAIN_OPTIONS.map((value) => ({ value, label: value }))}
              />
              <NumberField
                label="Resting BP"
                value={form.trestbps}
                onChange={(value) => updateForm("trestbps", value)}
              />
              <NumberField label="Cholesterol" value={form.chol} onChange={(value) => updateForm("chol", value)} />
              <SelectField
                label="Fasting blood sugar > 120"
                value={String(form.fbs)}
                onChange={(value) => updateForm("fbs", value === "true")}
                options={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Yes" },
                ]}
              />
              <SelectField
                label="Resting ECG"
                value={form.restecg}
                onChange={(value) => updateForm("restecg", value)}
                options={HEART_REST_ECG_OPTIONS.map((value) => ({ value, label: value }))}
              />
              <NumberField
                label="Max heart rate"
                value={form.thalch}
                onChange={(value) => updateForm("thalch", value)}
              />
              <SelectField
                label="Exercise angina"
                value={String(form.exang)}
                onChange={(value) => updateForm("exang", value === "true")}
                options={[
                  { value: "false", label: "No" },
                  { value: "true", label: "Yes" },
                ]}
              />
              <NumberField
                label="Oldpeak"
                value={form.oldpeak}
                step="0.1"
                onChange={(value) => updateForm("oldpeak", value)}
              />
              <SelectField
                label="Slope"
                value={form.slope}
                onChange={(value) => updateForm("slope", value)}
                options={HEART_SLOPE_OPTIONS.map((value) => ({ value, label: value }))}
              />
              <SelectField
                label="Major vessels (ca)"
                value={form.ca}
                onChange={(value) => updateForm("ca", value)}
                options={["0", "1", "2", "3"].map((value) => ({ value, label: value }))}
              />
              <SelectField
                label="Thal"
                value={form.thal}
                onChange={(value) => updateForm("thal", value)}
                options={HEART_THAL_OPTIONS.map((value) => ({ value, label: value }))}
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex flex-wrap justify-end gap-3 border-t border-black/5 pt-5">
              <Button type="button" variant="outline" onClick={() => setForm(DEFAULT_FORM)}>
                Reset values
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Running heart assessment..." : "Run heart assessment"}
              </Button>
            </div>
          </form>
        </Card>

        {loadingHistory ? (
          <div className="h-60 animate-pulse rounded-[28px] bg-white/70" />
        ) : (
          <RecentAssessmentList title="Recent cardiovascular assessments" records={history} />
        )}
      </div>
    </div>
  );
}
