import Link from "next/link";
import type { ReactElement } from "react";

interface Props {
  children?: never;
}

/**
 * Explains an expected browser-local deletion or missing demo product.
 * @param _props - Empty component props; no configurable inputs.
 * @returns A missing-product landmark with a working catalog route.
 */
export function ProductUnavailable(_props: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-20 text-center sm:px-8 lg:px-12"
    >
      <h1 className="text-4xl font-medium tracking-tight">Product not found</h1>
      <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted-foreground">
        This product was removed from your demo catalog or isn’t saved in this
        browser.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-primary px-5 py-3 text-sm text-primary-foreground"
      >
        Back to catalog
      </Link>
    </main>
  );
}
