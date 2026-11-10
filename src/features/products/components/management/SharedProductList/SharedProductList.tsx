"use client";
import type { ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { getSharedProducts } from "@/features/products/modules/demo/demoCatalog.changes";
import { useDemoCatalog } from "@/features/products/modules/demo/useDemoCatalog";
import { ProductTable } from "../ProductTable/ProductTable";

interface Props {
  products: readonly Product[];
}

/**
 * Derives unchanged shared rows without duplicating saved records or server data.
 * @param props - Validated route-owned API snapshot.
 * @returns The shared table once local changes have hydrated.
 */
export function SharedProductList({ products }: Props): ReactElement {
  const { snapshot } = useDemoCatalog();
  const sharedProducts = getSharedProducts(products, snapshot.changes);
  return (
    <section aria-labelledby="shared-products-title">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 id="shared-products-title" className="text-lg font-semibold">
            Shared catalog
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Edits become local demo copies in the section above.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {sharedProducts.length}
        </span>
      </div>
      {snapshot.status === "loading" ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading saved demo changes…
        </p>
      ) : (
        <ProductTable
          products={sharedProducts}
          emptyMessage="No unchanged shared products remain. Check your saved demo changes or reset the demo catalog."
        />
      )}
    </section>
  );
}
