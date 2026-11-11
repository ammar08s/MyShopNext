# ShopBoard Next.js design

Status: The implemented scope includes catalog/details, retail cards, instant filters, separate user/admin demo logins, browser-local product CRUD and custom selection menus. The dashboard completion and SVG icon revision are authorized. Real product routes, invisible internal IDs and dedicated test folders are preserved. Cart, checkout, comments, standalone category management and real authentication remain future work.

Updated: 2026-11-11. Earlier milestone sections retain their original scope; the current state and subsequent revisions take precedence.

## Intent

Prepare this repository for rebuilding the existing ShopBoard store with Next.js App Router, TypeScript, and shadcn/ui. Keep the useful feature boundaries and engineering discipline from the React project while adopting Next.js routing and server rendering.

The shared class API is read-only for this project. Product creation, editing, deletion, cart changes, comments, and demo checkout must never modify that API. Browser-only changes remain local to the visitor.

This document records product scope, data contracts, and architectural decisions. Engineering rules belong in `AGENTS.md`; setup instructions and the implemented component tree belong in `README.md`. No duplicate rules file is required.

## Current state

- This repository uses Next.js App Router, React, strict TypeScript, Tailwind CSS v4 with PostCSS, and Next.js ESLint configuration. The existing project was reused rather than overwritten by a generator.
- Application routes live in `src/app/`. The home catalog uses a `(catalog)` route group to keep its introduction outside loading/error boundaries. Positive product-detail IDs use individual server reads; negative IDs resolve browser-created records without an API call. Shared navigation remains mounted across these routes.
- The storefront uses illustrative product renders, instant search/category/sort controls and custom dropdown options, with no availability filter. `/login` and `/admin/login` use separate tab-local demo roles. `/admin` provides persistent product editing, local/shared tables, change counts and confirmed delete/reset actions. Persistent providers wrap server-rendered application content without converting route pages into Client Components.
- `AGENTS.md` contains the requested engineering and mentoring guidelines and the Next.js conventions. `CLAUDE.md` does not exist and is not required.
- Prettier, Husky, lint-staged, LF text conventions, and the complete Vercel project skills are configured. Unused Next.js starter assets are removed. `public/products/catalog-atlas.png` contains the illustrative product imagery; interface icons use source-owned SVG paths.
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

## Catalog and product details milestone

### Independent controls and product-route refinement

Search, reset and fixed sort choices render in the catalog layout immediately, outside the page's loading/error boundary. A catalog-scoped client workspace owns only query/category/sort selections and shares actions with the route results through context. API products remain server-owned props; categories and filtered results remain derived data. This provider is justified by the persistent controls and separately streamed results, replacing the original component-local owner without making filters global.

Only the data-dependent category choices, count and product grid use loading placeholders. Search and sort remain available during loading, empty results and request failures; retry preserves selections. Category selection sits beside the result count, while search and sort share the persistent control bar. `aria-label="Product filters"` is a frontend accessibility name, independent of fetching. Existing detail routes use the App Router folder `src/app/products/[id]/page.tsx`, awaiting `params.id`, validating it and retaining individual reads, metadata and route fallbacks. This renames the existing `[productId]` segment without changing URLs.

The chosen layout boundary preserves controls through loading and retries with no duplicate fetching. Keeping all controls inside the data page was simpler but unnecessarily blocked search; a client fetch cache or parallel route slots would add complexity without a requirement.

Status: Implementation authorized on 2026-11-10. The user selected catalog and product details, instant local filters, real route changes for details, no visible product IDs, and dedicated test folders. The user instructed the agent to proceed without further questions and explain the completed work.

### Intent and scope

Replace the holding page with a useful storefront where visitors can find products and open their individual details. This is the first feature migration after the foundation, retaining the existing Next.js stack and the original store's warm neutral and green visual direction.

Included routes are `/` and `/products/[productId]`, plus appropriate missing-page feedback. This milestone includes read-only product access, response validation, instant filtering and sorting, responsive presentation, accessible controls, and loading/error/empty/not-found states.

