"use client";
import { useRef, useState, type ReactElement, type ReactNode } from "react";
import { Icon } from "@/shared/components/ui/Icon/Icon";
import type { Product } from "@/features/products/modules/catalog/products.types";
import {
  createProductDraft,
  productToDraft,
} from "@/features/products/modules/demo/demoCatalog.changes";
import type {
  ProductDraft,
  ProductDraftErrors,
} from "@/features/products/modules/demo/demoCatalog.types";
import { validateProductDraft } from "@/features/products/modules/demo/demoCatalog.validation";
import { useDemoCatalog } from "@/features/products/modules/demo/useDemoCatalog";
import { ProductManagementContext } from "@/features/products/modules/management/productManagement.context";
import { CatalogConfirmation } from "../CatalogConfirmation/CatalogConfirmation";
import { ProductEditor } from "../ProductEditor/ProductEditor";
import { ProductChangeSummary } from "../ProductChangeSummary/ProductChangeSummary";
import { ProductTable } from "../ProductTable/ProductTable";

interface Props {
  children: ReactNode;
}
interface Feedback {
  id: number;
  text: string;
}

/**
 * Keeps editor drafts, saved demo records and action feedback outside API recovery.
 * @param props - Shared-list route content or its loading/error fallback.
 * @returns A persistent editor plus local and server-backed product sections.
 */
