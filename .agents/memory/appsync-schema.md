---
name: AppSync schema source & analytics contract (mobile app)
description: Where to find the canonical AppSync schema for the AutoNXT mobile app, and an unconfirmed getAnalytics arg
---

# AppSync schema source (artifacts/mobile)

- The AppSync GraphQL API is **userPool-only and cannot be introspected** without login credentials.
- The canonical schema is the user-uploaded codegen in `attached_assets/`: `API_*.ts` (types/enums), `queries_*.ts`, `mutations_*.ts`. When you need a field/query/enum name, grep these files — they are the source of truth.
- `lib/appsync.ts` hand-writes a subset of these queries (the schema has dirty enum data that breaks AppSync serialization, e.g. complaint `problemType` is deliberately omitted), so add only the fields you need and map raw → view models there.

## getAnalytics (trips / charges)

- Query `getAnalytics(tractorID: ID!, PeriodType: PeriodType!, timeSegment: String!)` returns aggregate buckets (`trips`, `charges`, `standby`, `cumulative`), each a `CumulativeM` with `totalCount/totalDuration/totalDistance/totalKwhDelivered/totalKwhCharged/totalCostSavings/totalTreesSaved/totalDisconnectCount`.
- `PeriodType` enum: DAILY | WEEKLY | MONTHLY | YEARLY | GLOBAL.
- **Unconfirmed:** the `timeSegment` value format is NOT documented in the schema. The detail screen calls it with `PeriodType=GLOBAL, timeSegment='GLOBAL'` as a best-guess for lifetime totals. If Trips/Charge tabs always show the error state, this guess is wrong — confirm the correct timeSegment token with the backend.
- **Also unconfirmed:** `totalDuration` unit is assumed to be **seconds** (formatted as h/m in the UI).

**Why:** these are external-contract assumptions a future agent can't verify from the code alone.
**How to apply:** if analytics tabs misbehave, suspect `timeSegment`/duration-unit assumptions first, not the query wiring.
