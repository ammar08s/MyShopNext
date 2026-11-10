"use client";
import { use } from "react";
import {
  ProductManagementContext,
  type ProductManagementActions,
} from "./productManagement.context";

/** @returns Shared editor actions; takes no inputs and throws outside ProductManager. */
export function useProductManagement(): ProductManagementActions {
  const context = use(ProductManagementContext);
  if (context === null)
    throw new Error("Product management actions require ProductManager.");
  return context;
}
