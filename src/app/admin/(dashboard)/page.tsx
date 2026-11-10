import type { Metadata } from "next";
import type { ReactElement } from "react";
import { SharedProductList } from "@/features/products/components/management/SharedProductList/SharedProductList";
import { getProducts } from "@/features/products/modules/catalog/products.api";

interface Props extends PageProps<"/admin"> {
  children?: never;
}
export const metadata: Metadata = { title: "Admin products" };

/**
 * Reads the shared catalog beneath the persistent local editor.
 * @param _props - Framework route props; no configurable inputs.
 * @returns Validated shared rows; unexpected failures reach the local boundary.
 */
export default async function AdminPage(_props: Props): Promise<ReactElement> {
  const products = await getProducts();
  return <SharedProductList products={products} />;
}
