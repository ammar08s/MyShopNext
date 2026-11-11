# ShopBoard

A Next.js App Router storefront with React, strict TypeScript, Tailwind CSS v4 and source-owned UI controls. It includes retail product cards, instant search/category/sorting, real product-detail routes, separate demo user/admin logins, and browser-local admin product CRUD.

| Route            | Purpose                                                      | Demo credentials                     |
| ---------------- | ------------------------------------------------------------ | ------------------------------------ |
| `/`              | Public storefront with API products plus saved local changes | No login needed                      |
| `/products/[id]` | Individual API product or browser-created demo product       | No login needed                      |
| `/login`         | Demo user sign-in/account                                    | `user@shopboard.demo` / `User123!`   |
| `/admin/login`   | Separate demo admin sign-in                                  | `admin@shopboard.demo` / `Admin123!` |
| `/admin`         | Admin demo product management                                | Admin demo session required          |

Each login rejects the other role's credentials. Admin sign-in opens the product workspace. Users can browse but cannot access its controls through the demo UI. These are simulated browser accounts, not real authentication or authorization.

Product requirements live in [design.md](design.md); engineering rules live in [AGENTS.md](AGENTS.md). The shared class API is read-only. Admin create/edit/delete/reset never sends a write request to it. Cart, checkout, comments, standalone category management, real accounts and deployment remain outside the current implementation.

## Run and verify

Use Node.js **22.22.1 or newer** and npm. On Windows use `npm.cmd` if PowerShell blocks `npm.ps1`.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000); reuse an existing development server for this checkout. For production, run `npm run build`, then `npm start`.

The default API needs no configuration. To use a compatible service, copy [.env.example](.env.example) to `.env.local`, change server-only `SHOPBOARD_API_BASE_URL`, and restart. Never use `NEXT_PUBLIC_` for API configuration or commit secrets.

