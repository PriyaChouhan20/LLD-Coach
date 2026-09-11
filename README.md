# 🚀 LLD Coach — Low-Level Design Practice & Evaluation Platform

An interactive developer practice platform engineered for software engineers to design, submit, and receive instant, explainable feedback on classic **Low-Level Design (LLD)** and **Object-Oriented Design (OOD)** interview challenges.

---

## 🌟 Key Features

1. **Curated Problem Catalog**:
   - 4 seed problems: **Parking Lot**, **State-Driven Vending Machine**, **Multi-Elevator Dispatcher**, and **Library Management System**.
   - Complete functional/non-functional requirements, expected core entities, and sample scenarios.
2. **Structured Practice Workspace**:
   - 4-part guided design editor:
     - *1. Architectural Explanation & Approach*
     - *2. Classes, Interfaces & Responsibilities*
     - *3. Code / Pseudocode Implementation*
     - *4. Trade-offs, Edge Cases & Concurrency*
   - Live draft saving and reset-to-template capabilities.
3. **Dual-Tier Hybrid Evaluation Engine**:
   - **Deterministic Evaluation**: Structural completeness checks, core entity detection, and design pattern keyword heuristics.
   - **AI-Assisted Semantic Evaluation**: Deep review of SOLID principles (SRP, OCP, LSP, ISP, DIP), coupling/cohesion, and concurrency bottlenecks.
   - **Resilient Fallback Engine**: If no API key is provided or external LLMs rate-limit/timeout, the platform gracefully switches to heuristic evaluation with **zero crashes**.
4. **Rich Explainable Feedback**:
   - 100-Point Score Gauge & Verdict (Mastered, Solid Progress, Needs Revision, Incomplete).
   - Category-wise scoring bars (SOLID, Class Design, Extensibility, Edge Cases).
   - Identified strengths, categorized issues (with severity tags & location hints), actionable suggestions, and a dedicated **"Recommended Next Improvement"**.
5. **Attempt History & Iterative Practice**:
   - Chronological attempt history with versioning.
   - Deep-dive into previous submission snapshots and score comparisons.
   - Direct retry workflow to refine and master problem solutions.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose (with automated In-Memory fallback), Zod.
- **AI Providers Supported**: Google Gemini (`gemini-1.5-flash`), OpenAI (`gpt-4o-mini`), and Offline Mock Provider.
- **Testing**: Vitest, Supertest (100% passing unit & integration tests).

---

## 📂 Project Architecture

```
LLb Coach/
├── backend/
│   ├── src/
│   │   ├── config/            # Env validation & resilient database manager
│   │   ├── domain/            # Domain models (Problem, Attempt, Submission, EvaluationResult)
│   │   ├── evaluators/        # Strategy pattern engine (Deterministic, AI, Fallback, Pipeline)
│   │   ├── repositories/      # Mongoose schemas & data access abstraction
│   │   ├── services/          # ProblemService, AttemptService, EvaluationService
│   │   ├── controllers/       # REST controllers with Zod validation
│   │   ├── routes/            # Express routers
│   │   ├── data/seed/         # 4 Seed LLD problems and auto-seeder
│   │   └── app.ts             # Express application factory & server startup
│   └── tests/                 # Unit & Integration test suites
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components (ScoreGauge, CategoryBreakdown, IssueList, etc.)
│   │   ├── pages/             # 6 Pages (Dashboard, Details, Practice, Results, History, AttemptDetail)
│   │   ├── services/          # Typed API client
│   │   └── App.tsx            # Routes configuration
├── README.md                  # Project overview & guide
├── AI_USAGE.md                # AI usage and prompt disclosures
├── RESEARCH_NOTE.md           # Research on LLD evaluation rubrics
└── DESIGN_NOTE.md             # Low-Level & Domain Design Document
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm**: v9+

### 2. Backend Setup
```bash
cd backend
npm install

# (Optional) Configure environment variables
# Copy .env.example or create .env:
# PORT=5000
# AI_PROVIDER=auto # Options: auto, gemini, openai, mock
# GEMINI_API_KEY=your_gemini_key_here
# OPENAI_API_KEY=your_openai_key_here
# MONGODB_URI=mongodb://localhost:27017/lld_coach

# Run backend tests
npm test

# Start backend dev server (auto-seeds problem catalog)
npm run dev
```

> **Note on MongoDB**: If a local MongoDB instance is not detected, the backend will automatically initialize its resilient in-memory database store so that the app and tests run instantly out of the box!

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing Suite

Run backend unit and integration tests:
```bash
cd backend
npm test
```
The test suite validates:
- Deterministic structural completeness and keyword entity checks.
- AI Evaluator integration & graceful fallback execution.
- Problem catalog seeding and API endpoints (`GET /api/problems`, `GET /api/problems/:slug`).
- Attempt initialization, draft saving, submission evaluation, and history retrieval.

---

## 📜 Documentation Links
- [DESIGN_NOTE.md](file:///c:/Users/Lenovo/Desktop/LLb%20Coach/DESIGN_NOTE.md): In-depth domain design, strategy pattern implementation, and trade-off rationale.
- [RESEARCH_NOTE.md](file:///c:/Users/Lenovo/Desktop/LLb%20Coach/RESEARCH_NOTE.md): Research on LLD interview evaluation rubrics and explainability.
- [AI_USAGE.md](file:///c:/Users/Lenovo/Desktop/LLb%20Coach/AI_USAGE.md): Transparent disclosure of AI assistance and prompt templates.
