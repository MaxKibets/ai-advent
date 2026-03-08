# CLAUDE.md — Agent Instructions

## Project Overview

**AI Advent** — Next.js 16 application with Anthropic Claude integration. Provides a streaming chat interface powered by the Anthropic SDK.

## Tech Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript 5** (strict mode)
- **Tailwind CSS 4**, **shadcn/ui**, **Radix UI**
- **@anthropic-ai/sdk** — AI integration
- **Biome** — linting, formatting, import sorting
- **Vitest** + **React Testing Library** — testing

## Architecture: Feature-Sliced Design (FSD)

The project uses [FSD](https://feature-sliced.design/). Code lives in `src/`, routing only in `app/`.

### Layer hierarchy (top → bottom):

```
app/        ← global providers, styles, config
views/      ← page-level business logic (replaces FSD "pages" to avoid clash with Next.js)
widgets/    ← large composite UI blocks
features/   ← user-facing interactions
entities/   ← business domain models
shared/     ← UI kit, utilities, API client, config
```

**Strict import rule:** each layer may only import from layers **strictly below** it. Upward and same-layer (cross-slice) imports are both forbidden.

```
┌─────────────────┐
│      app        │  ← Can import: views, widgets, features, entities, shared
├─────────────────┤
│     views       │  ← Can import: widgets, features, entities, shared
├─────────────────┤
│    widgets      │  ← Can import: features, entities, shared
├─────────────────┤
│    features     │  ← Can import: entities, shared
├─────────────────┤
│    entities     │  ← Can import: shared only
├─────────────────┤
│     shared      │  ← Cannot import from any FSD layer
└─────────────────┘
```

### Slices and Segments

**Slices** — domain partitions inside a layer (e.g., `features/auth`, `entities/user`).
- `app` and `shared` have **no slices** — they contain segments directly.
- All other layers have slices; each slice is independent and cannot import from sibling slices.

**Segments** — purpose-based folders inside a slice:

| Segment | Purpose |
|---------|---------|
| `ui/` | React components |
| `model/` | Types, hooks, business logic |
| `api/` | Data fetching, external integrations |
| `lib/` | Slice-specific utilities |
| `config/` | Constants, feature flags |

**Public API:** every slice exports only through its `index.ts`. Never deep-import from internals:

```ts
// ✅ Correct
import { AnthropicAgent } from "@/entities/agent";

// ❌ Wrong — deep import bypasses public API
import { AnthropicAgent } from "@/entities/agent/model/AnthropicAgent";
```

### Directory layout

```
app/                    # Next.js routing only (layout, pages, API routes)
  api/chat/route.ts     # Streaming chat POST endpoint

src/
  app/                  # FSD app layer (providers, styles, fonts)
  views/                # FSD views layer
  widgets/              # FSD widgets layer
  features/             # FSD features layer
  entities/             # FSD entities layer
    agent/              # AnthropicAgent entity
  shared/               # FSD shared layer
    ui/                 # shadcn/ui components
    lib/                # utilities (cn)
```

## Import Aliases

Defined in `tsconfig.json`:

```
@/*         → src/*
@/app/*     → src/app/*
@/views/*   → src/views/*
@/widgets/* → src/widgets/*
@/features/* → src/features/*
@/entities/* → src/entities/*
@/shared/*  → src/shared/*
```

Always use these aliases — never use relative paths that cross layer boundaries.

## Code Style

Enforced by **Biome** (`biome.json`):

- Indentation: **2 spaces**
- Line width: **80 characters**
- Quotes: **double**
- Trailing commas: **all**
- Semicolons: **always**

Run before committing:

```bash
npm run lint      # lint + format + sort imports (auto-fix)
npm run check     # check only, no writes
```

## Key Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run test      # watch mode
npm run test:run  # run once
```

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## Core Patterns

### Adding a new entity

Create under `src/entities/<name>/`:
- `model/` — types, business logic
- `api/` — CRUD operations, data fetching
- `ui/` — entity-specific components
- `index.ts` — public API (barrel export, only export what consumers need)

### Adding a new feature

Create under `src/features/<name>/`:
- `model/` — hooks, state, types
- `api/` — feature-specific API calls
- `ui/` — feature components
- `lib/` — feature-specific utilities (optional)
- `index.ts` — public API

### API routes

Live in `app/api/`. Use `AnthropicAgent` from `@/entities/agent` for AI calls. Support streaming via `ReadableStream`.

### Default AI model

`claude-sonnet-4-6` — defined in `src/entities/agent/model/types.ts` as `DEFAULT_AGENT_CONFIG`.

## What NOT to Do

- Do not import **upward** in the FSD hierarchy (e.g., `features` must not import from `views` or `widgets`)
- Do not import **across slices** of the same layer (e.g., `features/auth` must not import from `features/chat`)
- Do not **deep-import** from a slice — always import from its `index.ts` public API
- Do not add business logic to `app/` routing files (Next.js routing layer)
- Do not skip `npm run lint` before committing
- Do not store secrets in source files — use `.env.local`
- Do not use relative cross-layer imports — always use `@/*` aliases
