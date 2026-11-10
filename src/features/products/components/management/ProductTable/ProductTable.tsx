import type { ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { ProductTableRow } from "../ProductTableRow/ProductTableRow";

interface Props {
  products: readonly Product[];
  emptyMessage: string;
}

/**
 * Displays a readable product management table with responsive overflow.
 * @param props - Rows and contextual empty feedback.
 * @returns Product controls or an ordinary empty state.
 */
export function ProductTable({ products, emptyMessage }: Props): ReactElement {
  /** @param product - One table product. @returns A stable action row. */
  function renderProduct(product: Product): ReactElement {
    return <ProductTableRow key={product.id} product={product} />;
  }
  if (products.length === 0)
    return (
      <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  return (
    <div
      role="region"
      aria-label="Product management table"
      tabIndex={0}
      className="overflow-x-auto rounded-xl border bg-card"
    >
      <table className="w-full min-w-[34rem] text-left text-sm">
        <caption className="sr-only">
          Products with view, edit and delete actions
        </caption>
        <thead className="border-b bg-muted/60 text-[10px] tracking-widest text-muted-foreground uppercase">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Product
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              USD price
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Stock
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>{products.map(renderProduct)}</tbody>
      </table>
    </div>
  );
}
