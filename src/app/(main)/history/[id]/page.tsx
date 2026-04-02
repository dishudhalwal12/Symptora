"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { ResultDetailView } from "@/components/assessments/ResultDetailView";
import { PageIntro } from "@/components/layout/PageIntro";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingPanel } from "@/components/ui/loading-panel";
import { RecoveryState } from "@/components/ui/recovery-state";
import { useAuth } from "@/hooks/useAuth";
import { getDemoAssessmentById, getDemoRecordById, isDemoId } from "@/lib/demo-data";
import { assessmentService } from "@/services/assessment.service";
import { recordsService } from "@/services/records.service";
import { AssessmentRecord, UploadRecord } from "@/types";

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>();
  const historyId = params?.id;
  const { user } = useAuth();
  const [result, setResult] = useState<AssessmentRecord | null>(null);
  const [linkedRecord, setLinkedRecord] = useState<UploadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!historyId) return;

    let cancelled = false;

    async function loadHistoryItem() {
      try {
        const assessment = isDemoId(historyId)
          ? getDemoAssessmentById(historyId, { uid: user?.uid })
          : await assessmentService.getAssessmentById(historyId);
        if (cancelled) return;

        setResult(assessment);
        setError(null);

        if (assessment?.linkedUploadId) {
          const upload = isDemoId(assessment.linkedUploadId)
            ? getDemoRecordById(assessment.linkedUploadId, { uid: assessment.uid })
            : await recordsService.getRecordById(assessment.linkedUploadId);
          if (cancelled) return;
          setLinkedRecord(upload);
        } else {
          setLinkedRecord(null);
        }
      } catch (error) {
        console.error("Failed to load history detail", error);
        if (cancelled) return;
        setResult(null);
        setLinkedRecord(null);
        setError(error instanceof Error ? error.message : "The selected assessment could not be loaded.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistoryItem();

    return () => {
      cancelled = true;
    };
  }, [historyId, user?.uid]);

  if (loading) {
    return <LoadingPanel className="h-72" lines={4} />;
  }

  if (!user) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="History item unavailable"
        description="The selected assessment could not be loaded."
      />
    );
  }

  if (!result) {
    return (
      <RecoveryState
        title="History item unavailable"
        description={error || "The selected assessment could not be loaded."}
        actionLabel="Retry history item"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="page-fade-in">
      <Link href="/history" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      <PageIntro
        eyebrow="History detail"
        title="Assessment snapshot"
        description="This detail view preserves the original inputs, prediction output, interpretation, and any linked record context."
      />
      <ResultDetailView result={result} linkedRecord={linkedRecord} userName={user.fullName} />
    </div>
  );
}
