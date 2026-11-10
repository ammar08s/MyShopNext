import type { ChangeEvent, ReactElement } from "react";
import { SelectField } from "@/shared/components/ui/SelectField/SelectField";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import type { ProductFilters as FilterValues } from "@/features/products/modules/filtering/products.filters.types";

interface Props {
  categories: readonly string[];
  values: FilterValues;
  onChange: (changes: Partial<FilterValues>) => void;
  onReset: () => void;
}

/**
 * Presents a compact search/category bar without availability filtering.
 * @param props - Full categories, selected filters and their owner callbacks.
 * @returns Accessible search, polished category selection and reset controls.
 */
export function ProductFilters({
  categories,
  values,
  onChange,
  onReset,
}: Props): ReactElement {
  /** @param event - Search edit. @returns No value; updates the owner query. */
  function changeQuery(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ query: event.target.value });
  }
  /** @param value - Category choice. @returns No value; empty selects all. */
  function changeCategory(value: string): void {
    onChange({ category: value || null });
  }
  /** @param category - Full-snapshot category. @returns A labelled option. */
  function createCategoryOption(category: string): SelectOption {
    return { value: category, label: category };
  }
  const categoryOptions: readonly SelectOption[] = [
    { value: "", label: "All categories" },
    ...categories.map(createCategoryOption),
  ];
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
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            >
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m13 13 4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
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
          id="product-category"
          label="Category"
          value={values.category ?? ""}
          options={categoryOptions}
          onValueChange={changeCategory}
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
