# BalanceSphere

BalanceSphere is a TypeScript monorepo for a 3D geopolitical relationship visualization and scenario simulation application. Phase 0 establishes the workspace, shared domain package, API and worker skeletons, Prisma schema foundation, Docker Compose, CI, and the initial Next.js route shell.

## Workspace Layout

```text
apps/
  web/        Next.js app shell and placeholder routes
  api/        Fastify service with health endpoint
  worker/     Placeholder background worker
packages/
  shared/     Shared types, schemas, and scoring helpers
  database/   Prisma schema and seed entry point
docs/         Product and technical documentation
```

## Runtime

- Docker with Compose support is the primary development runtime.
- Node.js and pnpm are only needed if you want to run host-side lint, typecheck, or test commands directly.

## Requirements

- Docker with Compose support
- Node.js 22+ optional
- pnpm 9+ optional

## Setup

```bash
docker compose up --build
docker compose config
```

## Development Commands

```bash
pnpm dev
pnpm docker:down
pnpm docker:logs
```

## Optional Host Validation

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm db:generate
pnpm db:seed
```

## Initial Routes

- `/` main graph landing shell
- `/admin` admin dashboard placeholder
- `/admin/claims` claim review queue placeholder
- `/sources` source management placeholder
- `/scenarios` scenario management placeholder

## Current Phase Boundary

Phase 0 intentionally stops before seeded geopolitical data, ingestion, AI extraction, graph rendering, or prediction logic. Those land in later phases after the workspace foundation is stable.