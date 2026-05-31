# CarAdvisor — AI-Powered Car Buying Advisor

> **CarDekho Group · AI-Native Software Engineer Assignment**

A full-stack web app that helps confused Indian car buyers go from _"I don't know what to buy"_ to _"I'm confident about my shortlist"_ — through a natural-language chat interface powered by Claude.

---

## Live Demo

> _Deploy using the steps below to get a live URL._

---

## Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/saurabhsrb23/cardekho-advisor.git
cd cardekho-advisor

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env.local
# Edit .env.local — add your ANTHROPIC_API_KEY

# 4. Setup the database
cp .env.example .env          # Prisma reads .env, Next.js reads .env.local
npm run db:push               # creates prisma/dev.db (SQLite)
npm run db:seed               # seeds 50 Indian market cars

# 5. Run
npm run dev                   # → http://localhost:3000
```

> **Node.js v18+** required. If `node` is not in PATH on Windows, prefix commands with `$env:PATH = "C:\Program Files\nodejs\;" + $env:PATH`

---

## What I Built and Why

### The Problem
Car buyers on platforms like CarDekho face _decision paralysis_. Hundreds of variants, no easy way to filter for "what fits my life." Filter UIs require buyers to already know what they want — which they don't.

### The Solution
A conversational AI advisor. The buyer describes their situation in plain English:

> _"Family of 4, mostly city driving, budget ₹12 lakhs, don't want diesel"_

Claude reads the full 50-car dataset as context, reasons about fit, and returns a **ranked shortlist of 3–5 cars** with a one-line justification per car — exactly how a knowledgeable friend would answer.

The buyer can then **refine** ("only automatic please"), **save cars** to a shortlist, and **compare them side-by-side** on a dedicated comparison page.

### What I Deliberately Cut

| Cut | Reason |
|---|---|
| User authentication | Adds 30 min, zero user-facing value in a demo |
| Complex filter UI | The AI *is* the filter — redundant |
| EMI calculator | Nice-to-have, doesn't move the core "confused → confident" needle |
| Dealer locator / test drive booking | Integration work, not core UX |
| Car image galleries | No public image API in scope; placeholder images distract |
| Review submission system | Requires moderation pipeline; seed pros/cons cover this |
| Pagination / search-as-you-type | Claude handles retrieval — no browse page needed |

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack in one repo, API routes, zero-config Vercel deploy, TypeScript native |
| **Language** | TypeScript (strict) | Catches bugs before runtime; better AI tool output to review |
| **Styling** | Tailwind CSS | Fastest path to a decent-looking UI; no context-switching to CSS files |
| **Database (dev)** | SQLite via Prisma | Zero config, single file, works offline, swap via one env var |
| **Database (prod)** | PostgreSQL on Neon | Free serverless tier, Prisma-native, works on Vercel |
| **ORM** | Prisma | Type-safe queries, migrations, seed script support |
| **AI** | Anthropic Claude `claude-sonnet-4-6` | Structured output via `tool_choice: "any"` — gets typed `{reply, recommendations[]}` in one API call without brittle JSON parsing |
| **Deployment** | Vercel | Zero-config for Next.js, env var management, instant preview URLs |

### Why Claude over OpenAI
Claude's tool use with `tool_choice: "any"` forces the model to always call the `recommend_cars` tool — meaning every response is typed and structured. No regex parsing of markdown, no hallucinated free-text car names. The 50-car dataset (≈10k tokens) fits in the system prompt, so no vector database or retrieval step is needed.

---

## Architecture

```
app/
├── page.tsx                  # Chat page (renders <ChatInterface />)
├── shortlist/page.tsx        # Comparison page
├── api/
│   ├── chat/route.ts         # POST — Claude pipeline
│   ├── session/route.ts      # GET  — create/restore session
│   ├── cars/route.ts         # GET  — car data
│   └── shortlist/route.ts   # GET + POST — save/remove cars

components/
├── chat/                     # ChatInterface, MessageThread, ChatInput, etc.
├── cars/                     # CarCard, RecommendationGrid
├── shortlist/                # ComparisonTable, EmptyState
└── ui/                       # LoadingDots

lib/
├── claude.ts                 # chatWithClaude() — tool use, system prompt, history
├── cars.ts                   # getAllCars(), getCarsByIds(), toCompactContext()
└── db.ts                     # Prisma singleton

