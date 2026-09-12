# LLD Coach — Low-Level Design Practice & Evaluation Platform

LLD Coach is an interactive practice platform designed to help learners practice Low-Level Design (LLD) interview problems, submit their designs, receive explainable feedback, review previous attempts, and improve through repeated practice.

## 🌟 Key Features

### 1. Curated Problem Catalog

The MVP includes a focused set of LLD problems:

- Parking Lot
- State-Driven Vending Machine
- Multi-Elevator Dispatcher
- Library Management System

Each problem provides requirements, expected core entities, and enough context for the learner to design a solution.

### 2. Structured Practice Workspace

Learners work on a solution using four structured sections:

1. Design Explanation
2. Classes & Responsibilities
3. Code / Pseudocode
4. Trade-offs & Edge Cases

The platform also supports saving work, reviewing previous attempts, and retrying problems.

### 3. Hybrid Evaluation

LLD problems can have multiple valid solutions. Therefore, LLD Coach combines deterministic validation with AI-assisted qualitative evaluation.

#### Deterministic Evaluation

Handles predictable checks such as:

- Required sections
- Minimum content
- Structural completeness
- Expected core entities

#### AI-Assisted Evaluation

Focuses on qualitative design aspects such as:

- SOLID principles
- Class responsibilities
- Abstraction
- Coupling and cohesion
- Extensibility
- Design patterns
- Edge cases
- Design trade-offs

If AI evaluation is unavailable, times out, or fails, the application uses a fallback evaluator to provide basic feedback.

### 4. Explainable Feedback

The learner receives:

- Overall score
- Verdict
- Category-wise scores
- Strengths
- Issues
- Suggestions
- Recommended next improvement

The goal is to explain why a design can be improved instead of providing only a numeric score.

### 5. Attempt History and Retry

Previous attempts are stored so learners can:

- Review earlier submissions
- Track their practice history
- Review previous feedback
- Retry a problem
- Improve their design based on feedback

## 🛠 Tech Stack

### Frontend

- React 18
- Vite
- JavaScript
- Tailwind CSS
- Lucide React
- React Router v6

### Backend

- Node.js
- Express.js
- JavaScript (ES Modules)
- Mongoose
- Zod
- CORS
- dotenv

### AI Providers

The backend supports configurable AI evaluation providers:

- Google Gemini
- OpenAI
- Mock/offline evaluation

The provider can be selected using the `AI_PROVIDER` environment variable.

### Testing

- Vitest
- Supertest

## 📂 Project Structure

```text
LLD Coach/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   │   └── seed/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   │
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── README.md
├── AI_USAGE.md
├── RESEARCH_NOTE.md
├── DESIGN_NOTE.md
└── render.yaml
```

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (optional; the backend can fall back to an in-memory store)

### 1. Clone the Repository

```bash
git clone https://github.com/PriyaChouhan20/LLD-Coach.git
cd LLD-Coach
```

### 2. Start the Backend

Open a terminal:

```bash
cd backend
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite in the terminal.

## 🔄 Learner Journey

The main learner flow is:

```text
Choose Problem
      ↓
Design Solution
      ↓
Submit
      ↓
Evaluate
      ↓
Receive Feedback
      ↓
Review Attempt
      ↓
Retry and Improve
```

The submission is saved before evaluation so that learner work is not lost if an evaluation provider fails.

## 🧠 Evaluation Approach

LLD Coach uses a hybrid evaluation approach.

### Deterministic Evaluation

Handles predictable checks such as:

- Required sections
- Minimum content
- Structural completeness
- Expected core entities

### AI-Assisted Evaluation

Focuses on qualitative design aspects such as:

- SOLID principles
- Class responsibilities
- Abstraction
- Coupling and cohesion
- Extensibility
- Design patterns
- Edge cases
- Trade-offs

### Fallback Evaluation

If the AI provider is unavailable or fails, the application uses a fallback evaluator so that the learner can still receive basic feedback.

## 🏗 Design Decisions and Trade-offs

### Simple Modular Monolith

The MVP uses a straightforward frontend + backend architecture instead of microservices or distributed infrastructure.

This keeps the project easier to understand, develop, test, and extend within the assignment scope.

### Multiple Valid LLD Designs

The platform does not require learners to reproduce one exact reference solution.

Evaluation focuses on design quality, responsibilities, extensibility, principles, and trade-offs.

### Save Before Evaluation

Submissions are persisted before evaluation begins. This prevents external AI failures from causing loss of learner work.

### AI as an Optional Layer

AI is used for qualitative feedback, but the core application does not depend entirely on AI availability.

## 🧪 Testing

Backend tests are implemented using:

- Vitest
- Supertest

Run backend tests with:

```bash
cd backend
npm test
```

The tests cover important API behavior and failure/edge cases.

## 🌐 Live Demo

### Frontend

https://lld-coach-1.onrender.com

### Backend Health Check

https://lld-coach-othz.onrender.com/api/health

## 📄 Assignment Documents

The repository includes:

- `RESEARCH_NOTE.md` — Research note
- `DESIGN_NOTE.md` — Design note
- `AI_USAGE.md` — AI usage and evaluation architecture

The corresponding PDF versions are provided separately for assignment submission.

## ⚠️ Limitations

This is an MVP built within a limited assignment timeframe.

Current limitations include:

- Limited number of curated LLD problems
- AI evaluation depends on the configured provider
- Fallback evaluation provides simpler feedback than AI evaluation
- No authentication or multi-user account system
- No background job queue for long-running evaluations

These trade-offs were intentional to keep the core learner journey functional and understandable.

## 🔮 Future Improvements

Possible future improvements include:

- More LLD problem types
- Authentication and user profiles
- More detailed evaluation rubrics
- Additional AI providers
- Asynchronous evaluation for long-running requests
- Progress tracking and analytics
- More advanced comparison of multiple attempts

## 🎯 Project Goal

The goal of LLD Coach is to make LLD practice more structured and useful by combining guided design practice, explainable evaluation, attempt history, and iterative improvement.