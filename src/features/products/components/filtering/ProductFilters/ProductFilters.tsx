import type { ChangeEvent, ReactElement } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import { SelectField } from "@/shared/components/ui/SelectField/SelectField";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import type { ProductFilters as FilterValues } from "@/features/products/modules/filtering/products.filters.types";

interface Props {
  values: FilterValues;
  onChange: (changes: Partial<FilterValues>) => void;
  onReset: () => void;
}

const sortOptions: readonly SelectOption[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
];

/**
 * Presents controls whose choices do not depend on a product response.
 * @param props - Current selections and their layout-owned actions.
 * @returns Enabled search/sort controls and reset, including during API loading.
 */
export function ProductFilters({
  values,
  onChange,
  onReset,
}: Props): ReactElement {
  /** @param event - Search edit. @returns No value; updates the owner query. */
  function changeQuery(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ query: event.target.value });
  }
  /** @param value - Fixed sort choice. @returns No value; ignores unknown orders. */
  function changeSort(value: string): void {
    if (
      value === "name-asc" ||
      value === "name-desc" ||
      value === "price-asc" ||
      value === "price-desc"
    )
      onChange({ sort: value });
  }
  const isDefault =
    !values.query && values.category === null && values.sort === "name-asc";
  return (
    <section
      aria-label="Product filters"
      className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
    >
      <div className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_auto]">
        <div className="min-w-0">
          <label
            htmlFor="product-search"
            className="mb-2 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
          >
            Find something you love
          </label>
          <div className="relative">
            <Icon
              name="search"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="product-search"
              type="search"
              value={values.query}
              onChange={changeQuery}
              placeholder="Search the collection…"
              className="w-full min-w-0 rounded-[calc(var(--radius)+2px)] border bg-card py-3 pr-4 pl-10 text-sm shadow-xs transition-colors hover:border-primary focus-visible:border-primary motion-reduce:transition-none"
            />
          </div>
        </div>
        <SelectField
          id="product-sort"
          label="Sort by"
          value={values.sort}
          options={sortOptions}
          onValueChange={changeSort}
        />
        <button
          type="button"
          onClick={onReset}
          disabled={isDefault}
          className="rounded-xl border bg-background px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
