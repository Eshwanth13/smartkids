# 🚀 SmartKids — Gamified Learning App (Antigravity Ready)

**A highly interactive, no-fail gamified learning platform for kids (Classes 1–8)** with adaptive architecture and AI-ready design.

## 📋 Project Overview

**Target Users**: Children (ages 6–14) + Their Parents  
**Scope**: Classes 1–8 (Math focus in Phase 1, expandable later)  
**Core Philosophy**: **No-Fail Learning** — Mistakes are learning opportunities, never punishments.

### 🎯 Key Differentiators
- No-Fail System with gentle hints and mascot guidance
- High engagement through XP, coins, levels, and digital pet companion
- Granular parental insights and analytics dashboard
- Dynamic rule-based question generation (NO static questions in Phase 1)
- Clean, scalable architecture ready for AI integration in Phase 2

## 💡 Problem Statement
Traditional EdTech platforms suffer from:
- Fear of failure due to harsh “Wrong!” feedback
- Low engagement (mostly passive videos)
- Lack of detailed, actionable parental insights
- One-size-fits-all content that doesn’t adapt to the child’s pace

## 🛠️ Tech Stack (Recommended)

**Frontend**: React 18+ (Vite), TypeScript, Tailwind CSS, Zustand (state management), React Router, Framer Motion (animations), Howler.js or native Audio API for sounds.

**Backend**: Node.js + Express.js (TypeScript recommended), MongoDB with Mongoose.

**Authentication**: JWT (Access token short expiry, Refresh token 7 days)

**Storage**: Cloudinary for images, avatars, and audio files

**Other**: dotenv, CORS, Helmet, Zod or Express-validator for input validation.

## 👥 User Flows

### 👦 Child Flow
1. Login using **4-digit PIN** (created by parent)
2. View/select digital pet avatar
3. See world map → Choose an unlocked level
4. Start level → Answer 5 questions
5. Earn XP, coins, and see pet reactions
6. Level completion → Confetti, reward chest → Unlock next level (if passed)

### 👨‍👩‍👦 Parent Flow
1. Login with email + password
2. View list of children
3. Access detailed dashboard for each child:
   - Overall progress and current level
   - Accuracy trends
   - Time spent per topic
   - Weak topics identification
   - Question attempt history

## 🧠 Question Generation (Phase 1 — Rule-based, NO AI)

Questions are generated **dynamically** at runtime using level configuration stored in the database.

**Example Level Config**:
```json
{
  "levelNumber": 1,
  "topic": "Addition",
  "difficulty": "beginner",
  "minValue": 1,
  "maxValue": 10,
  "questionTemplate": "addition-basic",
  "xpReward": 50,
  "coinsReward": 20,
  "unlockCondition": { "previousLevel": 0 }
}
Generator Logic (implement in backend):
TypeScriptfunction generateQuestion(level: LevelConfig) {
  const a = randomInt(level.minValue, level.maxValue);
  const b = randomInt(level.minValue, level.maxValue);

  return {
    id: generateUniqueId(),
    question: `${a} + ${b}`,
    correctAnswer: a + b,
    type: "addition"
  };
}
Each level generates 5 unique questions when started.
🎮 Game Rules & Logic

Each level consists of exactly 5 questions
Hearts: Start with 5 hearts per level
First wrong answer → Show hint + encouraging mascot message (no heart loss)
Subsequent wrong answers → Lose 1 heart

Passing Criteria: At least 3 correct answers to complete the level
Rewards: XP and coins for correct answers + bonus on level completion
Unlock next level only after successful completion
Pet reacts happily on correct answers, encouragingly on mistakes

🔐 Authentication

Parent: Email + Password (JWT)
Child: 4-digit PIN (linked to parent account)
Role-based access control (parents can only see their own children’s data)

Auth Endpoints:

POST /api/v1/auth/register-parent
POST /api/v1/auth/login-parent
POST /api/v1/auth/create-child
POST /api/v1/auth/login-child
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout

📡 API Endpoints
Game APIs

GET /api/v1/game/levels — Get all levels with unlock status for the child
POST /api/v1/game/start-level — Generate and return 5 questions for a level
POST /api/v1/game/submit-answer — Submit answer for a question (real-time feedback)
GET /api/v1/game/progress — Get current child progress

Parent APIs

GET /api/v1/parent/dashboard
GET /api/v1/parent/child/:childId/progress
GET /api/v1/parent/analytics

📦 Database Schemas (MongoDB)
User Model
TypeScript{
  _id: ObjectId,
  name: String,
  email?: String,
  password?: String,        // hashed
  role: "parent" | "child",
  parentId: ObjectId | null,
  pin?: String,             // 4-digit PIN for children
  avatar?: String,          // Cloudinary URL
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  currentLevel: { type: Number, default: 1 },
  createdAt: Date
}
Level Model
TypeScript{
  levelNumber: Number,
  topic: String,
  difficulty: String,
  minValue: Number,
  maxValue: Number,
  questionTemplate: String,
  xpReward: Number,
  coinsReward: Number,
  unlockCondition: Object
}
Analytics: Store every question attempt (userId, levelId, question, correct, timeTaken, topic, createdAt).
🎨 UI/UX Requirements
Child Side:

Bright, colorful, cartoon-style design
Large touch targets, kid-friendly fonts
Level selection as a fun world map
Smooth animations, sound effects, confetti on success
Digital pet with emotional reactions

Parent Side:

Clean, professional dashboard
Charts: Accuracy trends, topic-wise performance, time spent

General:

Mobile-first and fully responsive
Positive, encouraging language everywhere (never harsh red “Wrong”)

📁 Recommended Folder Structure
Backend:
text/backend
  /src
    /controllers
    /models
    /routes
    /middlewares
    /utils          ← questionGenerator.ts, rewards.ts, etc.
    /config
  server.ts
Frontend:
text/frontend
  /src
    /components
    /pages
    /store          ← Zustand stores
    /services       ← API calls
    /assets         ← sounds, images
🧪 Testing

Unit tests for question generator and game logic
Integration tests for auth and level completion flow
Strict role-based access enforcement

🚀 Phase 1 MVP Acceptance Criteria

Complete authentication (parent + child PIN)
Dynamic Math question generation (Addition focus initially)
Full gamified level flow with hearts, hints, rewards, and pet reactions
Level selection map and progress system
Parent analytics dashboard with charts
Responsive, joyful UI with animations and sounds
All data persisted in MongoDB
Clean code with proper MVC separation and README instructions

📅 Roadmap
Phase 1 (Current): Core gamified Math learning + Parent dashboard
Phase 2 (AI Integration):

AI-generated questions and explanations
Adaptive difficulty
Smart personalized hints
Personalized learning paths
Advanced analytics with insights

⚠️ Important Notes

Strictly follow REST API + MVC pattern
Maintain clean separation of concerns (controllers, models, routes, utils)
Store every question attempt for rich analytics
Use encouraging and positive language throughout the app
Design the experience to feel joyful and safe for kids
Keep the architecture clean and modular for easy AI integration later
License: MIT