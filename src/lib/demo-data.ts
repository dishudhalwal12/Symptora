import { buildInsightSummary } from "@/lib/scoring";
import { getProfileCompletion, mergeProfileWithDefaults } from "@/lib/profile";
import type {
  AdminStats,
  AssessmentRecord,
  AssessmentType,
  AuthUser,
  ContributingFactor,
  HealthProfile,
  InsightSummary,
  ModelMetadata,
  RiskBand,
  RiskLevel,
  UploadCategory,
  UploadRecord,
  UserDocument,
} from "@/types";

const DEMO_TEXT_URL = (text: string) => `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`;

const DEMO_XRAY_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#061121"/>
        <stop offset="100%" stop-color="#142946"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#bg)"/>
    <ellipse cx="420" cy="440" rx="170" ry="265" fill="#d8e4f2" opacity="0.78"/>
    <ellipse cx="780" cy="440" rx="170" ry="265" fill="#d8e4f2" opacity="0.78"/>
    <rect x="520" y="185" width="160" height="470" rx="80" fill="#9db2c8" opacity="0.46"/>
    <rect x="546" y="220" width="108" height="380" rx="54" fill="#142946" opacity="0.82"/>
    <path d="M330 390c52-74 116-110 191-110" stroke="#eff6ff" stroke-width="18" stroke-linecap="round" opacity="0.22"/>
    <path d="M869 390c-52-74-116-110-191-110" stroke="#eff6ff" stroke-width="18" stroke-linecap="round" opacity="0.22"/>
    <circle cx="600" cy="715" r="62" fill="#eff6ff" opacity="0.18"/>
  </svg>`
)}`;

type DemoSeed = {
  uid: string;
  fullName: string;
  email?: string;
  role?: "user" | "admin";
};

type DemoAssessmentInput = {
  id: string;
  type: AssessmentType;
  predictionLabel: string;
  probability: number;
  confidenceScore: number;
  riskLevel: RiskLevel;
  riskBand: RiskBand;
  overallHealthScore: number;
  lifestyleScore: number;
  recommendation: string;
  createdAt: string;
  linkedUploadId?: string;
  xrayImageUrl?: string;
  inputValues: Record<string, unknown>;
  contributingFactors: ContributingFactor[];
  warnings?: string[];
  explanation?: string;
  explanationNextSteps?: string[];
};

type DemoUploadInput = {
  id: string;
  category: UploadCategory;
  fileName: string;
  createdAt: string;
  notes?: string;
  linkedAssessmentId?: string;
  downloadUrl?: string;
  extractedText?: string;
  aiSummary?: string;
  archived?: boolean;
  fileType?: string;
  fileSizeBytes?: number;
};

const DEMO_MODEL_METADATA: ModelMetadata[] = [
  {
    modelName: "diabetes",
    version: "2026.03.1",
    taskType: "diabetes",
    accuracy: 0.892,
    precision: 0.874,
    recall: 0.861,
    f1Score: 0.867,
    trainedAt: "2026-03-14T10:00:00.000Z",
    status: "ready",
  },
  {
    modelName: "heart",
    version: "2026.03.2",
    taskType: "heart",
    accuracy: 0.908,
    precision: 0.891,
    recall: 0.882,
    f1Score: 0.886,
    trainedAt: "2026-03-16T12:30:00.000Z",
    status: "ready",
  },
  {
    modelName: "kidney",
    version: "2026.03.1",
    taskType: "kidney",
    accuracy: 0.884,
    precision: 0.868,
    recall: 0.846,
    f1Score: 0.857,
    trainedAt: "2026-03-18T08:15:00.000Z",
    status: "ready",
  },
  {
    modelName: "liver",
    version: "2026.03.1",
    taskType: "liver",
    accuracy: 0.872,
    precision: 0.851,
    recall: 0.838,
    f1Score: 0.844,
    trainedAt: "2026-03-20T09:45:00.000Z",
    status: "ready",
  },
  {
    modelName: "xray",
    version: "2026.03.0",
    taskType: "xray",
    accuracy: 0.813,
    precision: 0.804,
    recall: 0.789,
    f1Score: 0.796,
    trainedAt: "2026-03-22T15:10:00.000Z",
    status: "training",
  },
];

