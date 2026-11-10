# ShopBoard Project Rules

These instructions apply throughout this repository. Keep this document updated when project conventions change.

`AGENTS.md` is the authoritative engineering rules file. No `CLAUDE.md` is required; do not create a duplicate rules file unless explicitly requested.

## Project Engineering Guidelines

These guidelines apply throughout development. Explicit design approval is required before significant implementation; documentation edits alone do not approve application changes.

### Role

Act as a senior software engineer and mentor. Prioritize maintainability, simplicity, correctness, accessibility, and learning.

### Development Workflow

- Use Superpowers brainstorming before major features.
- Do not implement significant changes before I approve the design.
- Create an implementation plan with small tasks.
- Implement and verify one task at a time.
- Review changes before considering a feature complete.

### Architecture

- Follow Next.js App Router conventions.
- Use TypeScript and explicit types.
- Prefer Server Components unless client interactivity is needed.
- Keep code organized by feature where practical.
- Separate UI, business logic, and data access.
- Avoid unnecessary abstractions and dependencies.

### Code Quality

- Prefer readable code over clever code.
- Use meaningful names.
- Keep functions and components focused.
- Avoid duplication when abstraction improves clarity.
- Do not refactor unrelated code without approval.
- Never introduce secrets into source control.

### Testing

- Write tests for important behavior and bug fixes.
- Run relevant tests after changes.
- Run lint and build checks before completion.
- Never claim tests passed without executing them.

### Learning

After each completed feature:

1. Explain what was implemented.
2. Identify important files and responsibilities.
3. Explain new concepts in beginner-friendly English.
4. Show how I can modify the feature myself.
5. Give me one small coding exercise.

### Communication

- Explain important architectural decisions.
- Discuss meaningful trade-offs.
- Ask before making major technical decisions.
- Do not introduce complexity without a clear reason.

## Scope and stack

- Build ShopBoard with Next.js App Router, React, strict TypeScript, Tailwind CSS v4, and source-owned shadcn/ui primitives.
- This repository contains the storefront. Server rendering and server-only reads are allowed; do not add a backend, database, or API proxy without a separately approved need.
- Use Tailwind utilities and shared theme tokens for layouts and controls. Use colocated CSS Modules when custom CSS improves clarity. The standard Tailwind reset is enabled. Keep Tailwind source scanning restricted to application code, shared components, and relevant variant modules; never scan third-party skill bundles.
- Keep the shared class API read-only. Product additions, edits, deletions, cart changes, and comments are browser-only demo features; never send write requests to that service.
- Keep product requirements, user flows, and backend contracts in `design.md`. This file defines engineering and agent working rules.

## Feature-based architecture

- Organize code around features, not project-wide technical categories.
- **Each feature separates UI into `components/` and non-UI code into `modules/`. Each component owns a folder containing its component, with styles and UI tests when needed. Modules group state/hooks, business logic, API access, validation, types, and tests by responsibility. Components may import modules; modules must never import components. Split by responsibility, without empty folders or trivial wrapper components.**
- Use `components/<ComponentName>/<ComponentName>.tsx` for feature entry points and small component collections. When a feature's UI grows, group related component folders by responsibility using `components/<responsibility>/<ComponentName>/<ComponentName>.tsx`, such as `catalog/`, `filtering/`, `loading/`, and `feedback/`. Colocate any custom CSS Module in its owning component folder. Keep exactly one component per file; do not create empty stylesheets for utility-styled components.
- Use descriptive responsibility folders such as `modules/catalog/`, `modules/filtering/`, and `modules/pricing/`; do not recreate a flat collection of unrelated logic files inside `modules/`.
- Keep tests in a dedicated `tests/` folder inside the module or component they exercise, such as `modules/catalog/tests/products.data.test.ts`. Do not mix test files directly among production files or collect unrelated tests in one project-wide folder. Name hooks with a `use` prefix, such as `useProducts.ts` or `useProductFilters.ts`.
- Keep feature-specific types with the module that owns their domain. UI-only types belong with their component.
- Keep only genuinely shared feature UI rules in clearly named stylesheets under the narrowest owning `components/` group, such as `components/loading/productSkeleton.css`; component-specific selectors and responsive rules belong beside their component.
- Do not create empty files, folders, barrel files, or abstractions to satisfy the structure. Create only the parts a feature actually needs.
- Use `src/app/` for App Router routes, layouts, metadata, providers, and coordination between features. Keep route entry points thin as features grow.
- The document root is `src/app/layout.tsx`; `src/app/page.tsx` owns `/`. Framework entry points keep their Next.js filenames. Put other application UI in `src/app/components/<ComponentName>/`. Next.js owns bootstrapping; do not add `App.tsx`, `main.tsx`, or React Router.
- Use `src/shared/` for reusable, feature-independent code and styles. Do not create one large shared file.
- Features may import shared code. Shared code must never import feature or application code.
- Features must not import directly from other features. Coordinate them through the application layer and explicit props or callbacks.
- Extract code into shared only when it has a clear reusable responsibility; avoid speculative reuse.

