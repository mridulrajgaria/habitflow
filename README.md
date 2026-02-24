# 🔥 HabitFlow — Habit Tracking App

A full-stack habit tracking application built with the **MERN stack** (MongoDB, Express, React, Node.js).

**Live Demo:** https://habitflow-opal.vercel.app

---

## ✨ Features

- **Authentication** — Register/login with JWT, bcrypt password hashing, input validation
- **Habit Management** — Create, edit, delete habits with title, description, color, category
- **Daily Tracking** — One-click toggle; MongoDB unique index prevents duplicate completions per day
- **Progress Dashboard** — Current streak, completion %, weekly bar chart, 30-day trend line chart
- **8 Categories** — Health, Fitness, Learning, Mindfulness, Productivity, Creative, Social, General
- **Rate Limiting** — Brute-force protection on auth endpoints
- **Mobile-first** — Fully responsive with mobile sidebar drawer

---

## 🏗 Architecture Overview

```
habitflow/
├── backend/                    # Node.js + Express REST API
│   └── src/
│       ├── app.js              # Express setup (middleware, routes, CORS, helmet)
│       ├── index.js            # Entry point + MongoDB connection
│       ├── models/             # Mongoose schemas
│       │   ├── User.js
│       │   ├── Habit.js
│       │   └── HabitCompletion.js
│       ├── controllers/        # Business logic
│       ├── middleware/auth.js  # JWT verification
│       ├── routes/             # API route definitions
│       └── utils/db.js         # MongoDB connection helper
│
└── frontend/                   # React 18 + Vite SPA
    └── src/
        ├── App.jsx             # Router + protected routes
        ├── context/            # AuthContext, ToastContext
        ├── pages/              # Login, Register, Dashboard, Habits
        ├── components/         # Layout, HabitModal
        └── utils/api.js        # Axios instance with auth interceptors
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Charts | Recharts (bar + line) |
| HTTP Client | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | Helmet + express-rate-limit |
| Containers | Docker + Docker Compose |

---

## 🗄 Database Schema

### users
```js
{
  _id:       ObjectId,
  name:      String (required),
  email:     String (required, unique),
  password:  String (bcrypt hash — never returned via API),
  createdAt, updatedAt
}
```

### habits
```js
{
  _id:         ObjectId,
  userId:      ObjectId → ref: User  (indexed),
  title:       String (required, max 100),
  description: String (optional, max 500),
  color:       String (hex color, default '#7c6af7'),
  category:    String (enum: health/fitness/learning/mindfulness/productivity/creative/social/general),
  archivedAt:  Date   (null = active, used for soft delete),
  createdAt, updatedAt
}
```

### habitcompletions
```js
{
  _id:      ObjectId,
  habitId:  ObjectId → ref: Habit (indexed),
  userId:   ObjectId → ref: User  (indexed),
  date:     String  (YYYY-MM-DD format),
  note:     String  (optional),
  createdAt,

  // UNIQUE compound index: { habitId, date }
  // → Prevents duplicate completions on the same day at DB level
}
```

**Key design decisions:**
- `date` stored as `YYYY-MM-DD` string — avoids UTC/timezone edge cases
- Compound unique index `(habitId, date)` enforced by MongoDB — prevents duplicate completions
- `archivedAt` soft-delete on habits — preserves completion history
- `userId` on completions — allows direct per-user queries without population

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local, Docker, or MongoDB Atlas)

---

### Option A: Docker (Easiest — everything included)

```bash
git clone https://github.com/mridulrajgaria/habitflow.git
cd habitflow

docker-compose up --build

# Frontend: http://localhost:3000
# API:      http://localhost:5000
# MongoDB runs automatically as a container
```

---

### Option B: Manual Setup

**1. Clone the repo**
```bash
git clone https://github.com/your-username/habitflow.git
cd habitflow
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
# API running at http://localhost:5000
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

### Option C: MongoDB Atlas (Free Cloud DB)

1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas) — free M0 cluster
2. Create cluster → click "Connect" → get connection string
3. Set `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/habitflow` in `.env`
4. No local MongoDB needed!

---

## 🔌 API Reference

> All routes except `/api/auth/*` require header: `Authorization: Bearer <token>`

### Auth
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/auth/register` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |
| GET | `/api/auth/me` | — |

Password rules: min 8 chars, must have uppercase + lowercase + number.

### Habits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | All habits + today's completion status |
| POST | `/api/habits` | Create habit |
| GET | `/api/habits/:id` | Single habit + last 30 completions |
| PUT | `/api/habits/:id` | Update habit |
| DELETE | `/api/habits/:id` | Delete habit + its completions |

### Completions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/completions/:habitId/toggle` | Toggle today's completion on/off |
| GET | `/api/completions/:habitId?from=&to=` | Get completions in date range |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/dashboard` | Streaks, rates, weekly + monthly chart data |

---

## 📦 Deployment Steps

### Recommended: Render + MongoDB Atlas + Vercel

**Step 1 — MongoDB Atlas (Database)**
1. [mongodb.com/atlas](https://mongodb.com/atlas) → Create free M0 cluster
2. Database Access → Add user with password
3. Network Access → Allow `0.0.0.0/0`
4. Connect → Copy connection string

**Step 2 — Render (Backend)**
1. [render.com](https://render.com) → New Web Service → connect GitHub
2. Root directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Environment variables:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=<generate: openssl rand -hex 64>
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

**Step 3 — Vercel (Frontend)**
1. [vercel.com](https://vercel.com) → Import repo
2. Root directory: `frontend`
3. Environment variable:
```
VITE_API_URL=https://your-backend.onrender.com
```
4. Deploy!

---

## 🔒 Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens expire after 7 days
- Rate limiting: 100 req/15min general, 10 req/15min on auth
- Helmet.js security headers (XSS, clickjacking, MIME sniffing)
- CORS restricted to frontend URL in production
- Input validation via express-validator on all endpoints
- MongoDB injection prevented by Mongoose schema typing

---

## 💡 Assumptions Made

1. **Date as string** — Dates stored as `YYYY-MM-DD` to avoid UTC timezone bugs. Server uses UTC date; for production, client should pass its local date in the request.
2. **Toggle behavior** — Clicking a completed habit unmarks it (useful for corrections).
3. **Streak logic** — Counts consecutive days ending on today or yesterday. Streak isn't broken until you miss today AND tomorrow.
4. **No refresh tokens** — JWT in localStorage for simplicity. Production would use httpOnly cookies + refresh tokens.
5. **Soft delete** — `archivedAt` field preserves completion history; can be extended to archive/restore feature.

---

## ✅ Submission Checklist

- ✅ User authentication — register, login, logout, JWT, bcrypt
- ✅ Habit CRUD — title, description, creation date, color, category
- ✅ Daily completion tracking + duplicate prevention (MongoDB unique index)
- ✅ Progress dashboard — streak, completion %, weekly progress
- ✅ Charts — Bar chart (weekly %) + Line chart (30-day trend)
- ✅ REST API with validation and error responses
- ✅ MongoDB schema with proper relationships
- ✅ Docker setup for easy local dev
- ✅ Environment variables for all secrets
- ✅ Mobile-responsive UI
- ✅ README with setup, architecture, schema, deployment, assumptions
