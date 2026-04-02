import { GoogleGenerativeAI } from "@google/generative-ai";

import { MedicalExplanationResult, RecordSummaryPayload } from "@/types";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const FALLBACK_GEMINI_MODELS = [
  DEFAULT_GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-flash-latest",
] as const;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new GoogleGenerativeAI(apiKey);
}

function getCandidateModelNames() {
  return [
    process.env.GEMINI_MODEL?.trim(),
    ...FALLBACK_GEMINI_MODELS,
  ].filter((value, index, array): value is string => !!value && array.indexOf(value) === index);
}

function isUnavailableModelError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("404 Not Found") ||
    error.message.includes("is not found for API version") ||
    error.message.includes("not supported for generateContent")
  );
}

function normalizeJsonPayload(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return trimmed;
}

function recoverExplanationPayload(text: string): MedicalExplanationResult | null {
  const explanationMatch = text.match(/"explanation"\s*:\s*"([\s\S]*?)"/);
  const nextStepsMatch = text.match(/"nextSteps"\s*:\s*\[([\s\S]*?)\]/);

  if (!explanationMatch) {
    return null;
  }

  const explanation = explanationMatch[1]
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, " ")
    .trim();

  const nextSteps = nextStepsMatch
    ? Array.from(nextStepsMatch[1].matchAll(/"([\s\S]*?)"/g)).map((match) =>
        match[1].replace(/\\"/g, "\"").replace(/\\n/g, " ").trim()
      )
    : [];

  return {
    explanation,
    nextSteps,
  };
}

function parseTaggedExplanationPayload(text: string): MedicalExplanationResult | null {
  const normalized = text.trim();
  const explanationStart = normalized.search(/EXPLANATION\s*:/i);

  if (explanationStart < 0) {
    return null;
  }

  const nextStepsStart = normalized.search(/NEXT[_ ]?STEPS?\s*:/i);
  const explanationSection = nextStepsStart >= 0
    ? normalized.slice(explanationStart, nextStepsStart)
    : normalized.slice(explanationStart);
  const explanation = explanationSection
    .replace(/EXPLANATION\s*:/i, "")
    .replace(/\s+/g, " ")
    .trim();

  const stepsSection = nextStepsStart >= 0 ? normalized.slice(nextStepsStart) : "";
  const nextSteps = stepsSection
    ? stepsSection
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-"))
        .map((line) => line.replace(/^-+\s*/, "").trim())
        .filter(Boolean)
    : [];

  if (!explanation) {
    return null;
  }

  return {
    explanation,
    nextSteps,
  };
}

async function runJsonPrompt(
  prompt: string,
  options?: {
    maxOutputTokens?: number;
    temperature?: number;
  }
): Promise<MedicalExplanationResult> {
  const client = getGeminiClient();

  if (!client) {
    return {
      explanation: "Gemini is not configured for this environment yet.",
      nextSteps: [],
      unavailableReason: "Missing GEMINI_API_KEY",
    };
  }

  let lastError: unknown = null;

  for (const modelName of getCandidateModelNames()) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: options?.maxOutputTokens ?? 220,
          temperature: options?.temperature ?? 0.75,
        },
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const normalizedText = normalizeJsonPayload(text);

      try {
        const parsed = JSON.parse(normalizedText) as MedicalExplanationResult;
        return {
          explanation: parsed.explanation || "No explanation returned.",
          summary: parsed.summary,
          nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
          unavailableReason: parsed.unavailableReason,
        };
      } catch {
        const tagged = parseTaggedExplanationPayload(normalizedText);
        if (tagged) {
          return tagged;
        }

        const recovered = recoverExplanationPayload(normalizedText);
        if (recovered) {
          return recovered;
        }

        return {
          explanation: normalizedText,
          nextSteps: [],
        };
      }
    } catch (error) {
      lastError = error;

      if (isUnavailableModelError(error)) {
        continue;
      }

      throw error;
    }
  }

  return {
    explanation: "Gemini is temporarily unavailable for the configured model list.",
    nextSteps: [],
    unavailableReason: lastError instanceof Error ? lastError.message : "No compatible Gemini model was available.",
  };
}

function sanitizeInlineText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function compactFactorList(factors: string[]) {
  const items = factors
    .map((factor) => sanitizeInlineText(factor))
    .filter(Boolean)
    .slice(0, 2);

  return items.length > 0 ? items.join("; ") : "No standout factors were provided";
}

function compactRecommendation(recommendation: string) {
  const clean = sanitizeInlineText(recommendation);
  const firstSentence = clean.split(/(?<=[.!?])\s+/)[0] || clean;
  return firstSentence.slice(0, 140);
}

export async function explainAssessmentWithGemini(payload: {
  assessmentId?: string;
  assessmentType: string;
  predictionLabel: string;
  probability: number;
  riskLevel: string;
  factors: string[];
  recommendation: string;
}) {
  const probabilityPercent = Math.round(payload.probability * 100);
  const compactFactors = compactFactorList(payload.factors);
  const followUp = compactRecommendation(payload.recommendation);

  return runJsonPrompt(
    `
Return valid JSON only with exactly these keys:
{"explanation":"string","nextSteps":["string","string"]}

Write like a calm, caring human talking directly to the patient.
Use simple everyday English.
Do not sound like a doctor, chatbot, report, or disclaimer.
Do not mention AI, models, training data, or "our analysis".
Do not diagnose. Do not prescribe treatment.

Tone:
- High risk: serious, steady, supportive, and clear that a doctor should be consulted soon.
- Moderate risk: practical and balanced.
- Low risk: reassuring but not dismissive.

Limits:
- Explanation must be one paragraph of 55 to 80 words.
- Mention at most two standout factors naturally.
- Next steps must be exactly 2 short strings.
- Each next step must stay under 12 words.

Case:
- Assessment: ${sanitizeInlineText(payload.assessmentType)}
- Result label: ${sanitizeInlineText(payload.predictionLabel)}
- Risk level: ${sanitizeInlineText(payload.riskLevel)}
- Estimated chance: ${probabilityPercent}%
- Standout factors: ${compactFactors}
- Follow-up note: ${followUp}
    `.trim(),
    {
      maxOutputTokens: 150,
      temperature: 0.6,
    }
  );
}

export async function summarizeRecordWithGemini(payload: RecordSummaryPayload) {
  return runJsonPrompt(`
You are summarizing uploaded medical record text for a healthcare support application called Symptora.
You must not diagnose or invent findings.
Return valid JSON with keys: explanation, nextSteps.

Record category: ${payload.category}
Raw text:
${payload.text}

Summarize what the report appears to say in plain language. Mention missing context if the text is incomplete.
The nextSteps array should contain 2-4 short practical follow-up points.
  `.trim());
}
