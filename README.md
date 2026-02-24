# 🔥 HabitFlow — Habit Tracking App

> Build habits that stick. Track daily progress, maintain streaks, and unlock your best self — one habit at a time.

**Live Demo:** https://habitflow-opal.vercel.app  
**Repository:** https://github.com/mridulrajgaria/habitflow

---

## ✨ Features

### Core
- 🔐 **Authentication** — Register/login with JWT, bcrypt password hashing, all validation errors shown at once
- 📋 **Habit Management** — Create, edit, delete, and archive habits with title, description, color, and category
- ✅ **Daily Tracking** — One-click toggle with optional notes; MongoDB unique index prevents duplicate completions
- 📊 **Progress Dashboard** — Current streak, completion %, weekly bar chart, 30-day area chart
- 📅 **Completion History** — 35-day calendar heatmap with color-coded cells and SVG checkmarks
- 🏅 **Achievement Badges** — 10 milestone badges (Week Warrior, Iron Will, Perfect Month, and more)

### Bonus
- 🌙 **Dark / Light mode** — Smooth toggle, saves preference, zero flash on load
- 📱 **PWA Support** — Installable as a mobile app via "Add to Home Screen"
- 🔍 **Search & Filter** — Filter habits by name or category in real time
- ⌨️ **Keyboard Shortcuts** — `N` new habit, `S` search, `Esc` clear
- 🔥 **Streak Fire Levels** — Flame grows in size and intensity based on streak length
- 🎉 **Confetti** — Fires when all habits are completed for the day
- 🔊 **Completion Sound** — Satisfying ding on completion, fanfare when all done (toggleable)
- 📦 **Archive Instead of Delete** — Soft-delete preserves all completion history
- 📈 **Weekly Report Card** — A+/B/C/D grade based on overall completion rate
- 🏆 **Personal Best Streak** — Tracks all-time longest streak per habit
- 🖼️ **Profile Picture Upload** — Base64 stored in MongoDB, auto-compressed to ~150KB
- 🎨 **8 Habit Categories** — Health, Fitness, Learning, Mindfulness, Productivity, Creative, Social, General
- 🌱 **Smart Empty States** — Animated SVG illustrations
- 💬 **Notes Per Completion** — Add a note every time you complete a habit
- 💡 **Motivational Quotes** — Rotating daily quote on the habits page
- 🐳 **Docker Setup** — Full local dev with docker-compose up
- 🛡️ **Rate Limiting** — 100 req/15min general, 10 req/15min on auth endpoints

---

## 🏗 Architecture Overview

```
habitflow/
├── backend/                        # Node.js + Express REST API
│   └── src/
│       ├── app.js                  # Express setup (CORS, helmet, rate limiting, routes)
│       ├── index.js                # Entry point + MongoDB connection
│       ├── models/
│       │   ├── User.js             # User schema with avatar + reset token fields
│       │   ├── Habit.js            # Habit schema with soft-delete (archivedAt)
│       │   └── HabitCompletion.js  # Completion schema with compound unique index
│       ├── controllers/            # Business logic (auth, habits, completions, stats)
│       ├── middleware/auth.js      # JWT verification middleware
│       ├── routes/                 # Route definitions (auth, habits, completions, stats)
│       └── utils/db.js             # MongoDB connection helper
│
└── frontend/                       # React 18 + Vite SPA
    └── src/
        ├── App.jsx                 # Router + protected routes + page transitions
        ├── context/
        │   ├── AuthContext.jsx     # Auth state + avatar methods
        │   ├── ThemeContext.jsx    # Dark/light mode state
        │   └── ToastContext.jsx    # Toast notification system
        ├── components/
        │   ├── Layout.jsx          # Sidebar + mobile header + profile modal
        │   ├── HabitFlowLogo.jsx   # Custom SVG logo (flame + checkmark)
        │   ├── Badges.jsx          # Achievement badge system
        │   ├── Confetti.jsx        # Canvas-based particle celebration
        │   ├── CompletionHistory.jsx # 35-day calendar + completion log
        │   ├── ProfileModal.jsx    # Profile picture upload with compression
        │   └── Illustrations.jsx  # Animated SVG illustrations
        ├── pages/
        │   ├── Login.jsx           # Split layout auth page
        │   ├── Register.jsx        # Live password strength checker
        │   ├── Dashboard.jsx       # Stats + charts + badges
        │   └── Habits.jsx          # Habit list + search + filter + sounds
        └── utils/
            ├── api.js              # Axios instance with auth interceptors
            └── sound.js            # Web Audio API completion sounds
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts (bar + area) |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | Helmet + express-rate-limit + CORS |
| Containers | Docker + Docker Compose |

---

## 🗄 Database Schema

### users
```json
{
  "_id":              "ObjectId",
  "name":             "String (required, 2-50 chars)",
  "email":            "String (required, unique, lowercase)",
  "password":         "String (bcrypt hash — never returned via API)",
  "avatar":           "String (base64 data URL, optional)",
  "createdAt":        "Date",
  "updatedAt":        "Date"
}
```

### habits
```json
{
  "_id":         "ObjectId",
  "userId":      "ObjectId → ref: User (indexed)",
  "title":       "String (required, max 100 chars)",
  "description": "String (optional, max 500 chars)",
  "color":       "String (hex, e.g. '#7c6af7')",
  "category":    "Enum: health | fitness | learning | mindfulness | productivity | creative | social | general",
  "archivedAt":  "Date (null = active, non-null = soft-deleted)",
  "createdAt":   "Date",
  "updatedAt":   "Date"
}
```

### habitcompletions
```json
{
  "_id":       "ObjectId",
  "habitId":   "ObjectId → ref: Habit (indexed)",
  "userId":    "ObjectId → ref: User  (indexed)",
  "date":      "String (YYYY-MM-DD format)",
  "note":      "String (optional)",
  "createdAt": "Date",

  "UNIQUE INDEX": "{ habitId, date } — prevents duplicate completions at DB level"
}
```

**Key design decisions:**
- `date` stored as `YYYY-MM-DD` string — avoids UTC/timezone edge cases
- Compound unique index `(habitId, date)` enforced by MongoDB — prevents duplicates even under concurrent requests
- `archivedAt` soft-delete on habits — preserves all completion history when a habit is archived
- `userId` on completions — enables direct per-user queries without population joins
- `avatar` as base64 in User — avoids need for external file storage; frontend compresses to ~150KB before upload

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local, Docker, or MongoDB Atlas)

### Option A: Docker (Easiest)
```bash
git clone https://github.com/mridulrajgaria/habitflow.git
cd habitflow
docker-compose up --build

