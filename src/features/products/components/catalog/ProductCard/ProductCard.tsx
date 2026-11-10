import Link from "next/link";
import type { ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { formatProductPrice } from "@/features/products/modules/pricing/products.pricing";
import { ProductArtwork } from "../ProductArtwork/ProductArtwork";
import { StockStatus } from "../StockStatus/StockStatus";

interface Props {
  product: Product;
}

/**
 * Presents a retail card with a clear image, title, price and details affordance.
 * @param props - Validated product; artwork is illustrative rather than API data.
 * @returns One keyboard-operable link to the real product route.
 */
export function ProductCard({ product }: Props): ReactElement {
  return (
    <Link
      href={`/products/${product.id}`}
      prefetch={false}
      className="group flex h-full min-w-0 flex-col rounded-2xl border bg-card p-2.5 text-card-foreground shadow-[0_2px_8px_0_#22352c06] transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <ProductArtwork
        productTitle={product.title}
        category={product.category}
        className="aspect-square rounded-xl"
      />
      <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1 sm:px-2">
        <p className="mb-2 text-[10px] font-medium tracking-[0.12em] break-words text-muted-foreground uppercase">
          {product.category}
        </p>
        <h3 className="mb-4 min-h-10 text-sm leading-5 font-semibold break-words group-hover:text-primary sm:text-base">
          {product.title}
        </h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <p className="min-w-0 text-base font-semibold tracking-tight wrap-anywhere sm:text-lg">
            {formatProductPrice(product.priceCents)}
          </p>
          <StockStatus inStock={product.inStock} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-3.5 pb-1 text-xs font-medium text-primary">
          <span>View product</span>
          <span
            aria-hidden="true"
            className="inline-flex size-7 items-center justify-center rounded-full bg-secondary text-base transition-colors group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none"
          >
            ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
