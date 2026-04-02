# Medify Handbook

## 1. The One-Liner
**Medify** is a **health risk workspace** that helps **everyday users** finally stop guessing what their symptoms, reports, and test values actually mean.

## 2. The Problem (Why This Exists)
- **Scattered records** turn one health question into a hunt across WhatsApp, gallery folders, and PDFs. 📁
- **Abnormal values without context** leave people with numbers like glucose or BP, but no clear risk picture.
- **Shallow symptom tools** give quick labels, then leave users with no history, no factors, and no follow-up path.
- **Past assessments vanish fast**, so users cannot see what changed or whether things got better or worse.

## 3. What We Built
Medify is a web app where a user creates a private health space, fills in a profile, uploads medical records, runs disease assessments, and gets a readable result with **risk level**, **probability**, major factors, and next steps. It also saves history, links uploaded files to results, and shows insights over time instead of treating every check like a one-off event.

The planning docs still call the project **Symptora**, but the shipped app in this repo runs as **Medify**. What makes it feel different from a generic student project is the full loop: **frontend**, **Firebase**, **Python models**, **AI explanation**, and **admin monitoring** all connect inside one working product.

- **Symptom likelihood explorer** - starts with what the user feels before asking for lab-style inputs.
- **Disease assessment modules** - runs diabetes, heart, liver, and X-ray-linked screening flows.
- **Medical record locker** - uploads reports, prescriptions, scans, and keeps them tied to the right user.
- **Explainable result screen** - shows risk band, confidence, and the factors that pushed the result.
- **History and insights** - saves older runs and turns them into trend-style summaries.
- **Admin control room** - tracks users, uploads, model status, and module usage in one place.

## 4. Who Uses It
| Role | What they can do | What their screen looks like |
| --- | --- | --- |
| **Guest** | Explore the symptom flow and decide whether to create an account | A bold landing page plus the **symptom workbench** |
| **User / patient** | Save profile data, run assessments, upload records, and review history | A personal **dashboard**, record locker, and result pages |
| **Admin** | Watch usage, inspect uploads, and check model and system health | A stats-heavy **control room** with cards, tables, and health checks |

## 5. Tech Stack — The Engine Room ⚙️
| Area | Tools |
| --- | --- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts |
| **Backend / Database** | Python FastAPI, Firebase Auth, Firestore, local upload routes, joblib model artifacts |
| **AI / Smart Features** | scikit-learn tabular models, TensorFlow/Keras X-ray path, Gemini assistive summaries, explainable contributing factors |
| **Deployment** | Local demo-first setup, Firebase Hosting config, optional separate ML API deployment |

We picked **Firebase** because it let us ship auth and data fast, and we kept **Python** for ML so the prediction layer stayed real instead of turning into fake logic inside the UI.

## 6. How It Actually Works
1. You open the app, sign in, and land on the **dashboard**.
2. You fill the **health profile** so the app has age, habits, history, and baseline values.
3. You start with the **symptom explorer** or jump into a direct disease module.
4. You enter medical values or upload a file, and Medify sends that input to the right **ML route**.
5. The app saves the result, then shows **risk level**, **probability**, contributing factors, and a plain-language explanation.
6. Your **history** and **insights** update, so the next check builds on what already happened.

## 7. The Team
**[Name 1]** -> Frontend and UI -> built the landing flow, dashboard layout, and result cards that make the app readable.

**[Name 2]** -> Backend and ML -> trained the prediction models, shaped the FastAPI layer, and kept the response format usable on the frontend.

**[Name 3]** -> Firebase and testing -> handled auth, Firestore and storage flow, uploads, rules, and the integration checks that kept data moving.

All three of us **did the final integration, testing, scope cuts, and viva prep together**.

## 8. What's Not Done Yet (Honest Corner)
- **Chest X-ray inference** is not live yet; the upload path works, but the trained image model is still missing.
- **Kidney support** still trails the copy; the current organ route mostly serves the liver workflow.
- **OCR is not automatic** yet; report summarization still depends on pasted or extracted text.

## 9. If We Had More Time...
- Add **real OCR extraction** so reports can fill forms instead of making users type values again.
- Finish the **kidney module** and tighten every screen that still hints at more than the app really does.
- Build a **doctor-facing review mode** with cleaner comparisons across older and newer results.

## 10. The Bottom Line
We built a **full-stack healthcare workflow**, not just a predictor form. A user can sign in, save a profile, upload records, run ML assessments, read explainable results, and track history inside one product. The biggest lesson came from integration: getting **React**, **Firebase**, and **Python inference** to agree on one clean flow took more grit than any single screen or model. We did not just build an app for marks. We learned how to ship something real under pressure, and that is the part that sticks.
