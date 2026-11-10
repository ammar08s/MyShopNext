import type { ReactElement } from "react";
import { CatalogSkeleton } from "@/features/products/components/loading/CatalogSkeleton/CatalogSkeleton";

interface Props {
  children?: never;
}

/**
 * Supplies the native catalog route loading fallback.
 * @param _props - Empty framework props; no configurable inputs.
 * @returns A decorative collection skeleton.
 */
export default function CatalogLoading(_props: Props): ReactElement {
  return <CatalogSkeleton />;
}
