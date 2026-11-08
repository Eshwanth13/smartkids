# 🚀 SmartKids — Gamified Learning App (Monorepo)

SmartKids is a gamified, no-fail educational platform designed for children (Classes 1–8) with an integrated parental monitoring dashboard. Its primary goal is to remove the "fear of failure" and replace it with interactive learning through dynamically generated questions, real-time rewards (XP and coins), and a digital pet companion.

---

## 📁 Repository Structure

- `backend/`: Node.js + Express + TypeScript, MongoDB + Mongoose, JWT authentication, Zod validation, Helmet, CORS.
- `frontend/`: React 19 + Vite + TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts, Lucide Icons.

---

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Configure environment variables**:
   - Copy `backend/.env.example` to `backend/.env` and supply your MongoDB URI, JWT secret, and optional OpenRouter API key.

3. **Start the development servers**:
   ```bash
   npm run dev
   ```
   - Backend runs on `http://localhost:5000`
   - Frontend runs on `http://localhost:5173`

4. **Run unit tests**:
   ```bash
   npm --workspace=backend run test
   ```

---

## 🤖 AI Insights (Child Score Analysis)

The Parent Dashboard includes an **AI Insights** card that evaluates your child's recent performance and returns a warm, encouraging, parent-friendly progress report with:
- **Summary**: Concise overview of progress and momentum.
- **Strengths**: 1–3 highlighted areas of high accuracy or consistency.
- **Areas to Improve**: 1–3 positively-framed focus topics.
- **Suggested Actions**: 2–3 practical steps parents can do this week.
- **Encouragement**: A warm, positive closing statement.

### 1. Setup Steps

1. Sign up for a free OpenRouter account at [openrouter.ai](https://openrouter.ai).
2. Generate an API key with free-tier access.
3. Open `backend/.env` and set your key:
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
   OPENROUTER_MODEL_PRIMARY=nvidia/nemotron-3-ultra-550b-a55b:free
   OPENROUTER_MODEL_FALLBACK=nvidia/nemotron-3.5-lightning:free
   OPENROUTER_MODEL_LAST_RESORT=openrouter/free
   AI_INSIGHTS_CACHE_HOURS=24
   AI_INSIGHTS_TIMEOUT_MS=20000
   ```
4. If `OPENROUTER_API_KEY` is omitted or empty, SmartKids starts normally and automatically uses high-quality rule-based insights so the dashboard never breaks.

### 2. How to Swap Models

SmartKids uses an OpenAI-compatible completion API powered by OpenRouter. You can change any of the model IDs in `backend/.env` without code changes:

- `OPENROUTER_MODEL_PRIMARY`: The preferred free model used on initial requests.
- `OPENROUTER_MODEL_FALLBACK`: The fallback model if the primary returns 429, 5xx, 404, or invalid JSON.
- `OPENROUTER_MODEL_LAST_RESORT`: The last-resort fallback before degrading to rule-based insights.

**Recommended Free Models on OpenRouter**:
- `nvidia/nemotron-3-ultra-550b-a55b:free` (Default Primary — fast and articulate)
- `nvidia/nemotron-3.5-lightning:free` (Default Fallback — ultra-low latency)
- `openrouter/free` (Auto-routing across available free models)
- `meta-llama/llama-3.3-70b-instruct:free`
- `google/gemini-2.0-flash-exp:free`

### 3. Architecture & Privacy Guarantees

- **Code-Only Calculation**: All percentages, trend categorizations, weak/strong topic flags, and averages are calculated deterministically in TypeScript code (`buildChildSummary.ts`). The LLM is never asked to do math.
- **Strict Anonymisation**: Child names, parent names, emails, PINs, and MongoDB ObjectIds are **never** included in prompt payloads.
- **Smart Caching**: Insights are cached for 24 hours (`AiInsight` collection) keyed by a deterministic hash of performance metrics. Forced refresh (`?refresh=true`) is rate-limited to 1 request per child per 10 minutes to protect free quotas.
- **Graceful Fallback**: If all AI providers fail or timeout, the endpoint seamlessly returns 200 with an identical JSON payload marked `source: "rule-based"`.

