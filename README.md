# 🎮 Life RPG — Gamified Real-Life Progression

Transform daily routines, chores, and habits into an immersive role-playing game. Gain Experience Points (XP), level up your character, build streaks, upgrade attributes, and conquer the global leaderboard.

---

## 🌟 Key Features

### 1. 🛡️ Hero & RPG Progression Engine
- **Non-Linear Leveling Formula**: Experience curve scales with formula `100 * level^1.5` so each level requires more effort and dedication than the last.
- **Dynamic Titles**: Rise through ranks from **Novice** all the way to **Immortal** and **Godlike**.
- **Character Attributes**: Real-life domains map directly to character stats:
  - ❤️ **Health** (Sleep, nutrition, hydration)
  - 💼 **Career** (Work, deep work sessions, finances)
  - 🤝 **Social** (Family, friends, community)
  - 📚 **Knowledge** (Reading, courses, studying)
  - 💪 **Fitness** (Gym, workouts, sports)
  - 🎨 **Creativity** (Music, writing, art)

### 2. 📜 Full Quest System (CRUD)
- **Create**: Add one-time tasks (`todo`), repeating habits (`habit`), daily tasks (`daily`), or epic boss fights (`challenge`).
- **Read**: Filter and browse by type, active vs completed, and view XP and Gold rewards.
- **Update**: Edit quest titles, difficulty rating, descriptions, and linked character attributes directly.
- **Delete**: Abandon quests anytime.
- **Streak Engine**: Consecutive completions award streak multipliers up to `2.0x`.

### 3. 🏪 Rewards Economy (Item Shop)
- Spend hard-earned gold coins on:
  - 🧪 **XP Potions & Elixirs** (Instant level boosts)
  - 🐲 **Class Avatars** (Dragon Knight, Shadow Assassin, Grand Archmage)
  - 📜 **Prestige Titles** ("Procrastination Slayer", "Master of Discipline")

### 4. 🏆 Achievements & Badges
- Progression milestones unlock rare badges with big XP rewards (e.g. *First Step*, *Streak Warrior*, *Legendary Hunter*).

### 5. 👑 Global Leaderboard
- Top 3 podium display and global ranking of adventurers based on Level, XP, and Gold.

### 6. 🎨 Tactile & Celebratory UI
- Dark fantasy aesthetic with glowing borders and ambient lighting.
- Confetti particle celebration (`canvas-confetti`) on quest completion and level ups.
- Full mobile and desktop responsive layout with intuitive keyboard accessibility.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions), [TailwindCSS 4](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL database, Row Level Security, Auth triggers)
- **Icons & Polish**: [Lucide React](https://lucide.dev/), Canvas Confetti

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- A free [Supabase](https://supabase.com) account

### 2. Clone & Install
```bash
git clone https://github.com/your-username/life-rpg.git
cd life-rpg
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local` and add your Supabase credentials:
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 🔒 Security & Data Persistence
- Authentication and session cookies are refreshed via middleware.
- PostgreSQL tables are safeguarded with **Row Level Security (RLS)** — users can only view and mutate their own tasks and character data.
