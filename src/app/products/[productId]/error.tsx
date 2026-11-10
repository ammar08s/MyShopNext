"use client";

import type { ReactElement } from "react";
import { RequestError } from "@/app/components/RequestError/RequestError";

interface Props {
  error: unknown;
  reset: () => void;
  retry: () => void;
}

/**
 * Recovers a failed individual read without hiding shared navigation.
 * @param props - Error information and framework recovery actions.
 * @returns Product request feedback with a fresh-read retry action.
 */
export default function ProductError({ retry }: Props): ReactElement {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-7xl flex-1 px-5 sm:px-8 lg:px-12"
    >
      <h1 className="sr-only">Product details</h1>
      <RequestError title="We couldn’t load this product" retry={retry}>
        Please check your connection and try again, or use the navigation to
        browse the collection.
      </RequestError>
    </main>
  );
}