Cart, checkout, comments, administration, demo catalog overlays, real authentication, and publication remain later milestones. The later polish revision below adds only browser demo login/session behavior. Navigation and product pages expose working actions only. Decorative generated product renders must be labelled illustrative; do not fabricate API photos, descriptions, ratings, discounts or shipping promises.

### Approaches and selected behavior

| Approach                                         | Benefits                                                                                                                                              | Tradeoffs                                                                    | Decision              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------- |
| Server-loaded catalog with instant local filters | A validated server snapshot renders immediately; browser filtering needs no further API requests. Keeps state ownership and the learning scope small. | Selections belong to the mounted catalog and are not shareable or persisted. | Selected by the user. |
| Server-loaded catalog with URL-backed filters    | Filtered views can be shared and bookmarked, with URL-driven navigation history.                                                                      | Adds URL parsing, validation, and navigation coordination.                   | Not selected.         |

Both approaches retain server-owned API reads and native Next.js detail routes. A browser request cache or client-only migration is unnecessary for either approach.

### Catalog experience

- Keep a compact shared header with a ShopBoard link and a working catalog navigation link. Follow it with a brief editorial introduction and the catalog workspace.
- Show a responsive search/sort/reset bar outside the product request boundary, with data-dependent result count and category selection above the cards. Use one column on the narrowest screens, two where readable, three on medium screens and four on wide screens. The polish revision replaces the original narrow sidebar.
- Search matches product titles by a trimmed, case-insensitive substring. The empty query matches every title.
- Category choices come from the complete validated snapshot and remain available when search hides their products. Include an All categories choice. There is no availability filter; in-stock and out-of-stock products participate equally in matching.
- Sorting offers Name A–Z, Name Z–A, Price low to high, and Price high to low. Default to Name A–Z. Use a deterministic secondary comparison for equal names or prices; never mutate the server snapshot when sorting.
- Search and category combine with AND semantics and update immediately without a submit action or further API request. Reset restores an empty query, all categories and Name A–Z.
- Announce the current result count politely without moving keyboard focus. A genuinely empty collection has its own message; a nonempty collection with no matches offers a reset action.
- Each retail card is one keyboard-operable link to its real detail route. Show true title, category, USD price and stock status, plus a labelled illustrative product render and clear details affordance. Wrap long content and keep hover/focus visible.
- Filter selections have one React state owner in the catalog layout's client workspace. Derive categories, visible products, and counts during rendering. Do not copy products into state, synchronize derived results with effects, or write filters to the URL or browser storage. Selections survive product-request retries and reset when the catalog layout unmounts or the page reloads; no persistent filter restoration is promised.

### Product details experience

- A product card opens `/products/{id}` with Next.js Link. A direct visit or refresh reads that individual product rather than downloading the collection.
- Show a Back to catalog link, decorative category treatment, title, category, USD price, and stock availability. Product IDs remain internal to routing and validation and never appear in visible card/detail content. Opening details changes the real browser route; it does not replace the catalog within the same page or use a hash-only mockup. Keep out-of-stock products readable. Product details remain server-rendered because this milestone has no product mutation or browser-only detail interaction.
- Accept canonical nonzero safe-integer route IDs. Positive IDs read the shared API; negative IDs resolve browser-created demo products. Zero, leading zeros, decimals, nonnumeric values and numbers outside the safe-integer range show not-found feedback without contacting the API.
- HTTP 404 for a valid ID is an expected missing-product result. A successful response with the wrong ID, malformed JSON, or invalid fields is a retryable request failure rather than a missing product.
- Include a useful page title based on the validated product where practical without duplicating the individual product request within one render. Unknown application URLs also show a clear route back to the catalog.

### API contract and request policy

