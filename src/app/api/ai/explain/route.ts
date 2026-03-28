import { NextResponse } from "next/server";

import { explainAssessmentWithGemini } from "@/services/gemini.server";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      assessmentId?: string;
      assessmentType: string;
      predictionLabel: string;
      probability: number;
      riskLevel: string;
      factors: string[];
      recommendation: string;
    };

    const result = await explainAssessmentWithGemini({
      assessmentId: payload.assessmentId,
      assessmentType: payload.assessmentType,
      predictionLabel: payload.predictionLabel,
      probability: payload.probability,
      riskLevel: payload.riskLevel,
      factors: payload.factors,
      recommendation: payload.recommendation,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        explanation: "AI explanation is currently unavailable.",
        nextSteps: [],
        unavailableReason: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
