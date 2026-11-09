# ShopBoard Next.js foundation design

Status: Approved for foundation initialization on 2026-11-09. Full store feature migration remains outside this delivery.

Date: 2026-11-09

## Intent

Prepare this repository for rebuilding the existing ShopBoard store with Next.js App Router, TypeScript, and shadcn/ui. Keep the useful feature boundaries and engineering discipline from the React project while adopting Next.js routing and server rendering.

The shared class API is read-only for this project. Product creation, editing, deletion, cart changes, comments, and demo checkout must never modify that API. Browser-only changes remain local to the visitor.

This document records product scope, data contracts, and architectural decisions. Engineering rules belong in `AGENTS.md`; setup instructions and the implemented component tree belong in `README.md`. No duplicate rules file is required.

## Current state

- This repository uses Next.js App Router, React, strict TypeScript, Tailwind CSS v4 with PostCSS, and Next.js ESLint configuration. The existing project was reused rather than overwritten by a generator.
- Application routes live in `src/app/`. The home route is a ShopBoard holding page using a shared shadcn/ui Badge. Store features have not been migrated here.
- `AGENTS.md` contains the requested engineering and mentoring guidelines and the Next.js conventions. `CLAUDE.md` does not exist and is not required.
- Prettier, Husky, lint-staged, LF text conventions, and the complete Vercel project skills are configured. Unused Next.js starter SVGs and the default favicon have been removed. No `public/` directory is needed until the store has static assets.
- The original project documents a catalog, filters, product details, cart, checkout, demo administration, category management, local comments, and notifications. These are reference requirements, not evidence that those features exist in this repository.