| Command                    | Purpose                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`              | Development server with updates.                                                     |
| `npm test`                 | Native Node TypeScript behavior tests.                                               |
| `npm run test:integration` | Streaming regression against the latest production build; run `npm run build` first. |
| `npm run lint`             | Next.js ESLint; warnings fail.                                                       |
| `npm run typecheck`        | Generate route types and run strict TypeScript.                                      |
| `npm run format`           | Apply Prettier.                                                                      |
| `npm run format:check`     | Check formatting without changing files.                                             |
| `npm run build`            | Optimized production build.                                                          |
| `npm start`                | Serve that build.                                                                    |
| `npm run prepare`          | Activate Husky checks.                                                               |

Husky/lint-staged checks staged JS/TS with ESLint, supported files with Prettier, and the full project with typecheck before restoring unstaged edits. Tasks run serially, with relative paths and a 4096-character Windows argument limit. Checks do not rewrite or stage fixes. LF is enforced; generated output and third-party skills stay outside application formatting/linting/Tailwind scanning.

## Admin CRUD and persistence

1. Open `/admin/login` and use the admin demo credentials or its fill-demo action.
2. Create a product with a title, category, nonnegative USD price and stock status. Names are trimmed and limited to 120 characters; categories to 60; prices allow up to two decimal places.
3. Read products in the shared table and the saved-changes table. Edit opens the product in the persistent editor. Saving creates a local copy; cancel discards the draft.
4. Delete requires confirmation. API products are hidden in this browser; demo creations are removed locally.
5. View the storefront or follow a product link. New and edited products appear there, including after refresh. Stock labels remain product information; there is no availability filter.
6. Confirm Reset demo changes to remove this browser's additions/edits/hiding and restore the shared catalog view.

The editor and saved records live in the dashboard layout, outside the shared-list loading/error boundary. Failed API reads do not remove an unsaved draft or locally saved rows. Retry initiates a new server read. Edited shared records move into the saved-changes section so they are not duplicated in both tables.

The dashboard overview shows created products, edited shared products and hidden shared products. Counts come directly from the saved overlay and display a pending state until storage loads. Consistent SVG icons accompany navigation, selections and management actions; text labels remain visible.

One DemoCatalogProvider owns the versioned localStorage overlay at `shopboard.catalog.v1`: `{ version: 1, nextId, created, updated, deletedIds }`. New products receive decreasing negative IDs; shared overrides and hidden IDs remain positive. API snapshots stay route props; effective collections, categories and counts are derived rather than copied into another state variable. Negative detail routes resolve in this browser and never call the individual API. Positive detail routes read one API product and then apply local edits/hiding. IDs remain absent from visible product content.

One DemoSessionProvider owns the tab's role at `shopboard.session.v2`, storing only `{ version: 2, role: "user" | "admin" }`. Legacy role-less markers never grant admin access. Entered passwords/fields are not stored, logged or transmitted. Signing out changes access but does not erase product changes; use the explicit catalog reset for that.

Both providers hydrate storage after subscribing through `useSyncExternalStore`. Server HTML and first client render share stable pending snapshots; no storage read happens during render and no default record overwrites saved data before loading. Invalid/blocked/full storage keeps the visit usable and explains when refresh may restore older data. There is no cross-device or live cross-tab synchronization promise.

## Server reads and controls

`src/shared/api/apiClient.ts` centralizes server-only configuration, bounded GETs, status handling and unknown JSON decoding. The products feature explicitly chooses `cache: "no-store"` and validates `{ items, total }` and every product. Invalid/duplicate/incomplete data fails visibly. HTTP 404 differs from failed requests. Fetch/framework exceptions propagate so Next.js can stop prerendering dynamic reads; builds do not need a live catalog snapshot. React's request-scoped cache deduplicates metadata/detail reads.

CatalogWorkspace lives in the catalog layout and stores only query/category/sort selections. Search, fixed sort choices and reset render before the API completes and remain mounted during failures and retries. Only category choices, result count and product cards wait for product data. The results read the same selections through catalog-scoped context, so typing during loading applies to arriving products. Selections reset when that layout unmounts or the page reloads; they are not saved in the URL or storage.

Search trims spaces and ignores case, conditions combine with AND, and sorting is deterministic without mutating the API snapshot. Reset shows all effective products in name order. Card detail prefetch is disabled. `aria-label="Product filters"` names the frontend controls for assistive technology; it has no connection to fetching or backend data.

The App Router product entry is `src/app/products/[id]/page.tsx`. Square brackets make the folder a dynamic segment: `/products/12` supplies `params.id` as `"12"`. The server page awaits `params`, validates the ID, reads only that product, and uses `notFound()` for invalid/missing shared records. Metadata uses the same request-deduplicated read. Local negative IDs use the browser overlay. `loading.tsx`, `error.tsx` and `not-found.tsx` live beside the page; no Pages Router `[id].tsx` file or extra routing library is needed.

SelectField now uses granular [Radix Select](https://www.radix-ui.com/primitives/docs/components/select), replacing native option menus. The source-owned wrapper styles the popup, selected checkmarks, highlighted/disabled options and scroll controls, with focus management, keyboard/typeahead support, collision handling and reduced motion. Options use safe internal encoding, so empty/all-category and arbitrary category names cannot collide. Its controlled API is `id`, `label`, `value`, `options`, `onValueChange`, with optional `disabled`, `placeholder`, `className`, `describedBy` and `invalid`.

## Modules and tests

Tests stay inside responsibility-owned `tests/` folders. Node's runner executes explicit `.ts` imports with the `react-server` condition for guarded server reads. No test framework was added.

`npm run test:integration` runs `CatalogWorkspace/tests/catalog.loading.integration.ts` after a production build. It starts an isolated test API and Next request server on available local ports, holds the product response, and verifies that enabled search/sort markup streams first. It then releases the response and checks product links and a single catalog request. Cleanup closes its own servers and restores its environment; it does not use the shared API or change a running development server.

```text
src/features/auth/modules/
  credentials/demoCredentials.ts          Role-specific public credentials/validation
  credentials/tests/                      Correct/wrong portal and normalization tests
  session/demoSession.store.ts             Stable role snapshots, persistence and recovery
  session/demoSession.types.ts             Role/state/action contracts
  session/demoSession.context.ts           Client context
  session/useDemoSession.ts                Typed consumer
  session/tests/                          Hydration, schema, sign-in/out and storage tests
