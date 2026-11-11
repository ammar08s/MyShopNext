import Link from "next/link";
import { useRef, useState, type ReactElement } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { formatProductPrice } from "@/features/products/modules/pricing/products.pricing";
import { useProductManagement } from "@/features/products/modules/management/useProductManagement";
import { CatalogConfirmation } from "../CatalogConfirmation/CatalogConfirmation";

interface Props {
  product: Product;
}

/**
 * Presents a product with real view/edit/delete controls and local confirmation.
 * @param props - One effective local or shared product snapshot.
 * @returns A table row and, when requested, its adjacent delete confirmation.
 */
export function ProductTableRow({ product }: Props): ReactElement {
  const { editProduct, deleteProduct } = useProductManagement();
  const [isConfirming, setIsConfirming] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  /** @returns No value; takes no inputs and opens this row's safe confirmation. */
  function requestDelete(): void {
    setIsConfirming(true);
  }
  /** @returns No value; takes no inputs and restores focus without changing products. */
  function cancelDelete(): void {
    setIsConfirming(false);
    deleteButtonRef.current?.focus();
  }
  /** @returns No value; takes no inputs and deletes only this browser's effective product. */
  function confirmDelete(): void {
    deleteProduct(product);
    setIsConfirming(false);
  }
  /** @returns No value; takes no inputs and opens this snapshot in the persistent editor. */
  function beginEdit(): void {
    editProduct(product);
  }
  return (
    <>
      <tr className="border-b last:border-0">
        <td className="max-w-56 px-4 py-4">
          <Link
            href={`/products/${product.id}`}
            prefetch={false}
            className="font-semibold break-words hover:text-primary hover:underline"
          >
            {product.title}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {product.category}
          </p>
        </td>
        <td className="px-4 py-4 font-medium wrap-anywhere">
          {formatProductPrice(product.priceCents)}
        </td>
        <td className="px-4 py-4 text-xs text-muted-foreground">
          {product.inStock ? "In stock" : "Out of stock"}
        </td>
        <td className="px-4 py-4">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={beginEdit}
              aria-label={`Edit ${product.title}`}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-primary hover:bg-secondary"
            >
              <Icon name="pencil" />
              Edit
            </button>
            <button
              ref={deleteButtonRef}
              type="button"
              onClick={requestDelete}
              aria-label={`Delete ${product.title}`}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              <Icon name="trash" />
              Delete
            </button>
          </div>
        </td>
      </tr>
      {isConfirming ? (
        <tr>
          <td colSpan={4} className="p-3">
            <CatalogConfirmation
              title={`Delete ${product.title}?`}
              confirmLabel="Delete product"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            >
              This removes the product from your browser’s catalog. It does not
              change the shared service.
            </CatalogConfirmation>
          </td>
        </tr>
      ) : null}
    </>
  );
}