const DEFAULT_ASSESSMENTS: DemoAssessmentInput[] = [
  {
    id: "demo-assessment-heart-1",
    type: "heart",
    predictionLabel: "Elevated cardiovascular risk detected",
    probability: 0.78,
    confidenceScore: 0.91,
    riskLevel: "High",
    riskBand: "Action Needed",
    overallHealthScore: 44,
    lifestyleScore: 72,
    recommendation:
      "Prioritize clinician review, repeat blood pressure and lipid checks, and compare symptoms with the latest record set before escalating to imaging or stress testing.",
    createdAt: "2026-03-28T09:10:00.000Z",
    linkedUploadId: "demo-upload-lab-1",
    inputValues: {
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
    },
    contributingFactors: [
      {
        feature: "cp",
        label: "Chest pain pattern",
        direction: "up",
        impactScore: 0.84,
        value: "Asymptomatic",
        explanation: "An asymptomatic pattern with exertional limitation often correlates with higher underlying cardiovascular risk in this model.",
      },
      {
        feature: "trestbps",
        label: "Resting blood pressure",
        direction: "up",
        impactScore: 0.69,
        value: "148 mmHg",
        explanation: "Elevated resting blood pressure materially increased the likelihood score.",
      },
      {
        feature: "oldpeak",
        label: "ST depression",
        direction: "up",
        impactScore: 0.62,
        value: "2.1",
        explanation: "A higher oldpeak value strengthened the signal for ischemic strain within the trained heart model.",
      },
    ],
    warnings: ["Use this output for screening support only and correlate with a clinician-led cardiac evaluation."],
    explanation:
      "The heart model is reacting most strongly to elevated blood pressure, exertional symptoms, and ECG-related markers. The score suggests this case should move quickly into clinical follow-up rather than simple watchful waiting.",
    explanationNextSteps: [
      "Compare the result against the latest blood pressure and cholesterol values.",
      "Ask about exertional chest discomfort, shortness of breath, and exercise tolerance changes.",
      "Escalate to clinician review if symptoms are new, progressive, or occurring at rest.",
    ],
  },
  {
    id: "demo-assessment-diabetes-1",
    type: "diabetes",
    predictionLabel: "Prediabetes pattern likely",
    probability: 0.64,
    confidenceScore: 0.88,
    riskLevel: "Moderate",
    riskBand: "Monitor",
    overallHealthScore: 58,
    lifestyleScore: 72,
    recommendation:
      "Confirm fasting glucose and HbA1c, review weight and activity habits, and monitor the trend before labeling a more severe diabetic risk pattern.",
    createdAt: "2026-03-24T08:35:00.000Z",
    linkedUploadId: "demo-upload-prescription-1",
    inputValues: {
      Pregnancies: 0,
      Glucose: 146,
      BloodPressure: 84,
      SkinThickness: 26,
      Insulin: 162,
      BMI: 29.4,
      DiabetesPedigreeFunction: 0.64,
      Age: 42,
    },
    contributingFactors: [
      {
        feature: "Glucose",
        label: "Fasting glucose",
        direction: "up",
        impactScore: 0.88,
        value: "146 mg/dL",
        explanation: "Glucose was the strongest upward driver of diabetes probability in this run.",
      },
      {
        feature: "BMI",
        label: "Body mass index",
        direction: "up",
        impactScore: 0.57,
        value: "29.4",
        explanation: "BMI added moderate upward pressure to the model score.",
      },
      {
        feature: "DiabetesPedigreeFunction",
        label: "Pedigree function",
        direction: "up",
        impactScore: 0.42,
        value: "0.64",
        explanation: "Family risk markers and related history nudged the probability higher.",
      },
    ],
    warnings: [],
  },
  {
    id: "demo-assessment-kidney-1",
    type: "kidney",
    predictionLabel: "Kidney function currently stable",
    probability: 0.22,
    confidenceScore: 0.87,
    riskLevel: "Low",
    riskBand: "Stable",
    overallHealthScore: 81,
    lifestyleScore: 72,
    recommendation:
      "Maintain the current medication and hydration plan, and repeat renal chemistry on the normal follow-up schedule.",
    createdAt: "2026-03-18T15:20:00.000Z",
    inputValues: {
      age: 42,
      bp: 128,
      sg: 1.02,
      al: 0,
      su: 0,
      rbc: "normal",
      pc: "normal",
      pcc: "notpresent",
      ba: "notpresent",
      bgr: 110,
      bu: 20,
      sc: 1,
      sod: 138,
      pot: 4.3,
      hemo: 14.1,
      pcv: 43,
      wc: 7800,
      rc: 4.9,
      htn: "yes",
      dm: "no",
      cad: "no",
      appet: "good",
      pe: "no",
      ane: "no",
    },
    contributingFactors: [
      {
        feature: "sc",
        label: "Serum creatinine",
        direction: "neutral",
        impactScore: 0.22,
        value: "1.0 mg/dL",
        explanation: "Creatinine remained within a reassuring range and helped keep the score lower.",
      },
      {
        feature: "bp",
        label: "Blood pressure",
        direction: "up",
        impactScore: 0.28,
        value: "128 mmHg",
        explanation: "Blood pressure was mildly elevated but not enough to dominate the kidney risk output.",
      },
    ],
    warnings: [],
  },
  {
    id: "demo-assessment-liver-1",
    type: "liver",
    predictionLabel: "Mild hepatic strain pattern",
    probability: 0.41,
    confidenceScore: 0.83,
    riskLevel: "Moderate",
    riskBand: "Monitor",
    overallHealthScore: 66,
    lifestyleScore: 72,
    recommendation:
      "Trend liver enzymes, review medication and alcohol use, and consider repeat markers if symptoms or fatigue are increasing.",
    createdAt: "2026-03-12T11:40:00.000Z",
    inputValues: {
      Age: 42,
      Gender: "Male",
      Total_Bilirubin: 1.4,
      Direct_Bilirubin: 0.5,
      Alkaline_Phosphotase: 198,
      Alamine_Aminotransferase: 58,
      Aspartate_Aminotransferase: 48,
      Total_Protiens: 7,
      Albumin: 3.8,
      Albumin_and_Globulin_Ratio: 1.1,
    },
    contributingFactors: [
      {
        feature: "Alkaline_Phosphotase",
        label: "Alkaline phosphotase",
        direction: "up",
        impactScore: 0.61,
        value: "198 IU/L",
        explanation: "Alkaline phosphotase was one of the main features pushing the liver score upward.",
      },
      {
        feature: "Alamine_Aminotransferase",
        label: "ALT",
        direction: "up",
        impactScore: 0.46,
        value: "58 IU/L",
        explanation: "A mild ALT elevation supported the moderate monitoring recommendation.",
      },
    ],
    warnings: [],
  },
  {
    id: "demo-assessment-xray-1",
    type: "xray",
    predictionLabel: "No acute radiographic concern detected",
    probability: 0.18,
    confidenceScore: 0.8,
    riskLevel: "Low",
    riskBand: "Stable",
    overallHealthScore: 84,
    lifestyleScore: 72,
    recommendation:
      "Keep the image attached to the case file and compare with prior imaging if respiratory symptoms persist.",
    createdAt: "2026-03-08T17:05:00.000Z",
    linkedUploadId: "demo-upload-xray-1",
    xrayImageUrl: DEMO_XRAY_URL,
    inputValues: {
      imageUrl: DEMO_XRAY_URL,
    },
    contributingFactors: [
      {
        feature: "image_findings",
        label: "Imaging pattern",
        direction: "down",
        impactScore: 0.55,
        value: "No focal opacity",
        explanation: "The saved chest film did not surface a dominant acute finding in the imaging workflow.",
      },
    ],
    warnings: ["Imaging review remains supportive and does not replace radiologist interpretation when clinically required."],
  },
];

