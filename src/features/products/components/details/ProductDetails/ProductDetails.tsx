import Link from "next/link";
import type { ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { formatProductPrice } from "@/features/products/modules/pricing/products.pricing";
import { ProductArtwork } from "../../catalog/ProductArtwork/ProductArtwork";
import { StockStatus } from "../../catalog/StockStatus/StockStatus";

interface Props {
  product: Product;
}

/**
 * Renders real product details while keeping internal identities out of the UI.
 * @param props - Validated individual API product.
 * @returns Product information and a normal route back to the catalog.
 */
export function ProductDetails({ product }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-7 pb-16 sm:px-8 lg:px-12"
    >
      <Link
        href="/"
        className="mb-8 inline-block rounded-sm text-sm text-muted-foreground hover:text-primary"
      >
        <span aria-hidden="true">← </span>Back to catalog
      </Link>
      <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-20">
        <ProductArtwork
          productTitle={product.title}
          category={product.category}
          className="aspect-square rounded-2xl"
        />
        <section aria-labelledby="product-title" className="min-w-0">
          <p className="mb-3 text-xs tracking-[0.2em] break-words text-primary uppercase">
            {product.category}
          </p>
          <h1
            id="product-title"
            className="mb-6 text-4xl leading-tight font-medium tracking-tight break-words sm:text-5xl"
          >
            {product.title}
          </h1>
          <StockStatus inStock={product.inStock} />
          <p className="my-7 text-3xl font-medium tracking-tight wrap-anywhere">
            {formatProductPrice(product.priceCents)}
            <span className="ml-2 text-xs font-normal tracking-normal text-muted-foreground">
              USD
            </span>
          </p>
          <dl className="border-t text-sm">
            <div className="flex justify-between gap-5 border-b py-4">
              <dt className="text-muted-foreground">Category</dt>
              <dd className="min-w-0 text-right break-words">
                {product.category}
              </dd>
            </div>
            <div className="flex justify-between gap-5 border-b py-4">
              <dt className="text-muted-foreground">Availability</dt>
              <dd>{product.inStock ? "In stock" : "Out of stock"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </main>
  );
}
