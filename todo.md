# Call Analyzer TODO (Implementation Status)

## 1. Migration Status (BigQuery -> MongoDB)

- [x] Replace `bigqueryService` usage with `mongodbService`.
- [x] Move core call read/write flows to MongoDB models.
- [x] Update upload pipeline to persist transcript metadata in MongoDB.
- [x] Store analysis output in `analyzed_calls`.
- [x] Remove BigQuery references from runtime code paths.
- [ ] Add graceful shutdown handling for MongoDB and RabbitMQ connections.

## 2. Data Model and Validation

- [x] Define TypeScript interfaces for `CallTranscript`, `AnalyzedCall`, and `Agent` data.
- [x] Add core indexes (`call_id`, analysis lookup, score/category filters).
- [ ] Align schema naming fully (`created_at` vs `createdAt`) and document one canonical API shape.
- [ ] Enforce duplicate-key and validation error mapping with explicit HTTP responses.
- [ ] Revisit `Agent` schema/register flow mismatch (`email` and `department` requirements).

## 3. Worker and Pipeline Reliability

- [x] Use RabbitMQ queue (`call_queue`) for async upload -> processing.
- [x] Connect worker startup in app bootstrap.
- [x] Add RabbitMQ connection retry.
- [ ] Add job retry policy/backoff strategy and dead-letter queue.
- [ ] Avoid marking transcript `analyzed: true` before analysis insert succeeds.
- [ ] Add worker idempotency protection for duplicate queue messages.

## 4. Environment and Config

- [x] Centralize env validation in `backend/utils/Env.ts`.
- [x] Use MongoDB via `DB_URL`.
- [ ] Update `backend/.env.example` to remove old GCP/BigQuery-era variables.
- [ ] Document separate local vs Docker endpoint values for service URLs.

## 5. API and Product

- [x] Auth endpoints (`/auth/register`, `/auth/login`).
- [x] Upload endpoint (`/upload`) with JWT + multipart audio.
- [x] Calls endpoints (`/calls`, `/calls/:id`).
- [ ] Add pagination metadata and cursor-based paging for large datasets.
- [ ] Add analysis-only endpoint wiring if needed (controller has method but route not exposed).
- [ ] Add endpoint-level request validation (zod/joi/class-validator).

## 6. Testing

- [ ] Unit tests for services (`analysisService`, `mongodbService`, `agentService`).
- [ ] Integration tests for auth, upload, and call retrieval routes.
- [ ] Worker pipeline integration test (queue -> transcript -> analysis persistence).
- [ ] Smoke test script for local readiness checks.

## 7. Documentation

- [x] Update root `Readme.md` to match current MongoDB + RabbitMQ + Whisper + Ollama architecture.
- [ ] Add `backend/README.md` focused on backend-only setup and troubleshooting.
- [ ] Document operational runbook (model pull, queue health, common failure modes).

## 8. Cleanup

- [ ] Remove unused cloud SDK dependencies from `backend/package.json` if no longer required.
- [ ] Standardize import paths with `.js` extension for ESM consistency.
- [ ] Review and remove stale comments/log messages from earlier architecture.
