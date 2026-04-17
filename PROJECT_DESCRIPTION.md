# 🚀 SmartKids — Gamified Learning App

**SmartKids** is a gamified, no-fail educational platform designed for children (Classes 1–8) with an integrated parental monitoring dashboard. Its primary goal is to remove the "fear of failure" and replace it with interactive learning through dynamically generated math questions, real-time rewards (XP and coins), and a digital pet companion.

---

## 🛠️ Tech Stack & Monorepo Setup

The app is built as a custom monorepo utilizing npm workspaces:

- **Root Framework**: Standard NPM workspaces managing `frontend` and `backend`.
- **Frontend**: 
  - React 19 (via Vite) + TypeScript
  - Tailwind CSS + Framer Motion (for smooth gamified animations)
  - Zustand (for state management)
  - React Router DOM (for routing)
  - Recharts (for parent dashboard analytics)
  - Howler.js (for sound effects)
- **Backend**:
  - Node.js + Express.js + TypeScript
  - MongoDB + Mongoose
  - JWT Authentication (Bcrypt for password hashing)
  - Zod (Request validation)
  - Cloudinary (Image handling)
  - Helmet & CORS (Security)

---

## 🧠 Core Features & Business Logic

### 1. No-Fail Gamified Learning System
Mistakes are treated as learning opportunities. The system dynamically generates Math questions (Addition focus initially) based on the level configuration. The child gets hints and encouragement rather than aggressive failure states.
- 5 hearts per level.
- First mistake provides a hint (no heart lost).
- Progress unlocks levels systematically.

### 2. Dual User Interface
- **Child Flow**: Kids log in via a 4-digit PIN (linked to the parent account). They see a colourful layout, world map (level selector), and a digital pet avatar.
- **Parent Flow**: Parents log in via Email/Password. They are presented with a detailed real-time dashboard analyzing the child's accuracy trends, weak topics, and time spent.

### 3. Rule-Based Dynamic Question Generation
Questions are currently not static. They are dynamically generated at runtime by the backend `generateQuestion` utility from level parameters (minValue, maxValue). This prepares the system for seamless AI content generation in Phase 2.

---

## 📁 Project Structure

```text
minor/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB connections, env config
│   │   ├── controllers/  # API business logic
│   │   ├── middlewares/  # Auth & Validation
│   │   ├── models/       # Mongoose Schemas (User, Level, Analytics)
│   │   ├── routes/       # Express route definitions
│   │   ├── utils/        # Token gen, seed scripts, Question generators
│   │   └── server.ts     # Main backend entry point
│   └── package.json      # Backend specific dependencies
│
├── frontend/
│   ├── src/
│   │   ├── assets/       # Gamified images, global sounds
│   │   ├── components/   # Reusable UI elements (Buttons, Layouts)
│   │   ├── pages/        # Route views (Dashboard, Game Map, Login)
│   │   ├── services/     # Axios API request wrappers
│   │   ├── store/        # Zustand state
│   │   └── main.tsx      # Vite entry
│   └── package.json      # Frontend specific dependencies
│
└── package.json          # Monorepo root (concurrently scripts)
```

---

## 💾 Database Schema Highlights

- **User Model**: Differentiates roles (`parent` or `child`). Children have a parentId reference, PIN, accumulated XP, coins, and current level. Parents have standard email/password authentication.
- **Level Model**: Stores configuration to generate questions dynamically (`minValue`, `maxValue`, `difficulty`, `topic`, rewards).
- **Analytics (History)**: Tracks every single question attempt made by a child indicating correctness, time taken, and timestamp.

---

## 🚀 How to Run Locally

You can launch both the frontend and backend simultaneously from the root directory:

```bash
cd minor
npm run dev
```

*(This uses `concurrently` to run `npm run dev:backend` and `npm run dev:frontend` together).*

---

## 🔮 Present State & Future Roadmap

**Current State (Phase 1)**: The MVP features a fully working Authentication pipeline, rule-based level and dynamic question generation, UI implementation with Framer Motion, and a stable Parent monitoring dashboard. 

**Next Steps (Phase 2 - AI Integration)**: 
The current clean abstraction of the backend `utils` allows for replacing the rule-based random generator with an AI Model (e.g. Gemini) integration to provide dynamically adaptive difficulty, personalized hints, and advanced AI-driven parental analytics.