const DEFAULT_UPLOADS: DemoUploadInput[] = [
  {
    id: "demo-upload-lab-1",
    category: "lab-report",
    fileName: "Q1 cardiometabolic panel.pdf",
    createdAt: "2026-03-28T08:05:00.000Z",
    notes: "Uploaded after annual executive screening with repeat cholesterol and glucose checks.",
    linkedAssessmentId: "demo-assessment-heart-1",
    aiSummary:
      "The lab panel shows elevated LDL and fasting glucose with otherwise stable renal markers. This record is commonly used alongside the heart and diabetes modules during review.",
    extractedText:
      "Lipid profile: LDL 162 mg/dL, HDL 44 mg/dL, triglycerides 186 mg/dL. Fasting glucose 146 mg/dL. Serum creatinine 1.0 mg/dL.",
    downloadUrl: DEMO_TEXT_URL("Cardiometabolic panel report."),
    fileType: "application/pdf",
    fileSizeBytes: 524288,
  },
  {
    id: "demo-upload-prescription-1",
    category: "prescription",
    fileName: "Follow-up medication plan.pdf",
    createdAt: "2026-03-24T07:55:00.000Z",
    notes: "Primary care follow-up with statin continuation and repeat HbA1c request.",
    linkedAssessmentId: "demo-assessment-diabetes-1",
    aiSummary:
      "The follow-up plan emphasizes lifestyle adjustment, repeat glycemic testing, and medication continuity rather than urgent escalation.",
    extractedText:
      "Continue rosuvastatin 10 mg nightly. Review walking schedule and nutrition changes. Repeat fasting glucose and HbA1c in 8-12 weeks.",
    downloadUrl: DEMO_TEXT_URL("Follow-up medication plan."),
    fileType: "application/pdf",
    fileSizeBytes: 301465,
  },
  {
    id: "demo-upload-xray-1",
    category: "xray",
    fileName: "Chest-xray-ap-view.png",
    createdAt: "2026-03-08T16:50:00.000Z",
    notes: "Baseline chest X-ray added during respiratory review.",
    linkedAssessmentId: "demo-assessment-xray-1",
    aiSummary:
      "The chest film is being used as a baseline reference. No acute concerning finding is highlighted in this saved case.",
    extractedText: "Portable AP chest X-ray. Cardiomediastinal silhouette within expected range. No focal consolidation.",
    downloadUrl: DEMO_XRAY_URL,
    fileType: "image/png",
    fileSizeBytes: 824112,
  },
];

