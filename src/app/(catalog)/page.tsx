import type { ReactElement } from "react";
import { ProductCatalog } from "@/features/products/components/catalog/ProductCatalog/ProductCatalog";
import { getProducts } from "@/features/products/modules/catalog/products.api";

interface Props extends PageProps<"/"> {
  children?: never;
}

/**
 * Reads the catalog once on the server before client-side filtering.
 * @param _props - Framework route props; no configurable inputs.
 * @returns The interactive catalog with validated, serializable products.
 */
export default async function HomePage(_props: Props): Promise<ReactElement> {
  const products = await getProducts();
  return <ProductCatalog products={products} />;
}
