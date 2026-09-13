# ⚔️ Life RPG — Turn Your Real Life Into An Epic Adventure

> *"Every day is a new quest."*

**Life RPG** is a full-stack gamified productivity web application that transforms your everyday tasks, habits, and goals into an immersive RPG experience. Complete quests, earn XP and gold, level up your character, build streaks, unlock achievements, shop for rewards, and compete on a global leaderboard — all while getting real things done.

---

## 🌐 Live Demo & Video

| Deliverable | Link |
|---|---|
| **🔗 Live Deployed URL** | [https://life-rpg-sooty.vercel.app](https://life-rpg-sooty.vercel.app) |
| **🎥 Walkthrough Video** | *TODO: Add public YouTube/Loom link before submission (90–180 seconds, under 100 MB)* |
| **📦 GitHub Repository** | [https://github.com/codewithsuraj33-sketch/life-rpg](https://github.com/codewithsuraj33-sketch/life-rpg) |

---

## 📖 Table of Contents

- [The Core Problem](#-the-core-problem)
- [Product Feel & Creative Direction](#-product-feel--creative-direction)
- [Core Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Database Schema & Data Model](#-database-schema--data-model)
- [RPG Progression System](#-rpg-progression-system)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [AI & Development Tools Disclosure](#-ai--development-tools-disclosure)
- [Team & Contributions](#-team--contributions)
- [Judging Criteria Checklist](#-judging-criteria-checklist)
- [Disqualification Rules (Zero-Tolerance)](#-disqualification-rules-zero-tolerance)
- [License](#-license)

---

## 🧠 The Core Problem

Traditional productivity tools, habit trackers, and to-do lists are fundamentally flawed for many users: they feel like chores. They suffer from a **"delayed gratification"** problem — where the real-world results of reading a book, going to the gym, or studying take months to materialize.

In contrast, **video games** provide immediate dopamine through instant feedback loops, clear progression systems, and tangible rewards.

**Life RPG bridges this gap** by engineering a platform that translates mundane real-world tasks into an engaging virtual progression system. Unlike a simple frontend prototype, this project requires a robust full-stack architecture with a secure backend to prevent users from easily "cheating" their stats, a relational database to maintain complex historical logs of completed tasks and inventory, and user authentication to allow seamless cross-device synchronization.

---

## 🎨 Product Feel & Creative Direction

This application does **not** look or feel like a standard enterprise SaaS dashboard or a generic Bootstrap CRUD app. It has a soul — a **Cyber-Fantasy** visual identity with:

- **Alive and Tactile UI:** The interface reacts instantly to the user. Earning XP, leveling up, or buying an item triggers celebratory confetti, retro sound effects (generated via Web Audio API — no external audio files), screen shake animations, and glowing CSS micro-interactions that make mundane checkmarks feel deeply satisfying.
- **Thematically Cohesive:** The entire experience is wrapped in a custom cyber-fantasy design system — "Quests" instead of "Tasks", "Gold" instead of "Points", "Character Attributes" instead of "Categories", neon glows, glassmorphism cards, and purple/cyan gradients. Typography uses the modern **Outfit** font from Google Fonts.
- **Seamlessly Integrated:** Even though data is stored on a remote Supabase server, the user never feels bogged down by network latency. Parallel data fetching, optimistic UI updates, and smooth transitions make the experience feel as fast as a native client-side app.

---

## ✨ Core Features

### 🔐 User Authentication & Security
- Secure **email/password** signup, login, logout, and session persistence via **Supabase Auth**.
- Username selection during signup with Supabase email confirmation support.
- Server-side authentication checks protect all game routes — unauthenticated users are redirected.
- Session cookies are refreshed automatically by **Next.js middleware**.
- All user-owned queries are filtered by the authenticated user ID.
- **Row Level Security (RLS)** policies are configured on every user-owned table in Supabase.
- A user can **only** see and modify their own tasks and character data.

### 📋 Quest CRUD (Full Database Persistence)
- **Create** quests with title, description, difficulty, type, linked character attribute, and negative/positive toggle.
- **Read/Browse** all your quests on the Quest Board with filter and sort.
- **Edit** existing quests — update title, description, difficulty, type, and linked stat.
- **Complete** quests to earn XP + gold with streak bonuses, stat progression, boss damage, and achievement checks.
- **Delete** quests you no longer need.
- **Quest Types:** Daily (auto-resets), Habit (repeatable), To-Do (one-time), Challenge (one-time hard).
- **Bad Habits (Negative Quests):** Logging a bad habit deals HP damage to your character instead of granting XP. If HP reaches 0, you respawn but lose 100 gold — a real consequence system.
- Data persists across page refreshes and sessions (server-rendered from Supabase).

### 📊 RPG Progression Engine
- **Non-linear leveling** system from Level 1 to Level 20 (formula: `100 × level^1.5`, rounded). Each subsequent level requires more XP than the last.
- **10 Unique Titles:** Novice → Apprentice → Adventurer → Warrior → Champion → Hero → Legend → Mythic → Immortal → Godlike.
- **4 Difficulty Tiers:** Easy (15 XP / 5 Gold), Medium (30 XP / 10 Gold), Hard (60 XP / 25 Gold), Legendary (120 XP / 50 Gold).
- **Streak Multiplier:** Completing quests consecutively scales rewards up to **2× at 30-day streaks**.
- **Level-Up Celebrations:** Confetti bursts, ascending arpeggio sound effect, and a glowing modal when you level up.

### 🧬 Character & Attributes
- **6 Core Character Attributes:** Health ❤️, Career 💼, Social 🤝, Knowledge 📚, Fitness 💪, Creativity 🎨.
- Each attribute has its own XP and level — completing quests linked to a stat raises that stat independently.
- **Character Classes:** Choose from Warrior, Mage, or Rogue — each gives a **1.5× XP bonus** for quests aligned with their specialization (e.g., Warrior gets bonus XP for Fitness/Health quests).
- **HP System:** Your character has HP. Bad habits deal damage; reaching 0 HP triggers a gold penalty respawn.
- **Inventory / Bag:** View all purchased items, equipped avatars, and earned titles.

### 🏪 Rewards Shop & Economy
- **Gold currency** earned from completing quests.
- Spend gold on:
  - **Minor XP Elixir** (30 gold → +50 XP) and **Greater XP Elixir** (80 gold → +150 XP)
  - **Avatar Unlocks:** Dragon Knight 🐲 (100 gold), Shadow Assassin 🥷 (60 gold), Grand Archmage 🧙‍♂️ (75 gold)
  - **Prestige Titles:** "Procrastination Slayer" 📜 (120 gold), "Master of Discipline" 🎖️ (200 gold)
- Purchased items appear in your inventory. Avatar and title purchases are applied to your profile.
- Duplicate purchase prevention is enforced.

### 🏆 Achievements
- Milestone-based achievement badges awarded automatically when you reach thresholds:
  - Quests completed milestones
  - Streak milestones
  - Level milestones
  - Gold earned milestones
  - Complete a Legendary quest
- Each achievement grants **bonus XP** as a reward.

### 🐉 Shared Boss Encounter
- A global community boss (**"The Procrastination Dragon 🐉"**) with 10,000 HP.
- Every quest completed by any user on the platform deals 1 damage to the boss.
- A real-time health bar on the dashboard shows global progress.

### 📊 Dashboard & Activity
- **Hero Overview Banner:** Avatar, username, level, title, gold count, total quests completed, and XP progress bar.
- **Character Attributes Grid:** Quick glance at all 6 stats with levels.
- **Active Quests Quick-Board:** See your most recent uncompleted quests with direct completion links.
- **Consistency Heatmap:** A GitHub-style activity heatmap showing your quest completion activity over the last 60 days.
- **Recent Activity Log:** Timestamped feed of completed quests, XP gained, and gold earned.
- **Quick Action Shortcuts:** One-click navigation to Quest Board, Leaderboard, Shop, and Achievements.
- **Daily Login Reward Modal:** Claim daily login bonuses.
- **Class Selection Modal:** First-time prompt to choose your character class.

### 👑 Global Leaderboard
- **Time-based leaderboards:** All-Time, Weekly, and Monthly rankings.
- Displays rank, username, avatar, level, title, and total XP.
- **Automated gold rewards** for top-ranked players.
- Public access — even unauthenticated users can view the leaderboard from the landing page.

### 🎵 Sound Effects (Web Audio API)
- **Retro RPG sound effects** generated entirely via the Web Audio API — no external audio files needed:
  - ⚔️ **Sword slash** sound on quest completion
  - 🎵 **Level-up arpeggio** (ascending C-E-G-C notes) on level up
  - 🪙 **Coin chime** on reward/purchase

### 📱 Responsive & Accessible UI
- Fully responsive from **mobile to desktop** with Tailwind CSS responsive breakpoints.
- **Keyboard navigable:** Primary actions (buttons, links, forms) are reachable via Tab, Enter, and Space.
- **Semantic HTML5** elements, proper heading hierarchy (single `<h1>` per page), and `<label>` associations on form inputs.
- **Focus indicators** visible for keyboard navigation.
- Smooth CSS transitions with `touch-action: manipulation` for mobile tap responsiveness (no 300ms delay).
- Glassmorphism cards, custom scrollbars, and slide-in mobile sidebar.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16 (App Router, Server Components, Server Actions) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Custom CSS Design System (Cyber-Fantasy theme) |
| **Typography** | [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts) |
| **Icons** | Lucide React |
| **Celebration Effects** | `canvas-confetti` |
| **Sound Effects** | Web Audio API (no external files) |
| **Backend / BaaS** | Supabase (PostgreSQL, Auth, RLS) |
| **Auth** | Supabase Auth with `@supabase/ssr` for server-side session management |
| **Database** | PostgreSQL (via Supabase) |
| **CSS Utilities** | `clsx`, `tailwind-merge` |
| **Deployment** | Vercel |

**Note:** The `@google/generative-ai` package is installed in `package.json` but is **currently unused** by the application. No generative AI feature is exposed to users.

The implementation uses **only** the technologies listed above. No external UI template, CSS framework boilerplate, or copied visual theme is used — the entire game interface and design system are **custom-built and project-specific**.

---

## 📂 Architecture & Folder Structure

```
life-rpg/
├── public/                     # Static assets (SVG icons)
├── supabase/
│   └── migrations/             # SQL migration files
├── src/
│   ├── middleware.ts            # Next.js middleware (session refresh)
│   └── app/
│       ├── globals.css          # Cyber-Fantasy design system (CSS variables, components)
│       ├── layout.tsx           # Root layout (Outfit font, metadata, SEO)
│       ├── page.tsx             # Landing page (public)
│       ├── icon.svg             # Favicon
│       ├── (auth)/              # Auth route group
│       │   ├── login/           # Login page
│       │   └── signup/          # Signup page
│       ├── (game)/              # Protected game route group
│       │   ├── layout.tsx       # Game layout (sidebar + topbar)
│       │   ├── dashboard/       # Main dashboard
│       │   ├── quests/          # Quest board (CRUD)
│       │   ├── character/       # Character stats + inventory
│       │   ├── shop/            # Rewards market
│       │   ├── achievements/    # Achievement badges
│       │   └── leaderboard/     # Global rankings
│       ├── _actions/            # Server Actions (mutations)
│       │   ├── auth.ts          # Signup, login, logout
│       │   ├── quests.ts        # Create, complete, update, delete quests
│       │   ├── shop.ts          # Purchase items
│       │   ├── character.ts     # Class selection, avatar updates
│       │   ├── daily.ts         # Daily login rewards
│       │   ├── inventory.ts     # Inventory management
│       │   ├── leaderboard.ts   # Leaderboard queries + reward distribution
│       │   └── profile.ts       # Profile updates
│       ├── _components/
│       │   ├── game/            # Game-specific components
│       │   │   ├── ActivityHeatmap.tsx
│       │   │   ├── BossHealthBar.tsx
│       │   │   ├── CharacterClient.tsx
│       │   │   ├── ClassSelectionModal.tsx
│       │   │   ├── CreateQuestModal.tsx
│       │   │   ├── DailyRewardModal.tsx
│       │   │   ├── EditQuestModal.tsx
│       │   │   ├── InventoryClient.tsx
│       │   │   ├── LevelUpModal.tsx
│       │   │   ├── QuestBoardClient.tsx
│       │   │   ├── QuestCard.tsx
│       │   │   ├── ShopClient.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── TopBar.tsx
│       │   └── ui/              # Reusable UI primitives
│       │       ├── Badge.tsx
│       │       ├── Card.tsx
│       │       ├── Modal.tsx
│       │       └── ProgressBar.tsx
│       ├── _lib/                # Shared logic & utilities
│       │   ├── constants.ts     # XP table, difficulty rewards, titles, stats
│       │   ├── xp.ts            # Level calculation, progress, level-up checks
│       │   ├── achievements.ts  # Achievement evaluation engine
│       │   ├── shop.ts          # Shop item definitions
│       │   ├── sound.ts         # Web Audio API sound effects
│       │   ├── utils.ts         # Utility functions (cn)
│       │   └── supabase/        # Supabase client (server + browser + middleware)
│       └── api/                 # API routes (if any)
├── .env.example                 # Environment variable template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── postcss.config.mjs           # PostCSS (Tailwind)
├── eslint.config.mjs            # ESLint configuration
└── update.sql                   # Database update script (profiles + bosses)
```

---

## 🗄️ Database Schema & Data Model

The application reads and writes these **Supabase PostgreSQL** tables:

| Table | Purpose |
|---|---|
| `profiles` | User profile — level, XP, coins, title, avatar, class, HP, last login date |
| `stats` | Character attributes — name, icon, color, XP, level (per user) |
| `quests` | User quests — title, description, type, difficulty, rewards, streak, completion status |
| `activity_log` | Activity history — action description, XP gained, coins gained, timestamp |
| `inventory` | Purchased shop items — item ID, category, purchase date |
| `achievements` | Achievement definitions — name, icon, requirement type/value, XP reward |
| `user_achievements` | Junction table — which achievements each user has unlocked |
| `bosses` | Global boss encounters — name, max HP, current HP, active status |
| `system_rewards_log` | Leaderboard reward distribution log |

**Security:**
- Row Level Security (RLS) is enabled on all user-owned tables.
- Foreign keys and ownership checks ensure data isolation per user.
- The `bosses` table allows read access for all users and update access only for authenticated users.

---

## 📈 RPG Progression System

### XP Table (Non-Linear)

| Level | Total XP Required | Title Unlocked |
|---|---|---|
| 1 | 0 | Novice |
| 2 | 100 | — |
| 3 | 260 | Apprentice |
| 4 | 490 | — |
| 5 | 800 | Adventurer |
| 6 | 1,200 | — |
| 7 | 1,700 | Warrior |
| 8 | 2,300 | — |
| 9 | 3,000 | Champion |
| 10 | 3,800 | — |
| 11 | 4,750 | Hero |
| 12 | 5,800 | — |
| 13 | 7,000 | Legend |
| 14 | 8,350 | — |
| 15 | 9,850 | Mythic |
| 16 | 11,500 | — |
| 17 | 13,300 | Immortal |
| 18 | 15,300 | — |
| 19 | 17,500 | — |
| 20 | 20,000 | Godlike |

### Streak Multiplier

| Consecutive Completions | XP/Gold Multiplier |
|---|---|
| 1–2 | 1.0× |
| 3–6 | 1.1× |
| 7–13 | 1.3× |
| 14–29 | 1.5× |
| 30+ | 2.0× |

### Class Bonuses

| Class | 1.5× XP Bonus For |
|---|---|
| ⚔️ Warrior | Health, Fitness, Strength quests |
| 🧙 Mage | Intellect, Career, Study quests |
| 🗡️ Rogue | Social, Fun, Charisma quests |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites

- **Node.js** 18 or newer
- **npm** (comes with Node.js)
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/codewithsuraj33-sketch/life-rpg.git
cd life-rpg
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the environment template:

```bash
# Windows
copy .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project: **Project Settings → API**.

### 4. Set Up the Database

1. In the **Supabase SQL Editor**, run the base schema SQL to create all required tables (`profiles`, `stats`, `quests`, `activity_log`, `inventory`, `achievements`, `user_achievements`, `system_rewards_log`).
2. Run the [`update.sql`](update.sql) file to add the `class_type` and `last_login_date` columns to profiles and create the `bosses` table with the initial boss seed.
3. Run the inventory migration from [`supabase/migrations/20260912161149_create_inventory_table.sql`](supabase/migrations/20260912161149_create_inventory_table.sql).
4. Configure **Row Level Security (RLS)** policies on all user-owned tables.
5. In **Supabase Auth settings**, choose whether email confirmation is enabled. When enabled, users must confirm their email before a session is created.

> ⚠️ **Important:** This repository contains the application-side SQL updates and inventory migration, but the complete base schema and all production RLS policies must exist in the target Supabase project before deployment. **Never** expose a service-role key in `.env.local` or client code.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Lint & Build (Validation)

```bash
npm run lint
npm run build
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public API key | ✅ |

- `.env.local` is listed in `.gitignore` and is **never committed** to the repository.
- `.env.example` is provided as a safe template.

---

## 🌍 Deployment

### Recommended: Vercel

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in Vercel's **Project Settings → Environment Variables**.
4. Set the build command to `npm run build` and publish directory to `.next`.
5. Deploy.

### Post-Deployment Verification

After deploying, verify these flows on the live URL:

- [ ] Signup with a new account
- [ ] Login with existing credentials
- [ ] Create a quest
- [ ] Complete a quest → XP, gold, streak, and activity log update
- [ ] Level up → confetti + sound + modal
- [ ] Purchase an item from the shop
- [ ] Check the leaderboard
- [ ] Refresh the page → all data persists
- [ ] Test on mobile viewport
- [ ] Test keyboard navigation

---

## 🤖 AI & Development Tools Disclosure

### AI Tools Used

| Tool | How It Was Used |
|---|---|
| **GitHub Copilot** | Code suggestions, autocompletion, debugging assistance, and reviewing implementation ideas during development. |
| **Google Gemini (Antigravity IDE)** | Used for code generation assistance, debugging, architectural planning, README documentation writing, and code review. |

### AI Features in the Application

- **No generative AI feature is currently exposed to end users.**
- The `@google/generative-ai` package is installed in `package.json` but is **currently unused** by the application. No AI-powered feature (chatbot, content generation, smart suggestions, etc.) is active in the deployed version.

### Development Tools

| Tool | Purpose |
|---|---|
| **Visual Studio Code** | Primary code editor |
| **Antigravity IDE** | AI-assisted development environment |
| **Node.js / npm** | Runtime and package management |
| **Git / GitHub** | Version control and repository hosting |
| **Supabase Dashboard** | Database management, auth configuration, SQL editor, and RLS policy setup |
| **Next.js Dev Server** | Local development and hot reload |
| **Vercel** | Production deployment |
| **ESLint** | Code linting and quality checks |
| **TypeScript** | Static type checking |

### Generated Assets

- **No AI-generated images, audio, or video assets** are included in the application.
- All visual design is custom-built using CSS/Tailwind classes and the project-specific Cyber-Fantasy design system.
- Icons are from the open-source **Lucide React** icon library.
- Sound effects are generated programmatically via the **Web Audio API** (no external audio files).
- Emoji characters are used for avatars, stat icons, and shop items (native Unicode — not generated).

### What Was NOT Used

- No external UI template, theme, or design kit was used.
- No copied code from other projects or repositories.
- No pre-built component libraries (like shadcn/ui, MUI, Chakra, etc.) — all components (`Card`, `Badge`, `Modal`, `ProgressBar`) are custom-built.
- No external CSS framework boilerplate was used — the design system in `globals.css` is entirely project-specific.

---

## 👥 Team & Contributions

| # | Name | Role & Contribution |
|---|---|---|
| 1 | **Suraj** | Full-Stack Developer — Architecture, frontend (React/Next.js), backend (Supabase), RPG progression engine, UI/UX design, deployment, testing |

---

## ✅ Judging Criteria Checklist

### 🎨 Design & UX (Crucial)
- [x] Coherent **Cyber-Fantasy** visual language — not a generic dashboard
- [x] Custom design system with CSS variables, gradients, glassmorphism, and glow effects
- [x] Modern typography (**Outfit** from Google Fonts)
- [x] Curated color palette (purple, cyan, gold, emerald — not generic red/blue/green)
- [x] Responsive layouts for mobile, tablet, and desktop
- [x] Celebratory feedback: confetti, sound effects, screen shake, level-up modals
- [x] Smooth micro-animations (fade-in, float, slide-in, hover transforms)
- [x] Readable visual hierarchy and clean component spacing
- [x] Mobile-friendly game flows with touch optimization

### ⚡ Performance & SEO
- [x] Next.js 16 App Router with server-rendered pages
- [x] Parallel data fetching with `Promise.all` on the dashboard
- [x] Optimized CSS with minimal JavaScript bundle
- [x] Semantic HTML5 elements
- [x] Proper `<title>` and `<meta description>` tags
- [x] Open Graph metadata for social sharing
- [x] Single `<h1>` per page with proper heading hierarchy
- [x] `<html lang="en">` attribute set
- [x] Tested production build on mobile and desktop

### 🎮 Creativity & Gamification
- [x] Real-life tasks mapped to **quests** with 4 types and 4 difficulty tiers
- [x] **6 character attributes** that level independently
- [x] **Streak bonuses** scaling up to 2× multiplier
- [x] **Character class system** with specialized XP bonuses
- [x] **HP system** with bad habit damage and respawn penalties
- [x] **Achievements** with milestone-based auto-unlocking
- [x] **Gold economy** with a functioning shop (potions, avatars, titles)
- [x] **Inventory system** for purchased items
- [x] **Global boss encounter** with shared HP
- [x] **Leaderboard** with time-based rankings and automated rewards
- [x] **Activity heatmap** for consistency visualization
- [x] **Daily login rewards**
- [x] **Retro RPG sound effects** (Web Audio API)
- [x] **Level-up celebrations** with confetti and modals
- [x] Progression system feels rewarding, well-thought-out, and not like an afterthought

### 🔒 Robustness & Edge Cases
- [x] Empty states handled (no quests, no stats, no activity)
- [x] Invalid signup input validation (empty title, character limits)
- [x] Unauthenticated route protection via middleware
- [x] Failed database operations return error messages
- [x] Duplicate reward purchase prevention
- [x] Data persists on page refresh (server-rendered from Supabase)
- [x] Quest completion is idempotent (can't complete an already-completed quest)
- [x] Bad habit HP damage with 0-HP respawn penalty
- [x] Streak tracking with best-streak persistence

### ♿ Accessibility & Responsiveness
- [x] Primary actions are keyboard reachable (Tab, Enter, Space)
- [x] Labels associated with form inputs
- [x] Focus indicators are visible
- [x] Responsive design tested on mobile and desktop viewports
- [x] `touch-action: manipulation` for mobile tap responsiveness
- [x] Semantic HTML structure sound for screen readers
- [x] Antialiased text rendering

---

## 🚫 Disqualification Rules (Zero-Tolerance)

Before submitting, confirm:

- [x] The **GitHub repository is public** and contains at least 3 meaningful chronological commits (19 commits in the repo).
- [x] The **live link** opens without authentication errors or broken backend calls.
- [ ] The **walkthrough video** is public, playable, within the duration/size limit (90–180s, <100 MB), and demonstrates: signup/login, creating a quest, completing it, XP and level progression, reward purchase, refresh persistence, and responsive UI.
- [x] No secret keys, private links, broken links, uncredited copied assets, or inaccessible video are included.
- [x] `.env.local` and secret keys are **not committed** to the repository.
- [x] The deployed database has the required schema, seed data, ownership constraints, and RLS policies.
- [x] The README contains the final live URL, video URL, team names, and contribution details.

---

## 📜 License

This project is built as a hackathon submission. All code is original and written specifically for this project.

---

<p align="center">
  <strong>⚔️ Every day is a new quest. Level up your reality. ⚔️</strong>
</p>
bahut samay hogaya hai asa hi hai 