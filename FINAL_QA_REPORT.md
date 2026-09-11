# 📋 Final QA Report — LLD Coach MVP

**Date:** 2026-09-10  
**Target:** 2-Day Engineering Assignment MVP  
**Status:** **READY FOR SUBMISSION** ✅

---

## 1. Automated Test Suite Results

All automated unit and integration tests passed cleanly:

- **Test Runner:** `vitest` v3.2.7 + `supertest`
- **Total Test Files:** 5 passed (5)
- **Total Tests:** 14 passed (14)

### Breakdown:
1. `DeterministicEvaluator.test.ts`:
   - `✓ should flag incomplete submissions with critical issues`
   - `✓ should identify core entities and design patterns in well-formed submissions`
2. `EvaluationPipeline.test.ts`:
   - `✓ should fall back gracefully to deterministic result when submission is empty`
   - `✓ should execute hybrid AI evaluation with mock provider when submission is valid`
3. `ProblemService.test.ts`:
   - `✓ should auto-seed and return all 4 problems`
   - `✓ should fetch a single problem by slug`
4. `problemApi.test.ts` (Integration):
   - `✓ GET /api/health should return health status`
   - `✓ GET /api/problems should return 4 seeded problems`
   - `✓ GET /api/problems/:slug should return a specific problem`
   - `✓ GET /api/problems/non-existent-slug should return 404`
5. `attemptApi.test.ts` (Integration):
   - `✓ POST /api/attempts/start should create or retrieve an attempt initialized with starter template`
   - `✓ PUT /api/attempts/:id/draft should save progress draft`
   - `✓ POST /api/attempts/:id/submit should evaluate submission and return explainable feedback`
   - `✓ GET /api/attempts/history should list user attempts`

---

## 2. Verified End-to-End User Journeys

| Flow | Status | Verification Details |
|---|:---:|---|
| **1. Dashboard View** | **PASS** | Catalog renders 4 seed problems (*Parking Lot*, *Vending Machine*, *Elevator*, *Library Management*) with difficulty badges, tags, and practice CTAs. |
| **2. Problem Details** | **PASS** | Complete functional/non-functional requirements, expected domain entities chips, sample use cases, and 100-point rubric table. |
| **3. Start Practice Workspace** | **PASS** | Split view with reference drawer on the left and 4-part structured editor (*Explanation*, *Classes*, *Code*, *Trade-offs*) populated with starter template. |
| **4. Draft Auto-Saving** | **PASS** | `PUT /api/attempts/:id/draft` persists state without evaluating or closing the attempt. |
| **5. Empty & Short Validation** | **PASS** | Empty submissions are rejected with HTTP 400 validation error; overly short submissions trigger deterministic structural warnings and incomplete status. |
| **6. Submission & Evaluating State** | **PASS** | Interactive multi-step animated modal displaying real-time rubric evaluation progress. |
| **7. Evaluation Result & Feedback** | **PASS** | 100-Point Score Gauge, Verdict badge, 4-category score breakdown (SOLID, Class Design, Extensibility, Edge Cases), strengths, categorized issues with severity pills, and recommended next improvement. |
| **8. Attempt History** | **PASS** | Chronological log displaying problem title, score badge, date, submission version count, and "View Feedback" / "Try Again" links. |
| **9. View Past Attempt** | **PASS** | Detailed side-by-side inspection view of past submission content and evaluation results. |
| **10. "Try Again" Re-attempt** | **PASS** | Triggers `/practice/:slug?new=true` with `forceNew: true`, creating a fresh attempt while preserving all historical attempts. |
| **11. AI Fallback Resilience** | **PASS** | In offline or unconfigured API mode, `FallbackEvaluator` generates rich explainable feedback with zero 500 errors or server crashes. |
| **12. Error Boundaries & 404s** | **PASS** | Invalid problem slugs return clean 404 JSON and UI fallback without blank screens. |

---

## 3. Production Build Validation

- **Backend Build (`npm run build`):** `tsc` compiled cleanly into `./dist` with 0 TypeScript errors.
- **Frontend Build (`npm run build`):** Vite production build generated bundle cleanly (gzip: ~68 kB) with 0 errors.

---

## 4. Bugs Found & Fixed During QA

1. **Issue:** `ProblemRepository` in-memory map was originally keyed on both `slug` and `id`, leading to duplicate items in `findAll()`.  
   **Fix:** Changed `ProblemRepository` to key exclusively by `id` with static class-level storage.
2. **Issue:** Initial deterministic word count checks were overly strict on short pseudocode snippets.  
   **Fix:** Balanced word count thresholds (6 words for explanation/classes, 8 for code) to distinguish genuine submissions from blank/low-effort attempts.
3. **Issue:** Mongoose schema used `ObjectId` which threw `CastError` when handling custom string IDs (`att_...`).  
   **Fix:** Explicitly configured `_id: { type: String, required: true }` on `AttemptSchema` and `ProblemSchema`.
4. **Issue:** TypeScript build flagged unused icon imports in frontend pages.  
   **Fix:** Cleaned up all unused imports across all React components and pages.
5. **Issue:** "Try Again" needed an explicit guarantee to create a fresh attempt rather than reusing an in-progress draft.  
   **Fix:** Added `forceNew: boolean` support in `AttemptService`, `AttemptController`, and `PracticePage.tsx` query parameters (`?new=true`).

---

## 5. Known Limitations & Scope Boundaries

- **Single Monolith Architecture:** By design, the application does not use microservices, Kafka, Redis, or Kubernetes, matching assignment constraints for a 2-day scope.
- **Synchronous LLM Evaluation:** Uses synchronous HTTP request with a 12-second timeout safeguard and animated frontend progress state instead of an asynchronous Celery/BullMQ worker queue.

---

## 6. Exact Commands to Run the Project

### Start Backend
```bash
cd backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000` with auto-seeding of all 4 LLD problems)*

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

### Run Automated Tests
```bash
cd backend
npm test
```

### Run Production Builds
```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## 7. Final Project Status

# 🟢 READY FOR SUBMISSION