Illustrative structure; create only the parts actually needed:

```text
src/
  app/
    layout.tsx
    page.tsx
    components/
      StoreHeader/
        StoreHeader.tsx
        StoreHeader.module.css
  features/
    products/
      components/
        Products/
          Products.tsx
        catalog/
          ProductCatalog/
            ProductCatalog.tsx
            ProductCatalog.module.css
          ProductCard/
            ProductCard.tsx
            ProductCard.module.css
        filtering/
          ProductFilters/
            ProductFilters.tsx
            ProductFilters.module.css
        loading/
          ProductLoading/
            ProductLoading.tsx
            ProductLoading.module.css
          productSkeleton.css
      modules/
        catalog/
          products.api.ts
          products.data.ts
          products.types.ts
          useProducts.ts
          tests/
            products.data.test.ts
        filtering/
          products.filters.ts
          products.filters.types.ts
          useProductFilters.ts
          tests/
            products.filters.test.ts
  shared/
    api/
      apiClient.ts
    styles/
      globals.css
      typography.css
```

`modules/catalog/products.api.ts` is the products feature's server-only data access file when that feature is implemented. Its response validation and domain model belong in the same catalog module. Filtering and pricing have their own focused modules. Import files directly rather than through re-export barrels. The tree is illustrative; only implemented responsibilities need folders.

## Clean code

- Give every function one clear responsibility. Split functions when they combine unrelated jobs.
- Prefer descriptive names, small modules, guard clauses, and straightforward control flow.
- Keep business rules separate from rendering and HTTP details.
- Prefer composition over large configurable components or unnecessary inheritance.
- Avoid duplicated business rules, magic values, deeply nested conditions, and premature abstractions.
- Do not enforce arbitrary line limits; split code when responsibilities or readability require it.
- Remove unused code and imports. Do not leave commented-out implementations.

## Function documentation

- Every function must have a documentation comment immediately above it explaining its purpose, inputs, and output.
- Use JSDoc with `@param` for each parameter and `@returns` for the result.
- Explicitly state when there are no inputs or no returned value.
- Document side effects and meaningful error behavior when applicable.
- This rule includes components, hooks, helpers, handlers, and anonymous callbacks. Prefer named functions when that makes documentation clearer.
- Keep comments accurate when behavior changes; explain the contract rather than narrating each implementation line.

```ts
/**
 * Filters products by their names.
 * @param products - Products to search.
 * @param query - Search text to match against product names.
 * @returns Products whose names contain the search text.
 */
function searchProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  /**
   * Checks whether a product matches the normalized query.
   * @param product - Product to check.
   * @returns Whether the product name contains the query.
   */
  function matchesQuery(product: Product): boolean {
    return product.name.toLowerCase().includes(normalizedQuery);
  }

  return products.filter(matchesQuery);
}
```

## TypeScript

- Enable and preserve TypeScript strict mode.
- Do not use `any`, type assertions (`as` or angle-bracket assertions), or non-null assertions (`value!`) unless there is a documented reason immediately beside the usage.
- Exceptions must explain why narrowing, validation, or a better type cannot reasonably solve the problem. Do not use assertions merely to silence errors.
- `as const` falls under the assertion rule. Logical negation (`!condition`) is allowed. Import aliases (`import { name as alias }`) are unrelated to type assertions.
- Prefer explicit null checks, discriminated unions, type guards, and accurate domain types.
- Treat untrusted external data as `unknown` and validate it before using it as application data. A generic request return type alone does not validate a response.
- Explicitly type component props and API function inputs and outputs. Infer obvious local types.
- Use type-only imports where appropriate. Do not bypass compiler checks with suppression comments without a documented reason.

