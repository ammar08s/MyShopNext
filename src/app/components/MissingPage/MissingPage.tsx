import Link from "next/link";
import type { ReactElement, ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

/**
 * Presents an expected missing route or product with useful navigation.
 * @param props - Page heading and contextual missing-content explanation.
 * @returns A complete page landmark with a catalog link.
 */
export function MissingPage({ title, children }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-20 text-center sm:px-8 lg:px-12"
    >
      <p className="mb-4 text-xs tracking-widest text-muted-foreground uppercase">
        Nothing here just yet
      </p>
      <h1 className="text-4xl font-medium tracking-tight">{title}</h1>
      <div className="mx-auto mt-5 max-w-md text-sm leading-6 text-muted-foreground">
        {children}
      </div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Back to catalog
      </Link>
    </main>
  );
}
