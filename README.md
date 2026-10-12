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
pnpm dev          # starts PostgreSQL if needed, then api, web and admin
```

Open Docker Desktop first. `pnpm dev` checks the database (and tells you if Docker is
not running), and the website waits for the API before it starts.

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

## Website members (email + Google)

Visitors can sign up / log in at `/th/register` and `/th/login` with email + password or
Google, and edit their profile at `/th/account`. Members are stored separately from admin
users (their tokens cannot call admin APIs). Staff see them in Admin > สมาชิกเว็บไซต์.

To enable the Google button:

1. Google Cloud Console → APIs & Services → Credentials → **Create OAuth client ID** →
   type **Web application**.
2. **Authorized JavaScript origins**: `http://localhost:3000` (dev) and the website's
   public URL, e.g. `https://<domain>`. No redirect URI is needed.
3. Put the client ID in `apps/api/.env` (`GOOGLE_CLIENT_ID`) and
   `apps/web/.env.local` (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`), then restart / rebuild the web app.

Until then the page shows "Google sign-in is not available yet" and email sign-up works.

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

## Deploy with PM2

[`ecosystem.config.cjs`](ecosystem.config.cjs) runs three apps. The names are prefixed
`beautyup-shop-` so they never clash with the older `beautyup-api` / `beautyup-admin`
processes already running on the server.

### Ports on beautyup-server

The server already uses 3000-3003, 3100, 5432-5434, 5050 and 80/443 (Caddy). This project
uses:

| | Port | Reachable from |
|---|---|---|
| `beautyup-shop-api` | 4200 | localhost only (via Caddy) |
| `beautyup-shop-web` | 3200 | localhost only (via Caddy) |
| `beautyup-shop-admin` | 3201 | localhost only (via Caddy) |
| PostgreSQL (docker) | 5435 | localhost only |

These live in the root `.env` on the server (`cp .env.server.example .env`), which
`ecosystem.config.cjs`, `pnpm ports:check` and docker compose all read. Local development
keeps the defaults (4000 / 3000 / 3001 / 5433).

**Always run `pnpm ports:check` before starting.** It fails if a PM2 name is used by
another project or a port is taken, and names the process holding it.

### Env files on the server

| File | Values for the server |
|---|---|
| `.env` (root) | from `.env.server.example`: ports, `HOST=127.0.0.1`, `DB_PASSWORD` |
| `apps/api/.env` | `DATABASE_URL=postgresql://beautyup:<DB_PASSWORD>@127.0.0.1:5435/beautyup_shop`, `JWT_SECRET`, `API_PUBLIC_URL=https://api.<domain>`, `CORS_ORIGINS=https://<domain>,https://admin.<domain>` |
| `apps/web/.env.local` | `API_URL=http://127.0.0.1:4200/api`, `REVALIDATE_SECRET` |
| `apps/admin/.env.local` | `API_URL=http://127.0.0.1:4200/api`, `WEB_URL=http://127.0.0.1:3200`, same `REVALIDATE_SECRET` |

### First deploy

```bash
cp .env.server.example .env                    # then set DB_PASSWORD
pnpm install --frozen-lockfile
pnpm db:up                                     # PostgreSQL on 127.0.0.1:5435
pnpm ports:check
pnpm --filter @beautyup/types build
pnpm --filter @beautyup/api build
pnpm --filter @beautyup/api exec prisma migrate deploy
pnpm db:seed                                   # first time only
pm2 start ecosystem.config.cjs --only beautyup-shop-api
# The website prerenders pages from the API, so build it while the API is running
pnpm --filter @beautyup/web build
pnpm --filter @beautyup/admin build
pm2 start ecosystem.config.cjs --only beautyup-shop-web,beautyup-shop-admin
pm2 save                                       # keep the list for reboots
```

Later deploys: `git pull && pnpm install --frozen-lockfile`, rebuild the API and
`pm2 reload beautyup-shop-api`, then build web/admin and
`pm2 reload beautyup-shop-web beautyup-shop-admin`.

> Never run `pm2 reload all` / `pm2 restart all` on this server: other projects share it.

### Caddy

The server already runs Caddy on 80/443 (automatic HTTPS). Add to the Caddyfile and
`systemctl reload caddy`:

```caddy
<domain>, www.<domain> {
	reverse_proxy 127.0.0.1:3200
}

admin.<domain> {
	reverse_proxy 127.0.0.1:3201
}

api.<domain> {
	reverse_proxy 127.0.0.1:4200
}
```

## Docs

- [docs/site-menu.md](docs/site-menu.md): pages and menus of the current Wix site, and decisions