The read-only collection was checked on 2026-11-09. `GET https://shopboard-api.vercel.app/api/products` returned an object with `items` and `total`, containing 12 products at inspection time. The count is an observation, not a hardcoded requirement. A subsequent read-only check confirmed that `/api/products/1` returns the individual record directly, and an unknown positive ID returns HTTP 404.

- Keep server-only URL configuration, GET execution, status handling, and JSON decoding in `src/shared/api/apiClient.ts`. Use `SHOPBOARD_API_BASE_URL` when provided, otherwise the documented API base URL, and add the environment example and README setup instructions with implementation.
- Put `getProducts`, `getProduct`, validated domain types, and response mapping in the products feature's catalog module. Map `category_name`, `price_cents`, and `in_stock` to frontend names such as `category`, `priceCents`, and `inStock`.
- Treat decoded JSON as `unknown`. Require positive safe-integer IDs, nonempty titles/categories, nonnegative safe-integer price cents, and boolean stock values. Validate the collection envelope and nonnegative integer total, reject duplicate IDs, and fail the request when any item is invalid rather than silently omitting it. Ignore unrelated extra fields.
- This milestone displays the complete, unpaginated collection. If the endpoint indicates more products than it returns, report an unsupported/incomplete response instead of displaying misleading complete-catalog filters; pagination would require a separate scope decision.
- `getProduct` verifies that the returned product ID matches its input and represents HTTP 404 as a typed expected result. Other HTTP, network, timeout, JSON, and validation failures reach the request error UI. Keep unsafe remote response details out of user-facing messages.
- Start API reads with explicit `cache: "no-store"`. Use a 10-second request timeout so failures cannot leave loading feedback indefinitely. Preserve framework-owned fetch exceptions so Next.js can select request-time rendering rather than wrapping its control-flow signals. Do not add automatic retry loops, artificial loading delays, proxy routes, or write methods. Deduplication for product metadata and rendering uses request-scoped React caching while retaining uncached reads across requests.
- Server Components call the feature reads directly. Pass only the validated serializable catalog fields into its interactive client section. Product details do not import the collection loader. Do not re-fetch the catalog in the browser or introduce TanStack Query/SWR for this snapshot.

### Components and state ownership

Keep `RootLayout`, route entry points, the shared navigation shell, and product details as Server Components by default. Only the catalog interaction owner, interactive controls within its client subtree, and framework-required error recovery need a client boundary.

The products feature owns its catalog UI, filtering UI, detail UI, and request feedback. Organize its non-UI work into catalog, filtering, and pricing responsibilities. Shared currency formatting belongs in the narrowest appropriate pricing module until another feature actually needs it. Follow the repository's component folders, typed Props, direct imports, and required function documentation.

Use props and children to compose focused components, without a global filter provider, large boolean-mode components, speculative wrappers, or unused cart/demo providers. Apply the repository's Vercel React and composition skills, and code-simplifier when implementing and reviewing touched code. Add source-owned shadcn controls only where they provide a concrete benefit; preserve attribution and project conventions.

### Loading, recovery, and accessibility

- Keep the shared header available while either route loads, fails, or shows a missing product. Keep the collection introduction outside the replaceable catalog request area using a narrow route layout or boundary where useful.
- Show decorative placeholders for category/count and six cards while the collection is pending; leave search and fixed sorting available above the boundary. Use a detail-shaped skeleton for an individual read. Announce loading once, keep placeholders non-interactive, disable shimmer for reduced-motion preferences, and replace placeholders immediately after success or failure.
- Use native Next.js loading, error, not-found, and focused Suspense boundaries as appropriate. A retry action must initiate a new server read and recover after the upstream service returns; resetting a rejected render alone is insufficient. Keep error recovery focused on the affected route content.
- Distinguish collection loading, retryable errors, empty collection, no matches, missing product, and success. A failure must never look like an empty catalog. Provide a reload fallback when necessary for unrecoverable client/deployment failures.
- Use semantic landmarks, one clear page heading, explicit control labels, a useful keyboard order, visible focus, and text for stock state. Do not depend on color or animation alone. Keep content usable at 320px and on wide screens, including long titles/categories and keyboard-only browsing.

