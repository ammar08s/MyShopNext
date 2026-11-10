import type { ReactElement } from "react";

interface Props {
  children?: never;
}

/**
 * Introduces the catalog outside its request boundary.
 * @param _props - Empty component props; no configurable inputs.
 * @returns A responsive introduction that remains visible during recovery.
 */
export function CatalogIntro(_props: Props): ReactElement {
  return (
    <section
      aria-labelledby="catalog-title"
      className="flex flex-col justify-between gap-5 border-b py-9 sm:py-11 lg:flex-row lg:items-end"
    >
      <div>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
          The ShopBoard collection
        </p>
        <h1
          id="catalog-title"
          className="max-w-2xl text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl"
        >
          Everyday, a little better.
        </h1>
      </div>
      <p className="max-w-xs text-sm leading-6 text-muted-foreground">
        Explore bags, shoes and accessories.
        <br />A little something for wherever you’re headed.
      </p>
    </section>
  );
}
