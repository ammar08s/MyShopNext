"use client";
import { createContext } from "react";
import type { Product } from "../catalog/products.types";

export interface ProductManagementActions {
  editProduct: (product: Product) => void;
  deleteProduct: (product: Product) => void;
}
export const ProductManagementContext =
  createContext<ProductManagementActions | null>(null);