### Acceptance and verification

1. `/` server-renders the validated catalog; search, category, sorting, result count, reset and no-match behavior work without browser API fetches. Availability filtering is absent.
2. Cards navigate to details, and direct detail URLs and refresh work without requesting the collection. Invalid IDs, HTTP 404, invalid product responses, and unknown routes produce the intended distinct states.
3. Failed reads time out or show actionable errors; retry performs a new read and succeeds when the service recovers. Shared navigation remains available throughout.
4. Add focused tests for response validation/mapping, ID parsing, filter combinations/reset/defaults, sorting without input mutation, USD formatting, and meaningful request/error behavior. Use Node's built-in test runner with the existing Node >=22.22.1 floor, explicit `.ts` imports and the `react-server` export condition for server-only module tests. Keep tests in a dedicated `tests/` folder within each owning module or component, including `src/shared/api/tests/`; do not scatter them among production files. No separate testing framework is needed.
5. Manually check the affected flow on narrow/wide layouts, keyboard behavior, reduced motion, and loading/error/empty/not-found states when browser access is available. Verify the README's component tree in React DevTools when available and explicitly report access limits.
6. Run `npm run format`, `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build`, plus the focused tests. Only report executed checks as passing.
7. Update README setup, implemented behavior, the complete component tree and its props/boundaries/state owners, and the learning walkthrough. Explain how to change a filter or card and provide one small coding exercise.

### Decisions left to the implementer

Exact component names, route-boundary placement, copy, spacing, category initial styling, focused test scripts, and the smallest set of shadcn controls are agent implementation decisions within this scope. Preserve the current compatible dependencies unless a specific implementation need justifies an addition. Browser mockups are disposable review artifacts outside this repository and do not replace this design or its approval.

## Application structure

### Separate user/admin demos, product CRUD and custom options

Dashboard completion includes a responsive overview of created, edited and hidden products, derived from the existing local record. Replace decorative text symbols with consistent SVG icons in navigation, login, product links and selections; pair management-action icons with visible labels. Keep the editor and local records usable during shared-list loading and failures. No dashboard sales figures or other fabricated metrics are introduced.

The user's latest clarification authorizes a demo user login, a separate administrator login and working administrator product CRUD, plus improved open dropdown options. Their instruction to proceed without further questions remains in force. This revision supersedes the previous single-account/native-select limitation.

- `/login` is the customer demo (`user@shopboard.demo` / `User123!`). `/admin/login` is the admin demo (`admin@shopboard.demo` / `Admin123!`). Each form validates its intended role. A v2 tab session stores only `{ version: 2, role: "user" | "admin" }` under `shopboard.session.v2`; legacy role-less markers never imply administrator access. Header navigation and sign-out reflect one current role.
- `/admin` is a clearly labelled browser-only product-management workspace. Its client admin guard remains above dashboard request loading/error boundaries and redirects guest/customer sessions to `/admin/login`. This is a demo UI gate, never real authorization or permission to modify the shared API.
- Admins can create products, read shared/local records, edit title/category/USD price/stock and delete with confirmation. Editing cancellation preserves data. Reset demo catalog is a separate confirmed action. Validate trimmed title (1–120), category (1–60), nonnegative exact USD prices with at most two decimal places and boolean stock. Keep form draft/validation/action feedback local and preserve the editor when the shared list fails.
- One persistent products provider owns a validated localStorage overlay at `shopboard.catalog.v1`: version, decreasing next local ID, created products, positive-ID overrides and hidden positive IDs. Hydrate after subscription with matching initial server/client snapshots; do not overwrite saved changes before loading. Corrupt/blocked/full storage leaves the visit usable and explains persistence limits. API snapshots remain route props, never copied into another state owner.
- Storefront products/categories/counts derive from the current API snapshot plus local changes. Admin saved changes remain editable outside the API recovery boundary; the shared table omits locally overridden/deleted records to avoid duplicate rows. Reset restores the shared catalog without sending any write request.
- New products use negative IDs and real `/products/-N` routes that resolve only from this browser's overlay, without contacting an individual API endpoint. Positive routes keep their individual read and apply local overrides/deletion after hydration. Internal IDs stay out of visible product content. Browser-aware detail rendering is a focused client boundary; API fields still validate at the server boundary. The original negative-ID/no-detail rule is replaced by this behavior.
- Replace native `<option>` popups with a source-owned Radix Select wrapper: fully styled option panel, selected checkmark, hover/keyboard highlight, scrolling, collision handling and focus restoration. Use safe internal option encoding so arbitrary category values, including the all-category empty value, cannot collide. Add only the granular `@radix-ui/react-select` dependency for this concrete accessibility need. Availability filtering remains removed.
- Keep feature boundaries: auth owns roles, products owns demo catalog/management, and the application layer composes the admin guard/routes/providers. Never add a backend, database, API proxy or shared-service write operation. Tests stay in dedicated responsibility-owned `tests/` folders; document and verify all changed routes and state owners.

