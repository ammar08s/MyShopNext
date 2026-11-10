import type { ReactElement, ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** @param node - Newly mounted cancel control. @returns No value; focuses the safe action only on mount. */
function focusCancel(node: HTMLButtonElement | null): void {
  node?.focus();
}

/**
 * Offers an inline, keyboard-operable destructive-action confirmation.
 * @param props - Explanation and deliberate confirm/cancel actions.
 * @returns A nonmodal confirmation group with a safely focused cancel button.
 */
export function CatalogConfirmation({
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: Props): ReactElement {
  return (
    <div
      role="group"
      aria-label={title}
      className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
    >
      <p className="font-semibold">{title}</p>
      <div className="mt-2 leading-6 text-muted-foreground">{children}</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          ref={focusCancel}
          type="button"
          onClick={onCancel}
          className="rounded-lg border bg-card px-4 py-2 text-sm hover:border-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
