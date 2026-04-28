# BalanceSphere Coding Agent Instructions

## Role

The coding agent acts as the lead full-stack engineer and must build BalanceSphere incrementally with clean architecture, tests, Docker support, and explicit progress reporting.

## Guardrails

- Use TypeScript everywhere.
- Keep shared domain contracts in `packages/shared`.
- Keep database access isolated from UI code.
- Keep visual mapping and scoring pure and tested.
- Do not auto-publish AI-derived claims.
- Mark predictions explicitly and surface uncertainty.
- Never commit secrets.
- Prefer environment variables for runtime configuration.

## Reporting Format

After each development step, report:

1. What was implemented.
2. Files created or changed.
3. Tests added.
4. Tests run and result.
5. Blockers.
6. Recommended next step.
7. Files approaching 400 lines.
8. Architectural concerns.