src/features/products/modules/
  catalog/products.api.ts                  Read-only collection/individual access
  catalog/products.data.ts                 API response validation and positive API IDs
  catalog/products.types.ts                Trusted Product model
  catalog/tests/                          API, validation, IDs and request tests
  demo/demoCatalog.types.ts                Draft, overlay, snapshot and action contracts
  demo/demoCatalog.validation.ts           Exact USD/field/schema/signed-route validation
  demo/demoCatalog.changes.ts              Pure create/edit/delete/merge/resolve functions
  demo/demoCatalog.store.ts                One persistent browser overlay owner
  demo/demoCatalog.context.ts              Client context
  demo/useDemoCatalog.ts                   Typed consumer
  demo/tests/                             CRUD, immutable merges, reload and failure tests
  management/productManagement.context.ts  Persistent editor action contract
  management/useProductManagement.ts       Table-to-editor consumer
  filtering/products.filters.ts           Pure query/category/sort behavior
  filtering/products.filters.types.ts      Three filter selections
  filtering/products.filters.context.ts    Catalog-scoped selection/action contract
  filtering/useProductFilters.ts           Consumer shared by streamed results
  filtering/tests/                        Defaults, AND matches, ties and purity
  imagery/products.imagery.ts              Illustrative title/category atlas mapping
  imagery/tests/                          Tile normalization and fallback tests
  pricing/products.pricing.ts              Exact integer-cent USD display
  pricing/tests/                          Normal and maximum-safe-integer prices
src/shared/
  api/apiClient.ts                         Server-only GET client
  api/tests/                              HTTP, JSON, timeout and framework exception tests
  modules/ui/selectField.types.ts          Shared option contract
  modules/ui/selectField.options.ts        Safe option encoding/decoding
  modules/ui/tests/                       Empty/arbitrary/disabled/invalid option tests
