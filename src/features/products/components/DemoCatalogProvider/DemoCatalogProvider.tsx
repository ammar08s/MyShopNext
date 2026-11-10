"use client";
import {
  useState,
  useSyncExternalStore,
  type ReactElement,
  type ReactNode,
} from "react";
import { DemoCatalogContext } from "@/features/products/modules/demo/demoCatalog.context";
import { createDemoCatalogStore } from "@/features/products/modules/demo/demoCatalog.store";

interface Props {
  children: ReactNode;
}

/**
 * Preserves browser-local CRUD changes above all route request boundaries.
 * @param props - Server-rendered application children.
 * @returns One client catalog provider with subscription-time storage hydration.
 */
export function DemoCatalogProvider({ children }: Props): ReactElement {
  const [store] = useState(createDemoCatalogStore);
  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  return (
    <DemoCatalogContext
      value={{
        snapshot,
        createDemoProduct: store.createDemoProduct,
        updateDemoProduct: store.updateDemoProduct,
        deleteDemoProduct: store.deleteDemoProduct,
        resetDemoCatalog: store.resetDemoCatalog,
      }}
    >
      {children}
    </DemoCatalogContext>
  );
}