function formatDemoId(uid: string, id: string) {
  return `${uid}-${id}`;
}

function personalizeAssessment(seed: DemoSeed, item: DemoAssessmentInput): AssessmentRecord {
  return {
    id: formatDemoId(seed.uid, item.id),
    uid: seed.uid,
    assessmentType: item.type,
    predictionLabel: item.predictionLabel,
    probability: item.probability,
    confidenceScore: item.confidenceScore,
    riskLevel: item.riskLevel,
    contributingFactors: item.contributingFactors,
    recommendation: item.recommendation,
    overallHealthScore: item.overallHealthScore,
    lifestyleScore: item.lifestyleScore,
    riskBand: item.riskBand,
    linkedUploadId: item.linkedUploadId ? formatDemoId(seed.uid, item.linkedUploadId) : undefined,
    xrayImageUrl: item.xrayImageUrl,
    explanation: item.explanation,
    explanationNextSteps: item.explanationNextSteps,
    createdAt: item.createdAt,
    modelName: `${item.type}-risk-model`,
    modelVersion: "2026.03",
    warnings: item.warnings || [],
    status: "ok",
    inputValues: item.inputValues,
  };
}

function personalizeUpload(seed: DemoSeed, item: DemoUploadInput): UploadRecord {
  return {
    id: formatDemoId(seed.uid, item.id),
    uid: seed.uid,
    fileName: item.fileName,
    fileType: item.fileType || "application/pdf",
    category: item.category,
    storagePath: `users/${seed.uid}/${item.category}/${item.fileName.toLowerCase().replace(/\s+/g, "-")}`,
    downloadUrl: item.downloadUrl || DEMO_TEXT_URL(item.fileName),
    fileSizeBytes: item.fileSizeBytes || 352640,
    notes: item.notes,
    extractedText: item.extractedText,
    aiSummary: item.aiSummary,
    linkedAssessmentId: item.linkedAssessmentId ? formatDemoId(seed.uid, item.linkedAssessmentId) : undefined,
    archived: item.archived || false,
    createdAt: item.createdAt,
  };
}

