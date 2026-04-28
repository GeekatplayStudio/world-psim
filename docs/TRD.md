# BalanceSphere Technical Requirements

## Recommended Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui-ready structure, React Three Fiber, Zustand, TanStack Query.
- Backend: Fastify, TypeScript, Prisma, PostgreSQL, Redis, BullMQ, Zod, OpenAPI.
- Data processing: connector abstraction, LLM extraction adapter, review queue, optional pgvector later.
- Testing: Vitest, React Testing Library, Playwright, MSW, Prisma test database.
- DevOps: Docker Compose, GitHub Actions, strict TypeScript, environment validation.

## Phase 0 Deliverables

- Monorepo layout with `apps/web`, `apps/api`, `apps/worker`, `packages/shared`, and `packages/database`.
- Root lint, typecheck, test, and database utility commands.
- Initial Fastify health endpoint.
- Shared types, schemas, and pure scoring helpers.
- Prisma schema baseline and seed entry point.
- Docker Compose definition for web, api, worker, postgres, and redis.
- CI workflow for lint, typecheck, test, and compose validation.

## Non-Functional Constraints

- Use strict TypeScript across the repository.
- Keep modules under 500 lines; warn at 400 lines.
- Avoid `any` unless there is a concrete justification.
- Keep rendering and scoring logic pure and testable.
- Keep external ingestion and AI publication disabled until later phases.