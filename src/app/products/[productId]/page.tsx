import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { ProductDetailsView } from "@/features/products/components/details/ProductDetailsView/ProductDetailsView";
import { getProduct } from "@/features/products/modules/catalog/products.api";
import { parseProductRouteId } from "@/features/products/modules/demo/demoCatalog.validation";

interface Props extends PageProps<"/products/[productId]"> {
  children?: never;
}

/**
 * Names the page using the request-deduplicated individual product read.
 * @param props - Framework-provided asynchronous route parameters.
 * @returns Product metadata or a missing-product title.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const id = parseProductRouteId(productId);
  if (id === null) return { title: "Product not found" };
  if (id < 0) return { title: "Demo product" };
  const product = await getProduct(id);
  return { title: product?.title ?? "Product not found" };
}

/**
 * Loads one product for real route navigation and direct visits.
 * @param props - Framework-provided asynchronous route parameters.
 * @returns The server-rendered detail page; invokes notFound for invalid/missing IDs.
 */
export default async function ProductPage({
  params,
}: Props): Promise<ReactElement> {
  const { productId } = await params;
  const id = parseProductRouteId(productId);
  if (id === null) notFound();
  if (id < 0) return <ProductDetailsView productId={id} apiProduct={null} />;
  const product = await getProduct(id);
  if (product === null) notFound();
  return <ProductDetailsView productId={id} apiProduct={product} />;
}
