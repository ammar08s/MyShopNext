import Link from "next/link";
import type { ReactElement } from "react";
import { DemoAccountNav } from "@/app/components/DemoAccountNav/DemoAccountNav";

interface Props {
  children?: never;
}

/**
 * Renders persistent store navigation; takes no configurable inputs.
 * @param _props - Empty component props.
 * @returns A header available during route loading and recovery.
 */
export function StoreHeader(_props: Props): ReactElement {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 border-b px-5 py-6 sm:px-8 lg:px-12">
      <Link
        href="/"
        className="inline-flex items-center gap-3 rounded-sm text-2xl font-semibold tracking-tight"
      >
        <span
          aria-hidden="true"
          className="grid grid-cols-2 gap-1 text-primary"
        >
          <span className="size-2 rounded-xs bg-current" />
          <span className="size-2 rounded-xs bg-current" />
          <span className="size-2 rounded-xs bg-current" />
          <span className="size-2 rounded-xs bg-current" />
        </span>
        ShopBoard
      </Link>
      <nav
        aria-label="Main navigation"
        className="flex flex-wrap items-center gap-3 text-sm sm:gap-6"
      >
        <Link
          href="/"
          className="rounded-sm underline decoration-primary/40 underline-offset-8 hover:decoration-primary"
        >
          <span className="hidden sm:inline">The collection</span>
          <span className="sm:hidden">Shop</span>
        </Link>
        <DemoAccountNav />
      </nav>
    </header>
  );
}
