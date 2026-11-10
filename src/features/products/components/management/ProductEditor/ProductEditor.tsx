import type { ChangeEvent, FormEvent, ReactElement, RefObject } from "react";
import { SelectField } from "@/shared/components/ui/SelectField/SelectField";
import type { SelectOption } from "@/shared/modules/ui/selectField.types";
import type {
  ProductDraft,
  ProductDraftErrors,
} from "@/features/products/modules/demo/demoCatalog.types";

interface Props {
  draft: ProductDraft;
  errors: ProductDraftErrors;
  disabled: boolean;
  nameInputRef: RefObject<HTMLInputElement | null>;
  categoryInputRef: RefObject<HTMLInputElement | null>;
  priceInputRef: RefObject<HTMLInputElement | null>;
  onChange: (changes: Partial<ProductDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const stockOptions: readonly SelectOption[] = [
  { value: "in-stock", label: "In stock" },
  { value: "out-of-stock", label: "Out of stock" },
];
const inputClassName =
  "w-full rounded-xl border bg-card px-3.5 py-3 text-sm aria-invalid:border-destructive disabled:opacity-50";

/**
 * Renders the controlled product draft without owning a second copy of form data.
 * @param props - Draft, validation feedback and persistent manager actions.
 * @returns Create/edit controls that remain mounted during shared-list failures.
 */
export function ProductEditor({
  draft,
  errors,
  disabled,
  nameInputRef,
  categoryInputRef,
  priceInputRef,
  onChange,
  onSave,
  onCancel,
}: Props): ReactElement {
  /** @param event - Title edit. @returns No value; updates the owner. */
  function changeTitle(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ title: event.target.value });
  }
  /** @param event - Category edit. @returns No value; updates the owner. */
  function changeCategory(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ category: event.target.value });
  }
  /** @param event - Decimal USD edit. @returns No value; validation remains centralized. */
  function changePrice(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ price: event.target.value });
  }
  /** @param value - Custom stock selection. @returns No value; rejects unknown choices. */
  function changeStock(value: string): void {
    if (value === "in-stock" || value === "out-of-stock")
      onChange({ inStock: value === "in-stock" });
  }
  /** @param event - Local form submission. @returns No value; prevents native data transmission. */
  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (!disabled) onSave();
  }
  return (
    <section
      aria-labelledby="product-editor-title"
      className="rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-6"
    >
      <p className="mb-2 text-[10px] font-semibold tracking-widest text-primary uppercase">
        Local demo editor
      </p>
      <h2
        id="product-editor-title"
        className="text-xl font-semibold tracking-tight"
      >
        {draft.id === null ? "Create a product" : "Edit product"}
      </h2>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        Your changes appear in this browser’s storefront. The shared catalog
        stays unchanged.
      </p>
      <form onSubmit={submit} noValidate className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="admin-product-title"
            className="mb-2 block text-xs font-semibold"
          >
            Product name
          </label>
          <input
            ref={nameInputRef}
            id="admin-product-title"
            value={draft.title}
            onChange={changeTitle}
            disabled={disabled}
            maxLength={120}
            placeholder="e.g. Weekend canvas bag"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "admin-title-error" : undefined}
            className={inputClassName}
          />
          {errors.title ? (
            <p id="admin-title-error" className="mt-2 text-xs text-destructive">
              {errors.title}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="admin-product-category"
            className="mb-2 block text-xs font-semibold"
          >
            Category
          </label>
          <input
            ref={categoryInputRef}
            id="admin-product-category"
            value={draft.category}
            onChange={changeCategory}
            disabled={disabled}
            maxLength={60}
            placeholder="e.g. Bags"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={
              errors.category ? "admin-category-error" : undefined
            }
            className={inputClassName}
          />
          {errors.category ? (
            <p
              id="admin-category-error"
              className="mt-2 text-xs text-destructive"
            >
              {errors.category}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="admin-product-price"
            className="mb-2 block text-xs font-semibold"
          >
            Price in USD
          </label>
          <input
            ref={priceInputRef}
            id="admin-product-price"
            inputMode="decimal"
            value={draft.price}
            onChange={changePrice}
            disabled={disabled}
            placeholder="0.00"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? "admin-price-error" : undefined}
            className={inputClassName}
          />
          {errors.price ? (
            <p id="admin-price-error" className="mt-2 text-xs text-destructive">
              {errors.price}
            </p>
          ) : null}
        </div>
        <SelectField
          id="admin-product-stock"
          label="Stock status"
          value={draft.inStock ? "in-stock" : "out-of-stock"}
          options={stockOptions}
          onValueChange={changeStock}
          disabled={disabled}
        />
        <div className="flex flex-wrap gap-3 border-t pt-5">
          <button
            type="submit"
            disabled={disabled}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {draft.id === null ? "Create product" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="rounded-xl border px-4 py-3 text-sm hover:border-primary disabled:opacity-50"
          >
            {draft.id === null ? "Clear" : "Cancel edit"}
          </button>
        </div>
      </form>
    </section>
  );
}