## Next.js, React, and state

- Keep exactly one React component per file. Each component must declare a typed `Props` interface; components without configurable props may use `interface Props { children?: never }`.
- Apply the repository skills at `.agents/skills/vercel-composition-patterns/SKILL.md` and `.agents/skills/vercel-react-best-practices/SKILL.md` when writing or reviewing React code; apply rules appropriate to Next.js and the server/client boundary.
- Apply `code-simplifier` to touched code during implementation and final review, preserving behavior and the required function documentation.

- Use function components and follow the Rules of Hooks. Keep layouts and pages as Server Components by default; add `"use client"` only for interactivity, hooks, browser APIs, or client context. Do not mark the whole application as client-rendered for a small interactive section.
- Pass validated, serializable data across server/client boundaries. Keep ordinary callbacks within the client application composition layer. Keep server-only modules out of client imports, and pass server-rendered content through `children` when composing a client provider.
- Prefer children for composing UI structure. Use render callbacks when the caller needs data or actions owned by the child, such as dashboard list actions or Error Boundary reset controls. Consolidate repeated request gating through composition instead of adding boolean modes or duplicate wrappers.
- Use Next.js file-based routes, `next/link`, and the appropriate `next/navigation` APIs for route parameters and internal navigation. Use framework-generated `PageProps`/`LayoutProps` where useful, awaiting asynchronous route parameters when read. Do not add manual route-module loaders.
- Use Next.js metadata, `loading.tsx`, `error.tsx`, `not-found.tsx`, and focused Suspense boundaries where needed. Keep persistent providers, editors, and unrelated UI outside request recovery boundaries. Ensure retries actually retry the relevant server read.
- Server-rendered route data owns the API snapshot. Derive filtered/merged products without copying the snapshot into state or fetching it again in a browser query cache. Do not add TanStack Query or a mandatory QueryClient without a concrete requirement. Expected empty/not-found/no-match results are ordinary UI; unexpected failures reach the appropriate Error Boundary.
- Use effects only to synchronize external systems: document title/focus, timers, and request lifetime/cancellation. Use event handlers for user actions, derive computed values during rendering, and prefer stable mount refs when focus is needed only as a confirmation appears.
- Keep rendering pure. Perform user-triggered work in event handlers and use effects for synchronization with external systems.
- Start with React's built-in state tools. Add a state library only when a concrete need justifies it.
- Keep state close to where it is used. Lift it only when consumers need to share it.
- When cart functionality is implemented, keep one client `CartProvider` in a persistent application layout above route loading/error boundaries. Read it through the cart feature's `useCart()` consumer and change it only through provider actions. Keep product-to-cart coordination in application Client Components so features do not import each other. Component-local state stays local; do not create unused providers during initialization.
- Every piece of state must have one owner and one copy. Anything that can be calculated from existing state or props is derived data, not state. Calculate it during rendering instead of storing or synchronizing a separate copy.
- Use functional state setters when an update depends on the previous value, so queued actions use the latest state. Keep updater functions pure; persistence and notifications belong in event handlers.
- When checkout is implemented, React Hook Form owns its field values, touched state, errors, and submission status. Keep all validation and normalization in one Zod schema connected through `zodResolver`; do not duplicate rules in components or registration options. Keep form state local and coordinate checkout with cart actions through the application layer. Do not install form dependencies before the feature needs them.
- Hydrate versioned, validated localStorage data through a client-safe mechanism. Initial server output and the first client render must agree. Do not read browser storage at module scope or render time, or overwrite saved data with defaults before loading it. Recover from corrupt/blocked storage, keep the current visit usable, and explain persistence failures.
- Never mutate React state directly. Use stable identifiers for list keys.
- Extract custom hooks when stateful behavior has a clear independent responsibility; do not add hooks solely to wrap a single trivial expression.

## API client and data access

