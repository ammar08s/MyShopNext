"use client";
import { use } from "react";
import { DemoCatalogContext } from "./demoCatalog.context";
import type { DemoCatalogContextValue } from "./demoCatalog.types";

/** @returns The sole browser catalog owner; takes no inputs and throws outside its provider. */
export function useDemoCatalog(): DemoCatalogContextValue {
  const context = use(DemoCatalogContext);
  if (context === null)
    throw new Error("useDemoCatalog requires DemoCatalogProvider.");
  return context;
}