# Frontend: http://localhost:3000
# API:      http://localhost:5000
```

### Option B: Manual Setup

**1. Clone**
```bash
git clone https://github.com/mridulrajgaria/habitflow.git
cd habitflow
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
# API at http://localhost:5000
```

**3. Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
# App at http://localhost:5173
```

---

## 🔌 API Reference

All routes except `/api/auth/*` require: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | — |
| PUT | `/api/auth/avatar` | `{ avatar: "data:image/jpeg;base64,..." }` |
| DELETE | `/api/auth/avatar` | — |

Password rules: min 8 chars, uppercase + lowercase + number. All validation errors returned at once.

### Habits
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | All active habits + today's status + streak |
| POST | `/api/habits` | Create habit |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit + its completions |
| PATCH | `/api/habits/:id/archive` | Toggle archive (soft delete) |

### Completions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/completions/:habitId/toggle` | Toggle today's completion on/off |
| GET | `/api/completions/:habitId` | Get all completions for a habit |

### Stats
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stats/dashboard` | Streaks, rates, chart data, perfect days, total completions |

---

## 📦 Deployment

### Render + Vercel + MongoDB Atlas

**Step 1 — MongoDB Atlas**
1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free M0 cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0` (required for Render's dynamic IPs)
4. Connect → Copy connection string

**Step 2 — Render (Backend)**
1. [render.com](https://render.com) → New Web Service → connect GitHub
2. Root directory: `backend` | Build: `npm install` | Start: `node src/index.js`
3. Environment variables:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

**Step 3 — Vercel (Frontend)**
1. [vercel.com](https://vercel.com) → Import repo → Root directory: `frontend`
2. Environment variable: `VITE_API_URL=https://your-backend.onrender.com`
3. Deploy!

> ⚠️ Set `FRONTEND_URL` on Render to your exact Vercel URL — not `*`. Using `*` with `credentials: true` is blocked by browsers (CORS policy).

> ⚠️ Render free tier spins down after 15 mins of inactivity. First request after idle may take 30-60 seconds.

---

## 🔒 Security

- Passwords hashed with **bcrypt** (cost factor 12)
- **JWT tokens** expire after 7 days
- **Rate limiting** — brute-force protection on all routes
- **Helmet.js** — XSS, clickjacking, MIME sniffing protection
- **CORS** restricted to exact frontend URL in production
- **Input validation** via express-validator — all errors returned at once
- Password never returned in any API response

---

## 💡 Assumptions & Engineering Decisions

| Decision | Reasoning |
|---|---|
| **Date as string (YYYY-MM-DD)** | Avoids UTC timezone bugs that occur when comparing Date objects across timezones |
| **Compound unique index** | Prevents duplicate completions at DB level — handles concurrent requests safely, not just at app level |
| **Toggle behavior** | Clicking a completed habit unmarks it — useful for corrections, more intuitive than a separate undo |
| **Streak logic** | Counts consecutive days ending on today or yesterday — avoids penalizing users who complete habits late at night |
| **Base64 avatar** | Avoids external file storage (S3/Cloudinary). Frontend compresses to ~150KB before upload |
| **Soft delete (archivedAt)** | Preserves all completion history when a habit is removed |
| **Web Audio API for sounds** | No audio files needed — sounds generated programmatically, zero extra network requests |

---

## ✅ Submission Checklist

### Mandatory
- ✅ User authentication — register, login, logout, JWT, bcrypt, input validation
- ✅ Habit CRUD — title, description, creation date, color, category
- ✅ Daily completion tracking + duplicate prevention (MongoDB compound unique index)
- ✅ Progress dashboard — streak, completion %, weekly progress
- ✅ Charts — Bar chart (weekly %) + Area chart (30-day trend)
- ✅ REST API with validation and structured error responses
- ✅ MongoDB schema with proper relationships and indexes
- ✅ Environment variables for all secrets
- ✅ Mobile-responsive UI
- ✅ App deployed publicly at https://habitflow-opal.vercel.app
- ✅ README with setup, architecture, schema, deployment, assumptions

### Bonus
- ✅ Mobile-first design + Dark/Light mode
- ✅ Animations — confetti, bounce, stagger, page transitions
- ✅ Smart empty states with animated SVG illustrations
- ✅ Habit categories (8 types) + Notes per completion
- ✅ Motivational messages + Achievement badges
- ✅ Docker setup + Rate limiting
- ✅ PWA — installable as mobile app
- ✅ Search + filter + Keyboard shortcuts
- ✅ Completion sounds (Web Audio API)
- ✅ Archive instead of delete + Personal best streak
- ✅ Weekly report card + Profile picture upload
