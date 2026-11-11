import type { ReactElement } from "react";
import { MissingPage } from "@/app/components/MissingPage/MissingPage";

interface Props {
  children?: never;
}

/**
 * Handles invalid route IDs and missing products; takes no configurable inputs.
 * @param _props - Empty framework props.
 * @returns Distinct missing-product feedback and a catalog link.
 */
export default function ProductNotFound(_props: Props): ReactElement {
  return (
    <MissingPage title="Product not found">
      This product may no longer be available, or the link may be incorrect.
      There are more finds to explore in the collection.
    </MissingPage>
  );
}