prisma/
├── schema.prisma             # Car, Session, Message, ShortlistItem
└── seed.ts                   # 50 real Indian market cars
```

### Chat pipeline (`POST /api/chat`)
```
User message
  → validate input
  → upsert session
  → load last 40 DB messages (Claude uses last 10 turns)
  → fetch all 50 cars
  → call Claude (tool_choice: "any") with system prompt + history + car dataset
  → validate returned carIds against DB  ← hallucination guard
  → persist user + assistant messages
  → return { reply, recommendations[] }
```

---

## AI Tool Usage

### What I delegated to Claude Code
- Project scaffold (Next.js boilerplate, tsconfig, tailwind config)
- Prisma schema and seed data for 50 cars
- Component stubs (ChatInterface, CarCard, ComparisonTable, etc.)
- API route structure and TypeScript types
- Test commands and verification scripts

### What I did manually
- **System prompt and tool schema** — this is core product logic. Getting the prompt rules right (force tool use, handle vague queries, handle refinements, handle no-match) required iteration that an AI tool can't drive autonomously.
- **Architecture decisions** — choosing `tool_choice: "any"` over a text response, deciding to put all car data in the system prompt vs. a retrieval step, choosing localStorage as shortlist source of truth.
- **Reviewing every AI-generated component** before moving on — the CarCard safety stars rendering, the ComparisonTable sticky column, the session restore flow all needed manual fixes.
- **Debugging** — ESLint 10 vs. 9 peer conflict, Next.js 16 removing `next lint`, `uuid` v14 API change, Prisma needing `.env` not `.env.local`.

### Where AI tools helped most
- **Seed data generation** — 50 cars with accurate specs, prices, NCAP ratings, pros/cons in minutes. Would have taken 2 hours manually.
- **Component boilerplate** — the ComparisonTable spec rows, CarCard layout, responsive grid were all first-pass-good.
- **TypeScript type definitions** — the full `types/index.ts` contract was generated correctly in one shot.

### Where they got in the way
- AI tools assumed `next lint` still existed in Next.js 16 (it doesn't). Had to manually debug and switch to `eslint .` with flat config.
- Generated imports for `@types/uuid` that conflicted with uuid v14's built-in types.
- Early CarCard had `brand-100` Tailwind class that wasn't in the config — silent failure until visual test.

---

## Database Schema

```
Car            — 50 seeded, read-only at runtime
Session        — anonymous UUID session per browser
Message        — full conversation history per session
ShortlistItem  — cars saved by a session (unique per session+car)
```

---

## Deployment to Vercel

The app uses SQLite locally and PostgreSQL (Neon free tier) on Vercel.

### Step 1 — Create a Neon database
1. Go to [neon.tech](https://neon.tech) → create a free account
2. Create a new project → copy the **connection string** (looks like `postgresql://user:pass@host/dbname?sslmode=require`)

### Step 2 — Switch Prisma to PostgreSQL
```bash
# In prisma/schema.prisma, change:
#   provider = "sqlite"
# to:
#   provider = "postgresql"
```
Then push the schema and seed to Neon:
```bash
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx prisma db seed
```

### Step 3 — Deploy to Vercel
```bash
npm install -g vercel
vercel                          # follow prompts, link to your GitHub repo
```

### Step 4 — Set environment variables in Vercel
In the Vercel dashboard → Project → Settings → Environment Variables:

| Key | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` from [console.anthropic.com](https://console.anthropic.com) |
| `DATABASE_URL` | Your Neon connection string |

### Step 5 — Redeploy
```bash
vercel --prod
```

---

## If I Had 4 More Hours

1. **Streaming responses** — use `@anthropic-ai/sdk` streaming with Server-Sent Events so the reply types out word-by-word instead of appearing all at once. Biggest perceived-performance win.
2. **Car images** — source from a CDN or placeholder service; the comparison table looks sparse without visuals.
3. **"Why not X?"** — let the user ask "why not Creta?" and have Claude explain why it wasn't recommended for their stated needs. Builds buyer confidence.
4. **EMI calculator** — show monthly EMI on each CarCard based on an assumed 20% down, 7-year loan. Most Indian buyers think in EMIs, not ex-showroom price.
5. **Richer seed data** — expand to 200+ cars including more variants, genuine NCAP data, and long-term ownership cost per km.

---

## Scripts Reference

```bash
npm run dev          # start dev server (http://localhost:3000)
npm run build        # production build
npm run lint         # ESLint check
npm run format       # Prettier format
npm run db:push      # sync Prisma schema → DB
npm run db:seed      # seed 50 cars
npm run db:studio    # Prisma Studio GUI
npm run db:generate  # regenerate Prisma Client
```