```

Tests cover domain/storage behavior and server streaming order. They do not replace browser checks for rendered menus, keyboard focus, route transitions or responsive layout.

## Component tree

This tree lists every application component file; framework internals/native elements are omitted. Paths start at `src/`, except `auth/` and `products/`, which start at `src/features/`. `{}` means no configurable props; route pages also receive their generated framework props. Components imported by client boundaries execute in that client subtree. Server content passed as provider `children` remains server-rendered.

```text
RootLayout — app/layout.tsx [Server; children; no state]
└── DemoSessionProvider — auth/components/DemoSessionProvider/DemoSessionProvider.tsx
    [Client; children; sole role-session store owner]
    └── DemoCatalogProvider — products/components/DemoCatalogProvider/DemoCatalogProvider.tsx
        [Client; children; sole saved catalog overlay owner]
        ├── StoreHeader — app/components/StoreHeader/StoreHeader.tsx [Server; {}]
        │   └── DemoAccountNav — app/components/DemoAccountNav/DemoAccountNav.tsx
        │       [Client; {}; reads role/actions; no duplicate session state]
        │       └── Icon — shared/components/ui/Icon/Icon.tsx
        │           [name/optional className; no state; decorative SVG, reused below]
        ├── Active route, one of:
        │   ├── CatalogLayout — app/(catalog)/layout.tsx [Server; children]
        │   │   ├── CatalogIntro — app/components/CatalogIntro/CatalogIntro.tsx [Server; {}]
        │   │   └── CatalogWorkspace — products/components/catalog/CatalogWorkspace/CatalogWorkspace.tsx
        │   │       [Client; children; sole query/category/sort owner; context actions]
        │   │       ├── ProductFilters — products/components/filtering/ProductFilters/ProductFilters.tsx
        │   │       │   [values/onChange/onReset; no state; search/sort/reset always present] → Icon
        │   │       │   └── SelectField — shared/components/ui/SelectField/SelectField.tsx
        │   │       │       [controlled API described above; Radix owns popup interaction] → Icon
        │   │       └── Request branch supplied through children:
        │   │           ├── Pending: CatalogLoading — app/(catalog)/loading.tsx [Server; {}]
        │   │           │   └── CatalogSkeleton — products/components/loading/CatalogSkeleton/CatalogSkeleton.tsx
        │   │           │       [{}; category/count/cards only, no search/sort placeholders]
        │   │           ├── Error: CatalogError — app/(catalog)/error.tsx [Client; error/reset/retry]
        │   │           │   └── RequestError — app/components/RequestError/RequestError.tsx
        │   │           │       [Client; title/children/retry; transition pending status]
        │   │           └── HomePage — app/(catalog)/page.tsx [Server; framework props; API snapshot]
        │   │               └── ProductCatalog — products/components/catalog/ProductCatalog/ProductCatalog.tsx
        │   │                   [Client; products; reads filters; derives overlay merge/categories/results]
        │   │                   ├── No effective records while storage loads: CatalogSkeleton
        │   │                   └── Ready:
        │   │                       ├── CatalogToolbar — products/components/filtering/CatalogToolbar/CatalogToolbar.tsx
        │   │                       │   [count/categories/category/onChange; no state] → SelectField
        │   │                       ├── Empty collection or no matches: contextual message/reset
        │   │                       └── Matches: ProductCard[] — products/components/catalog/ProductCard/ProductCard.tsx
        │   │                           [product; no state] → Icon
        │   │                           ├── ProductArtwork — products/components/catalog/ProductArtwork/ProductArtwork.tsx
        │   │                           │   [productTitle/category/optional className; no state]
        │   │                           └── StockStatus — products/components/catalog/StockStatus/StockStatus.tsx
        │   │                               [inStock; no state]
        │   │                               └── Badge — shared/components/ui/Badge/Badge.tsx
        │   │                                   [native span/ref props, className/variant/asChild; no state]
        │   ├── ProductPage — app/products/[id]/page.tsx
        │   │   [Server; async params/searchParams; positive individual read or negative local route]
        │   │   ├── Pending: ProductLoading — app/products/[id]/loading.tsx [Server; {}]
        │   │   │   └── ProductDetailsSkeleton — products/components/loading/ProductDetailsSkeleton/ProductDetailsSkeleton.tsx [{}]
        │   │   ├── Error: ProductError — app/products/[id]/error.tsx [Client; error/reset/retry] → RequestError
        │   │   ├── Invalid ID/API 404: ProductNotFound — app/products/[id]/not-found.tsx [Server; {}]
        │   │   │   └── MissingPage — app/components/MissingPage/MissingPage.tsx [Server; title/children]
        │   │   └── ProductDetailsView — products/components/details/ProductDetailsView/ProductDetailsView.tsx
        │   │       [Client; productId/apiProduct; derives local result; synchronizes document title]
        │   │       ├── Local hydration pending: ProductDetailsSkeleton
        │   │       ├── Missing/hidden local result: ProductUnavailable — products/components/details/ProductUnavailable/ProductUnavailable.tsx [{}]
        │   │       └── ProductDetails — products/components/details/ProductDetails/ProductDetails.tsx
        │   │           [Client subtree; product; no state] → Icon, ProductArtwork, StockStatus → Badge
        │   ├── LoginPage — app/login/page.tsx [Server; framework props]
        │   │   └── LoginPageLayout — app/components/LoginPageLayout/LoginPageLayout.tsx [Server; children] → Icon
        │   │       ├── ProductArtwork [Server decorative usage]
        │   │       └── DemoLogin — auth/components/DemoLogin/DemoLogin.tsx
        │   │           [Client; role=user; owns email/password/visibility/error; reads role session] → Icon
        │   ├── AdminLoginPage — app/admin/login/page.tsx [Server; framework props]
        │   │   └── LoginPageLayout → ProductArtwork + DemoLogin [role=admin]
        │   │       Form pending/guest/other-role; same-role confirmation; admin submit opens /admin.
        │   ├── AdminLayout — app/admin/(dashboard)/layout.tsx [Server; children] → Icon
        │   │   └── AdminAccessGuard — app/components/AdminAccessGuard/AdminAccessGuard.tsx
        │   │       [Client; children; reads role, redirects guest/user, shows session warnings]
        │   │       └── Admin session ready: ProductManager — products/components/management/ProductManager/ProductManager.tsx
        │   │           [Client; children; owns draft/errors/feedback/reset confirmation; editor-action context] → Icon
        │   │           ├── ProductChangeSummary — products/components/management/ProductChangeSummary/ProductChangeSummary.tsx
        │   │           │   [changes/isLoading; no state; derived counts or pending labels] → Icon
        │   │           ├── Reset requested: CatalogConfirmation — products/components/management/CatalogConfirmation/CatalogConfirmation.tsx
        │   │           │   [title/children/confirmLabel/onConfirm/onCancel; stable cancel mount focus]
        │   │           ├── ProductEditor — products/components/management/ProductEditor/ProductEditor.tsx
        │   │           │   [draft/errors/disabled, name/category/price refs, onChange/onSave/onCancel] → Icon
        │   │           │   └── SelectField [stock status; no availability filtering]
        │   │           ├── Saved changes: ProductTable — products/components/management/ProductTable/ProductTable.tsx
        │   │           │   [products/emptyMessage; empty message or scrollable table]
        │   │           │   └── ProductTableRow[] — products/components/management/ProductTableRow/ProductTableRow.tsx
        │   │           │       [product; owns row delete confirmation/ref; reads editor actions] → Icon
        │   │           │       └── Delete requested: CatalogConfirmation
        │   │           └── Request branch supplied through children:
        │   │               ├── AdminPage — app/admin/(dashboard)/page.tsx [Server; framework props; API snapshot]
        │   │               │   └── SharedProductList — products/components/management/SharedProductList/SharedProductList.tsx
        │   │               │       [Client; products; derives unchanged rows] → ProductTable
        │   │               ├── Pending: AdminLoading — app/admin/(dashboard)/loading.tsx [Server; {}]
        │   │               └── Error: AdminError — app/admin/(dashboard)/error.tsx [Client; error/reset/retry] → RequestError
        │   └── Unknown URL: NotFound — app/not-found.tsx [Server; {}] → MissingPage
        └── StoreFooter — app/components/StoreFooter/StoreFooter.tsx [Server; {}]
