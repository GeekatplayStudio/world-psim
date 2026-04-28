# BalanceSphere Functional Specification

## Actor Model

- Actors may be countries, governments, militaries, proxy groups, regions, international organizations, strategic assets, or unknown entities.
- Actor visual size derives from composite power using a softened square-root scale.
- Actor metadata includes confidence, source count, and time-aware metrics.

## Relationship Model

- Relationships are typed, directional, weighted, and time-sensitive.
- Relationship snapshots preserve strength, sentiment, volatility, confidence, source count, and whether a value is predictive.
- UI must visually distinguish conflict, alliance, mediation, trade, proxy influence, and uncertain or predictive states.

## Timeline and Review

- Timeline playback, scrub, and event markers are core MVP behaviors.
- Draft claims require human review before they affect the official graph.
- Sources remain stored independently from extracted claims.

## Placeholder Routes in Phase 0

- `/` provides the graph landing shell.
- `/admin` provides the future editing dashboard.
- `/admin/claims` provides the claim review shell.
- `/sources` provides the source intake shell.
- `/scenarios` provides the scenario lab shell.