import type { ReactElement } from "react";
import { ProductDetailsSkeleton } from "@/features/products/components/loading/ProductDetailsSkeleton/ProductDetailsSkeleton";

interface Props {
  children?: never;
}

/**
 * Supplies the native individual product route loading fallback.
 * @param _props - Empty framework props; no configurable inputs.
 * @returns The product-shaped skeleton page.
 */
export default function ProductLoading(_props: Props): ReactElement {
  return <ProductDetailsSkeleton />;
}