- When API access is implemented, centralize server-only base URL configuration, GET execution, HTTP error handling, and response parsing in `src/shared/api/apiClient.ts`.
- Put feature endpoints in the owning module's API file, such as `features/products/modules/catalog/products.api.ts`, using the shared client.
- UI components must not call `fetch` directly or contain endpoint URLs.
- Expose clearly named, server-only reads such as `getProducts` and `getProduct`, with typed inputs and outputs. Never expose HTTP `POST`, `PUT`, `PATCH`, or `DELETE` for the shared class API. Implement demo mutations in browser storage modules with explicit names such as `createDemoProduct`.
- Validate response data at the data boundary and map backend models to frontend models when necessary.
- Keep HTTP concerns in the client and business rules in feature logic.
- Define request/caching policy in the owning feature module. Start migrated API reads with explicit `cache: "no-store"`; add caching only for a documented need. Do not rely on implicit build-time snapshots or duplicate server data in client state. Server Components call feature API functions directly rather than adding an internal proxy route.
- Handle failed requests explicitly. Provide appropriate loading, error, empty, and success states in the UI.
- Prevent duplicate submissions while mutations are pending and handle stale or cancelled requests when relevant.
- Read deployment-specific API configuration from a server-only variable such as `SHOPBOARD_API_BASE_URL` when the client is implemented. Never put secrets in source control, browser bundles, or `NEXT_PUBLIC_*` variables.
- Keep mock data behind the same feature data interface when mocks are needed.
- Demo admin controls do not provide real authentication or authorization. They must never enable shared API writes. Demo checkout creates no order/payment; never persist, log, or transmit contact/delivery data.

## CSS and accessibility

- Keep custom CSS Modules beside the UI they style. Add only stylesheets that are actually needed.
- Use mobile-first responsive Tailwind utilities or CSS.
- Use scoped CSS Modules or descriptive, feature-prefixed selectors to reduce collisions.
- Keep the global Tailwind import/reset, base typography, and reusable theme variables in `src/shared/styles/globals.css`. Update its explicit source paths when adding a new feature so its utility classes are compiled.
- Use CSS variables for repeated design values such as colors and spacing.
- Avoid business logic that depends on CSS class names or styling implementation details.
- Use semantic HTML, accessible form labels, keyboard-operable controls, and visible focus styles.
- Build layouts that remain usable on small and large screens.

## Dependencies and working practices

- Inspect existing code and conventions before making changes.
- Prefer existing tools and native platform capabilities. Justify new dependencies with a concrete need and avoid adding libraries speculatively.
- Keep changes focused on the requested task. Preserve unrelated user changes.
- Keep only requested application code, tests, configuration, skills, and durable project documentation in this repository. Do not add AI chat transcripts, implementation plans, agent progress/review logs, scratch files, or temporary verification assets; keep working artifacts outside the repository. Product requirements belong in `design.md`, setup and usage in `README.md`, and engineering rules here.
- Keep naming consistent: PascalCase for components and component files; camelCase for functions and variables; `use` prefixes for hooks; descriptive feature filenames such as `products.api.ts`.
- Use the existing Next.js ESLint and Prettier configurations; do not add a second linter without a concrete reason. Prefix intentionally unused framework parameters with `_`.
- Run `npm run format` to apply project formatting and `npm run format:check` to check it without changing files. Keep LF text line endings as defined in `.gitattributes`.
- Keep complete project-scoped Codex skills in `.agents/skills/`, including their referenced rule files. Preserve third-party skill contents and exclude them from application formatting and linting.
- Keep the Husky pre-commit hook active through the `prepare` script. Its `lint-staged.config.mjs` tasks check staged TypeScript/JavaScript with ESLint, supported staged files with Prettier, and the full project with `npm run typecheck` before restoring unstaged edits to partially staged files. Run tasks serially with relative paths and a 4096-character argument limit on Windows. Checks do not automatically rewrite or stage fixes. Fix failures before committing.
- Update relevant documentation when architecture, setup, or behavior changes.
- Keep the README component tree rooted at `RootLayout` synchronized with every component file, its props, conditional rendering, server/client boundary, and state ownership. Verify it in React DevTools' Components tab when available; report any access limitation explicitly.
- Discuss significant architecture changes or unclear product requirements before implementing them. Routine decisions within these rules can proceed.

## Validation and completion

- For code changes, run `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build` before reporting completion.
- Add focused behavior tests for meaningful business logic and bug fixes when test tooling is available. Do not introduce a testing framework without a concrete need.
- Manually check affected UI behavior, responsive layouts, and relevant loading, error, empty, and success states when the application can be run.
- Documentation-only changes require checking the resulting document, not running application tests.
- Report what changed, what was verified, and any remaining limitations. Never claim a check passed unless it was actually run successfully.
