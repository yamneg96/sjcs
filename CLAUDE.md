# Lumora Platform — Implementation Rules

`PROJECT_ARCHITECTURE_FINAL.md` is the single source of truth. If code and document disagree, stop and flag; do not silently diverge.

**Actual stack note:** the architecture document names NestJS/Next.js; the implemented stack is Express + TypeScript (`backend/`), Vite + React (`frontend/`), and Expo/React Native (`mobile/`). The architectural rules below apply unchanged to this stack.

## ADRs (binding)

- **ADR-001** — `react-native-executorch` is the ONLY local inference runtime. Never add llama.rn. The runtime is touched only by `mobile/modules/ai/engine/inference.ts`.
- **ADR-002** — Google ML Kit only via `@infinitered/react-native-mlkit`, only on mobile. The backend must never gain an ML Kit dependency or a raw-image OCR endpoint.
- **ADR-003** — No model names in feature code. Models come from the catalog (`backend/src/modules/mobile/model-catalog.model.ts`, served by `GET /api/mobile/models`) and the device registry (`documentDirectory/models/model-registry.json`). Adding/replacing a model is a data operation, never a code change.

## Boundaries

- Mobile features call **`AIEngine`** (`mobile/modules/ai/engine/ai.engine.ts`) only. Never import the inference adapter, ExecuTorch bindings, providers, or the cloud AI client (`mobile/api/ai.ts`) from feature/screen code.
- Backend modules call **`AIGateway`** (`backend/src/modules/ai/ai.gateway.ts`) only — new AI abilities are gateway services/providers, never endpoints that call vendors directly.
- Every AI request is wrapped by the **Educational Pipeline**: `buildEducationalInstruction()` on the backend, `buildEduContext()`/`buildLocalInstruction()` on mobile. Callers never assemble context ad hoc.
- Model lifecycle changes must keep `model-registry.json` atomic and crash-safe: files first, registry entry LAST; checksum mismatch never registers a model.
- Every AI response path must handle local-ready, cloud, and offline-fallback with honest UX copy (see `fallback.service.ts`).

## Conventions

- TypeScript strict everywhere; zod validation at all API edges; responses use the `{ success, data, message }` envelope (`sendSuccess`/`sendError`).
- Tenant-scoped collections carry `organizationId`; learner-owned data (learning events, knowledge profiles) is keyed by `userId` only and follows the student across schools.
- Mobile sync endpoints must be idempotent (client event UUIDs; server dedupes).
- Keep the APK budget (≤50 MB): no mobile dependency lands without a size check.
- Web styling follows `frontend/src/index.css` tokens; mobile follows `mobile/global.css` — do not introduce new color systems.
