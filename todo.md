# Call Analyzer TODO (Post BigQuery -> MongoDB Switch)

## 1. Core Backend Migration

- [ ] Replace `backend/services/bigqueryService.ts` with `mongodbService.ts` (or `callRepository.ts`) using the MongoDB Node driver or Mongoose.
- [ ] Update all imports/usages in controllers/services to stop referencing `bigqueryService`.
- [ ] Add MongoDB connection bootstrap with startup validation and graceful shutdown handling.
- [ ] Move from SQL/table operations to MongoDB collection operations:
  - `call_transcripts` collection
  - `analyzed_calls` collection
  - `agents` collection

## 2. Data Model and Indexing

- [ ] Define TypeScript-backed MongoDB schemas/interfaces for:
  - `CallTranscript`
  - `AnalyzedCall`
  - `Agent`
- [ ] Standardize IDs (`call_id`, `agent_id`) and map `_id` handling.
- [ ] Add indexes for query performance:
  - `call_transcripts.call_id` (unique)
  - `call_transcripts.agent_id`
  - `call_transcripts.created_at`
  - `analyzed_calls.call_id` (unique)
- [ ] Enforce validation rules (required fields, score range, timestamps).

## 3. API and Service Refactor

- [ ] Update `backend/controllers/callsController.ts` to use Mongo-backed methods.
- [ ] Ensure pagination strategy works with MongoDB (`limit`, optional cursor/skip).
- [ ] Handle not-found and duplicate-key errors with clear API responses.
- [ ] Keep route contracts stable so frontend changes are minimized.

## 4. Upload -> Transcribe -> Analyze Pipeline

- [ ] Confirm upload flow writes transcript records to MongoDB instead of BigQuery fallback arrays.
- [ ] Update any worker/cron logic to query unanalyzed calls from MongoDB (`analyzed: false`).
- [ ] Persist Gemini/analysis output into `analyzed_calls` and mark transcript as analyzed.
- [ ] Add retry/error states for failed transcription/analysis jobs.

## 5. Environment and Config

- [ ] Add required MongoDB env vars (example):
  - `MONGODB_URI`
  - `MONGODB_DB_NAME`
  - optional collection names
- [ ] Remove or deprecate BigQuery-only env vars where no longer used.
- [ ] Update `backend/utils/Env.ts` validation to include MongoDB config.

## 6. Documentation Updates

- [ ] Fix inconsistencies in `Readme.md`:
  - Replace BigQuery flow blocks with MongoDB flow end-to-end.
  - Replace "Database Schema (BigQuery)" with MongoDB collection schema.
  - Update processing workflow text that still says "Saves transcript in BigQuery".
- [ ] Add a short "MongoDB local setup" section in `backend/README.md`.
- [ ] Document migration notes if legacy BigQuery data still exists.

## 7. Testing and Verification

- [ ] Add unit tests for Mongo repository/service methods.
- [ ] Add integration tests for:
  - `GET /calls`
  - `GET /calls/:id`
  - upload -> transcript persistence -> analysis persistence flow
- [ ] Add one smoke test script to verify DB connection + read/write.
- [ ] Run regression checks to ensure existing auth/upload APIs still behave the same.

## 8. Cleanup and Naming

- [ ] Rename files/classes still containing "BigQuery" naming to avoid confusion.
- [ ] Remove dead fallback logic that stores records only in in-memory arrays.
- [ ] Verify log messages and comments consistently reference MongoDB.
- [ ] Optional: add a repository abstraction to make future DB swaps easier.
