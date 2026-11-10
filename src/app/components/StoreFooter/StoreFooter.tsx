import type { ReactElement } from "react";

interface Props {
  children?: never;
}

/**
 * Renders the shared store footer; takes no configurable inputs.
 * @param _props - Empty component props.
 * @returns The store identity and explicit price currency.
 */
export function StoreFooter(_props: Props): ReactElement {
  return (
    <footer className="mx-auto mt-auto flex w-full max-w-7xl flex-wrap justify-between gap-3 border-t px-5 py-7 text-xs text-muted-foreground sm:px-8 lg:px-12">
      <p>ShopBoard · Everyday discovery.</p>
      <p>All prices in USD.</p>
    </footer>
  );
}