Reference: [original ShopBoard repository](https://github.com/ammar08s/Shopboard_React), including its [README](https://github.com/ammar08s/Shopboard_React/blob/main/README.md) and [product requirements](https://github.com/ammar08s/Shopboard_React/blob/main/design.md).

## Approaches considered

| Approach                  | Benefits                                                                                                                                                                                | Tradeoffs                                                                                           | Decision              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------- |
| Next.js-native foundation | Use App Router, server-rendered pages and API reads, and focused Client Components for browser interaction. Fits the chosen stack and provides a clear foundation for learning Next.js. | Requires adapting the old router, data ownership, loading boundaries, and browser storage behavior. | Selected by the user. |
| Client-first migration    | Keep most of the existing React rendering and data-loading structure inside Next.js Client Components.                                                                                  | Less initial restructuring, but retains more client JavaScript and much of the old architecture.    | Not selected.         |

## Scope of this initialization

The first delivery is a working, verified foundation. Full feature migration is a later task. Approval of this document authorizes only the initialization described in this section; the later sections constrain future migrations without authorizing them now.

### Included

1. Align the remaining legacy rules in `AGENTS.md` with Next.js and shadcn/ui while preserving the requested engineering, workflow, and mentoring guidelines. Keep one authoritative rules file.
2. Move application source into `src/`, with one active App Router at `src/app/` and an `@/*` alias targeting `src/*`.
3. Configure shadcn/ui in the existing application, including `components.json`, theme tokens, class merging, and the smallest set of primitives actually used by the starter page. Preserve upstream license attribution.
4. Replace the default Next.js promotional content with a small ShopBoard holding page and ShopBoard metadata. It identifies the store as in progress and renders a shadcn/ui primitive to prove the integration. It does not simulate a working catalog or expose inactive cart/admin controls.
5. Establish formatting, type checking, Next.js linting, LF line endings, and the existing project's intended Husky/lint-staged commit checks.
6. Include the complete Vercel React and composition skill bundles under `.agents/skills/`, with referenced files intact and excluded from application linting/formatting.
7. Update README setup instructions, the actual component tree, and the distinction between initialized functionality and planned features.

### Outside this delivery

- Migrating catalog browsing, filters, product detail routes, cart, checkout, login, administration, categories, comments, or notifications.
- Creating empty feature folders, placeholder routes for every future page, unused API abstractions, or unused state providers.
- Adding a backend, database, API proxy, real authentication, orders, payments, or shared write endpoints.
- Publishing the application, creating a pull request, or committing existing user changes.

### Proposed setup decisions

These agent-proposed setup decisions are included in the approved initialization:

- Keep TypeScript strict mode, the current compatible Next.js/React versions, npm, and Next.js ESLint presets. Add Prettier instead of introducing a second linter solely because the old rules mention Oxlint.
- Use standard Tailwind v4 and shadcn/ui theme integration for new application styling, including its normal reset. This replaces the old restriction to Tailwind utilities only inside controls without Preflight. Use colocated plain CSS Modules when custom styling is clearer than utilities; a component does not need an empty stylesheet.
- Start with a neutral light theme and a green accent consistent with the original store. A dark-mode toggle or broader visual redesign is outside initialization.
- Prefer the documented stable Next.js/Tailwind integration. Retain custom or experimental starter configuration only where it has a concrete, verified need; advanced caching and prefetch settings are not requirements of the foundation.
- Preserve the project's typed component props, function documentation, direct imports, and feature boundaries. Adapt the shadcn primitives actually added to these conventions rather than broadly exempting UI code.

## Application structure

`src/app/` owns Next.js route entry points, layouts, providers, metadata, and coordination between features. It is not a new home for all feature logic. There is no Vite `main.tsx`, custom React mounting entry point, or React Router root `App`.

Application components use `src/app/components/<ComponentName>/<ComponentName>.tsx`. A route `page.tsx` or `layout.tsx` remains at its framework-defined path and uses the framework's filename rather than the normal component filename convention.

Feature UI belongs in `src/features/<feature>/components/`; its non-UI code belongs in descriptive `modules/<responsibility>/` groups. Components may import modules; modules never import components. Features do not import one another. Application composition connects them through explicit props and callbacks.

Reusable, feature-independent code belongs in `src/shared/`. Shared shadcn primitives use `src/shared/components/ui/<ComponentName>/<ComponentName>.tsx`; class merging and non-UI variant definitions belong in `src/shared/modules/ui/`. Configure shadcn aliases for these locations and review generated imports after adding controls.

Create only files with a current responsibility. During initialization, no `features/` directory or provider is necessary unless it actually contains implemented behavior. Documentation examples do not require matching empty folders.

## Server and client boundaries

Layouts and route pages remain Server Components by default. Add `"use client"` only at boundaries that need event handlers, hooks, browser APIs, or client context. A client provider can receive server-rendered content through `children`; the whole application does not become a Client Component because it needs a cart provider later. These boundaries follow the [Next.js Server and Client Components guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components).

Server-to-client props carry validated, serializable data. Client callbacks are created inside an application-level Client Component that coordinates the relevant features; ordinary callbacks are not passed across the server/client boundary. Keep server-only API modules out of client imports.

When the cart and demo catalog are migrated, their providers live in a persistent application layout above route loading/error boundaries. Keep state ownership explicit, and do not create those providers during initialization simply to reserve their future locations.

Use Next.js `Link`, routing parameters, metadata, `loading.tsx`, `error.tsx`, `not-found.tsx`, and focused Suspense boundaries as appropriate. Do not carry over React Router, manual route loaders, `RetryablePage`, or a mandatory application QueryClient. Local state, editors, and persistent providers must survive unrelated request recovery where practical.

## Read-only API architecture for migration

This section defines the future catalog boundary; initialization does not create unused request code or contact the class API.

- Default base URL: `https://shopboard-api.vercel.app`.
- Collection endpoint: `GET /api/products`.
- Individual product endpoint: `GET /api/products/{id}`.
- The original project's documented fields are `id`, `title`, `category_name`, `price_cents`, and `in_stock`. Confirm collection envelope and response details with read-only requests when implementing the catalog. Do not invent product images or descriptions; the original API contract provides neither.
- Use integer cents for price arithmetic and USD as the existing documented display assumption.
- Read a deployment override from a server-only environment variable such as `SHOPBOARD_API_BASE_URL`. Add its documented environment example when the API client is actually introduced. No secret belongs in a `NEXT_PUBLIC_*` variable.
- Centralize URL configuration, GET execution, status handling, and JSON parsing in `src/shared/api/apiClient.ts`. Do not expose an arbitrary HTTP method or write operation for this API.
- Keep validated product models and response mapping with `src/features/products/modules/catalog/`. Expose server-only `getProducts` and `getProduct` operations from that module. Treat decoded JSON as `unknown` until validation succeeds.
- Server Components call these operations directly; do not add an internal Route Handler merely to forward the same read.
- Begin with explicit uncached reads when API features are migrated, so shared class data is not silently frozen at build time. Use local Suspense/loading and retryable errors around these reads. Add a documented cache policy later only for a concrete reason, following the [Next.js data-fetching guidance](https://nextjs.org/docs/app/getting-started/fetching-data).
- Do not add a duplicate browser fetch or query cache for data already owned by the server-rendered route. Derive filtered and locally merged results from the validated server snapshot and browser-owned state.
- Never issue API `POST`, `PUT`, `PATCH`, or `DELETE` requests. Server Actions must not be introduced as a way to write demo changes to the shared service.

## Browser-only demo behavior for migration

The server cannot read localStorage. API records are the shared base catalog; browser changes are a separate local layer. The application must communicate when displayed changes are demo data available only in that browser and origin.

### Catalog changes

Keep a versioned local catalog record containing additions, overrides, and deleted IDs. Derive the effective collection from the latest API snapshot plus that local record instead of copying the merged collection into another state variable. Category changes operate on this local layer as in the original demo.

Retain noncolliding local IDs and validation of stored data. Local deletion hides a product in this browser; it does not delete a classmate's API record. Provide a deliberate reset action when demo administration is migrated.

### Cart, comments, and checkout

One application-level cart provider owns cart state. Product and checkout features receive the relevant cart actions/data through application composition rather than importing the cart feature directly.

Preserve the original cart's saved product snapshots, integer-cent totals, and quantities from 1 to 99. Later catalog edits do not silently rewrite existing cart snapshots. An accepted new addition of the same product may refresh its snapshot according to the original cart rules.

Comments remain versioned, validated, and scoped to a product in localStorage. Demo checkout never sends an order or takes payment, and contact/delivery fields must not be persisted, logged, or transmitted. When checkout is migrated, React Hook Form and one Zod schema own its form state and validation.

Existing storage keys are reference contracts to evaluate during migration: `shopboard.catalog.v1`, `shopboard.cart.v1`, and `shopboard.comments.v1.<productId>`. The old demo login uses the tab-scoped sessionStorage key `shopboard.admin.session.v1`; it is not real authorization. Sharing key names does not transfer storage between different deployment origins.

### Hydration and failures

- Initial server output and the first client render must agree. Read browser storage only through a hydration-safe client mechanism; never access it at module scope or assume `"use client"` makes render-time browser access safe.
- Show neutral pending state for storage-dependent counts and controls until saved state has been loaded. Do not overwrite saved data with empty defaults before that load completes.
- Keep one owner for each browser state record. Derive filtered products, totals, and request status during rendering.
- Validate storage contents before use. Corrupt or unavailable storage must not crash the store; keep the current visit usable and explain when changes cannot survive refresh.
- Keep persistence side effects outside pure state updater functions. No cross-device or cross-tab synchronization is promised.

## Later feature migration reference

These routes and behaviors come from the original store. They are documented for continuity and are not part of the initialization acceptance criteria.

| Route                   | Intended behavior                                                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                     | Read-only API collection, local catalog overlay, name search, category/availability filters, sorting, and cart actions.                                                                                               |
| `/products/[productId]` | Direct individual API read, valid positive ID handling, stock/cart action, and local comments. Preserve the existing distinction: this page shows the API record; negative-ID demo products have no API detail route. |
| `/cart`                 | Persistent local cart, quantity controls, removal, clearing, and derived totals.                                                                                                                                      |
| `/checkout`             | Validated demo contact/delivery form and cart summary; successful demo completion clears the cart without creating an order.                                                                                          |
| `/login` and `/admin`   | Clearly labelled browser-only administration, simulated session, local product/category changes, and confirmations.                                                                                                   |

Keep distinct loading, retryable request failures, empty catalog, no matches, missing product, empty cart, and successful actions. Do not disguise API failure as an empty catalog. Local demo data must not be uploaded when connectivity returns.

Carry forward the original project's accessibility, responsive behavior, input validation, reduced-motion support, and action feedback as each feature is migrated. Exact page layouts and detailed feature changes remain for their own implementation scope; this foundation does not approve a store redesign.

## Engineering conventions

- Replace Vite and React Router instructions with Next.js App Router conventions and server/client import boundaries.
- Replace the mandatory `App`/`main.tsx`, custom lazy-route, and QueryClient rules with the Next.js ownership described here.
- Permit normal Tailwind/shadcn styling and optional colocated CSS Modules, with shared theme tokens and accessible focus states.
- Preserve strict TypeScript, validation of untrusted values, documented assertion exceptions, JSDoc for functions/callbacks, typed props, and one component per file.
- Preserve feature responsibility groups, direct imports, no feature-to-feature imports, and no speculative abstractions.
- Limit shared API operations to reads and make the browser-only demo boundary explicit.
- Align lint/format/commit-check instructions with the tools actually installed. Preserve the pre-commit protection for staged code and full-project type checking, including partially staged files.
- Root the README's implemented component tree at `RootLayout` and describe server/client boundaries, props, conditional rendering, and state owners. Verify with React DevTools when available; report access limitations.
- Keep `AGENTS.md` authoritative, preserve the requested Project Engineering Guidelines, and do not create duplicate rules files unless explicitly requested.

## Development workflow and mentoring

Act as a senior software engineer and mentor, prioritizing maintainability, simplicity, correctness, accessibility, and learning. Use Superpowers brainstorming before major features and get explicit design approval before significant implementation. Discuss meaningful tradeoffs and ask before major technical decisions.

After design approval, create an implementation plan with small tasks outside the repository. Implement and verify one task at a time, then review the changes before calling a feature complete. Test important behavior and bug fixes, run relevant tests after changes, and run lint and build checks before completion. Report only checks that were actually executed.

After each completed feature, explain what was implemented, identify the important files and their responsibilities, explain new concepts in beginner-friendly English, show how the user can modify the feature, and give one small coding exercise. Avoid unrelated refactoring without approval, unnecessary dependencies or abstractions, and secrets in source control.

## Acceptance and verification

Before declaring initialization complete:

1. `npm run dev` serves the ShopBoard holding page through `src/app/`, with correct metadata and working shadcn theme/primitive styling.
2. The original root `app/` does not remain as a second active router. TypeScript and shadcn aliases resolve to the selected `src/` locations.
3. The initial page has semantic structure, readable mobile/desktop layouts, and no hydration or browser console errors. Check keyboard behavior for any interactive element actually included.
4. Initialization performs no requests to the class API and offers no pretend working store actions.
5. Run `npm run lint`, `npm run typecheck`, `npm run format`, `npm run format:check`, and `npm run build` successfully. Type checking must work on a clean checkout with generated Next.js types handled appropriately.
6. Verify the Husky prepare script and lint-staged configuration without creating a commit or staging the user's changes. Report if actual commit-hook execution cannot be tested safely.
7. Verify that `AGENTS.md` preserves the requested engineering and mentoring guidelines, plus LF text conventions, complete project skill bundles, and the README's actual component tree. No `CLAUDE.md` is required.

No testing framework is required for this static foundation. Add focused business/storage/API tests when those behaviors are implemented, using available tooling and a concrete testing need. Loading/error/empty/cart/storage checks become required with their relevant feature migrations.

For documentation-only changes, read and review the resulting Markdown and verify that only the requested documentation files changed. Application checks are deferred until implementation exists.

## Details left to the implementer

Choose the smallest shadcn primitive needed by the holding page, exact component names, spacing, and compatible tooling package versions during implementation. Use the existing npm lockfile and avoid unrelated dependency upgrades. Resolve routine generated-import and formatting details without expanding product scope.

## Approval boundary

The user approved this design and authorized foundation initialization, unused-starter cleanup, and a learning recap. That approval does not authorize full feature migration, backend changes, or publication. Use brainstorming and obtain design approval for later significant features; explicitly requested documentation edits do not authorize application implementation on their own.

Implementation notes, review logs, scratch files, and temporary verification assets remain outside the repository, as required by the project rules. This durable `design.md` is the design artifact for this project.
