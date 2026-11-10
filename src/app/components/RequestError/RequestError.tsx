"use client";

import { useTransition, type ReactElement, type ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  retry: () => void;
}

/**
 * Offers framework-backed request recovery without exposing remote error details.
 * @param props - Safe heading, explanatory content and Next.js retry action.
 * @returns An error section with retry and full-page reload controls.
 */
export function RequestError({ title, children, retry }: Props): ReactElement {
  const [isPending, startTransition] = useTransition();
  /**
   * Starts a fresh server read through the route boundary; takes no inputs.
   * @returns No value; marks the retry as a transition.
   */
  function retryRequest(): void {
    startTransition(retry);
  }
  /**
   * Reloads the current route if client recovery is unavailable; takes no inputs.
   * @returns No value; navigates the browser to the same URL.
   */
  function reloadPage(): void {
    window.location.reload();
  }
  return (
    <section
      aria-labelledby="request-error-title"
      role="alert"
      className="my-8 rounded-xl border bg-card px-6 py-12 text-center"
    >
      <h2 id="request-error-title" className="text-2xl font-medium">
        {title}
      </h2>
      <div className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {children}
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          disabled={isPending}
          onClick={retryRequest}
          className="rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Trying again…" : "Try again"}
        </button>
        <button
          type="button"
          onClick={reloadPage}
          className="rounded-sm text-sm text-muted-foreground underline underline-offset-4"
        >
          Reload page
        </button>
      </div>
    </section>
  );
}
