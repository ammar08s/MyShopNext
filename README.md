# ShopBoard

A Next.js App Router and TypeScript foundation for rebuilding the [original ShopBoard store](https://github.com/ammar08s/Shopboard_React), with Tailwind CSS v4 and source-owned shadcn/ui controls.

Currently implemented: a responsive ShopBoard holding page, shared Badge primitive, a light green/neutral theme, project rules, and development checks. Catalog, product details, cart, checkout, and demo administration are planned features, not working routes yet. This initial page makes no requests to the class API.

Product scope and API/storage contracts live in [design.md](design.md). Engineering and mentoring rules live in [AGENTS.md](AGENTS.md). No `CLAUDE.md` is required.

## Run locally

Use Node.js **22.22.1 or newer**, as required by the installed lint-staged tooling, and npm.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`. If Next.js reports an existing server for this project, reuse its printed URL.

For production, run `npm run build`, then `npm start`. The holding page requires no environment variables. Add the server-only `SHOPBOARD_API_BASE_URL` override and its environment example when API reads are implemented.

## Commands and commit checks

| Command                | Purpose                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start Next.js with development updates.                                                                   |
| `npm run lint`         | Run Next.js ESLint rules; warnings fail the check.                                                        |
| `npm run typecheck`    | Generate Next route types, then run TypeScript without emitting JavaScript. Works before the first build. |
| `npm run format`       | Apply Prettier formatting.                                                                                |
| `npm run format:check` | Check formatting without changing files.                                                                  |
| `npm run build`        | Create the optimized production application.                                                              |
| `npm start`            | Serve an existing production build.                                                                       |
| `npm run prepare`      | Activate Husky; normally invoked automatically by npm install.                                            |

The pre-commit hook runs ESLint on staged TypeScript/JavaScript, Prettier on supported staged files, and a full-project typecheck inside lint-staged. Checks finish before unstaged edits to partially staged files are restored, so an unstaged correction cannot hide a staged type error. Checks do not automatically fix or stage files. Tasks run serially, use relative paths, and cap argument batches at 4096 characters for Windows. Local hooks do not replace CI.

`.gitattributes` and Prettier enforce LF text. Generated output, the lockfile, and third-party skills are excluded from formatting. Skill bundles are also excluded from application linting and Tailwind scanning. No unit-test framework was added for this static foundation; add focused behavior tests when business logic, API validation, storage, and bug fixes are implemented.

## Files and responsibilities

```text
src/
  app/
    layout.tsx                       Root document, global styles, metadata
    page.tsx                         Server-rendered / holding page
  shared/
    components/ui/
      Badge/Badge.tsx                Source-owned shadcn/ui badge
      LICENSE                        Upstream shadcn MIT license
    modules/ui/
      badgeVariants.ts               Badge appearance variants
      cn.ts                          Conditional/conflicting class merging
    styles/globals.css               Tailwind sources, theme, base styles
components.json                      shadcn CLI paths and theme settings
next.config.ts                       Minimal typed Next.js configuration
postcss.config.mjs                   Tailwind v4 build integration
eslint.config.mjs                    Next.js lint rules and ignores
.prettierrc.json                      Formatting preferences
.prettierignore                       Generated/vendor formatting exclusions
.gitattributes                       LF text convention
.gitignore                           Generated output and local secrets
package.json                         Dependencies, scripts, Node requirement
package-lock.json                    Reproducible dependency versions
lint-staged.config.mjs               Staged checks and full typecheck
.husky/pre-commit                    Commit-check entry point
.agents/skills/                      Complete Vercel skill bundles
AGENTS.md                            Engineering and mentoring rules
design.md                            Approved foundation and later feature scope
```

No feature folders or providers exist before they have real behavior. Future features separate UI in `components/` from non-UI responsibilities in `modules/`. Features communicate through application composition.

## Component tree

Every current component file is listed; Next.js internal components are omitted.

```text
RootLayout — src/app/layout.tsx [Server Component]
Props: { children: ReactNode }; owns no state.
└── HomePage — src/app/page.tsx [/; Server Component]
    Props: Next.js PageProps<"/"> plus children?: never; no configurable inputs.
    Owns no state and makes no API requests.
    └── Badge — src/shared/components/ui/Badge/Badge.tsx
        Props: native span attributes/ref; optional className, variant, asChild.
        variant: default | secondary | destructive | outline | ghost | link.
        The page uses secondary. asChild defaults to false, rendering a span.
        With asChild=true, Radix Slot applies the badge props to one child.
        Owns no state; static usage needs no client boundary.
```

For unmatched URLs, Next.js renders its built-in not-found UI inside the root layout; HomePage and Badge are not mounted. No application-defined loading/error branches or browser state owners exist yet.

In React DevTools, compare the available server component tree with the tree above. Browser UI verification was unavailable during initialization: the browser access host was unavailable, and native Computer Use stopped because it could not confidently determine Chrome's URL. The DevTools Components-tab comparison remains unverified.

## Starter cleanup and setup decisions

- Moved the active routes from root `app/` to `src/app/` and changed `@/` imports to resolve inside `src/`.
- Replaced Next.js promotional content and metadata with ShopBoard content. Removed Google font loading; system fonts avoid network font downloads during builds.
- Removed `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, and the default favicon. Removed the empty `public/` folder; recreate it when real static assets are needed.
- Replaced the custom Tailwind Turbopack loader and unneeded experimental/cache settings with minimal Next.js defaults and Tailwind's PostCSS integration. Set `agentRules: false` to prevent Next.js from automatically appending managed instructions to the project's authoritative `AGENTS.md`.
- Added shadcn configuration, Badge, class merging, variants, theme tokens, and only their required runtime dependencies. No extra router, query cache, form library, icon library, or state library was added.
- Added development checks and complete Vercel skills. Updated AGENTS.md for Next.js while preserving the requested mentoring guidelines.

Badge is adapted from the [official shadcn new-york-v4 source](https://ui.shadcn.com/r/styles/new-york-v4/badge.json). Rendering, variant definitions, and class merging are separated to match project rules. The granular `@radix-ui/react-slot` package provides child composition without a larger primitive bundle. The upstream [MIT license](src/shared/components/ui/LICENSE) is retained.

## Learning walkthrough

**How Next.js builds the page:** `src/app/layout.tsx` creates the HTML document and receives the active page as `children`. `src/app/page.tsx` is the `/` route. No manual React mounting or React Router is needed. Both are Server Components by default, and this static page can be prerendered.

**When client code is needed:** add a focused Client Component for event handlers, React state, or browser APIs such as localStorage. Do not mark the entire layout `"use client"` for one interactive section. Later, a cart provider can wrap route content without converting all that content to client code.

**How shadcn works:** Badge is source code you own, rather than a remote widget. `components.json` tells the CLI where UI and utilities live. Tailwind utilities describe appearance; CSS variables supply reusable colors. `badgeVariants.ts` maps a variant to classes. `cn.ts` combines conditional classes and resolves conflicting utilities.

**Try changing the project:**

1. Edit the heading or paragraph in `src/app/page.tsx`; the development server updates the page.
2. Change Badge from `variant="secondary"` to `variant="outline"`.
3. Adjust shared colors in `src/shared/styles/globals.css`.
4. Add a future route at `src/app/<route>/page.tsx`. Put substantial UI/data logic in its feature. When introducing the first feature, add `@source "../../features";` to the shared stylesheet so Tailwind compiles its utilities.
5. Add shadcn controls only when needed with `npx shadcn@latest add <name>`. The CLI can generate a lowercase flat file; move/adapt it into the required component folder, split non-UI variants into modules, add Props/JSDoc, and update imports directly.

**Small exercise:** change the badge text to “My ShopBoard”, select its `outline` variant, and add a short welcome sentence below the heading. Run lint, typecheck, and formatting checks afterward.

## Read-only API and local demo boundary

Future catalog and product pages will read `GET /api/products` and `GET /api/products/{id}` through validated server-only feature functions. Neither request is implemented in this initial page.

Product additions/edits/deletions, cart data, and comments will use versioned, validated browser storage. They will not affect classmates or synchronize across devices. Demo checkout will create no order/payment and will not save or transmit delivery details. See [design.md](design.md) for the migration contract.
