# beautyup-shop

Monorepo for the BeautyUp online store.

| App | Path | Stack | Dev URL |
|---|---|---|---|
| Storefront | `apps/web` | Next.js + Tailwind | http://localhost:3000 |
| Admin Panel | `apps/admin` | Next.js + Tailwind | http://localhost:3001 |
| API | `apps/api` | NestJS + Prisma | http://localhost:4000/api (docs: `/docs`) |

Shared code lives in `packages/` (`@beautyup/types`).

## Requirements

- Node.js 20+
- pnpm 10+
- Docker Desktop (for PostgreSQL)

## Getting started

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm db:up          # start PostgreSQL on localhost:5433
pnpm db:migrate     # apply Prisma migrations
pnpm dev            # run web, admin and api
```

Health check: http://localhost:4000/api/health

## Useful scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm --filter @beautyup/web dev` | Run a single app |
