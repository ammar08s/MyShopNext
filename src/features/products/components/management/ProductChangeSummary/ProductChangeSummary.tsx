import type { ReactElement } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import type { DemoCatalogChanges } from "@/features/products/modules/demo/demoCatalog.types";

interface Props {
  changes: DemoCatalogChanges;
  isLoading: boolean;
}

/**
 * Summarizes the browser's saved product changes without duplicating store state.
 * @param props - Current validated overlay and whether storage is still loading.
 * @returns Responsive counts for creations, edits and hidden shared products.
 */
export function ProductChangeSummary({
  changes,
  isLoading,
}: Props): ReactElement {
  return (
    <dl
      aria-label="Demo product changes"
      className="mb-6 grid gap-3 sm:grid-cols-3"
    >
      <div className="rounded-2xl border bg-card p-5 shadow-xs">
        <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="plus" className="text-primary" />
          Created products
        </dt>
        <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {isLoading ? (
            <span className="text-sm font-normal">Loading…</span>
          ) : (
            changes.created.length
          )}
        </dd>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-xs">
        <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="pencil" className="text-primary" />
          Edited shared products
        </dt>
        <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {isLoading ? (
            <span className="text-sm font-normal">Loading…</span>
          ) : (
            changes.updated.length
          )}
        </dd>
      </div>
      <div className="rounded-2xl border bg-card p-5 shadow-xs">
        <dt className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon name="trash" className="text-primary" />
          Hidden shared products
        </dt>
        <dd className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {isLoading ? (
            <span className="text-sm font-normal">Loading…</span>
          ) : (
            changes.deletedIds.length
          )}
        </dd>
      </div>
    </dl>
  );
}
