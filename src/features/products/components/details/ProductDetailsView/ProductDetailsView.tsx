"use client";
import { useEffect, type ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { getDemoProduct } from "@/features/products/modules/demo/demoCatalog.changes";
import { useDemoCatalog } from "@/features/products/modules/demo/useDemoCatalog";
import { ProductDetailsSkeleton } from "../../loading/ProductDetailsSkeleton/ProductDetailsSkeleton";
import { ProductDetails } from "../ProductDetails/ProductDetails";
import { ProductUnavailable } from "../ProductUnavailable/ProductUnavailable";

interface Props {
  productId: number;
  apiProduct: Product | null;
}

/**
 * Applies local edits/deletions to one API product or resolves a local-only route.
 * @param props - Canonical route identity and the individual server snapshot.
 * @returns Browser-aware details without fetching or copying server products into state.
 */
export function ProductDetailsView({
  productId,
  apiProduct,
}: Props): ReactElement {
  const { snapshot } = useDemoCatalog();
  const product = getDemoProduct(productId, apiProduct, snapshot.changes);
  const title = product?.title ?? "Product not found";
  const storageFeedback = snapshot.warning ? (
    <p
      role="status"
      className="mx-auto mb-6 max-w-3xl px-5 text-sm text-muted-foreground"
    >
      {snapshot.warning}
    </p>
  ) : null;
  /** @returns No value; takes no inputs and synchronizes browser-only product title edits. */
  function synchronizeTitle(): void {
    if (snapshot.status === "ready") document.title = `${title} | ShopBoard`;
  }
  useEffect(synchronizeTitle, [snapshot.status, title]);
  if (snapshot.status === "loading" && apiProduct === null)
    return <ProductDetailsSkeleton />;
  if (product === null)
    return (
      <>
        <ProductUnavailable />
        {storageFeedback}
      </>
    );
  return (
    <>
      <ProductDetails product={product} />
      {storageFeedback}
    </>
  );
}
