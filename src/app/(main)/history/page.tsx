"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { History, LineChart } from "lucide-react";

import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingPanel } from "@/components/ui/loading-panel";
import { RecoveryState } from "@/components/ui/recovery-state";
import { StatusPill } from "@/components/ui/status-pill";
import { useAuth } from "@/hooks/useAuth";
import { getDemoAssessments } from "@/lib/demo-data";
import { getAssessmentService } from "@/services/loaders";
import { AssessmentRecord, AssessmentType } from "@/types";

type SortOption = "newest" | "oldest" | "risk";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<AssessmentType | "all">("all");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    if (!user) return;
    const userId = user.uid;

    let cancelled = false;

    async function loadHistory() {
      try {
        const assessmentService = await getAssessmentService();
        const records = await assessmentService.getHistory(userId);
        if (cancelled) return;
        setHistory(records.length > 0 ? records : getDemoAssessments({ uid: userId }));
        setError(null);
      } catch (error) {
        console.error("Failed to load assessment history", error);
        if (cancelled) return;
        setHistory(getDemoAssessments({ uid: userId }));
        setError(error instanceof Error ? error.message : "Unable to load assessment history.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredHistory = useMemo(() => {
    const next = history.filter((record) => (filter === "all" ? true : record.assessmentType === filter));

    if (sort === "oldest") {
      return next.sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
    }

    if (sort === "risk") {
      const weight = { High: 3, Moderate: 2, Low: 1 };
      return next.sort((left, right) => weight[right.riskLevel] - weight[left.riskLevel]);
    }

    return next.sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  }, [filter, history, sort]);

  const trend = useMemo(
    () =>
      filteredHistory
        .slice()
        .sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt))
        .map((record) => ({
          date: new Date(record.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          probability: Number((record.probability * 100).toFixed(1)),
          score: record.overallHealthScore,
        })),
    [filteredHistory]
  );

  return (
    <div className="page-fade-in">
      <PageIntro
        eyebrow="Assessment history"
        title="Read the full assessment timeline at a glance"
        description="Filter by module, compare movement, and open saved result pages that preserve the original inputs, labels, and linked evidence."
      />
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="shell-card border-0 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gray-400">Controls</p>
              <h3 className="mt-2 text-2xl font-semibold text-gray-950">Assessment timeline</h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                className="field-select"
                value={filter}
                onChange={(event) => setFilter(event.target.value as AssessmentType | "all")}
              >
                <option value="all">All modules</option>
                <option value="diabetes">Diabetes</option>
                <option value="heart">Heart</option>
                <option value="kidney">Kidney</option>
                <option value="liver">Liver</option>
                <option value="xray">X-ray</option>
              </select>
              <select
                className="field-select"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="risk">Highest risk</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {error && !loading ? (
              <RecoveryState
                title="Assessment history unavailable"
                description={error}
                actionLabel="Retry history"
                onAction={() => window.location.reload()}
              />
            ) : loading ? (
              <LoadingPanel className="h-56" lines={4} />
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((record, index) => (
                <Link
                  key={record.id}
                  href={`/history/${record.id}`}
                  className={`block rounded-[24px] p-4 ${index % 3 === 0 ? "bubble-card" : index % 3 === 1 ? "mesh-panel" : "clay-card"}`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-lg font-semibold capitalize text-gray-950">
                        {record.assessmentType} assessment
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{record.predictionLabel}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {(record.probability * 100).toFixed(1)}% probability · {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill level={record.riskLevel} />
                      <span className="rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-600">
                        {record.riskBand}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                icon={History}
                title="No saved assessments"
                description="Run your first assessment to start building a risk timeline. Your onboarding baseline is already ready to support it."
              />
            )}
          </div>
        </Card>

        <Card className="ink-panel border-0 p-6">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-white" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/55">Trend view</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Probability movement</h3>
            </div>
          </div>

          <div className="mt-6 h-[280px]">
            {trend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4C57F" stopOpacity={0.62} />
                      <stop offset="95%" stopColor="#8BD7DA" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#DDE8F4" />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="probability" stroke="#F4C57F" strokeWidth={2.5} fill="url(#historyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[24px] border border-white/10 bg-white/6 text-sm text-white/72">
                Trend movement appears after saved assessments exist.
              </div>
            )}
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/8 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">Summary</p>
            <p className="mt-3 text-sm leading-7 text-white/78">
              Use the history view to compare how probability changes after new records, updated baseline details, or repeat runs across the same concern.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
