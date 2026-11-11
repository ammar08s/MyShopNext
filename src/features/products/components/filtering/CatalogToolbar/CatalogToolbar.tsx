import type { ReactElement } from "react";
import { SelectField } from "@/shared/components/ui/SelectField/SelectField";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import type { ProductFilters } from "@/features/products/modules/filtering/products.filters.types";

interface Props {
  count: number;
  categories: readonly string[];
  category: string | null;
  onChange: (changes: Partial<ProductFilters>) => void;
}

/**
 * Presents the count and category options that depend on the loaded collection.
 * @param props - Derived count/categories, selected category and layout-owned action.
 * @returns Results feedback and category selection after product data is available.
 */
export function CatalogToolbar({
  count,
  categories,
  category,
  onChange,
}: Props): ReactElement {
  /** @param value - Category choice. @returns No value; an empty value selects all. */
  function changeCategory(value: string): void {
    onChange({ category: value || null });
  }
  /** @param value - Full-collection category. @returns A labelled option. */
  function createCategoryOption(value: string): SelectOption {
    return { value, label: value };
  }
  const categoryOptions: readonly SelectOption[] = [
    { value: "", label: "All categories" },
    ...categories.map(createCategoryOption),
  ];
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
          id="product-category"
          label="Category"
          value={category ?? ""}
          options={categoryOptions}
          onValueChange={changeCategory}
        />
      </div>
    </div>
  );
}