function createDemoUser(seed: DemoSeed, createdAt: string, lastLoginAt: string): UserDocument {
  return {
    uid: seed.uid,
    fullName: seed.fullName,
    email: seed.email || `${seed.uid}@gmail.com`,
    role: seed.role || "user",
    createdAt,
    lastLoginAt,
  };
}

export function isDemoId(id: string | undefined | null) {
  return Boolean(id?.includes("demo-"));
}

export function createDemoProfile(seed?: Partial<DemoSeed>): HealthProfile {
  return mergeProfileWithDefaults(
    {
      uid: seed?.uid || "demo-user",
      fullName: seed?.fullName || "Aarav Sharma",
      age: 42,
      gender: "male",
      height: 176,
      weight: 78,
      bloodGroup: "B+",
      smokingStatus: "former",
      alcoholUse: "social",
      activityLevel: "moderate",
      sleepPattern: "fair",
      familyHistory: ["Type 2 diabetes", "Coronary artery disease"],
      existingConditions: ["Prediabetes", "Borderline hypertension"],
      allergies: ["Penicillin"],
      medications: ["Rosuvastatin 10 mg", "Vitamin D supplement"],
      baselineValues: {
        systolicBP: 134,
        diastolicBP: 84,
        fastingGlucose: 118,
        cholesterol: 214,
      },
      emergencyNote: "Prefers morning appointments and usually brings recent lab summaries.",
      onboardingCompletedAt: "2026-03-05T09:30:00.000Z",
      onboardingLastSavedAt: "2026-03-27T06:45:00.000Z",
      onboardingLastStep: 4,
      updatedAt: "2026-03-27T06:45:00.000Z",
    },
    {
      uid: seed?.uid,
      fullName: seed?.fullName,
    }
  );
}

export function shouldUseDemoProfile(profile: HealthProfile | null | undefined) {
  return getProfileCompletion(profile || null).percentage < 35;
}

export function getDemoAssessments(seed?: Partial<DemoSeed>) {
  const resolved: DemoSeed = {
    uid: seed?.uid || "demo-user",
    fullName: seed?.fullName || "Aarav Sharma",
    email: seed?.email,
    role: seed?.role || "user",
  };

  return DEFAULT_ASSESSMENTS.map((item) => personalizeAssessment(resolved, item)).sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
  );
}

export function getDemoAssessmentById(id: string, seed?: Partial<DemoSeed>) {
  const candidates = seed?.uid
    ? [seed]
    : [{ uid: "demo-user", fullName: "Aarav Sharma" }, ...getDemoUserDirectory()];

  for (const candidate of candidates) {
    const match = getDemoAssessments(candidate).find((item) => item.id === id);

    if (match) {
      return match;
    }
  }

  return null;
}

export function getDemoAssessmentsByType(type: AssessmentType, seed?: Partial<DemoSeed>) {
  return getDemoAssessments(seed).filter((item) => item.assessmentType === type);
}

