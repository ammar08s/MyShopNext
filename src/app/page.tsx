import type { ReactElement } from "react";
import { Badge } from "@/shared/components/ui/Badge/Badge";

interface Props extends PageProps<"/"> {
  children?: never;
}

/**
 * Introduces ShopBoard while the storefront features are being migrated.
 * @param _props - Framework route props; this page has no configurable inputs.
 * @returns A responsive, server-rendered holding page without API requests.
 */
export default function HomePage(_props: Props): ReactElement {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-16">
      <section
        aria-labelledby="shopboard-title"
        className="w-full max-w-xl rounded-2xl border bg-card p-8 text-card-foreground shadow-sm sm:p-12"
      >
        <Badge variant="secondary">Storefront in progress</Badge>
        <h1
          id="shopboard-title"
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          ShopBoard
        </h1>
        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
          A fresh place to discover your next find. Our collection will be ready
          to explore soon.
        </p>
      </section>
    </main>
  );
}
