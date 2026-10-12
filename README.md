# beautyup-shop

Monorepo for the BeautyUp Enterprise website (Thai + English), its admin panel and API.

| App | Path | Stack | Dev URL |
|---|---|---|---|
| Website | `apps/web` | Next.js 16 (Cache Components) + Tailwind 4 | http://localhost:3000 (`/th`, `/en`) |
| Admin panel | `apps/admin` | Next.js 16 + Tailwind 4 | http://localhost:3001 |
| API | `apps/api` | NestJS 12 + Prisma 7 + PostgreSQL | http://localhost:4000/api (Swagger: `/docs`) |
| Shared contracts | `packages/types` | zod schemas + types used by all apps | – |

```
apps/web  ──(public API, cached)──►  apps/api  ◄──(admin API, JWT)──  apps/admin
   ▲                                      │                              │
   └──────── POST /api/revalidate ◄───────┼──────────────────────────────┘
                                          ▼
                                     PostgreSQL
```

## Requirements

- Node.js 20+ and pnpm 10+
- Docker Desktop (PostgreSQL runs in a container on port **5433**)

## First-time setup

```bash
pnpm install
pnpm db:up                                   # start PostgreSQL
cp apps/api/.env.example apps/api/.env       # then set JWT_SECRET
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
#   REVALIDATE_SECRET must be the same value in web and admin
pnpm db:migrate                              # create tables
pnpm db:seed                                 # content from the current site + first admin
```

`db:seed` prints the first admin's email and password (or uses `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` from `apps/api/.env`). Change the password after logging in.

## Daily development

```bash
pnpm db:up
pnpm dev          # api, web and admin together
```

`pnpm --filter @beautyup/web dev` runs a single app. `pnpm db:studio` opens Prisma Studio.

> **Note:** the website reads content from the API, so the API must be running for
> `apps/web` to build (`next build` prerenders `/th` and `/en` pages).

## Languages

- Every URL has a language prefix: `/th/...` and `/en/...`. Paths without one
  (e.g. `/products`) redirect using the browser's language, Thai by default.
- **UI text** (buttons, headings) lives in `apps/web/src/i18n/th.ts` and `en.ts`.
- **Content** (products, posts, pages, settings) is stored as `{ th, en }` and edited in
  the admin panel with the ภาษาไทย / English tab. Missing English falls back to Thai.

## How content updates reach the website

The website caches API data (`'use cache'`, tag `content`). After every save in the admin
panel, the admin calls `POST {WEB_URL}/api/revalidate` with `REVALIDATE_SECRET`, so changes
show on the next page view without a redeploy.

## Uploaded files

Images and PDFs uploaded in the admin panel are stored on the API server's disk in
`apps/api/uploads/` and served at `{API_PUBLIC_URL}/uploads/...`. In production:

- keep `uploads/` on a persistent volume (it must survive redeploys),
- back it up together with the database,
- set `API_PUBLIC_URL` to the public API domain so saved image links are correct.

## Admin roles

| Role | Can do |
|---|---|
| ADMIN | Everything, including site settings and admin users |
| STAFF | Edit content, answer the inquiries inbox |

## Useful scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps (API must be running for the website) |
| `pnpm lint` | Lint all apps |
| `pnpm db:migrate` | Apply Prisma migrations |
| `pnpm db:seed` | Seed content and the first admin (safe to re-run) |
| `pnpm db:studio` | Open Prisma Studio |

## Docs

- [docs/site-menu.md](docs/site-menu.md): pages and menus of the current Wix site, and decisions