### Storefront polish and demo login revision

Authorized by the user's follow-up request on 2026-11-10, with their instruction to proceed without further questions. This revision supersedes the earlier availability-filter and letter-artwork decisions.

- Redesign cards using retail references such as [Everlane's collection](https://www.everlane.com/collections/womens-bags): consistent product media, readable name/category/price, a clear details affordance, generous spacing, borders and restrained hover/focus feedback. Use a wider product grid with a horizontal filter bar instead of the narrow sidebar.
- The API still supplies no photos. Use locally generated, consistently lit illustrative product renders, visibly labelled as illustrations rather than actual inventory photography. Known titles map to a 4-by-3 atlas; unknown products use a category illustration fallback. Keep true API names/prices/stock, real product routes and invisible internal IDs. Do not invent ratings, discounts, cart actions, product descriptions or shipping claims.
- Remove availability filtering entirely from controls, filter state/types, logic and reset. Keep title search, category selection and four sort orders. Availability remains product information on cards/details.
- Improve category and sorting controls with a shared labelled, styled native select: clear border, chevron, padding, hover/focus feedback and native keyboard/mobile behavior. No dependency is required for two simple selectors.
- Add `/login` as a clearly labelled demo account page. Use the original demo credentials `admin@shopboard.demo` / `Admin123!`, with field validation, a fill-demo action, password visibility and success/sign-out states. Successful sign-in offers a return to the collection; this revision does not add an admin dashboard.
- One persistent client provider owns a per-provider demo-session store. Subscribe/hydrate versioned `shopboard.admin.session.v1` sessionStorage after mounting, keeping the server snapshot and first client render in a neutral loading state. Never read storage at module scope or during render. Persist only a versioned signed-in marker, never passwords or entered fields. Corrupt/blocked storage produces a usable guest/current-visit state and an explanation. Header account actions use this same owner.
- Add focused credentials, session-storage and image-mapping tests in their owning `tests/` folders. Update the existing filtering tests and README component tree. Retain all required project checks and report any browser verification limits.

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
- The documented fields are `id`, `title`, `category_name`, `price_cents`, and `in_stock`. Confirm collection envelope and response details through read-only requests when changing the contract. Do not claim that illustrative renders are actual API photography or invent descriptions; the API provides neither images nor descriptions.
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

The user previously approved foundation initialization, unused-starter cleanup, and a learning recap. On 2026-11-10 the user authorized catalog and product details implementation with the corrections recorded above and instructed the agent to proceed without further questions. This authorizes that milestone only. Other feature migration, backend changes, and publication require their own authorization; explicitly requested documentation edits alone do not authorize application implementation.

Implementation notes, review logs, scratch files, and temporary verification assets remain outside the repository, as required by the project rules. This durable `design.md` is the design artifact for this project.
