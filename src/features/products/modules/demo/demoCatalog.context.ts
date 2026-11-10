"use client";
import { createContext } from "react";
import type { DemoCatalogContextValue } from "./demoCatalog.types";
export const DemoCatalogContext = createContext<DemoCatalogContextValue | null>(
  null,
);
