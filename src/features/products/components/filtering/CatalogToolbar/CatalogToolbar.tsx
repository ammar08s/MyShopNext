import type { ReactElement } from "react";
import { SelectField } from "@/shared/components/ui/SelectField/SelectField";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import type {
  ProductFilters,
  ProductSort,
} from "@/features/products/modules/filtering/products.filters.types";

interface Props {
  count: number;
  sort: ProductSort;
  onChange: (changes: Partial<ProductFilters>) => void;
}

const sortOptions: readonly SelectOption[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" },
];

/**
 * Pairs a clear collection heading/count with a polished sort selector.
 * @param props - Derived count, current sort and filter-owner callback.
 * @returns A responsive results heading and accessible custom sort control.
 */
export function CatalogToolbar({ count, sort, onChange }: Props): ReactElement {
  /** @param value - Sort choice. @returns No value; ignores unknown orders. */
  function changeSort(value: string): void {
    if (
      value === "name-asc" ||
      value === "name-desc" ||
      value === "price-asc" ||
      value === "price-desc"
    )
      onChange({ sort: value });
  }
  return (
    <div className="my-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Everyday essentials
        </h2>
        <p role="status" className="mt-1 text-xs text-muted-foreground">
          {count} {count === 1 ? "product" : "products"} to explore
        </p>
      </div>
      <div className="w-44 max-w-full">
        <SelectField
          id="product-sort"
          label="Sort by"
          value={sort}
          options={sortOptions}
          onValueChange={changeSort}
        />
      </div>
    </div>
  );
}