```

Badge retains [shadcn/ui](https://ui.shadcn.com/r/styles/new-york-v4/badge.json) attribution and its [MIT license](src/shared/components/ui/LICENSE). StockStatus uses secondary/outline with `asChild=false`, rendering a span; the general `asChild=true` API uses Radix Slot. SelectField and ProductArtwork own CSS Modules; loading components share `productSkeleton.css` with reduced-motion support. Other layouts use shared theme tokens and Tailwind.

Icon uses source-owned SVG paths with a shared 24px viewBox, stroke weight and `currentColor`. It has no client boundary or dependencies; its importing component determines server/client execution. Icons are decorative (`aria-hidden`, non-focusable), so a visible label or the control's accessible name supplies meaning.

Compare the active branches against React DevTools when available. Earlier browser automation had screenshot/pointer limitations; report remaining visual, keyboard and DevTools access limits rather than treating source review as browser proof.

## Illustrative product assets

The API supplies no photographs/descriptions. [catalog-atlas.png](public/products/catalog-atlas.png) is a labelled illustrative studio atlas, not inventory photography. Next Image optimizes its served format; known titles map to 12 square cells, unknown titles use category artwork, and unknown categories get a neutral fallback. Product facts remain API/local validated records.

Retail references: [Everlane](https://www.everlane.com/collections/womens-bags) and [Allbirds](https://www.allbirds.com/collections/mens-sneakers), without copying their product records or commercial claims. Built-in imagegen brief: one seamless warm-neutral 4-by-3 studio atlas; row 1 leather tote/canvas backpack/crossbody/white sneakers; row 2 running shoes/loafers/wool scarf/silver watch; row 3 sunglasses/duffel/rain boots/leather belt; consistent light/materials, no text/logos, each group inside the central 68% of its cell. Saved PNG: 1448×1086 with 362×362 cells.

## Learning and customization

**Roles versus real authorization:** a role controls which demo UI appears. The browser can be changed by its owner, so it cannot secure a shared service. That is why all CRUD is local and the external API still only accepts our GET reads.

**Snapshots and overlays:** the server owns the shared snapshot; the products provider owns only local additions/overrides/hiding. Rendering combines them. You do not need another synchronized copy of the merged catalog in React state.

**Persistence and boundaries:** `useSyncExternalStore` starts with a stable server snapshot, then subscribes and hydrates browser storage. The admin layout keeps the editor mounted while its child route retries the shared read, preserving the draft.

**Loading boundaries:** Next's `loading.tsx` replaces its page content, while the surrounding layout stays mounted. CatalogWorkspace uses this boundary to keep search/sort ready and preserve selections during retry. Context lets the controls and arriving results share one set of selections without copying the product data into state.

**Change it yourself:** edit demoAccounts for public role credentials; demoCatalog.validation.ts for form rules; demoCatalog.changes.ts for mutation/merge rules; ProductEditor for fields; SelectField.module.css for the option panel. Update corresponding tests in the owning `tests/` folder.

For dashboard presentation, edit ProductChangeSummary's labels and layout. To change an icon, select a supported `name` from Icon.tsx and adjust its `className` for size or color; retain the accompanying text label.

**Small exercise:** change the initial sort to price low to high in `products.filters.ts`, adjust the defaults test, and explain why the sort choice can render before any products arrive. For new UI controls, use ProductFilters when choices are fixed and CatalogToolbar when choices depend on loaded products.