export function getDemoRecords(seed?: Partial<DemoSeed>) {
  const resolved: DemoSeed = {
    uid: seed?.uid || "demo-user",
    fullName: seed?.fullName || "Aarav Sharma",
    email: seed?.email,
    role: seed?.role || "user",
  };

  return DEFAULT_UPLOADS.map((item) => personalizeUpload(resolved, item)).sort(
    (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
  );
}

export function getDemoRecordById(id: string, seed?: Partial<DemoSeed>) {
  const candidates = seed?.uid
    ? [seed]
    : [{ uid: "demo-user", fullName: "Aarav Sharma" }, ...getDemoUserDirectory()];

  for (const candidate of candidates) {
    const match = getDemoRecords(candidate).find((item) => item.id === id);

    if (match) {
      return match;
    }
  }

  return null;
}

export function getDemoInsight(seed?: Partial<DemoSeed>) {
  const profile = createDemoProfile(seed);
  const assessments = getDemoAssessments(seed);
  const summary = buildInsightSummary(profile.uid, profile, assessments);

  return {
    ...summary,
    recommendations: [
      "Cardiometabolic markers are worth monitoring closely over the next follow-up cycle.",
      "Profile completeness is strong enough for stable trend review and follow-up planning.",
      "Use the latest heart and diabetes results to guide the next conversation and record checks.",
    ],
  } satisfies InsightSummary;
}

export function getDemoUserDirectory() {
  return [
    createDemoUser(
      {
        uid: "qL8mY2nA4rT9xP1cV7eK",
        fullName: "Aarav Sharma",
        email: "aarav.sharma@icloud.com",
      },
      "2026-02-19T10:20:00.000Z",
      "2026-03-30T04:10:00.000Z"
    ),
    createDemoUser(
      {
        uid: "uR3kD7pN2wF6zB9mJ1sH",
        fullName: "Meera Nair",
        email: "meera.nair@gmail.com",
      },
      "2026-02-22T08:05:00.000Z",
      "2026-03-29T16:35:00.000Z"
    ),
    createDemoUser(
      {
        uid: "xC5vL1qS8tM4hK2pR6yW",
        fullName: "Daniel Brooks",
        email: "daniel.brooks@outlook.com",
      },
      "2026-03-01T11:45:00.000Z",
      "2026-03-28T13:15:00.000Z"
    ),
  ];
}

export function getDemoUserDetail(uid: string) {
  const directory = getDemoUserDirectory();
  const user = directory.find((item) => item.uid === uid) || null;

  if (!user) {
    return null;
  }

  const profileSeed = { uid: user.uid, fullName: user.fullName, email: user.email };
  return {
    user,
    profile: createDemoProfile(profileSeed),
    assessments: getDemoAssessments(profileSeed),
    uploads: getDemoRecords(profileSeed),
  };
}

export function getDemoHealth(): AdminStats["health"] {
  return {
    firebase: "online",
    mlApi: "online",
    gemini: "online",
  };
}

export function getDemoModelMetadata() {
  return DEMO_MODEL_METADATA;
}

export function getDemoAdminStats(): AdminStats {
  const users = getDemoUserDirectory();
  const recentAssessments = users.flatMap((user) =>
    getDemoAssessments({ uid: user.uid, fullName: user.fullName, email: user.email }).slice(0, 3)
  );
  const recentUploads = users.flatMap((user) =>
    getDemoRecords({ uid: user.uid, fullName: user.fullName, email: user.email }).slice(0, 2)
  );

  const usageByModule: AdminStats["usageByModule"] = {
    diabetes: 0,
    heart: 0,
    kidney: 0,
    liver: 0,
    xray: 0,
  };

  recentAssessments.forEach((item) => {
    usageByModule[item.assessmentType] += 1;
  });

  return {
    totalUsers: 48,
    totalAssessments: 164,
    totalUploads: 91,
    usageByModule,
    storageUsageMb: 742.8,
    recentUsers: users,
    recentAssessments: recentAssessments.sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
    ),
    recentUploads: recentUploads.sort(
      (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)
    ),
    modelMetadata: getDemoModelMetadata(),
    health: getDemoHealth(),
  };
}

export function getDisplayProfile(user: AuthUser | null, profile: HealthProfile | null) {
  if (!user) {
    return profile;
  }

  if (!shouldUseDemoProfile(profile)) {
    return mergeProfileWithDefaults(profile, { uid: user.uid, fullName: user.fullName });
  }

  return mergeProfileWithDefaults(
    {
      ...createDemoProfile({
        uid: user.uid,
        fullName: user.fullName,
      }),
      ...profile,
      fullName: profile?.fullName || user.fullName,
      uid: user.uid,
    },
    { uid: user.uid, fullName: user.fullName }
  );
}