export function ProductManager({ children }: Props): ReactElement {
  const {
    snapshot,
    createDemoProduct,
    updateDemoProduct,
    deleteDemoProduct,
    resetDemoCatalog,
  } = useDemoCatalog();
  const [draft, setDraft] = useState(createProductDraft);
  const [errors, setErrors] = useState<ProductDraftErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const feedbackSequence = useRef(0);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const savedProducts = [
    ...snapshot.changes.created,
    ...snapshot.changes.updated,
  ];
  const isLoading = snapshot.status === "loading";
  const hasChanges =
    savedProducts.length > 0 ||
    snapshot.changes.deletedIds.length > 0 ||
    snapshot.warning !== null;
  /** @param text - Safe action feedback. @returns No value; gives every action a distinct announcement. */
  function announce(text: string): void {
    feedbackSequence.current += 1;
    setFeedback({ id: feedbackSequence.current, text });
  }
  /** @param changes - Edited fields. @returns No value; merges against the latest draft. */
  function changeDraft(changes: Partial<ProductDraft>): void {
    /** @param current - Current draft. @returns Updated fields without mutation. */
    function merge(current: ProductDraft): ProductDraft {
      return { ...current, ...changes };
    }
    setDraft(merge);
    setErrors({});
  }
  /** @returns No value; takes no inputs and validates/saves the current local draft. */
  function saveProduct(): void {
    const result = validateProductDraft(draft);
    if (!result.success) {
      setErrors(result.errors);
      announce("Check the highlighted product fields before saving.");
      if (result.errors.title) nameInputRef.current?.focus();
      else if (result.errors.category) categoryInputRef.current?.focus();
      else priceInputRef.current?.focus();
      return;
    }
    try {
      if (draft.id === null) createDemoProduct(result.values);
      else updateDemoProduct({ ...result.values, id: draft.id });
      announce(
        `${result.values.title} ${draft.id === null ? "created" : "updated"} in your demo catalog.`,
      );
      setDraft(createProductDraft());
      setErrors({});
      nameInputRef.current?.focus();
    } catch (error) {
      announce(
        error instanceof Error
          ? error.message
          : "The demo product could not be saved. Please try again.",
      );
    }
  }
  /** @returns No value; takes no inputs and discards unsaved form edits only. */
  function cancelEdit(): void {
    setDraft(createProductDraft());
    setErrors({});
    announce("Form cleared. No unsaved edits were applied.");
    nameInputRef.current?.focus();
  }
  /** @param product - Snapshot chosen from a local/shared table. @returns No value; starts one editor draft. */
  function editProduct(product: Product): void {
    setDraft(productToDraft(product));
    setErrors({});
    setFeedback(null);
    nameInputRef.current?.focus();
  }
  /** @param product - Product whose deletion was confirmed. @returns No value; hides/removes only local data. */
  function deleteProduct(product: Product): void {
    try {
      deleteDemoProduct(product.id);
      /** @param current - Current editor draft. @returns A cleared draft only when its product was removed. */
      function clearRemovedDraft(current: ProductDraft): ProductDraft {
        return current.id === product.id ? createProductDraft() : current;
      }
      setDraft(clearRemovedDraft);
      setErrors({});
      announce(`${product.title} removed from your demo catalog.`);
      nameInputRef.current?.focus();
    } catch (error) {
      announce(
        error instanceof Error
          ? error.message
          : "The demo product could not be removed.",
      );
    }
  }
  /** @returns No value; takes no inputs and requests deliberate reset confirmation. */
  function requestReset(): void {
    setIsResetConfirming(true);
  }
  /** @returns No value; takes no inputs and cancels reset without changing data. */
  function cancelReset(): void {
    setIsResetConfirming(false);
    resetButtonRef.current?.focus();
  }
  /** @returns No value; takes no inputs and restores the shared catalog view locally. */
  function confirmReset(): void {
    try {
      resetDemoCatalog();
      setDraft(createProductDraft());
      setErrors({});
      setIsResetConfirming(false);
      announce(
        "Demo changes reset. Shared products are restored in this browser.",
      );
      nameInputRef.current?.focus();
    } catch (error) {
      announce(
        error instanceof Error
          ? error.message
          : "Demo changes could not be reset.",
      );
    }
  }
  return (
    <ProductManagementContext value={{ editProduct, deleteProduct }}>
      <ProductChangeSummary changes={snapshot.changes} isLoading={isLoading} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-secondary/50 px-5 py-4">
        <p className="max-w-2xl text-xs leading-6 text-secondary-foreground">
          Admin demo: products are changed only in this browser. No changes are
          sent to the shared API.
        </p>
        <button
          ref={resetButtonRef}
          type="button"
          onClick={requestReset}
          disabled={isLoading || !hasChanges}
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs font-medium hover:border-destructive hover:text-destructive disabled:opacity-40"
        >
          <Icon name="reset" />
          Reset demo changes
        </button>
      </div>
      {isResetConfirming ? (
        <div className="mb-6">
          <CatalogConfirmation
            title="Reset all demo product changes?"
            confirmLabel="Reset demo catalog"
            onConfirm={confirmReset}
            onCancel={cancelReset}
          >
            Your locally created products and edits will be removed. Hidden
            shared products will appear again. This only affects this browser.
          </CatalogConfirmation>
        </div>
      ) : null}
      <div role="status" aria-live="polite" aria-atomic="true" className="mb-5">
        {feedback ? (
          <p
            key={feedback.id}
            className="rounded-xl border bg-card px-4 py-3 text-sm"
          >
            {feedback.text}
          </p>
        ) : null}
      </div>
      {snapshot.warning ? (
        <p
          role="status"
          className="mb-5 rounded-xl border border-destructive/20 bg-card px-4 py-3 text-sm leading-6 text-muted-foreground"
        >
          {snapshot.warning}
        </p>
      ) : null}
      <div className="grid items-start gap-7 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <ProductEditor
          draft={draft}
          errors={errors}
          disabled={isLoading}
          nameInputRef={nameInputRef}
          categoryInputRef={categoryInputRef}
          priceInputRef={priceInputRef}
          onChange={changeDraft}
          onSave={saveProduct}
          onCancel={cancelEdit}
        />
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="saved-demo-title">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 id="saved-demo-title" className="text-lg font-semibold">
                  Your demo changes
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created products and local edits stay available here.
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {savedProducts.length}
              </span>
            </div>
            {isLoading ? (
              <p role="status" className="text-sm text-muted-foreground">
                Loading your saved products…
              </p>
            ) : (
              <ProductTable
                products={savedProducts}
                emptyMessage="No saved changes yet. Create a product or edit one from the shared catalog."
              />
            )}
          </section>
          {children}
        </div>
      </div>
    </ProductManagementContext>
  );
}
